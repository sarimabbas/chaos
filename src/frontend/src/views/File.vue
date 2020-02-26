<script>
import api from "../api";
import { get as lGet } from "lodash";
import CrossIcon from "../assets/icons/cross.svg";
import WebsiteInteract from "../modules/website/Interact";
export default {
  components: { CrossIcon, WebsiteInteract },
  data() {
    return {
      manifest: null
    };
  },
  // mounted() {
  //   this.path = this.$route.query.path;
  // },
  methods: {
    close() {
      this.$router.push("splash");
    }
  },
  watch: {
    // TODO
    currentPath: {
      immediate: true,
      handler: async function(newVal, oldVal) {
        console.log(newVal);
        const response = await api.get("/read-file", {
          params: {
            path: newVal
          }
        });
        if (this.isFileAtom) {
          this.manifest = await response.data;
        } else {
          this.manifest = null;
        }
      }
    }
  },
  computed: {
    currentNode() {
      const node = this.$store.state.views.currentWorkingNode;
      return node;
    },
    currentPath() {
      return this.currentNode.path;
    },
    currentFileExtension() {
      const extension = this.currentPath.split(".").pop();
      return extension;
    },
    isFileAtom() {
      const atomExtensions = ["chaos", "crncl", "sa490"];
      return atomExtensions.includes(this.currentFileExtension);
    },
    moduleID() {
      return lGet(this.manifest, "module.id", "");
    }
  }
};
</script>


<template>
  <div class="w-full h-full overflow-y-scroll bg-gray-700">
    <div class="flex items-center justify-between mx-4 my-3">
      <h1 class="text-2xl font-bold tracking-widest text-gray-200 uppercase">File View</h1>
      <CrossIcon class="ui-option-button" width="24" @click="close" />
    </div>
    <!-- <span>{{ this.$route.query.path }}</span> -->
    <!-- <span>{{ currentNode.path }}</span> -->
    <!-- <span>Exte ID: {{ currentFileExtension }}</span> -->
    <!-- <span>Module ID: {{ moduleID }}</span> -->

    <WebsiteInteract v-if="moduleID === 'com.sarimabbas.website'" :manifest="manifest" />
  </div>
</template>

<style>
</style>