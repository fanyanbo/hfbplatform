/**
 * index.js
 * author : fanyanbo@coocaa.com
 */

console.log('config.js process.env.NODE_ENV:' + process.env.NODE_ENV);

let config;

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV.trim() === "production") {
    config = require('./prod.env');
} else{
    config = require('./dev.env');
}

module.exports = config;
