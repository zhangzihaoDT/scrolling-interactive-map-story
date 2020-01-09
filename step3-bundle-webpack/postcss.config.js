const postcss_import = require("postcss-import");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

module.exports = {
  plugins: [postcss_import, autoprefixer, cssnano]
};
