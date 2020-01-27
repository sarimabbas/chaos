<script>
import api from "../api";
import CrossIcon from "../assets/icons/cross.svg";
import { mapState } from "vuex";
export default {
  components: { CrossIcon },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    close() {
      this.$router.push("splash");
    },
    fetchFiles() {},
    nestedChildrenHelper(node) {
      let children = [];
      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          // add the child to the array
          children.push(child);
          // also add all of its children
          if (child.children && child.children.length > 0) {
            children = children.concat(this.nestedChildrenHelper(child));
          }
        }
      }
      return children;
    }
  },
  computed: {
    currentWorkingPath() {
      return this.$store.state.views.currentWorkingPath;
    },
    currentWorkingNode() {
      return this.$store.state.views.currentWorkingNode;
    },
    immediateChildren() {
      return this.$store.state.views.currentWorkingNode.children;
    },
    nestedChildren() {
      return this.nestedChildrenHelper(
        this.$store.state.views.currentWorkingNode
      );
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
    },
    currentWorkingPath(value) {
      console.log(value);
    }
  }
};
</script>


<template>
  <div class="w-full h-full overflow-y-scroll break-words bg-gray-700">
    <!-- margins -->
    <div class="mx-4">
      <!-- heading -->
      <div class="flex items-center justify-between my-3">
        <h1 class="text-2xl font-bold tracking-widest text-gray-200 uppercase">Folder View</h1>
        <CrossIcon class="ui-option-button" width="24" @click="close" />
      </div>
      <!-- folder name -->
      <div>
        <h2 class="text-xl text-gray-200">{{currentWorkingNode.name}}</h2>
      </div>
      <!-- <span>{{ this.$route.query.path }}</span> -->
      <!-- immediate children list -->
      <ul>
        <li
          v-for="child in nestedChildren"
          :key="child.path"
          class="p-3 my-1 truncate bg-gray-300 border-gray-600 rounded-sm"
        >{{child.name}}</li>
      </ul>
    </div>
  </div>
</template>

<style>
</style>