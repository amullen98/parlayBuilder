const request = require('request');
const fs = require('fs')
const glob = require("glob");
const cheerio = require("cheerio");
const path = require('path');
const rimraf = require("rimraf");

//Start Common Functions
function getTodaysDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  return today;
}

function readFromFile(directory) {
  return new Promise((resolve) => {
    fs.readdir('files/' + directory + '/', function(err, filename) {
      if (err) {
        console.log('Error reading directory: ', err)
      }
      if (!filename.length) {
        if (directory == 'scoreboard') {
          getScoreboardData().then(data => {
            //let today = getTodaysDate()
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;
            let filename = directory + '_' + today + '.json'
            writeToFile(directory, data, filename);
          })
        } else if (directory == 'boxscoreUrls') {
          generateBoxScoreURLs().then(data => {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;

            let filename = directory + '_' + today + '.json'
            writeToFile(directory, data, filename);
          })
        }
      } else {
        fs.readFile('files/' + directory + '/' + filename, 'utf-8', function(err, content) {
          if (err) {
            console.log('Error reading file in: ' + directory, err)
          }
          resolve([filename, content]);
        });
      }
    });
  })
}

function writeToFile(directory, value, fileName) {
  //if(!fileName){
  //  let fileName = directory +'_' + today + '.json'
  //}

  fs.writeFileSync('files/' + directory + '/' + fileName, value, err => {
    if (err) {
      console.log('Error writing file in: ' + directory, err)
    } else {
      console.log('Successfully wrote file in: ' + directory)
    }
  })
}

async function createToDirectory(directory, newDirectory) {
  fs.mkdirSync('files/' + directory + '/' + newDirectory)
}

function generateFilePaths() {
  //deleteFile('files/filePaths/filePaths.json')
  let getDirectories = function(src, callback) {
    glob(src + '/**/*.json', callback);
  };
  getDirectories('files', function(err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let data = JSON.stringify(res);
      writeToFile('filePaths', data, 'filePaths.json')
    }
  });
}

function deleteFile(fileName){
fs.unlink(fileName, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
});
}

function proxyGenerator() {
  let ip_addresses = [];
  let port_numbers = [];
  let proxy;

  request("https://sslproxies.org/", function(error, response, html) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      $("td:nth-child(1)").each(function(index, value) {
        ip_addresses[index] = $(this).text();
      });

      $("td:nth-child(2)").each(function(index, value) {
        port_numbers[index] = $(this).text();
      });
    } else {
      console.log("Error loading proxy, please try again");
    }

    ip_addresses.join(", ");
    port_numbers.join(", ");

    let random_number = Math.floor(Math.random() * 100);

    let proxy = 'http://${ip_addresses[random_number]}:${port_numbers[random_number]}';
    console.log(proxy)
    return proxy
  })
}

Array.prototype.unique = function() {
  console.log('Check if unique')
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i].name === a[j].name) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function deleteOldGames(){

  let games = getDirectories(path.join(__dirname, "../files/games"))

  for(let i = 0; i < games.length; i++){
    let homeAwayTeams = getDirectories(path.join(__dirname, "../files/games/" + games[i]))
    for(let y = 0; y < homeAwayTeams.length; y++){
      let players = getDirectories(path.join(__dirname, "../files/games/" + games[i] + '/' + homeAwayTeams[y]))
      for (let p = 0; p < players.length; p++){
        rimraf.sync(path.join(__dirname, "../files/games/" + games[i] + '/' + homeAwayTeams[y] + '/' + players[p]));
      }
      rimraf.sync(path.join(__dirname, "../files/games/" + games[i] + '/' + homeAwayTeams[y]));
    }
    rimraf.sync(path.join(__dirname, "../files/games/" + games[i]));
  }
}
//End of Common Functions

//Start of Scoreboard functions
function getScoreboardData() {
  return new Promise((resolve) => {

    let options = {
      'method': 'GET',
      'url': 'https://nba-prod-us-east-1-mediaops-stats.s3.amazonaws.com/NBA/liveData/scoreboard/todaysScoreboard_00.json'
      //'proxy': proxyGenerator()
    };

    request(options, function(error, response) {
      if (error) throw new Error(error);

      let TodaysScoreboard = response.body;
      resolve(TodaysScoreboard)
    });
  })
}

//End of Scoreboard Functions

//Start of Boxscore Functions
function generateBoxScoreURLs() {
  return new Promise((resolve) => {
    let boxscoreUrls = new Array;
    readFromFile('scoreboard').then(returnedData => {
      let scoreboardfileData = JSON.parse(returnedData[1]);
      let games = scoreboardfileData.scoreboard.games

      for (let i = 0; i < games.length; i++) {
        boxscoreUrls[i] = 'https://cdn.nba.com/static/json/liveData/boxscore/boxscore_' + games[i].gameId + '.json'
      }
      resolve(boxscoreUrls)
    })
  })
}

function getBoxscoreData() {
  readFromFile('boxscoreUrls').then(data => {
    let boxscoreUrls = JSON.parse(data[1]);

    for (let x = 0; x < boxscoreUrls.length; x++) {

      let options = {
        'method': 'GET',
        'url': boxscoreUrls[x]
        //'proxy': proxyGenerator()
      };

      request(options, function(error, response) {
        if (error) throw new Error(error);
        if (!response.body.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
          let gameData = JSON.parse(response.body)
          //console.log(gameData)
          let gameId = gameData.game.gameId
          let HTteamId = gameData.game.homeTeam.teamId
          let ATteamId = gameData.game.awayTeam.teamId

          let HTplayers = gameData.game.homeTeam.players
          let ATplayers = gameData.game.awayTeam.players

          if (!(fs.existsSync('files/games/' + gameId))) {
            createToDirectory('games', gameId)
            createToDirectory('games/' + gameId, HTteamId)
            createToDirectory('games/' + gameId, ATteamId)
            for (let i = 0; i < HTplayers.length; i++) {
              createToDirectory('games/' + gameId + '/' + HTteamId + '/', HTplayers[i].personId)
            }
            for (let x = 0; x < ATplayers.length; x++) {
              createToDirectory('games/' + gameId + '/' + ATteamId + '/', ATplayers[x].personId)
            }
          }
          setHomeAndAwayGameData(gameData);
          setScorePerPeriod('homeTeam', gameData)
          setScorePerPeriod('awayTeam', gameData)
          setPlayerStats('homeTeam', gameData)
          setPlayerStats('awayTeam', gameData)
        }
      });
    }
  })
}


function setHomeAndAwayGameData(gameData) {
  let HtTeamId = gameData.game.homeTeam.teamId
  let HtTricode = gameData.game.homeTeam.teamTricode
  let HtCity = gameData.game.homeTeam.teamCity
  let HtName = gameData.game.homeTeam.teamName
  let HtScore = gameData.game.homeTeam.score

  let AtTeamId = gameData.game.awayTeam.teamId
  let AtTricode = gameData.game.awayTeam.teamTricode
  let AtCity = gameData.game.awayTeam.teamCity
  let AtName = gameData.game.awayTeam.teamName
  let AtScore = gameData.game.awayTeam.score

  let gameDate = gameData.game.gameTimeLocal
  let gameStatus = gameData.game.gameStatus
  let gameStatusText = gameData.game.gameStatusText
  let period = gameData.game.period
  let gameClock = gameData.game.gameClock

  let myAssociativeArr = [];
  myAssociativeArr.push({
    "HtTeamId": HtTeamId,
    "HtTricode": HtTricode,
    "HtCity": HtCity,
    "HtName": HtName,
    "HtScore": HtScore,
    "AtTeamId": AtTeamId,
    "AtTricode": AtTricode,
    "AtCity": AtCity,
    "AtName": AtName,
    "AtScore": AtScore,
    "gameDate": gameDate,
    "gameStatus": gameStatus,
    "gameStatusText": gameStatusText,
    "period": period,
    "gameClock": gameClock
  });

  let directory = 'games/' + gameData.game.gameId
  let data = JSON.stringify(myAssociativeArr)
  let filename = 'gameInfo.json'

  writeToFile(directory, data, filename);
}

function setScorePerPeriod(team, gameData) {
  let teamData = gameData.game[team]
  let periods = teamData.periods

  let directory = 'games/' + gameData.game.gameId + '/' + teamData.teamId
  let data = JSON.stringify(periods)
  let filename = 'teamScore.json'

  writeToFile(directory, data, filename);
}

function setPlayerStats(team, gameData) {
  let teamData = gameData.game[team]
  let players = teamData.players

  for (let i = 0; i < players.length; i++) {

    let directory = 'games/' + gameData.game.gameId + '/' + teamData.teamId + '/' + players[i].personId
    let data = JSON.stringify(players[i])
    let filename = players[i].firstName + players[i].familyName + '.json'

    writeToFile(directory, data, filename);
  }
}



async function addPlayerToFullList() {
  let player = new Array;

  let returnedFilePaths = await readFromFile('filePaths')
  let filePaths = JSON.parse(returnedFilePaths[1]);
  for (let i = 0; i < filePaths.length; i++) {
    let path = filePaths[i]
    let splitPath = path.split('/');

    if (splitPath[1] == 'games') {
      if (splitPath[3] != 'gameInfo.json' && splitPath[4] != 'teamScore.json') {
        let directory = 'games/' + splitPath[2] + '/' + splitPath[3] + '/' + splitPath[4]
        let data = await readFromFile(directory)
        let playerData = JSON.parse(data[1]);
        player.push({
          'name': playerData.name,
          'jerseyNum': playerData.jerseyNum,
        })

      }
    }
  }

  let currentPlayer = await readFromFile('players')
  let currentPlayerData = JSON.parse(currentPlayer[1]);

  let array3 = player.concat(currentPlayerData).unique();
  writeToFile('players', JSON.stringify(array3), 'players.json')
}
//End of Boxscore Functions

module.exports = {
  getTodaysDate,
  readFromFile,
  writeToFile,
  deleteFile,
  deleteOldGames,
  generateFilePaths,
  getScoreboardData,
  generateBoxScoreURLs,
  getBoxscoreData,
  addPlayerToFullList
};
