import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

const __dirname = path.resolve();
const webpack = {
    entry: "./src/client/js/main.js",
    mode: "development",
    watch: true,
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
        clean: true
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
            },
            {
                test:/\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    }
};

export default webpack;
/*
test: 어떤 확장자의 파일을 webpack 으로 변환시킬건지 명시합니다.
use: loader는 역순으로 실행합니다.
 */