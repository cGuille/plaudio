const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'lib.js'),
    output: {
        filename: 'plaudio.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'plaudio',
    },
    devtool: 'source-map',
};
