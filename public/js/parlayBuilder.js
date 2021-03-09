function newParlay() {
  let betCount = document.getElementById("bets").children.length
  let cardNum = betCount + 1

  let bets = document.getElementById("bets")
  let card = document.createElement("div");
  card.className = "box";
  card.id = "card" + cardNum;
  card.style.minHeight = "50px"
  bets.appendChild(card);

  let headerClone = document.getElementById("card1Header");
  let boxHeader = headerClone.cloneNode(true);
  //boxHeader.find("*[id]").each(function() {
	//							$(this).attr("id", function(i, id) {
	//								let splitData = id.split(1);
	//								return splitData[0] + cardNum + splitData[1];
	//							});
	//						});
  boxHeader.id = "card" + cardNum + "Header";
  card.appendChild(boxHeader);
  //let boxHeader = document.createElement("card1Header");
  //boxHeader.className = "box-header with-border";
  //boxHeader.id = "card" + cardNum + "Header";
  //card.appendChild(boxHeader);

  //let tools = document.createElement("div");
  //tools.className = "box-tools pull-right";
  //tools.style = "left:0%"
  //boxHeader.appendChild(tools);

  //let minusButton = document.createElement("button");
  //minusButton.type = "button";
  //minusButton.className = "btn btn-box-tool";
  //minusButton.setAttribute("data-widget","collapse")
  //tools.appendChild(minusButton);

  //let minus = document.createElement("i");
  //minus.className = "fa fa-minus";
  //minusButton.appendChild(minus);

  //let timesButton = document.createElement("button");
  //timesButton.type = "button";
  //timesButton.className = "btn btn-box-tool";
  //timesButton.setAttribute("data-widget","remove")
  //tools.appendChild(timesButton);

  //let times = document.createElement("i");
  //times.className = "fa fa-times";
  //timesButton.appendChild(times);
  let childHeader = document.getElementById("card" + cardNum + "Header").getElementsByClassName( 'box-title' )[0]
  childHeader.id = "card" + cardNum + "HeaderTitle";
  childHeader.innerText = "Parlay #" + cardNum
  boxHeader.appendChild(childHeader);

  let boxBody = document.createElement("div");
  boxBody.className = "box-body with-border";
  boxBody.id = "card" + cardNum + "Body";
  boxBody.style = "text-align: center;"
  card.appendChild(boxBody);

  let introText = document.createElement("b");
  introText.id = "card" + cardNum + "IntroText";
  introText.innerText = "Use the Parlay Builder on the Left to Get Started"
  boxBody.appendChild(introText);

  let list = document.createElement("ul");
  list.id = "card" + cardNum + "List";
  list.className = "list-group list-group-unbordered"
  boxBody.appendChild(list);

  let boxFooter = document.createElement("div");
  boxFooter.className = "box-footer with-border";
  boxFooter.id = "card" + cardNum + "Footer";
  card.appendChild(boxFooter);

  playerName = document.getElementById("playerName").value
  betLineDropDown = document.getElementById("betLineDropDown")
  betLine = betLineDropDown.options[betLineDropDown.selectedIndex].text;
  total = document.getElementById("total").value
  betTypeDropDown = document.getElementById("betTypeDropDown")
  betType = betTypeDropDown.options[betTypeDropDown.selectedIndex].text;

  if (playerName != "" || betLine != "Bet Type" || total != "" || betType != "Value Type") {
    addLeg()
  }
}

function addLeg(leg) {
  let playerName
  let betLineDropDown
  let betLine
  let total
  let betTypeDropDown
  let betType
  if(leg == null){

     playerName = document.getElementById("playerName").value
     betLineDropDown = document.getElementById("betLineDropDown")
     betLine = betLineDropDown.options[betLineDropDown.selectedIndex].text;
     total = document.getElementById("total").value
     betTypeDropDown = document.getElementById("betTypeDropDown")
     betType = betTypeDropDown.options[betTypeDropDown.selectedIndex].text;

  } else{

     playerName = leg.player
     betLine = leg.betLine
     total = leg.total
     betType = leg.betType
  }
  if (playerName == "" || betLine == "Bet Type" || total == "" || betType == "Value Type") {
    if (playerName == "") {
      document.getElementById("playerName").style.borderColor = "red"
    }
    if (betLine == "Bet Type") {
      document.getElementById("betLineDropDown").style.borderColor = "red"
    }
    if (total == "") {
      document.getElementById("total").style.borderColor = "red"
    }
    if (betType == "Value Type") {
      document.getElementById("betTypeDropDown").style.borderColor = "red"
    }
} else {

    let betCount = document.getElementById("bets").children.length
    let cardNum = betCount
    let list = document.getElementById("card" + cardNum + "List").childElementCount
    let listNum = list + 1

    document.getElementById("card" + cardNum + "Body").removeAttribute("style");
    document.getElementById("card" + cardNum + "IntroText").style.display = 'none'

    let cardList = document.getElementById("card" + cardNum + "List")
    let cardItem = document.createElement("li");
    cardItem.className = "list-group-item";
    cardItem.id = "card" + cardNum + "Item" + listNum;
    cardList.appendChild(cardItem);

    let player = document.createElement("b");
    player.id = "card" + cardNum + "Item" + listNum + "Player"
    player.innerText = playerName
    cardItem.appendChild(player)

    let line = document.createElement("b");
    line.className = "pull-right"
    line.id = "card" + cardNum + "Item" + listNum + "Line"
    line.innerText = betLine + ' ' + total + ' ' + betType
    player.appendChild(line)

    let progress = document.createElement("div");
    progress.className = "progress"
    progress.id = "card" + cardNum + "Item" + listNum + "Progress"
    progress.style = "margin-top:1%;margin-bottom:1%"
    player.appendChild(progress)

    let progressBar = document.createElement("div");
    progressBar.className = "progress-bar"
    progressBar.id = "card" + cardNum + "Item" + listNum + "ProgressBar"
    progressBar.style = "width: 0%; text-align: center; background-color: #337ab7; opacity: 0.8"
    progress.appendChild(progressBar)

    let bottomRow = document.createElement("div");
    bottomRow.className = "row paramLimit"
    player.appendChild(bottomRow)

    let bottomCenter = document.createElement("div");
    bottomCenter.className = "centerText"
    bottomRow.appendChild(bottomCenter)

    let current = document.createElement("b");
    current.id = "card" + cardNum + "Item" + listNum + "Current"
    current.innerText = "Current Total : 0"
    bottomCenter.appendChild(current)

    let newParlayCol = document.getElementById("newParlayCol").style.display
    if(newParlayCol == 'none'){
      let buttonRow = document.getElementById("buttonRow");
      buttonRow.className = buttonRow.className.replace(/\bcenterButton\b/g, "");
      document.getElementById("newParlayCol").style.display = "block"
    }
  }
  cacheParlays()
}

  function cacheParlays(){
    let bets = new Array()

    let betCount = document.getElementById("bets").children.length

    for(let i = 0; i < betCount; i++){
      let card = i + 1
      let legs = new Array()
      let list = document.getElementById("card" + card + "List").childElementCount
      for(let x = 0; x < list; x++){
        let list = x + 1

        let betString = document.getElementById("card"+ card +"Item"+ list + "Line").innerText
        let bet = betString.split(" ");

        let playerString = document.getElementById("card"+ card +"Item"+ list +"Player").innerText
        let playerSplit = playerString.split(/(\r\n|\n|\r)/gm);
        let player = playerSplit[0]

        let betLine = bet[0]
        let total = bet[1]
        let betType = bet[2]

        legs.push({
          'player': player,
          'betLine': betLine,
          'total': total,
          'betType': betType
        })
      }
      bets.push({
          'bet': legs
      })
    }
    if (localStorage.getItem("bets") !== null){
      localStorage.removeItem('bets');
    }
    localStorage.setItem("bets", JSON.stringify(bets));
  }

function readcachedBets(){
  let storedBets = JSON.parse(localStorage.getItem("bets"));

  if(storedBets.length > 0){
    for(let i = 0; i < storedBets.length; i++){
        if( i > 0){
          newParlay()
        }
        let bet = storedBets[i].bet
        for(let x = 0; x < bet.length; x++){
          let leg = bet[x]
          addLeg(leg)
        }
    }
  }
}
