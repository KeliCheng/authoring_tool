if (Meteor.isClient) {
	unitList = new Mongo.Collection('unitList');
	Session.setDefault('numUnitsInt', 0);
	
  Template.hello.helpers({

  });

  Template.Units.events({
'click .dropdown-toggle': function (e) {
    e.preventDefault();
    $(e.target).find('.dropdown-menu').toggle();
    }
});

  Template.Units.helpers({

    unitList: function () {
      return unitList.find({});
    },
    unitVal: function () {
      return Session.get('unitVal');
    },
    instruction: function(toReturn) {
	
	//var attrclass = $(event.target).attr("class").split('m')[1];
	console.log("unit num... " + toReturn)
	//var x = unitList.findOne({num: parseInt(unitNum)}).instructions;
	return toReturn;

	var v = Session.get('unitVal');	
	if (v == 'instruction')
	    return true;
	else
	    return false;
    },
    assessment: function(toReturn) {
	console.log("unit num... " + toReturn)
	return toReturn;
	var v = Session.get('unitVal');	
	if (v == 'assessment')
	    return true;
	else
	    return false;
    },
    learningsession: function(toReturn) {
	console.log("unit num... " + toReturn)
	return toReturn;
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
	var attrclass = $(event.target).attr("class").split('m')[1];
      //console.log(attrclass);
      var x = unitList.findOne({num: parseInt(attrclass)});
	
      if (v == "instruction") {
	unitList.update({_id: x._id}, {$set: {instructions: true}});
	unitList.update({_id: x._id}, {$set: {learningsessions: false}});
	unitList.update({_id: x._id}, {$set: {assessments: false}});

      	Session.set('unitVal', 'instruction');
      } else if (v == "learningsession") {
	unitList.update({_id: x._id}, {$set: {instructions: false}});
	unitList.update({_id: x._id}, {$set: {learningsessions: true}});
	unitList.update({_id: x._id}, {$set: {assessments: false}});

      	Session.set('unitVal', 'learningsession');
      } else if (v == "assessment") {
	unitList.update({_id: x._id}, {$set: {instructions: false}});
	unitList.update({_id: x._id}, {$set: {learningsessions: false}});
	unitList.update({_id: x._id}, {$set: {assessments: true}});

      	Session.set('unitVal', 'assessment');
      } else {
      	Session.set('unitVal', 'invalid');
      }
    },
    'change numberofunits': function(event) {
	var v = $(event.target).val();
    }
  });

  Template.Units.events({
    'click .addUnit': function(event) {
      console.log("add unit button clicked");
	Session.set('numUnitsInt', Session.get('numUnitsInt') + 1);
	unitList.insert({num:Session.get('numUnitsInt'),
				instructions:false,
				learningsessions:false,
				assessments:false});
    }

  });
}


if (Meteor.isServer) {
  unitList = new Mongo.Collection('unitList');
  //Session.setDefault('numUnitsInt', 0);
  Meteor.startup(function() {
    // code to run on server at startup
	unitList.remove({})
   

  });

}
