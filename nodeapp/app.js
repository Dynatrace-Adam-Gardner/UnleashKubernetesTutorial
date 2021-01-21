const axios = require('axios').default;
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

var flagsMasterList = ["AlwaysEnabled", "EnableStaticContent", "CreateProblem"];
var flagsEnabled = [];
var flagsDisabled = [];

// START Initalise unleash-client
const { initialize } = require('unleash-client');
const instance = initialize({
    url: 'http://unleash/api',
    appName: 'my-app-name',
    refreshInterval: '1'
});

// optional events
instance.on('error', console.error);
instance.on('warn', console.warn);
instance.on('ready', console.log);

/* This is called whenever the isEnabled method is called
 * If a flag is enabled, add it to the featureFlags cookie
 */
instance.on('count', (name, enabled) => {
  console.log(`isEnabled(${name}) returned ${enabled}`);
  if (enabled) {
    flagsEnabled.push(name);
  }
  else {
    flagsDisabled.push(name);
  }
})

// END Initalise unleash-client

app.use(cookieParser());

app.get('/getcookies', (req, res)=>{ 
//shows all the cookies 
res.send(req.cookies); 
}); 



app.get('/', function (req, res) {
    
    res.cookie('foo','a, b, c');
    
    const {
      isEnabled,
      getVariant,
      getFeatureToggleDefinition,
      getFeatureToggleDefinitions,
    } = require('unleash-client');
    
    // Reset list of feature flags that are enabled and disabled
    flagsEnabled.length = 0;
    flagsDisabled.length = 0;
    
    // Remove all cookie. We'll re-add them later.
    flagsMasterList.forEach(function(value){
      console.log('clearing cookie: ' + value);
      res.clearCookie(value);
    });
    
    // Check whether each flag is enabled. This also adds to the flagsEnabled list.
    flagsMasterList.forEach(function(value){
      isEnabled(value);
    });
    
    var statusCode = req.query.statusCode;
    
    if (statusCode == 500) {
        res.sendStatus(500);
        return; // Do not process further
    }
    
    flagsEnabled.forEach(function(value){
        console.log('cookie set: ' + value);
        res.cookie(value, "true")
    });
    
    if (flagsEnabled.includes('CreateProblem')) { 
      res.sendStatus(500);
      console.log('-- END REQUEST --');
    }
    else if (flagsEnabled.includes('EnableStaticContent')) {
      axios.get('https://raw.githubusercontent.com/agardnerIT/OddFiles/master/index2.html')
      .then(function (response) {
        res.send(response.data);
        console.log('-- END REQUEST --');
      })
      .catch(function (error) {
      // handle error
      console.log(error);
      })
    }
    else {
        res.sendFile(__dirname + '/index.html');
        console.log('-- END REQUEST --');
    }
    
});

var server = app.listen(5000);