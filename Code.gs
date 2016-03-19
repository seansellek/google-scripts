function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('Wyncode');
  menu.addSubMenu(ui.createMenu("Final Projects").addItem("Tabulate groups", 'parseVotingResults')).addToUi();
  menu.addSubMenu(ui.createMenu("Progress Reports").addItem("Import Progress", 'importProgressReport')).addToUi();
};

function onInstall(e) {
  onOpen(e);
}
