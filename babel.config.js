const presets = [
    "@babel/env"
];
const ignore = [
    "*.min.js", "*.umd.js"
];
module.exports = function (api) {
    api.cache(true);
    return {
        presets, ignore
    };
};
