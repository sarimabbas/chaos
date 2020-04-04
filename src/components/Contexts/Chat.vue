<script>
export default {
  data() {
    return {
      validConfig: false,
    };
  },
  mounted() {},
  computed: {
    workspaceRootNode() {
      return this.$store.state.views.workspaceRootNode;
    },
  },
  watch: {
    workspaceRootNode: {
      handler: function (val) {
        this.checkConfig();
      },
      immediate: true,
    },
  },
  methods: {
    checkConfig() {
      if (
        this.$chaos.fs.existsSync(
          this.$chaos.path.join(
            this.workspaceRootNode.path,
            ".chaos",
            "config.chaos"
          )
        )
      ) {
        this.validConfig = true;
      } else {
        console.log("iunvalid");
        this.validConfig = false;
      }
    },
    createConfig() {},
  },
};
</script>

<template>
  <div class="flex items-center flex-none h-full">
    <!-- no root found text -->
    <div class="text-center" v-if="!workspaceRootNode.path">
      <div class="px-16 py-4 mt-1 ui-help-text">
        Open a workspace directory to use this Slack integration.
      </div>
    </div>
    <!-- help text -->
    <div class="text-center" v-else-if="workspaceRootNode.path && !validConfig">
      <div class="px-16 py-4 mt-1 ui-help-text">
        No Slack configuration found in your Explorer root. Would you like to
        create one?
      </div>
      <button class="px-2 py-1 mr-2 text-base ui-button">
        Create Slack configuration
      </button>
    </div>
    <!-- help end -->
    <div class="text-center" v-else-if="workspaceRootNode.path && validConfig">
      <div class="px-16 py-4 mt-1 ui-help-text">
        Valid configuration found!
      </div>
    </div>
    <!-- help end -->
  </div>
</template>

<style></style>
