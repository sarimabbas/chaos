<script>
import CheckIcon from "../../assets/icons/check.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
import Status from "./components/Status";
import { remote } from "electron";
const { getLinkPreview } = remote.require("link-preview-js");
import { get as lGet } from "lodash";

const moduleID = "com.sarimabbas.chaos.website";
const moduleName = "Chaos Website Module";

export default {
  components: {
    CheckIcon,
    LoaderIcon,
    Status,
  },
  data() {
    return {
      url: "",
      statuses: {
        global: "not_started", // loading, success, error
        metadata: "not_started",
        screenshot: "not_started",
        html: "not_started",
        mhtml: "not_started",
      },
    };
  },
  methods: {
    async fetchURL() {
      // statuses
      this.statuses.global = "loading";
      // create initial bundle
      let pathToBundle;
      let metadata;
      let webpageAtom;
      try {
        this.statuses.metadata = "loading";
        const result = await this.fetchMetadata();
        pathToBundle = result.pathToBundle;
        metadata = result.metadata;
        webpageAtom = result.webpageAtom;
        this.statuses.metadata = "success";
      } catch (err) {
        console.log(err);
        this.statuses.metadata = "error";
      }
      // save favicon
      const faviconURL = lGet(metadata, "favicons[0]", null);
      if (faviconURL) {
        try {
          this.statuses.metadata = "loading";
          const relativePathToImage = await this.fetchImage(
            pathToBundle,
            faviconURL,
            "favicon"
          );
          await webpageAtom.update({
            module: {
              favicon: relativePathToImage,
            },
          });
          await webpageAtom.save(pathToBundle);
          this.statuses.metadata = "success";
        } catch (err) {
          this.statuses.metadata = "error";
          console.log(err);
        }
      }
      // save image
      const imageURL = lGet(metadata, "images[0]", null);
      if (imageURL) {
        try {
          this.statuses.metadata = "loading";
          const relativePathToImage = await this.fetchImage(
            pathToBundle,
            imageURL,
            "image"
          );
          await webpageAtom.update({
            shared: {
              image: relativePathToImage,
            },
          });
          await webpageAtom.save(pathToBundle);
          this.statuses.metadata = "success";
        } catch (err) {
          this.statuses.metadata = "error";
          console.log(err);
        }
      }
      // save snapshots
      await this.fetchSnapshots(pathToBundle, webpageAtom);
      // finish
      this.statuses.global = "success";
      this.$chaos.refreshExplorer();
      setTimeout(() => {
        this.statuses.global = "not_started";
      }, 2000);
    },
    async fetchMetadata() {
      // check if the URL exists
      const checkExists = await this.$chaos.utils.urlExists(this.url);
      if (!checkExists) {
        throw "URL does not exist";
      }
      // fetch the metadata object
      const metadata = await getLinkPreview(this.url);
      const pathToBundle = await this.$chaos.path.join(
        this.$store.state.views.currentWorkingPath,
        metadata.title + ".chaos"
      );
      // create the initial bundle and save
      const webpageAtom = new this.$chaos.Atom();
      await webpageAtom.update({
        shared: {
          title: metadata.title,
          description: metadata.description,
        },
        module: {
          id: moduleID,
          name: moduleName,
          url: this.url,
        },
      });
      await webpageAtom.save(pathToBundle);
      return {
        pathToBundle: pathToBundle,
        metadata: metadata,
        webpageAtom: webpageAtom,
      };
    },
    async fetchImage(pathToBundle, imageURL, filename) {
      if (!imageURL) {
        throw "Image URL does not exist";
      }
      console.log(imageURL, filename, pathToBundle);
      const extension = this.$chaos.path.extname(imageURL);
      const relativePath = `./${filename}${extension}`;
      try {
        await this.$chaos.utils.saveURLToPath(
          imageURL,
          this.$chaos.path.join(pathToBundle, relativePath)
        );
        return relativePath;
      } catch (err) {
        console.log(err);
        throw "Could not save URL to path";
      }
    },
    async fetchSnapshots(pathToBundle, webpageAtom) {
      // create a new renderer process window, but keep it hidden
      let win = new this.$chaos.BrowserWindow({
        width: 800,
        height: 600,
        show: false,
      });

      // register event handler to clear up window when closed
      win.on("closed", () => {
        win = null;
      });

      // load the entered URL
      win.loadURL(this.url);

      // when the window is finished loading
      win.webContents.on("did-finish-load", async () => {
        // save the html
        const pathToPage = this.$chaos.path.join(pathToBundle, "page.html");
        try {
          this.statuses.html = "loading";
          await win.webContents.savePage(pathToPage, "HTMLComplete");
          this.statuses.html = "success";
          await webpageAtom.update({
            module: {
              html: "./page.html",
            },
          });
          await webpageAtom.save(pathToBundle);
        } catch (err) {
          this.statuses.html = "error";
          console.log(err);
        }

        // save the mhtml
        const pathToMHTMLPage = this.$chaos.path.join(
          pathToBundle,
          "page.mhtml"
        );
        try {
          this.statuses.mhtml = "loading";
          await win.webContents.savePage(pathToMHTMLPage, "MHTML");
          this.statuses.mhtml = "success";
          await webpageAtom.update({
            module: {
              mhtml: "./page.mhtml",
            },
          });
          await webpageAtom.save(pathToBundle);
        } catch (err) {
          this.statuses.mhtml = "error";
          console.log(err);
        }

        // save screenshot
        const pathToScreenshot = this.$chaos.path.join(
          pathToBundle,
          "page.png"
        );
        try {
          this.statuses.screenshot = "loading";
          const image = await win.webContents.capturePage();
          await this.$chaos.fs.writeFileSync(pathToScreenshot, image.toPNG());
          this.statuses.screenshot = "success";
          await webpageAtom.update({
            module: {
              screenshot: "./page.png",
            },
          });
          await webpageAtom.save(pathToBundle);
        } catch (err) {
          this.statuses.screenshot = "error";
          console.log(err);
        }

        // finish
        win.close();
      });
    },
  },
};
</script>

<template>
  <div>
    <h1 class="text-xl">Add website</h1>
    <p class="mt-1 mb-2 text-sm text-gray-600">
      The URL, if it exists, will be fetched and stored in the Chaos file
      format.
    </p>
    <div class="flex justify-between">
      <input
        class="w-full px-2 py-2 placeholder-gray-800 border border-gray-300 rounded-lg appearance-none text-md focus:outline-none focus:shadow-outline"
        type="url"
        placeholder="Enter URL e.g. https://google.com"
        v-model="url"
      />
      <button
        class="px-2 ml-2 bg-gray-400 rounded-lg hover:bg-gray-500"
        @click="fetchURL"
      >
        <span v-if="statuses.global === 'loading'">
          <LoaderIcon width="24" class="spin" />
        </span>
        <span v-else-if="statuses.global === 'success'">
          <CheckIcon width="24" />
        </span>
        <span v-else>Fetch</span>
      </button>
    </div>
    <div class="mt-2 statuses">
      <Status name="Metadata" :status="statuses.metadata" />
      <Status name="HTML" :status="statuses.html" />
      <Status name="MHTML" :status="statuses.mhtml" />
      <Status name="Screenshot" :status="statuses.screenshot" />
    </div>
  </div>
</template>

<style></style>
