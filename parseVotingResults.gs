function parseVotingResults() {
  var formResponseWorkbook = SpreadsheetApp.getActive();
  var ui = SpreadsheetApp.getUi();
  var responseSheet = formResponseWorkbook.getSheetByName('Form Responses 1');
  var results = new Tabulator(responseSheet);
 
  var teamCount = ui.prompt("How many teams?").getResponseText();
  results.getTopIdeas(teamCount);
  var resultsSheet = formResponseWorkbook.getSheetByName('Point Tabulation').activate() || formResponseWorkbook.insertSheet().setName('Point Tabulation').activate();
  var display = new Displayer(results, resultsSheet);
  display.printTabulation();
}
