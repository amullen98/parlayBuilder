//prefixes of implementation that we want to test
  window.indexedDB = window.indexedDB || window.mozIndexedDB ||
  window.webkitIndexedDB || window.msIndexedDB;

  //prefixes of window.IDB objects
  window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
  window.msIDBKeyRange

  if (!window.indexedDB) {
     window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }

  let db;
  let request = window.indexedDB.open("NbaData", 1);

  request.onerror = function(event) {
     console.log("error: ");
  };

  request.onsuccess = function(event) {
     db = request.result;
     console.log("success: "+ db);
  };

  request.onupgradeneeded = function(event) {
     let playerInfo = loadPlayerData()
     let db = event.target.result;
     let objectStore = db.createObjectStore("PlayerInfo", {keyPath: "playerName"});

     for (let i in playerInfo) {
        objectStore.add(playerInfo[i]);
        console.log("Data has been loaded successfully")
     }
     //NEED ALERT TO RELOAD PAGE DUE TO DB VERSION
  }


function getCount(){
    let transaction = db.transaction(["PlayerInfo"]);
    let objectStore = transaction.objectStore("PlayerInfo");
    return(objectStore.count())
}

function read(playerName) {
  return new Promise((resolve) => {
   let transaction = db.transaction(["PlayerInfo"]);
   let objectStore = transaction.objectStore("PlayerInfo");
   let request = objectStore.get(playerName);

   request.onerror = function(event) {
      console.log("Unable to retrieve data from database!");
   };

   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         resolve(request.result)
      } else {
         console.log("Unable to find player.")
      }
   };
 })
}

function readAll() {
   let objectStore = db.transaction("employee").objectStore("employee");

   objectStore.openCursor().onsuccess = function(event) {
      let cursor = event.target.result;

      if (cursor) {
         alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
         cursor.continue();
      } else {
         alert("No more entries!");
      }
   };
}

function addAll() {
  let playerInfo = loadPlayerData()

  playerInfo.forEach(data =>{
    let request = db.transaction(["PlayerInfo"], "readwrite").objectStore("PlayerInfo").add(data)

    request.onsuccess = function(event) {

    };

    request.onerror = function(event) {
       console.log("Unable to add add player");
    }
  })
}

function add(playerInfo) {
   let request = db.transaction(["PlayerInfo"], "readwrite")
   .objectStore("playerName")
   .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });

   request.onsuccess = function(event) {
      alert("Kenny has been added to your database.");
   };

   request.onerror = function(event) {
      alert("Unable to add data\r\nKenny is aready exist in your database! ");
   }
}

function clearData() {
  // open a read/write db transaction, ready for clearing the data
  let transaction = db.transaction(["PlayerInfo"], "readwrite")

  transaction.onsuccess = function(event) {
     console.log("Connected")
  };

  transaction.onerror = function(event) {
    alert("Unable to add data\r\nKenny is aready exist in your database! ");
  };

  // create an object store on the transaction
  var objectStore = transaction.objectStore("PlayerInfo");

  // Make a request to clear all the data out of the object store
  var objectStoreRequest = objectStore.clear();

  objectStoreRequest.onsuccess = function(event) {
    console.log('Players have been truncated.')
  };
};

function remove() {
   let request = db.transaction(["employee"], "readwrite")
   .objectStore("employee")
   .delete("00-03");

   request.onsuccess = function(event) {
      alert("Kenny's entry has been removed from your database.");
   };
}
