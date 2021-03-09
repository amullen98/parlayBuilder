const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path');
const bodyParser = require('body-parser');
const bodyParserJsonError = require('express-body-parser-json-error');
const baseDir = __dirname;
const functions = require("./javascript/functions");

// Use ejs templates
app.set('view engine', 'ejs');

functions.addPlayerToFullList();
setInterval(function() {
  let today = functions.getTodaysDate();
  let scoreboardFile;
  functions.readFromFile('scoreboard').then(returnedData => {
    scoreboardFile = returnedData[0]
    let fileData = JSON.parse(returnedData[1])
    if (!(fileData.scoreboard.gameDate == today)) {
      functions.getScoreboardData().then(data => {
        let requestData = JSON.parse(data);
        if (!(requestData.scoreboard.gameDate == fileData.scoreboard.gameDate)) {
          functions.deleteOldGames()
          functions.deleteFile('files/scoreboard/' + scoreboardFile)

          let today = new Date();
          let dd = String(today.getDate()).padStart(2, '0');
          let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          let yyyy = today.getFullYear();

          today = yyyy + '-' + mm + '-' + dd;
          let filename = 'scoreboard' + '_' + today + '.json'

          functions.writeToFile('scoreboard', data, filename);
          functions.generateBoxScoreURLs().then(data => {

            functions.readFromFile('boxscoreUrls').then(returnedData => {
               let boxscoreUrlsFile = returnedData[0]
              functions.deleteFile('files/boxscoreUrls/' + boxscoreUrlsFile)

              let today = new Date();
              let dd = String(today.getDate()).padStart(2, '0');
              let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              let yyyy = today.getFullYear();

              today = yyyy + '-' + mm + '-' + dd;
              let filename = 'boxscoreUrls' + '_' + today + '.json'

              functions.writeToFile('boxscoreUrls', JSON.stringify(data), filename)
              functions.getBoxscoreData();
              functions.generateFilePaths();
            })
          })
        }
      })
    } else {
      functions.generateBoxScoreURLs().then(data => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        let filename = 'boxscoreUrls' + '_' + today + '.json'

        functions.writeToFile('boxscoreUrls', JSON.stringify(data), filename)
        functions.getBoxscoreData();
        functions.generateFilePaths();
      })
    }
  })
}, 300000);

setInterval(function() {functions.addPlayerToFullList()}, 45000);

//process.on('uncaughtException', function (err) {
//  console.log('Caught exception: Please view log files for more details');
//});

// Serve static files from two directories below
app.use(express.static(path.join(baseDir, 'public')));
app.use(express.static(path.join(baseDir, 'lib/adminLTE')));
app.use(express.static(path.join(baseDir, 'files')));

app.use(bodyParser.json({
  limit: '5mb'
}));
app.use(bodyParserJsonError());
app.use(bodyParser.urlencoded({
  extended: true
}));

const indexRoutes = require("./routes");
const index = require("./routes/index");

app.use(indexRoutes);
app.use("/index", index);

app.listen(3000, function() {
  console.log("Live at: " + 3000);
});
