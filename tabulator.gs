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
