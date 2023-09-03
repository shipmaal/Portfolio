import * as webpack from "webpack";
const WorkerPlugin = require('worker-plugin');


const mode = process.env["NODE_ENV"] === "production" ? "production" : "development";

const webpackConfig: webpack.Configuration = {
    // WARNING: MUST set the 'mode' manually because it isn't done by NX/NG cli
    mode,
    module: {
        rules: [
            // add custom rules here
        ],
    },
    plugins: [
        new WorkerPlugin()
    ],
};

module.exports = webpackConfig;
