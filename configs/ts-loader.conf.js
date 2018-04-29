const config = require('./config')

module.exports = (options) => {
    return {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // exclude: /node_modules/,
        exclude: /node_modules|\/src/,
        // options: {
        //     appendTsSuffixTo: [/\.vue$/],
        //     transpileOnly: true
        // }
        use: [
            "babel-loader",
            {
              loader: "ts-loader",
              options: { appendTsxSuffixTo: [/\.vue$/] }
            }
        ]
    }
}