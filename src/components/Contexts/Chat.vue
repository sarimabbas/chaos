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
    workspaceRootNode() {
      return this.$store.state.views.workspaceRootNode;
    },
    currentWorkingNode() {
      return this.$store.state.views.currentWorkingNode;
    },
    orderedMessages() {
      return this.messages.slice().reverse();
    },
  },
  watch: {
    workspaceRootNode: {
      handler: function (val) {
        this.checkConfig();
        this.startListening();
      },
      immediate: false,
    },
    currentWorkingNode: {
      handler: async function (val) {
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
            console.log(config.access_token);
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
          console.log(details);
          const url = new URL(details.url);
          console.log(url);
          // process the callback url and get any param you need

          const code = url.searchParams.get("code");
          console.log(code);

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

          await console.log(bearerTokenResponse.data);

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

      authWindow.on("closed", function () {
        authWindow = null;
      });
    },
    async getChannelID() {
      // if no token, bail
      if (!this.config.access_token) {
        return;
      }

      // reset channel ID
      this.currentChannelID = "";

      // construct the channel name
      const channelName = this.$chaos.path.basename(
        this.currentWorkingNode.path
      );

      // look up all channels to see if there is a match
      const channelsListResponse = await this.slack.conversations.list({
        token: this.config.access_token,
      });
      await console.log(channelsListResponse);

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

      await console.log("SOCKET REQUEST", socketRequest);

      await socketRequest.users.forEach(async (user) => {
        this.userMap[user.id] = await user;
      });

      await console.log(this.userMap);

      this.socket = await new WebSocket(socketRequest.url);

      // Listen for messages
      await this.socket.addEventListener("message", (event) => {
        const received = JSON.parse(event.data);

        if (
          received.type === "message" &&
          received.channel === this.currentChannelID
        ) {
          console.log(received);
          this.messages.unshift(received);
          this.scrollSmooth = true;
          setTimeout(() => {
            this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
          }, 200);
        }
      });

      await console.log(socketRequest);
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
      console.log(response.messages);
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
      v-if="!workspaceRootNode.path || !validConfig"
    >
      <!-- no root found text -->
      <div v-if="!workspaceRootNode.path">
        <div class="px-16 py-4 mt-1 ui-help-text">
          Open a workspace directory to use this Slack integration.
        </div>
      </div>
      <!-- no slack conig found text -->
      <div v-else-if="workspaceRootNode.path && !validConfig">
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
    </div>
    <!-- SUCCESS CONDITION / LIST MESSAGES  -->
    <div class="flex flex-col h-full" v-else>
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

<style scoped>
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
