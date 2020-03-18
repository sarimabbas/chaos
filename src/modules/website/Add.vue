<script>
import CheckIcon from "../../assets/icons/check.svg";
import LoaderIcon from "../../assets/icons/loader.svg";

const moduleID = "com.sarimabbas.chaos.website";
const moduleName = "Chaos Website Module";

export default {
  components: {
    CheckIcon,
    LoaderIcon
  },
  data() {
    return {
      url: "",
      loading: false,
      success: false,
      error: false
    };
  },
  methods: {
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

      // create path to a new bundle file
      const hostname = new URL(this.url).hostname;
      const pathToBundle =
        this.$store.state.views.currentWorkingPath + "/" + hostname + ".chaos";

      // create a new renderer process window, but keep it hidden
      let win = new this.$chaos.BrowserWindow({
        width: 800,
        height: 600,
        show: false
      });

      // register event handler to clear up window when closed
      win.on("closed", () => {
        win = null;
      });

      // load the entered URL
      win.loadURL(this.url);

      // when the window is finished loading
      win.webContents.on("did-finish-load", async () => {
        // create atom
        const webpageAtom = new this.$chaos.Atom();

        webpageAtom.update({
          module: {
            id: moduleID,
            name: moduleName,
            page: "./page.html",
            singlepage: "./singlepage.html",
            url: this.url
          }
        });

        webpageAtom.save(pathToBundle);

        // save the full directory
        const pathToPage = this.$chaos.path.join(pathToBundle, "page.mhtml");
        await win.webContents.savePage(pathToPage, "HTMLComplete");

        // const mhtmlFileContents = this.$chaos.fs.readFileSync(
        //   pathToPage,
        //   "utf8"
        // );
        // const html = mhtml2html.convert(mhtmlFileContents);
        // console.log(html);

        // save a compressed/inlined version for preview
        this.$chaos.inline.html(
          {
            fileContent: this.$chaos.fs.readFileSync(pathToPage, "utf8"),
            images: true,
            svgs: true,
            scripts: false,
            links: true,
            relativeTo: pathToBundle
          },
          (error, result) => {
            this.$chaos.fs.writeFileSync(
              this.$chaos.path.join(pathToBundle, "singlepage.html"),
              result
            );

            // finish
            win.close();
            this.loading = false;
            this.success = true;
            this.$chaos.refreshExplorer();
            setTimeout(() => {
              this.success = false;
            }, 2000);
          }
        );
      });
    }
  }
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
