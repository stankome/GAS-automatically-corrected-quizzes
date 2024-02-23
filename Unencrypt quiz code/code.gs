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
  const decryptedMessage = cCryptoGS.CryptoJS.AES.decrypt(element, 'passphrase').toString(cCryptoGS.CryptoJS.enc.Utf8);
  //storeCodes(Phrase,encryptedMessage);
  return `<em style='color:blue'> `+ decryptedMessage;
};
