import path from "path";
const __dirname = path.resolve();
const webpack = {
    entry: "./src/client/js/main.js",
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js")
    },
    module: {
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    }
                }
            }
        ]
    }
};

export default webpack;