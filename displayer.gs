function Displayer(results, resultsSheet, teamCount) {
  this.results = results;
  this.sheet = resultsSheet;
  this.colors = ['#CEE2F4', '#FDE5CC', '#D9D2EA', '#F5CCCB']
  this.topIdeasAddress = function() {
    return "A2:B" + (Number(this.results.topIdeas.length) + 1); 
  }
  
  this.printResults = function() {
    this.sheet.clear();
    this.sheet.appendRow(["Team","Points"]);
    for(var i in this.results.ideas) {
     var idea = this.results.ideas[i];
     this.sheet.appendRow([idea.name, idea.voteCount]);
    }
    this.sheet.getRange(this.topIdeasAddress()).setBackground('#EFEFEF');
  };
  
  this.getRowLength = function(rowNum) {
    var row = this.sheet.getRange(rowNum + ":" + rowNum);
    for (var i = row.getWidth(); i > 0; i--) {
      if (row.getCell(1, i).getValue().length > 0) {
        return i;
      }
    }
    return row.getWidth();
  }
  
  this.appendVote = function(rowNum , voterName, choice) {
    
    var rowLength = this.getRowLength(rowNum);
    var row = this.sheet.getRange(rowNum, 1, 1, rowLength);
    var colNum = row.getLastColumn() + 1;
    this.sheet.getRange(rowNum, colNum).setValue(voterName).setBackground(this.colors[choice]);                   
  };
  
  this.prepareIdea = function(row, idea) {
    var ideaVoteCount = this.results.students[0].votes.length;
    for (var i = 0; i < ideaVoteCount; i++ ) {
      if (this.getRowLength(row) < (ideaVoteCount + 1) ) {
        var voters = this.results.voters(idea, i);
        for (var j in voters) {
          var voter = voters[j];
          var voterName = voter.name;
          if (this.results.creators.indexOf(voter) === -1) {
            this.appendVote(row, voterName, i);
          }
        }
      }
    }  
  };
  
  this.printSelectionTable = function() {
    var lastRow = this.sheet.getLastRow();
    this.sheet.appendRow(["Team", "Creater", "Voters"]);
    this.sheet.insertRows(lastRow + 1); 
    for (var i in this.results.topIdeas) {
      var idea = this.results.topIdeas[i];
      var ideaName = idea.name;
      var creator = results.getCreator(idea);
      if (creator) {
        var creatorName = creator.name;
      } else {
        var creatorName = "";
      }
      this.sheet.appendRow([ideaName, creatorName]);
      var row = this.sheet.getLastRow();
      if(creator) {
        this.sheet.getRange(row,1,1,2).getCell(1,2).setBackground('#D9EAD2');
      }
      this.prepareIdea(row, idea);
    }
  };
  
  this.printUnvoted = function() {
    var unvoted = this.results.getUnvoted();
    
    for(var i in unvoted) {
      var student = unvoted[i];
      this.sheet.appendRow([student.name]);
    }
  };

  this.printTabulation = function() {
    this.printResults();
    this.printSelectionTable();
    this.sheet.autoResizeColumn(1);
    var lastRow = this.sheet.getLastRow();
    this.sheet.appendRow(["Students Whose Votes Did Not Get Chosen:"]);
    this.sheet.insertRows(lastRow + 1); 
    this.printUnvoted();
  };
}


  

    
