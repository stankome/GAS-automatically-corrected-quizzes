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
function CheckAnswers(element,browser){
 
  let keyArr = [Answer_for_question_1, . , . , . , .];
  //Answer_for_question_1 if a multiple choice, use [0,1,..] with 0/1 indicating unselected/selected option
  //if value, use [value]
  grade=compare(keyArr,element);
  
  //If the parsed number is a number, return calculated number otherwise return error.
  if(grade===""){
      return updateNumber_(browser);
  };
  return `<em style='color:red'> You didn't pass, try again! ` + grade;
};
 
/**#####################################
  * This function is an example of a location you can update your value in.
  *
  * @param {num} num - number from getNumberFromWebAPP()
  * @return {num} contains evaluated number.
  */
function updateNumber_(browser){
  var timestamp = Number(new Date());
  quiznr='Quizname';
  browserVer=browser.name.toString()+browser.version.toString()
  timeStamp=timestamp.toString();
  Phrase=quiznr+'-'+browserVer+'-'+timeStamp;
  const encryptedMessage = cCryptoGS.CryptoJS.AES.encrypt(Phrase, 'passphrase').toString();
  return `<em style='color:blue'> Success!, your code: `+ encryptedMessage;
};

function compare(arr1,arr2){
 var i = arr1.length;
 var j=i;
 var result="";
while (i--) {
  var correct=1;
  var j=arr1[i].length;
  var arr3=arr1[i];
  var arr4=arr2[i];
  while ((j--)&&(correct===1)){
    if ((arr3[j]===0)||(arr3[j]===1)){
          if(arr3[j] === arr4[j]){
          }
          else{
            correct=0;
          }
    } else{
      if (isNumber(arr4[j])){
        var a=parseFloat(arr4[j]);
        var b=parseFloat(arr3[j]);
        if((a<=b*1.1)&&(a>=b*0.9)){
        }else{
            correct=0;
          }
      }
                else{
            correct=0;
          }
    }
  }
  if (correct===0){
    var k=i+1;
    result="Item-"+k.toString() + " is wrong, "+result;
  } 
      }
return result;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
