function importProgressReport() {
  var LNAMECOL       = 1;
  var FNAMECOL       = 2;
  var FWEEKCOL       = 7;
  var FSTUDENTROW    = 4;
  var sheet = SpreadsheetApp.getActive().getSheets()[0];
  var ui = SpreadsheetApp.getUi();
  var cohortId = sheet.getRange("B1").getValue();
  if ( ! Number(cohortId) ) { 
    ui.alert("Please enter GoodMeasure's Cohort Id for this cohort in cell B1.");
    return -1;
  };
  var url = "http://learn.wyncode.co/cohorts/" + cohortId + "/progress_report";
  var reportData = JSON.parse(UrlFetchApp.fetch(url, {
    headers: {
      "Authorization": 'REDACTED'
    }
  }).getContentText());
  
  displayResults(reportData);
  
  
  function displayResults(data) {
    data.students.forEach(function(student, index, _) {
      var studentRow = index + FSTUDENTROW;
      var [firstName, lastName] = student.name.split(" ");
      sheet.getRange(studentRow, FNAMECOL).setValue(firstName);
      sheet.getRange(studentRow, LNAMECOL).setValue(lastName);
      
      student.weeks.forEach(function(weekResults, weekNumber, _) {
        var weekRow = FWEEKCOL + weekNumber;
        sheet.getRange(studentRow, weekRow).setValue(weekResults.complete / 100);
      });
    }); 
  }
}
