function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Wyncode').addSubMenu(ui.createMenu("Final Projects").addItem("Tabulate groups", 'parseVotingResults')).addToUi();
};

function onInstall(e) {
  onOpen(e);
}
