import path from "path";
import webpack from "webpack";
import dotenv from "dotenv";
dotenv.config();

const config: webpack.Configuration = {
  target: "node",
  mode: "production",
  entry: {
    index: path.resolve(__dirname, "src", "index.ts"),
    cluster: path.resolve(__dirname, "src", "cluster.ts"),
    worker: path.resolve(__dirname, "src", "worker.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PORT": JSON.stringify(process.env.PORT),
    }),
  ],
};

export default config;
