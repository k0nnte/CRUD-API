import path from "path";
import webpack from 'webpack';
import dotenv from 'dotenv';
dotenv.config();

const config: webpack.Configuration = { mode: 'production',
  entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
   module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT)
    })
  ]
};

  export default config;