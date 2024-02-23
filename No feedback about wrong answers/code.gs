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
 
  let keyArr = [Answer_for_question_1, ...,];
  //Answer_for_question_1 if a multiple choice, use [0,1,..] with 0/1 indicating unselected/selected option
  //if value, use a value array[] 
  grade=compare(keyArr,element);
  
  //If the parsed number is a number, return calculated number otherwise return error.
  if(grade>=100){
      return updateNumber_(browser);
  };
  return `<em style='color:red'> You didn't pass, try again!`;
};
 
/**#####################################
  * This function is an example of a location you can update your value in.
  *
  * @param {num} num - number from getNumberFromWebAPP()
  * @return {num} contains evaluated number.
  */
function updateNumber_(browser){
  var timestamp = Number(new Date());
				  
  Phrase='Quizname'+browser.name.toString()+browser.version.toString()+'-'+timestamp.toString();
								 
											 
  const encryptedMessage = cCryptoGS.CryptoJS.AES.encrypt(Phrase, 'passphrase').toString();
  return `<em style='color:blue'> Success!, your code: `+ encryptedMessage;
};

function compare(arr1,arr2){
 var i = arr1.length;
 var j=i;
 var k=0;
while (i--) {
				
  if(arr1[i].length>1){
  l=compare2(arr1[i],arr2[i]);
  a=sumArray(arr1[i]);
  if(a==1){ if(arr1[i].length===l){
    k=k+1};}else{k=k+(l/arr1[i].length);}
  }else{ if(arr1[i] === arr2[i]){
      k=k+1;};
