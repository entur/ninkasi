var convict = require('convict');
var request = require('request');
var fs = require('fs');

var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development"],
    default: "development",
    env: "NODE_ENV"
  },
  configUrl: {
    doc: "URL for where to read the configuration",
    format: "url",
    default: "http://rutebanken.org/do_not_read",
    env: "CONFIG_URL"
  }
});

// If configuration URL exists, read it and update the configuration object
var configUrl = conf.get('configUrl');
if ( configUrl.indexOf("do_not_read") == -1 ) {
  // Read contents from configUrl if it is given
  request( configUrl, function( error, response, body ) {
    if ( !error && response.statusCode == 200 ) {
      // Reconfigure if config was read:
      fs.writeFileSync('/tmp/ninkasi_config.json',body);
      conf.loadFile('/tmp/ninkasi_config.json');
    } else {
      var err = "Could not load data from "+configUrl
      throw new Error(err);
    }
  });
} else {
  console.log("The CONFIG_URL element has not been set, so you use the default dev-mode configuration")
}


// Load environment dependent configuration
//  var env = conf.get('env');
//  conf.loadFile('./config/' + env + '.json');
conf.validate({strict: true});

module.exports = conf;
