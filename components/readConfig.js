import axios from 'axios'

var configreader = {};
var config;

configreader.readConfig = (callback) => {
  if ( config && typeof config !== 'undefined' ) {
    callback ( config );
    //alert("Not reading again");
    return;
  }
  axios({
    url: "config.json",
    timeout: 2000,
    method: 'get',
    responseType: 'json'
  })
    .then(function(response) {
       config = response.data;
      callback ( config )
    })
    .catch(function(response){
      throw new Error("Could not read config: "+response)
    })
  }


module.exports = configreader;
