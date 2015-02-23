if (Meteor.isClient) {
  // counter starts at 0
  //Session.setDefault('counter', 0);
  Session.setDefault('instructions', true);

  Template.hello.helpers({
    unitOpts: function () {
      return Session.get('unitOpts');
    },
    unitVal: function () {
      return Session.get('unitVal');
    },
    instructions: function(event, tamplate) {
	//var v = Session.get('unitOps').val();
	//var v = $(template.find('unitOps')).val();
	var v = Session.get('unitVal');	
	if (v == true)
	    return true;
	else
	    return false;
    }
  });

  Template.hello.events({
    'click': function () {
      // increment the counter when button is clicked
      console.log("You clicked something");
    },
    'change .unitType': function (event) {
      var v = $(event.target).val();
      console.log("unit type running");
      if (v == "instruction") {
	//Session.set('instructions', true)
      	//Session.set('unitOpts', v);
      	Session.set('unitVal', true);
      } else if (v == "learningsession") {
      	//Session.set('unitOpts', v);
      	Session.set('unitVal', false);
	//Session.set('instructions', false)
      } else if (v == "assessment") {
      	//Session.set('unitOpts', v);
      	Session.set('unitVal', false);
	//Session.set('instructions', false)
      } else {
      	Session.set('unitOpts', "invalid");
      }
    }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
