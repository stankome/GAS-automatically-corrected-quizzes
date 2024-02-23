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
function ProcessInput(element){
    let Pname=element[0];
  let email=element[1];
  let validation=1;
  let concatenatedInfo=Pname+'-'+email+'-';
  CodeSheetID="" ;//Google spreadsheet Template ID, example: https://docs.google.com/spreadsheets/d/1cGcYggRFaaS5OxGf79aSxb56tRDorJFsRZxNLXAWfj4/edit?usp=sharing
  //looping through each activity code provided
  for(var i = 2; i<element.length;i++){
    j=i-1;
    ActivityNrTag=j.toString();
    ActivityTag="Quiz"+ActivityNrTag
    // check if is a valid code
  try{
  const decryptedCode = cCryptoGS.CryptoJS.AES.decrypt(element[i], 'passphrase').toString(cCryptoGS.CryptoJS.enc.Utf8);
  if (decryptedCode.includes(ActivityTag)){
    // check if it is already registered on the database 
    if (rowifMatch(CodeSheetID,ActivityTag,element[i])==0){
      concatenatedInfo=concatenatedInfo+'-'+element[i]
      continue;
    };
      validation=2;
      break;
  }
  else{
    validation=0;
    break;
  }
  }
  catch(err){
    validation=0;
    break;
  }
  }
  if(validation==1){
      const Diplomacode = cCryptoGS.CryptoJS.AES.encrypt(concatenatedInfo, 'passphrase').toString();
      DocID=createCertificate(Pname,Diplomacode);
      Emailpdf(Pname,email,DocID);
      RegisterCodesinDB(CodeSheetID,element);
      outputMessage= `<em style='color:blue'> Success!, your diploma will be sent to: `+ email;
  }
  else if(validation==2){
    outputMessage=`<em style='color:red'> The code for activity ` + ActivityNrTag + ` has been claimed already`;
  }
  else{
    outputMessage=`<em style='color:red'> The code for activity ` + ActivityNrTag + ` is not valid`;
  };
  return outputMessage
};
 
/**#####################################
  * This function is an example of a location you can update your value in.
  *
  * @param {num} num - number from getNumberFromWebAPP()
  * @return {num} contains evaluated number.
  */
function Emailpdf(Pname,email,DocID){
     //Send email   
     //####UPDATE The following variables ####
     let subject = `Course certificate for `+Pname;//Subject line.
     //Body of text. To create a new line use forward slash + n (\n)
     let body = `Hello ` + Pname + `  , \n
     Congratulations on completing the Course. We hope that you enjoyed the course
     and improved your skills. \n
     Please find your Certificate of Attendance attached. \n\n
     Respectfully, \n
       Trainer`;
     //#####END UPDATE #######################
  var newSlide = DriveApp.getFileById(DocID);
     GmailApp.sendEmail(email, subject, body,{
       attachments: [newSlide.getAs(MimeType.PDF)],  //Convert to PDF
       name: 'Email Automatically Sent'
     });
      DriveApp.getFileById(DocID).setTrashed(true);
  return }

function createCertificate(Pname, Diplomacode){
  const TEMPLATE_ID = '';//Google Slide Template ID, example: https://docs.google.com/presentation/d/13PPYWf8QFOWO-owwm9AfKrov3rpUxhKOLn_gj5uOENI/edit?usp=sharing
  let newDoc = DriveApp.getFileById(TEMPLATE_ID).makeCopy('Diploma');
  let textID = `{{name}}`;
  let NewDiplomaID=newDoc.getId();
  let CurrentSlide= SlidesApp.openById(NewDiplomaID);
  CurrentSlide.replaceAllText(textID,Pname);
  CurrentSlide.replaceAllText('{{code}}',Diplomacode);
  CurrentSlide.saveAndClose();
  return NewDiplomaID;
}

function RegisterCodesinDB(CodeSheetID,codeArray){
 var ss = SpreadsheetApp.openById(CodeSheetID);
 for(var i = 2; i<codeArray.length;i++){
    j=i-1;
    ActivityNrTag=j.toString();
    ActivityTag="Quiz"+ActivityNrTag
  var ws = ss.getSheetByName(ActivityTag); 
  ws.appendRow([codeArray[i]]);
  }
  return
}

function rowifMatch(SheetID,SheetName,code){
  var output=0;
  var sheet =SpreadsheetApp.openById(SheetID).getSheetByName(SheetName);
  var data = sheet.getDataRange().getValues();
  for(var i = 1; i<data.length;i++){
    if(data[i][0] == code){ 
      output=i+1;
      return output;
    }
  }
return output;
}
