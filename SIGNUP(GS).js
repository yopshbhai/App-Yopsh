// Function to handle GET requests
function doGet(e) {
  // Open the Google Sheet by URL
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1YAjcaiJmrkqF864Aga7GOuKQM3P-wuSkcBbVDETRjOY/edit?gid=125098547#gid=125098547");
  var sheet = ss.getSheetByName("Users"); // Change "Users" to your sheet name

  // Check if the request is for sending OTP
  if (e.parameter.requestOTP === 'true') {
    var email = e.parameter.email;
    var username = e.parameter.username;

    // Check if the email already exists
    var data = sheet.getRange("B:B").getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === email) {
        return ContentService.createTextOutput("Email already exists");
      }
    }

    // Check if the username already exists
    var dataUsername = sheet.getRange("C:C").getValues();
    for (var i = 0; i < dataUsername.length; i++) {
      if (dataUsername[i][0] === username) {
        return ContentService.createTextOutput("Username already exists");
      }
    }

    // If email and username don't exist, send OTP to Google Sheets
    sendOTPToSheet(email);
    return ContentService.createTextOutput("OTP sent to Google Sheets");
  } 
  // Check if the request is for verifying OTP
  else if (e.parameter.verifyOTP === 'true') {
    return verifyOTP(e);
  } 
  // Otherwise, process form data
  else {
    var username = e.parameter.username;
    var email = e.parameter.email;
    var birthdate = e.parameter.birthdate;
    var mobile = e.parameter.mobile;
    var countryCode = e.parameter.countryCode; // New: Get country code from request

    // Ensure country code starts with +
    if (countryCode.charAt(0) !== '+') {
      countryCode = '+' + countryCode;
    }

    var age = calculateAge(new Date(birthdate));

    // Check if the email or username already exists
    var dataEmail = sheet.getRange("B:B").getValues();
    var dataUsername = sheet.getRange("C:C").getValues();
    for (var i = 0; i < dataEmail.length; i++) {
      if (dataEmail[i][0] === email) {
        return ContentService.createTextOutput("Email already exists");
      }
    }
    for (var i = 0; i < dataUsername.length; i++) {
      if (dataUsername[i][0] === username) {
        return ContentService.createTextOutput("Username already exists");
      }
    }

    // If neither email nor username exists, append new data and send confirmation email
    var newRow = [
      new Date(),
      email,
      username,
      e.parameter.name,
      birthdate,
      age,
      countryCode,
      mobile, // Combine country code with mobile number
      e.parameter.gender,
      e.parameter.password
    ];
    sheet.appendRow(newRow);

    // Send confirmation email to the user
    var subject = "Welcome to Our Platform!";
    var body = "Dear " + e.parameter.name + ",<br><br>"
             + "Thank you for signing up with us! Your account has been successfully created.<br><br>"
             + "Best regards,<br>"
             + "The Team";
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });

    return ContentService.createTextOutput("Data saved successfully");
  }
}

// Function to send OTP to Google Sheets
function sendOTPToSheet(email) {
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1YAjcaiJmrkqF864Aga7GOuKQM3P-wuSkcBbVDETRjOY/edit?gid=206593086#gid=206593086");
  var otpSheet = ss.getSheetByName("OTP"); // Change "OTP" to your sheet name
  var data = otpSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] === email) {
      // If OTP already sent for this email, return without sending a new one
      return;
    }
  }
  // If OTP hasn't been sent for this email, generate and send OTP
  var otp = Math.floor(100000 + Math.random() * 900000);
  otpSheet.appendRow([new Date(), email, otp]);
  MailApp.sendEmail({
    to: email,
    subject: "OTP Verification",
    htmlBody: "Dear User,<br><br>"
            + "Thank you for registering! Your One-Time Password (OTP) for account verification is: " + otp + ".<br><br>"
            + "Please use this code to complete your registration process.<br><br>"
            + "Best regards,<br>"
            + "The Team"
  });
}

// Function to verify OTP
function verifyOTP(e) {
  var otpEntered = e.parameter.otp;
  var email = e.parameter.email;
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1YAjcaiJmrkqF864Aga7GOuKQM3P-wuSkcBbVDETRjOY/edit?gid=206593086#gid=206593086");
  var otpSheet = ss.getSheetByName("OTP"); // Change "OTP" to your sheet name
  var data = otpSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] === email && data[i][2] == otpEntered) {
      // If OTP matches, delete the row
      otpSheet.deleteRow(i + 1);
      return ContentService.createTextOutput("OTP verified");
    }
  }
  return ContentService.createTextOutput("Invalid OTP");
}

// Function to calculate age based on birthdate
function calculateAge(birthdate) {
  var today = new Date();
  var age = today.getFullYear() - birthdate.getFullYear();
  var m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}
