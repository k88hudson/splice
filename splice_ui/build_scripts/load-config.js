'use strict';

// This file loads configuration from 3 places:
// From process.env;
// From config.json (all configuration under "public")
// From config-default.json (all configuration under "public")

const PUBLIC_KEY = 'public';
const DEFAULT_CONFIG = require('../../config-default.json')[PUBLIC_KEY];
let LOCAL_CONFIG = {};
const config = {};

try {
  LOCAL_CONFIG = require('../../config.json')[PUBLIC_KEY] || {};
} catch (e) {
  console.log('No local config.json found\n');
}

Object.keys(DEFAULT_CONFIG).forEach(key => {
  if (typeof process.env[key] !== 'undefined') {
    config[key] = process.env[key];
  } else if (typeof LOCAL_CONFIG[key] !== 'undefined') {
    config[key] = LOCAL_CONFIG[key]
  } else {
    config[key] = DEFAULT_CONFIG[key];
  }
});

console.log(config);

module.exports = config;
