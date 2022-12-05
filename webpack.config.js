const path = require("path");





const config = { 
    entry: {
        index: ["./src/index.tsx"],
    },
    output: {
        path: path.join(__dirname, "/dist/"),
        filename: "[name].bundle.js"
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 4000,
        open: false,
    },
    devtool: "source-map",
}