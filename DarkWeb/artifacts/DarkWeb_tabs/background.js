//const CSS = "body {filter: invert(100%); backbround-color: white; color: black;}";
const TITLE_APPLY = "Apply CSS";
const TITLE_REMOVE = "Remove CSS";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

// Different settings for different buttons
var CSS = ""; // Will hold code for various filters
var previousID = ""; // Will hold previous button id for filters
const INVERT = "body {filter: invert(100%); background-color: white; color: black;} html {background-color: black;} header {background-color: white;} ";
const GRAYSCALE = "body {filter: grayscale(100%); background-color: white; color: black;}";
const SEPIA = "body {filter: sepia(100%); background-color: white; color: black;}";
const NIGHT =
"body{filter: invert(100%); background-color: #E8EAE3; color: #181928;} "+
"html,header {background-color: #17151c;} "+
"a:link{color:#873E5A;}"+
"a, a:hover, a:visited, a:active {background-color:#E8EAE3;color: #897800;}"+
"div, :not(img, video){background-color:#E8EAE3; color:#181928;} "+
"img, .svg {filter:invert(100%);} "+
".app-badges, .mw-body{background: #E8EAE3;}"+
"*{color: 181928;}";
const ROTATECW = "body {filter: hue-rotate(180deg); background-color: white; color: black;}";
const ROTATECCW = "body {filter: hue-rotate(270deg); background-color: white; color: black;}";
const NOBLUE = "body {filter: sepia(40%); background-color: white; color: black;}";

/*
Toggle CSS: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
function toggleCSS(buttonID) {


  function applyFilter() {
    // Check if user clicked the same button twice, or if user wants to clear all filters
    console.log("Before function, previousID: " + previousID + " buttonID: " + buttonID);
    if((previousID == buttonID && buttonID != "") || buttonID == "Clear Filter") {

      browser.tabs.query({currentWindow: true}).then(queryInfo => {
        for (let tab in queryInfo) {
          browser.tabs.removeCSS(queryInfo[tab].id, {code: CSS});
        }
      });

      CSS = ""; // Reset the CSS variable
      previousID = ""; // Reset previously used button id
    }
    else {
      
      browser.tabs.query({currentWindow: true}).then(queryInfo => {
        for (let tab in queryInfo) {
          browser.tabs.removeCSS(queryInfo[tab].id, {code: CSS});
        }
      });

      // Get the code for the selected filter
      switch(buttonID) {
        case "Invert Color":
          CSS = INVERT;
          break;
        case "Grayscale":
          CSS = GRAYSCALE;
          break;
        case "Sepia":
          CSS = SEPIA;
          break;
		case "Night":
		  CSS = NIGHT;
		  break;
		case "RotateCW":
    	  CSS = ROTATECW;
		  break;
		case "RotateCCW":
		  CSS = ROTATECCW;
		  break;
		case "Blue Light":
		  CSS = NOBLUE;
		  break;
        default: // Do nothing for default
          break;
      }

      browser.tabs.query({currentWindow: true}).then(queryInfo => {
        for (let tab in queryInfo) {
          browser.tabs.insertCSS(queryInfo[tab].id, {code: CSS});
        }
      });
    }
    console.log("At end of function, prevID: " + previousID + " buttonID: " + buttonID);
  }


  applyFilter();
}

/*
toggleCSS when popup sends a message.
*/
function update(received, sender, sendResponse) {


  toggleCSS(received.message);
  sendResponse({response: "Button was pressed."});
}


/*
Add an event listener
The popup window's event listener broadcasts a message, and this receives it
Upon receiving a message, it then runs update()
*/
browser.runtime.onMessage.addListener(update);
