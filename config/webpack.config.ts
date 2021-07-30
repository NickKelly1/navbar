import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as wds from 'webpack-dev-server';
import * as C from '@nkp/config';

const root = path.join(__dirname, '..');
const absolute = (...paths: string[]) => path.join(root, ...paths);

type Modes =
  | 'development'
  | 'production';
const modes: Modes[] = [
  'development',
  'production',
];

interface Env {
  mode: Modes,
}

// eslint-disable-next-line import/no-anonymous-default-export
const config = async (env: Env): Promise<webpack.Configuration> => {
  const mode = C.key('mode').as(C.oneOf(modes)).get(env as {});

  let devServer: undefined | wds.Configuration = undefined;
  if (mode === 'development') {
    devServer = {
      contentBase: absolute('./docs'),
      compress: true,
      port: 4000,
      hot: true,
      inline: true,
    };
  }

  const entry: webpack.EntryObject = {
    index: absolute('./src/index.ts'),
  };

  const output: webpack.Configuration['output'] = {
    path: absolute('./docs'),
    filename: mode === 'production'
      ? '[name].[contenthash].bundle.js'
      : '[name].bundle.js',
  };

  let devtool: webpack.Configuration['devtool'] = undefined;
  if (mode !== 'production') {
    devtool = 'inline-source-map';
  }

  const module: webpack.Configuration['module'] = {
    rules: [
      // typescript
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: absolute('./config/tsconfig.build.json'),
        },
      },
      {
        // text
        test: /\.txt$/,
        type: 'asset/source',
      },
      {
        // svgs
        test: /\.svg$/,
        dependency: { not: ['url'], },
        type: 'asset/source',
      },
      {
        // static svgs
        test: /^\/static\/\.*.svg$/,
        type: 'asset/resource',
      },
      {
        // fonts
        test: /\.(woff(2)?|eot|ttf|otf|png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
      // css & scss
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          // mini-css-extract: load as separate css files
          MiniCssExtractPlugin.loader,
          // css-loader: parse into css
          'css-loader',
          // postcss: cross platform
          {
            loader: 'postcss-loader',
            // adds css vendor prefixes
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          // sass-loader: parse sass files
          { loader: 'sass-loader', },
        ],
      },
    ],
  };

  const resolve: webpack.Configuration['resolve'] = {
    extensions: ['.tsx', '.ts', '.js'],
  };

  const plugins = [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        from: absolute('./static'),
        to: 'static',
      }],
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      chunks: ['index'],
      template: absolute('./src/index.html'),
      showErrors: true,
      hash: true, // @note: not necessary with contenthash
      filename: '[name].html',
      minify: mode === 'production'
        ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }
        : undefined
      ,
    }),
  ];

  const result: webpack.Configuration = {
    mode,
    devServer,
    entry,
    output,
    devtool,
    module,
    resolve,
    plugins,
  } as webpack.Configuration;

  return result;
};

export default config;
