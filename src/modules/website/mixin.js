import { remote } from "electron";
const { getLinkPreview } = remote.require("link-preview-js");
import { get as lGet } from "lodash";

const moduleID = "com.sarimabbas.chaos.website";
const moduleName = "Chaos Website Module";

const mixin = {
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
      metadataImageFound: false,
    };
  },
  methods: {
    async fetchURL(dirToSaveTo) {
      // statuses
      this.statuses.global = "loading";
      // create initial bundle
      let pathToBundle;
      let metadata;
      let webpageAtom;
      try {
        this.statuses.metadata = "loading";
        const result = await this.fetchMetadata(dirToSaveTo);
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
          this.statuses.metadataImageFound = true;
        } catch (err) {
          this.statuses.metadata = "error";
          console.log(err);
        }
      }
      // save snapshots
      await this.fetchSnapshots(pathToBundle, webpageAtom);
      // finish
      this.statuses.global = "success";
      setTimeout(() => {
        this.statuses.global = "not_started";
      }, 2000);
    },
    async fetchMetadata(dirToSaveTo) {
      // check if the URL exists
      const checkExists = await this.$chaos.utils.urlExists(this.url);
      if (!checkExists) {
        throw "URL does not exist";
      }
      // fetch the metadata object
      const metadata = await getLinkPreview(this.url);
      const pathToBundle = await this.$chaos.path.join(
        dirToSaveTo,
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
          if (!this.statuses.metadataImageFound) {
            await webpageAtom.update({
              shared: {
                image: "./page.png",
              },
            });
            await webpageAtom.save(pathToBundle);
          }
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

export default mixin;
