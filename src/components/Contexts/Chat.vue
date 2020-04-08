<script>
import { remote } from "electron";
const { net, shell, BrowserWindow } = remote;
const Slack = remote.require("slack");
import SendIcon from "../../assets/icons/send.svg";
import { get as lGet } from "lodash";
import {
  format,
  formatDistance,
  formatRelative,
  subDays,
  fromUnixTime,
} from "date-fns";

const replaceSlashesWithDelimiter = (str) => {
  const pathDelimiter = "____";
  return str.replace(/\//g, pathDelimiter);
};

export default {
  components: {
    SendIcon,
  },
  data() {
    return {
      validConfig: false,
      slack: null,
      config: {},
      currentChannelID: "",
      channelExists: false,
      pathIsDir: false,
      messages: [],
      socket: null,
      messageBox: "",
      userMap: {},
      scrollSmooth: false,
    };
  },
  mounted() {
    this.slack = new Slack();
  },
  computed: {
    isCurrentNodeRoot() {
      return (
        this.$store.state.views.workspaceRootNode.path ===
        this.$store.state.views.currentWorkingNode.path
      );
    },
    workspaceRootNode() {
      return this.$store.state.views.workspaceRootNode;
    },
    currentWorkingNode() {
      return this.$store.state.views.currentWorkingNode;
    },
    relativePath() {
      return this.$chaos.path.relative(
        this.workspaceRootNode.path,
        this.currentWorkingNode.path
      );
    },
    currentNodeAsChannelName() {
      // root base name
      const rootBase = this.$chaos.path.basename(this.workspaceRootNode.path);
      // construct a difference of two paths
      let relativePath = this.$chaos.path.relative(
        this.workspaceRootNode.path,
        this.currentWorkingNode.path
      );
      // if the difference is empty, just make the channel name the root basename
      const channelName = replaceSlashesWithDelimiter(relativePath);
      console.log(channelName);
      return channelName;
    },
    orderedMessages() {
      return this.messages.slice().reverse();
    },
  },
  watch: {
    workspaceRootNode: {
      handler: function(val) {
        this.checkConfig();
        this.startListening();
      },
      immediate: false,
    },
    currentWorkingNode: {
      handler: async function(val) {
        await this.getChannelID();
        await this.listMessages();
      },
      immediate: false,
    },
  },
  methods: {
    getProfileImage(userId) {
      return lGet(this.userMap[userId], "profile.image_192", "");
    },
    getProfileName(userId) {
      return (
        lGet(this.userMap[userId], "real_name", null) ||
        lGet(this.userMap[userId], "name", "")
      );
    },
    getMessageDate(msg) {
      const ts = lGet(msg, "ts", "");
      const date_ts = fromUnixTime(ts);
      return formatRelative(date_ts, new Date());
    },
    checkConfig() {
      const pathToConfig = this.$chaos.path.join(
        this.workspaceRootNode.path,
        ".chaos",
        "slack.chaos"
      );

      if (this.$chaos.fs.existsSync(pathToConfig)) {
        const configAtom = new this.$chaos.Atom();
        if (configAtom.load(pathToConfig)) {
          const config = configAtom.toObj().module.config;
          if (config.access_token) {
            this.validConfig = true;
            this.config = config;
          }
        }
      } else {
        this.validConfig = false;
      }
    },
    async createConfig() {
      let authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        "node-integration": false,
        "web-security": false,
      });

      const clientID = "1049186934100.1049323891092";
      const scopes = "client";
      const redirect_uri = "https://localhost/chaos";
      const authURL = `https://slack.com/oauth/authorize?client_id=${clientID}&scope=${scopes}&redirect_uri=${redirect_uri}`;

      authWindow.loadURL(authURL);
      authWindow.show();

      const filter = {
        urls: [redirect_uri + "*"],
      };

      authWindow.webContents.session.webRequest.onBeforeRequest(
        filter,
        async (details, callback) => {
          const url = new URL(details.url);

          // process the callback url and get any param you need

          const code = url.searchParams.get("code");

          const bearerTokenResponse = await this.$chaos.axios.get(
            "https://slack.com/api/oauth.access",
            {
              params: {
                client_id: clientID,
                client_secret: "8533d1e55bcdfd6c6ba01d35f45dcf80",
                code: code,
                redirect_uri: redirect_uri,
              },
            }
          );

          const configAtom = new this.$chaos.Atom();
          const pathToConfig = this.$chaos.path.join(
            this.workspaceRootNode.path,
            ".chaos",
            "slack.chaos"
          );

          configAtom.update({
            module: {
              id: "com.sarimabbas.chaos.slack",
              name: "Slack",
              config: {
                access_token: await bearerTokenResponse.data.access_token,
                user_id: await bearerTokenResponse.data.user_id,
                team_id: await bearerTokenResponse.data.team_id,
                team_name: await bearerTokenResponse.data.team_name,
              },
            },
          });

          configAtom.save(pathToConfig);
          this.$chaos.refreshExplorer();

          // don't forget to let the request proceed
          callback({
            cancel: false,
          });

          authWindow.close();
        }
      );

      authWindow.on("closed", function() {
        authWindow = null;
      });
    },
    async getChannelID() {
      // reset channel ID
      this.currentChannelID = "";
      this.pathIsDir = false;
      this.scrollSmooth = false;

      // if no token, bail
      if (!this.config.access_token) {
        return;
      }

      // if path not exist, bail
      if (!this.$chaos.fs.existsSync(this.currentWorkingNode.path)) {
        return;
      }

      // if not directory, bail
      if (
        !this.$chaos.fs.lstatSync(this.currentWorkingNode.path).isDirectory()
      ) {
        return;
      }

      // .chaos files aren't directories
      const testAtom = new this.$chaos.Atom();
      if (testAtom.load(this.currentWorkingNode.path)) {
        return;
      }

      this.pathIsDir = true;

      const channelName = this.currentNodeAsChannelName;

      // look up all channels to see if there is a match
      const channelsListResponse = await this.slack.conversations.list({
        token: this.config.access_token,
      });

      await channelsListResponse.channels.some((ch) => {
        if (ch.name === channelName) {
          this.currentChannelID = ch.id;
          return true;
        }
      });
    },
    async startListening() {
      if (!this.config.access_token) {
        return;
      }

      const socketRequest = await this.slack.rtm.start({
        token: this.config.access_token,
      });

      await socketRequest.users.forEach(async (user) => {
        this.userMap[user.id] = await user;
      });

      this.socket = await new WebSocket(socketRequest.url);

      // Listen for messages
      await this.socket.addEventListener("message", (event) => {
        const received = JSON.parse(event.data);

        if (
          received.type === "message" &&
          received.channel === this.currentChannelID
        ) {
          this.messages.unshift(received);
          this.scrollSmooth = true;
          setTimeout(() => {
            this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
          }, 200);
        }
      });
    },
    async createChannel() {
      // if no token, bail
      if (!this.config.access_token) {
        return;
      }

      const response = await this.slack.conversations.create({
        token: this.config.access_token,
        name: this.currentNodeAsChannelName,
      });

      this.getChannelID();
    },
    async listMessages() {
      // if no token, bail
      if (!this.config.access_token) {
        return;
      }

      // reset
      this.messages = [];

      if (!this.currentChannelID) {
        return;
      }

      const response = await this.slack.conversations.history({
        token: this.config.access_token,
        channel: this.currentChannelID,
      });

      this.messages = await response.messages;

      setTimeout(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      }, 200);
    },
    async sendMessage() {
      // if no token, bail
      if (!this.config.access_token) {
        return;
      }

      if (!this.currentChannelID) {
        return;
      }

      const response = await this.slack.chat.postMessage({
        token: this.config.access_token,
        channel: this.currentChannelID,
        as_user: true,
        text: this.messageBox,
      });

      // construct the channel name
      const channelName = this.$chaos.path.basename(
        this.currentWorkingNode.path
      );
    },
  },
};
</script>

<template>
  <div class="h-full">
    <!-- ERROR TEXT -->
    <div
      class="flex items-center h-full text-center"
      v-if="
        !workspaceRootNode.path ||
          !validConfig ||
          !pathIsDir ||
          !currentChannelID ||
          isCurrentNodeRoot
      "
    >
      <!-- no root found text -->
      <div v-if="!workspaceRootNode.path">
        <div class="px-16 py-4 mt-1 ui-help-text">
          Open a workspace directory to use this Slack integration.
        </div>
      </div>
      <!-- no slack conig found text -->
      <div v-else-if="!validConfig">
        <div class="px-16 py-4 mt-1 ui-help-text">
          No Slack configuration found in your Explorer root. Would you like to
          create one?
        </div>
        <button
          @click="createConfig"
          class="px-2 py-1 mr-2 text-base ui-button"
        >
          Create Slack configuration
        </button>
      </div>
      <!-- path is file, not dir  -->
      <div v-else-if="!pathIsDir" class="flex w-full">
        <div class="px-16 py-4 mt-1 ui-help-text">
          Channels can only be created and mirrored for directories.
        </div>
      </div>
      <!-- path is root -->
      <div v-else-if="isCurrentNodeRoot" class="flex w-full">
        <div class="px-16 py-4 mt-1 ui-help-text">
          Channels are mirrored for subfolders in your workspace.
        </div>
      </div>
      <!-- create channel if not exists -->
      <div v-else-if="!currentChannelID">
        <div class="px-16 py-4 mt-1 ui-help-text">
          No Slack channel found for this path. Would you like to create one?
        </div>
        <button
          class="px-2 py-1 mr-2 text-base ui-button"
          @click="createChannel"
        >
          Create channel
        </button>
      </div>
    </div>
    <!-- SUCCESS CONDITION / LIST MESSAGES  -->
    <div class="flex flex-col h-full" v-else-if="currentChannelID">
      <!-- top -->
      <div
        :class="[
          'flex-grow overflow-y-scroll',
          { 'scroll-smooth': scrollSmooth },
        ]"
        ref="messages"
      >
        <!-- list of message bubbles -->
        <div
          v-for="msg in orderedMessages"
          :key="msg.client_msg_id"
          class="p-2 m-2 bg-white border rounded shadow"
        >
          <div class="flex">
            <img
              :src="getProfileImage(msg.user)"
              alt=""
              class="object-cover h-6 rounded"
              style="vertical-align: middle;"
            />
            <div class="w-full ml-2">
              <div class="flex items-baseline">
                <h3 class="mt-0 font-bold">{{ getProfileName(msg.user) }}</h3>
                <span class="ml-2 text-xs">{{ getMessageDate(msg) }}</span>
              </div>
              <p class="dont-break-out">
                {{ msg.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- bottom with message box -->
      <div class="flex px-2 py-2 m-2 bg-white border rounded-md shadow-lg">
        <textarea
          class="w-full px-1 py-1 border rounded resize-none focus:outline-none focus:shadow-outline"
          type="textarea"
          placeholder="Enter message here..."
          v-model="messageBox"
        />
        <button class="px-3" @click="sendMessage">
          <SendIcon width="30" class="text-gray-700" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.scroll-smooth {
  scroll-behavior: smooth;
}

.dont-break-out {
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
</style>
