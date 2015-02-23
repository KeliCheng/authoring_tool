if (Meteor.isClient) {
  Template.hello.helpers({

  });

  Template.Units.helpers({
    unitVal: function () {
      return Session.get('unitVal');
    },
    instructions: function() {
	var v = Session.get('unitVal');	
	if (v == 'instruction')
	    return true;
	else
	    return false;
    },
    assessment: function() {
	var v = Session.get('unitVal');	
	if (v == 'assessment')
	    return true;
	else
	    return false;
    },
    learningsession: function() {
	var v = Session.get('unitVal');	
	if (v == 'learningsession')
	    return true;
	else
	    return false;
    }
  });

  Template.hello.events({
    'change .unitType': function (event) {
      var v = $(event.target).val();
      console.log("unit type running");
      if (v == "instruction") {
      	Session.set('unitVal', 'instruction');
      } else if (v == "learningsession") {
      	Session.set('unitVal', 'learningsession');
      } else if (v == "assessment") {
      	Session.set('unitVal', 'assessment');
      } else {
      	Session.set('unitVal', 'invalid');
      }
    },
    'change numberofunits': function(event) {
	var v = $(event.target).val();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
