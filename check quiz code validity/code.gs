/**#####################################
  * Sets up server-side HTML environment
  */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
                    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};
 
/**#####################################
  * Gets a value from server-side input. 
  * Sends it to updateNumber to be updated.
  * Result will be returned server-side.
  *
  * @param {string} element - number as text from server-side
  * @return {string} contains evaluated number and test.
  */
function CheckAnswers(element){
      return updateNumber_(element);
};
 
/**#####################################
  * This function is an example of a location you can update your value in.
  *
  * @param {num} num - number from getNumberFromWebAPP()
  * @return {num} contains evaluated number.
  */
function updateNumber_(element){
  try{
  const decryptedMessage = cCryptoGS.CryptoJS.AES.decrypt(element, 'passphrase').toString(cCryptoGS.CryptoJS.enc.Utf8);
  if (decryptedMessage.includes("Quiz")){
    a=decryptedMessage.split("-");
    quiznr=a[0];
    browserVer=a[1];
    timeStamp=Number(a[2]);
    answercheck=checkAndstoreCodes(element,quiznr,browserVer,timeStamp);
    if (answercheck){
      outMessage="This is a valid code for: " + quiznr + " ,taken on the: " + Date(timeStamp) + ", using browser: " + browserVer;
    }
    else{
      outMessage="This is a code for: " + quiznr + " ,taken on the: " + Date(timeStamp) + ", using browser: " + browserVer+" but there is a conflict with an existing code in the database";
    }
  }
  else{
    outMessage="This is not a valid code string";
  }
  }
  catch(err){
    outMessage="This is not a valid code string";
  }
  return `<em style='color:blue'> `+ outMessage;
};

function checkAndstoreCodes(code,quiznr,browserVer,timeStamp) {  
  var url = "url of google spreadsheet";//example: https://docs.google.com/spreadsheets/d/1KZ6JCegEt6v1XAons5xOrtnItbq82UQc6NbbBmDmQAg/edit?usp=sharing
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName(quiznr); 
  var data = ws.getDataRange().getValues();
  var r=ws.getRange("A1");
  var alreadyinDb=false;
  checkResult=true;
  nrRows=data.length;
  if (r.isBlank()!=true) {
  for(n=0;n<nrRows;++n){
    if(data[n][0].toString()==code){
      alreadyinDb=true;
      rowNr=n;
      break;
  }
  }
  if(alreadyinDb==false){
    ws.appendRow([code,browserVer,timeStamp]);
  }      
  //checking for browser version and timestamp
  for(n=0;n<nrRows;++n){
    if((data[n][1].toString()==browserVer) && (Number(timeStamp)<(Number(data[n][2].toString())+10000) &&(Number(timeStamp)>(Number(data[n][2].toString())-10000)))){
      if (alreadyinDb==true){
        if(n!=rowNr){
          checkResult=false;
        }
      }
      else{
        checkResult=false;
      }
      break;
  }
  }
  }
  else {
    ws.appendRow([code,browserVer,timeStamp]);
  } 
  return checkResult;
}
