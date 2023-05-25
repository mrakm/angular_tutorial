// https://github.com/rhuang/falettis-ui/issues/494
// https://rynop.com/2018/11/20/use-momentjs-moment-timezone-in-angular-efficiently/

'use strict';

const webpack = require('webpack');

// https://webpack.js.org/plugins/context-replacement-plugin/
module.exports = {
  plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-us/)]
};
