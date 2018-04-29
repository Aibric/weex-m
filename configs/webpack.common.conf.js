const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('./config');
const helper = require('./helper');
const tsLoaderConfig = require('./ts-loader.conf')
const vueLoaderConfig = require('./vue-loader.conf');
// copy 静态资源
const copyWebpackPlugin= require("copy-webpack-plugin");

const vueWebTemp = helper.rootNode(config.templateDir);
const hasPluginInstalled = fs.existsSync(helper.rootNode(config.pluginFilePath));
const isWin = /^win/.test(process.platform);
var webEntry = {};
const weexEntry = {};

// Wraping the entry file for web.
const getEntryFileContent = (entryPath, vueFilePath) => {
  let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
  let relativeEntryPath = helper.root(config.entryFilePath);
  let relativePluginPath = helper.rootNode(config.pluginFilePath);

  let contents = '';
  let entryContents = fs.readFileSync(relativeEntryPath).toString();
  if (isWin) {
    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
    relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\');
  }
  if (hasPluginInstalled) {
    contents += `\n// If detact plugins/plugin.js is exist, import and the plugin.js\n`;
    contents += `import plugins from '${relativePluginPath}';\n`;
    contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`;
    entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`);
    contents = ''
  }
  contents += `\nconst App = require('${relativeVuePath}');\n`;
  //contents += `new Vue(Vue.util.extend({el: '#root'}, App));\n`;
  contents += `\nnew Vue(Vue.util.extend({el: '#root', template: '<app/>', components: {App}}, App));\n`;
  return entryContents + contents;
}

// Retrieve entry file mappings by function recursion
const getEntryFile = (dir, rootDir) => {
  dir = dir || '.';
  const directory = helper.root(dir);
  fs.readdirSync(directory).forEach((file) => {
    const fullpath = path.join(directory, file);
    const stat = fs.statSync(fullpath);
    const extname = path.extname(fullpath);
    if (stat.isFile() &&  ['.vue', '.ts'].includes(extname)) {
      //const name = path.join(dir, path.basename(file, extname));
      const name = path.join(rootDir || dir, path.basename(file, extname));
      // if (extname === '.vue') {
      if (['.vue', '.ts'].includes(extname)) {
        // const entryFile = path.join(vueWebTemp, dir, path.basename(file, extname) + '.js');
        const entryFile = path.join(vueWebTemp, rootDir || dir, path.basename(file, extname) + '.js');
        fs.outputFileSync(entryFile, getEntryFileContent(entryFile, fullpath));
        if (name === 'index') {
          webEntry = Object.assign({[name]: entryFile}, webEntry)
        } else {
          webEntry[name] = entryFile;
        }
      }
      weexEntry[name] = fullpath + '?entry=true';
    }
    else if (stat.isDirectory() && file !== 'build' && file !== 'include') {
      const subdir = path.join(dir, file);
      getEntryFile(subdir);
    }
  });
}

//检测文件或者文件夹存在 nodeJS
const fsExistsSync = (path) => {
  try{
      fs.accessSync(path, fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}

// getEntryFile()
// Generate an entry file array before writing a webpack configuration
[{dir: './pages', rootDir: '.'}].forEach((dir) => {
  let rootDir
  if (typeof dir === 'object') {
    if (dir.dir) {
      rootDir = dir.rootDir
      dir     = dir.dir
    } else {
      return
    }
  }
  const directory = helper.root(dir);
  if (fsExistsSync(directory)) {
    getEntryFile(dir, rootDir);
  }
})


const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [helper.rootNode('src'), helper.rootNode('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})
const useEslint = config.dev.useEslint ? [createLintingRule()] : []

/**
 * Plugins for webpack configuration.
 */
const plugins = [
  /*
   * Plugin: BannerPlugin
   * Description: Adds a banner to the top of each generated chunk.
   * See: https://webpack.js.org/plugins/banner-plugin/
   */
  new webpack.BannerPlugin({
    banner: '// { "framework": "Vue"} \n',
    raw: true,
    exclude: 'Vue'
  }),
  new copyWebpackPlugin([{
      from: helper.resolve('src/static/'),
      to: helper.rootNode('./dist')
  }])
];

// let webKeys = Object.keys(webEntry)
// let webKey = webKeys.slice(14,16)
// console.log('___webKeys.length', webKeys.length, 16)
// console.log('___webEntry', webEntry)
// let webEntry2 = {}
// webKey.forEach(val => {
//   webEntry2[val] = webEntry[val]
// })

// console.log('>>>>>', webEntry2)

// Config for compile jsbundle for web.
const webConfig = {
  entry: Object.assign(webEntry, {
    'vendor': [path.resolve('node_modules/phantom-limb/index.js')]
  }),
  output: {
    path: helper.rootNode('./dist'),
    filename: '[name].web.js'
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.ts', 'tsx', '.js', '.vue', '.we', 'css', '.json', '.yml', '.yaml'],
    alias: {
      // 'vue': 'vue/dist/vue.js',
      // 'vue$': 'vue/dist/vue.runtime.esm.js',
      // 'vue$': 'vue/dist/vue.common.js',
      '~~': helper.rootNode(''),
      '@@': helper.rootNode(''),
      '@': helper.resolve('src'),
      '~': helper.resolve('src')
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    // webpack 2.0 
    rules: useEslint.concat([
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: /node_modules(?!(\/|\\).*(weex).*)/
      },
      {
        test: /[\.vue|\.we](\?[^?]+)?$/,
        use: [{
          loader: 'vue-loader',
          options: Object.assign(vueLoaderConfig({useVue: true, usePostCSS: false}), {
            /**
             * important! should use postTransformNode to add $processStyle for
             * inline style prefixing.
             */
            optimizeSSR: false,
            postcss: [
              // to convert weex exclusive styles.
              require('postcss-plugin-weex')(),
              require('autoprefixer')({
                browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
              }),
              require('postcss-plugin-px2rem')({
                // base on 750px standard.
                rootValue: 75,
                // to leave 1px alone.
                minPixelValue: 1.01
              })
            ],
            compilerModules: [
              {
                postTransformNode: el => {
                  // to convert vnode for weex components.
                  require('weex-vue-precompiler')()(el)
                }
              }
            ]
          })
        }]
      },
      // {
      //   test: /\.tsx?$/,
      //   exclude: /node_modules/,
      //   use: [
      //     "babel-loader",
      //     {
      //       loader: "ts-loader",
      //       options: { appendTsxSuffixTo: [/\.vue(\?[^?]+)?$/] }
      //     }
      //   ]
      // },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // {
      //   ...tsLoaderConfig
      // },
      {
        test: /\.(yml|yaml)$/,
        loader: 'json-loader!yaml-loader',
        include: [helper.rootNode('src'), helper.rootNode('configs')],
      }
    ])
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  // presets: ["es2015", "stage-0"],
  plugins: plugins
};
// Config for compile jsbundle for native.
const weexConfig = {
  entry: weexEntry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.ts', 'tsx', '.js', '.vue', '.we', 'css', '.json', '.yml', '.yaml'],
    alias: {
      // 'vue': 'vue/dist/vue.js',
      // 'vue$': 'vue/dist/vue.runtime.esm.js',
      'vue$': 'vue/dist/vue.common.js',
      '@': helper.resolve('src'),
      '~': helper.resolve('src')
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /[\.vue|\.we](\?[^?]+)?$/,
        use: [{
          loader: 'weex-loader',
          options: vueLoaderConfig({useVue: false})
        }]
      },
      // {
      //   test: /\.tsx?$/,
      //   exclude: /node_modules/,
      //   use: [
      //     "babel-loader",
      //     {
      //       loader: "ts-loader",
      //       options: { appendTsxSuffixTo: [/\.vue$/] }
      //     }
      //   ]
      // },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // {
      //   ...tsLoaderConfig
      // },
      {
        test: /\.(yml|yaml)$/,
        loader: 'json-loader!yaml-loader',
        include: [helper.rootNode('src'), helper.rootNode('configs')],
      }
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  // presets: ["es2015", "stage-0"],
  plugins: plugins,
  /*
  * Include polyfills or mocks for various node stuff
  * Description: Node configuration
  *
  * See: https://webpack.github.io/docs/configuration.html#node
  */
  node: config.nodeConfiguration
};

module.exports = [webConfig, weexConfig];
