module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: [
        "@hapi/joi",
        "axios",
        "slack",
        "file-icon",
        "link-preview-js",
        "vue-js-toggle-button",
        "mac-open-with",
      ],
      // nodeModulesPath: ["../../node_modules", "./node_modules"]
      builderOptions: {
        productName: "Chaos",
        appId: "com.sarimabbas.chaos",
        copyright: "Copyright © 2020 Sarim Abbas",
        fileAssociations: [
          {
            ext: "chaos",
            name: "Chaos",
            role: "Editor",
            isPackage: true,
          },
        ],
      },
    },
  },
  assetsDir: "static",
  chainWebpack: (config) => {
    // handle svg imports
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
  configureWebpack: {
    devtool: "source-map",
  },
};
