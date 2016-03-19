function parseVotingResults() {
  var formResponseWorkbook = SpreadsheetApp.getActive();
  var ui = SpreadsheetApp.getUi();
  var responseSheet = formResponseWorkbook.getSheetByName('Form Responses 1');
  var results = new Tabulator(responseSheet);
 
  var teamCount = ui.prompt("How many teams?").getResponseText();
  results.getTopIdeas(teamCount);
  var resultsSheet = formResponseWorkbook.getSheetByName('Point Tabulation')|| formResponseWorkbook.insertSheet().setName('Point Tabulation');
  resultsSheet.activate();
  var display = new Displayer(results, resultsSheet);
  display.printTabulation();

  
  /****************************
  
  Displayer
  
  Displays tabulated results on a spreadsheet
  
  ****************************/
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
          var voters = this.results.voters(idea, i);
          for (var j in voters) {
            var voter = voters[j];
            var voterName = voter.name;
            if (this.results.creators.indexOf(voter) === -1) {
              this.appendVote(row, voterName, i);
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
  
  /****************************
  
  Tabulator
  
  Manages the tabulation of results
  
  ****************************/
  
  function Tabulator(sheet) {
    this.sheet = sheet;
    this.students = [];
    this.ideas = [];
    this.creators = [];
    this.topIdeas = [];
    
      function Student(name, votes) {
      this.name = name;
      this.votes = votes;
      this.vote = function(num) {return votes[num-1];}; 
    }
    
    function Idea(name, voteCount, creator) {
      this.name = name;
      this.voteCount = voteCount;
      this.creator = creator;
    }
  
    
    this.countIdea = function(name, score) {
      if (this.ideas.some(function(idea) { return idea.name === name })) {
        var idea = this.ideas.filter(function(idea) { return idea.name === name })[0];
      } else {
        var idea = new Idea(name, 0);
        this.ideas.push(idea);
      }
      idea.voteCount += score;
      return idea;
    }
    
    this.setCreators = function() {
      for (var i in this.topIdeas) {
        var idea = this.ideas[i];
        var creator = this.getCreator(idea);
        if (creator) { this.creators.push(creator); };
      }
      
    }
    
    this.tabulate = function() {
      var range = this.sheet.getDataRange();
      for (var row = 2; row <= range.getLastRow(); row++) {
        var name = range.getCell(row, 2).getValue();
        var votes = [];
        for (var i = 3; i <= range.getLastColumn(); i++) {
          var ideaName = range.getCell(row, i).getValue();
          var score = range.getLastColumn() - i + 1;
          var idea = this.countIdea(ideaName, score);
          votes.push(idea);
        }
        this.students.push(new Student(name, votes));
      }
    }
    
    this.getTopIdeas = function(teamCount) {
     this.ideas = this.ideas.sort(function(idea1, idea2) {
        return idea2.voteCount - idea1.voteCount;
      });
     this.topIdeas = this.ideas.slice(0, teamCount);
     this.setCreators();
    }
    
    this.getCreator = function(idea) {
      var ideaName = idea.name;
      for (var i in this.students) {
        var student = this.students[i];
        if (ideaName.indexOf(student.name) > -1) {
          return student;
        }
      }
    }
    
    this.getUnvoted = function() {
      var unVoted = [];
      for (var j in this.students) {
        var student = this.students[j];
        var isUnvoted = true;
        if(this.creators.indexOf(student) > -1) {
          isUnvoted = false;
        }
        for (var i in student.votes) {
          var idea = student.votes[i];
          if(this.topIdeas.indexOf(idea) > -1 ) {
            isUnvoted =  false;
          } 
        }
        if (isUnvoted) {
          unVoted.push(student);
        }
      }
      return unVoted;
    }
    
    this.voters = function(idea, choice) {
      return this.students.filter(function(student) {
        if (student.votes[choice].name === idea.name) {
          return true;
        } else {
          return false;
        }
      }); 
    }
    
    this.tabulate();
    return this
  }
}
