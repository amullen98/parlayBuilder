//setInterval(refreshPageData, 30000);

let now = new Date();
let millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
if (millisTill10 < 0) {
  millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(function() {

}, millisTill10);

function getTodaysDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  return today;
}

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function loadPlayerNames() {
  return new Promise((resolve) => {
    let loadedFile = loadFile('players/players.json')
    let parsedPlayerNames = JSON.parse(loadedFile)
    let players = new Array();

    for(let i = 0; i < parsedPlayerNames.length; i++){
      players[i] = parsedPlayerNames[i].name
    }
    resolve(players)
  })
}

function clearPlayersFromDB() {
  let loadedFile = loadFile('filePaths/filePaths.json')
  let parsedFilePaths = JSON.parse(loadedFile)

  for (let i = 0; i < parsedFilePaths.length; i++) {
    let path = parsedFilePaths[i]
    let splitPath = path.split('/');

    if (splitPath[1] == 'games' && splitPath[3] == 'gameInfo.json') {

      let gameId = splitPath[2]
      let filePath = 'games/' + gameId + '/gameInfo.json'

      let loadedFile = loadFile(filePath)
      let parsedFile = JSON.parse(loadedFile)

      let gameStatus = parsedFile[0].gameStatus
      let date = new Date(parsedFile[0].gameDate)
      let yyyy = date.getFullYear();
      let mm = String(date.getMonth() + 1).padStart(2, '0');
      let dd = String(date.getDate()).padStart(2, '0');
      let gameDate = yyyy + '-' + mm + '-' + dd
      let today = getTodaysDate()
      console.log(gameDate)

      if ((!(gameDate == today)) && gameStatus == 3) {
        clearData()
      }
    }
  }
}

function loadPlayerData() {
  //variables
  let playerInfo = new Array();

  //load file with game file urls
  let loadedFile = loadFile('filePaths/filePaths.json')
  let parsedFilePaths = JSON.parse(loadedFile)

  for (let i = 0; i < parsedFilePaths.length; i++) {
    let path = parsedFilePaths[i]
    let splitPath = path.split('/');

    if (splitPath[1] == 'games') {

      let gameId = splitPath[2]
      let filePath = 'games/' + gameId + '/gameInfo.json'
      let loadedFile = loadFile(filePath)
      let parsedFile = JSON.parse(loadedFile)
      let homeTeamId = parsedFile[0].HtTeamId
      let awayTeamId = parsedFile[0].AtTeamId

      if (splitPath[2] == gameId && splitPath[3] == homeTeamId && splitPath[4] != 'teamScore.json') {
        let playerId = splitPath[4]
        let filePath = 'games/' + gameId + '/' + homeTeamId + '/' + playerId + '/' + splitPath[5]
        let loadedFile = loadFile(filePath)
        let parsedFile = JSON.parse(loadedFile)
        let playerName = parsedFile.name
        playerInfo.push({
          'playerName': playerName,
          'gameId': splitPath[2],
          'teamId': splitPath[3],
          'playerId': splitPath[4],
          'fileName': splitPath[5]
        })
      } else if (splitPath[2] == gameId && splitPath[3] == awayTeamId && splitPath[4] != 'teamScore.json') {
        let playerId = splitPath[4]
        let filePath = 'games/' + gameId + '/' + awayTeamId + '/' + playerId + '/' + splitPath[5]
        let loadedFile = loadFile(filePath)
        let parsedFile = JSON.parse(loadedFile)
        let playerName = parsedFile.name
        playerInfo.push({
          'playerName': playerName,
          'gameId': splitPath[2],
          'teamId': splitPath[3],
          'playerId': splitPath[4],
          'fileName': splitPath[5]
        })
      }
    }
  }
  return playerInfo

}

function refreshPageData() {
  let betSection = document.getElementById("bets");
  let betCount = betSection.children.length
  let playersLookedUp = new Array;
  let cardNum = 1
  let itemNum = 1

  for (let i = 0; i < betCount; i++) {
    let cardList = document.getElementById("card" + cardNum + "List");
    for (let y = 0; y < cardList.children.length; y++) {
      let player = document.getElementById("card" + cardNum + "Item" + itemNum + "Player");
      let line = document.getElementById("card" + cardNum + "Item" + itemNum + "Line");
      let progressBar = document.getElementById("card" + cardNum + "Item" + itemNum + "ProgressBar");
      let currentLine = document.getElementById("card" + cardNum + "Item" + itemNum + "Current");

      read(player.innerText).then(data => {
        let filePath = 'games/' + data.gameId + '/' + data.teamId + '/' + data.playerId + '/' + data.fileName
        let fileData = loadFile(filePath)
        let parsedData = JSON.parse(fileData)
        let lineValue = line.innerText
        let split = lineValue.split(" ")
        let play = split[2].toLowerCase()

        if (play == 'rebounds') {
          play = play + 'Total'
        }
        let value = parsedData.statistics[play]
        let overUnder

        if (split[1].includes('.')) {
          let splitOU = split[1].split(".")
          if (split[0] == 'OVER') {
            overUnder = parseInt(splitOU[0]) + 1
          } else {
            overUnder = parseInt(splitOU[0])
          }
        } else {
          overUnder = parseInt(split[1])
        }

        let percent = Math.round((value / overUnder) * 100)
        currentLine.innerText = 'Current Total: ' + value
        progressBar.style.width = percent + '%'

        if (percent < 40) {
          progressBar.style.backgroundColor = '#b50000'
        } else if (percent => 40 && percent < 100) {
          progressBar.style.backgroundColor = '#ffd000'
        } else {
          progressBar.style.backgroundColor = '#00ad28'
        }
      })
      itemNum = itemNum + 1
    }
    cardNum = cardNum + 1
  }
}
