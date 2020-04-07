module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: ["@hapi/joi", "axios", "slack"],
      // nodeModulesPath: ["../../node_modules", "./node_modules"]
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
};
