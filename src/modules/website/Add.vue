<script>
import CheckIcon from "../../assets/icons/check.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
import { remote } from "electron";
const { getLinkPreview } = remote.require("link-preview-js");
import { get as lGet } from "lodash";

const moduleID = "com.sarimabbas.chaos.website";
const moduleName = "Chaos Website Module";

export default {
  components: {
    CheckIcon,
    LoaderIcon,
  },
  data() {
    return {
      url: "",
      loading: false,
      success: false,
      error: false,
    };
  },
  methods: {
    async downloadURLImageToPath(url, path) {
      console.log("Downloading preview image...");
      const writer = this.$chaos.fs.createWriteStream(path);

      const response = await this.$chaos.axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    },
    async fetchURL() {
      this.loading = true;

      // check if URL even exists
      let axiosResponse;
      try {
        axiosResponse = await this.$chaos.axios.get(this.url);
      } catch (error) {
        this.loading = false;
        this.error = true;
        return;
      }

      // collect preliminary information about URL
      const previewData = await getLinkPreview(this.url);

      // construct a path to the bundle
      const pathToBundle = await this.$chaos.path.join(
        this.$store.state.views.currentWorkingPath,
        previewData.title + ".chaos"
      );

      // create the initial bundle and save
      const webpageAtom = new this.$chaos.Atom();
      await webpageAtom.update({
        shared: {
          title: previewData.title,
          description: previewData.description,
        },
        module: {
          id: moduleID,
          name: moduleName,
          url: this.url,
          favicon: lGet(previewData, "favicons[0]", ""),
        },
      });
      await webpageAtom.save(pathToBundle);

      // try to save the preview image as well
      const previewImage = await lGet(previewData, "images[0]", null);
      let previewImageRelativePath = null;
      if (await previewImage) {
        const extension = await this.$chaos.path.extname(previewImage);
        previewImageRelativePath = `./image${extension}`;
        await this.downloadURLImageToPath(
          previewImage,
          this.$chaos.path.join(pathToBundle, `image${extension}`)
        );
      }
      await webpageAtom.update({
        shared: {
          // either the currently fetched image or the eventual page screenshot (below)
          image: previewImageRelativePath || "./page.png",
        },
      });
      await webpageAtom.save(pathToBundle);

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
          console.log("Saving page as HTML...");
          await win.webContents.savePage(pathToPage, "HTMLComplete");
        } catch (err) {
          console.log(err);
        }

        // save the mhtml
        const pathToMHTMLPage = this.$chaos.path.join(
          pathToBundle,
          "page.mhtml"
        );
        try {
          console.log("Saving page as MHTML...");
          await win.webContents.savePage(pathToMHTMLPage, "MHTML");
        } catch (err) {
          console.log(err);
        }

        // save screenshot
        const pathToScreenshot = this.$chaos.path.join(
          pathToBundle,
          "page.png"
        );
        const image = await win.webContents.capturePage();
        try {
          console.log("Saving page as screenshot...");
          await this.$chaos.fs.writeFileSync(pathToScreenshot, image.toPNG());
        } catch (err) {
          console.log(err);
        }

        // save PDF
        const pathToPDF = this.$chaos.path.join(pathToBundle, "page.pdf");
        const pdf = await win.webContents.printToPDF({});
        try {
          console.log("Saving page as PDF...");
          await this.$chaos.fs.writeFileSync(pathToPDF, pdf);
        } catch (err) {
          console.log(err);
        }

        // update bundle
        await webpageAtom.update({
          module: {
            html: "./page.html",
            mhtml: "./page.mhtml",
            screenshot: "./page.png",
            pdf: "./page.pdf",
          },
        });
        await webpageAtom.save(pathToBundle);

        // finish
        win.close();
        this.loading = false;
        this.success = true;
        this.$chaos.refreshExplorer();
        setTimeout(() => {
          this.success = false;
        }, 2000);
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
        <span v-if="loading">
          <LoaderIcon width="24" class="spin" />
        </span>
        <span v-else-if="success">
          <CheckIcon width="24" />
        </span>
        <span v-else>Fetch</span>
      </button>
    </div>
  </div>
</template>

<style></style>
