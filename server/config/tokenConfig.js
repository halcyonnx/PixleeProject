if (!process.env.DEPLOY) {
  var tokens = require('./../../.tokens.js');
}
else {
  var tokens = {
    instagramAPIToken: process.env.instagramAPIToken,
  }
}

module.exports = tokens;