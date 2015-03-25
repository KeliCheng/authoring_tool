if (Meteor.isClient) {
	unitList = new Mongo.Collection('unitList');
  	cardList = new Mongo.Collection('cardList');
  	versionList = new Mongo.Collection('versionList');
	Session.setDefault('numUnitsInt', 0);
	Session.setDefault('numCards', 0);
	Session.setDefault('numVersions', 0);
	

  Template.load.events(
	
   // THE LOAD XML CODE

	function loadXML() { // called by load when load clicked
	  function readingFiles(evt) {
	    var file = evt.target.files[0];

	    if (file) {
	      	var reader = new FileReader();
		reader.onload = function(e) {
		var contents = e.target.results;
		var ct = reader.result;
		var sections = ct.split('\n');

		alert("got the file.\n" + "name: " + file.name + "\n" + "fileType: " + file.type);

		for(i = 0; i !== sections.length - 1; i++){ //meteor has problems with < signs or something, need to switch this over to the js file when i finish
			//loop for sending each line to a specific place
			// was thinking if we do match the correct part, make a new var that splices the ends off, if needed, and then call var[0]

			sections[i] = sections[i].trim();
			console.log(sections[i]);
			if (sections[i].match(<lessonname>) === "<lessonname>") {//go through each line and place it correctly
				//
			} else if (sections[i].match(<stimulusfile>) === "<stimulusfile>") {
				//modulename?
			} else if (sections[i].match(<clustermodel>) === "<clustermodel>") {
				//
			} else if (sections[i].match(<clustersize>) === "<clustersize>") {
				//
			} else if (sections[i].match(<shuffleclusters>) === "<shuffleclusters>") {
				//
			} else if (sections[i].match(<lfparameter>) === "<lfparameter>") {
				//
			} else if (sections[i].match(<isModeled>) === "<isModeled>") {
				//
			} else if (sections[i].match(<timeoutInSeconds>) === "<timeoutInSeconds>") {
				//
			} else if (sections[i].match(<experimentTarget>) === "<experimentTarget>") {
				//
			} else if (sections[i].match(<cluster>) === "<cluster>") {
				//the cards
				for(j = i; sections[j].match(</cluster>) !== "</cluster>"; j++) { //continues through the array doing things for this specific card
					if (sections[i].match(<display>) === "<display>")) {
						// card question
						i++;
					} else if (sections[i].match(<response>) === "<response>")) {
						// correct response
						i++;
								} else if (sections[i].match(<falseResponse>) === "<falseResponse>")) {
									// incorrect response
									i++;
								} else {
									i++; //in case of a blank/useless line?
								}
							}
						} else if (sections[i].match(<unit>) === "<unit>") {
							//the different units
							//click the add unit button at this point then have the following loop work with the added units
							for(j = i; sections[j].match(</unit>) !== </unit>; j++) {
								if (sections[i].match(<unitname>) === "<unitname>") {
									//the name of the unit, not the type, in this i have to figure out the correct type, maybe check sections[i+2] === </unit> for instruction types, but then what for others?
								} else if (sections[i].match(<unitinstructions>) === "<unitinstructions>") {
									// a blanket text field? instruction units only have this and previous tag
								} else if (sections[i].match(<deliveryparams>) === "<deliveryparams>") {
									//has child nodes in xml so making this loop just in case
									for (k = j; sections[k].match() !== ; k++) {
										if (sections[i].match() === "") {
											
										} else if (sections[i].match() === "") {
											
										} else {
											i++;
											j++;
										}
									}
								} else if (sections[i].match(<buttontrial>) === "<buttontrial>") {
									
								} else if (sections[i].match() === "") {
									
								} else {
									
								}
							}
						} else if (sections[i].match() === "") {
							//
						} else if (sections[i].match() === "") {
							//
						}
					}
				} 
				reader.readAsText(file);


				/*//start of the xml parsing, may get rid of this since txt parser
				if (window.XMLHttpRequest) { //IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp = new XMLHttpRequest();
				} else { //IE5, IE6
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.open("GET", file, false); //is the second parameter ok or do i have to do something like file.name to get it correct?
				xmlhttp.send();
				xmlDoc = xmlhttp.responseXML*/

			} else {
				alert("Failed to load file. Reclick it if you did pick a file.");
			}
		}

		var loadedFile = document.getElementById('realLoad');
		
		document.getElementById('realLoad').addEventListener('click', readingFiles);
		loadedFile.click();
		//need to end the Listener, it adds 1 more each time i click it seems
		//also, it runs the listen event before i can pick a file, making me pick it twice
		document.getElementById('realLoad').removeEventListener('click', readingFiles);

		var correctFileType = false;
		//correctFileType = checkFileExtension(loadedFile);
		// verify uploaded file is an xml/txt file in xml format

		//alert(loadedFile);
		console.log("clicked funcLoad");
	} /*this is called by load when clicked*/

	/*function checkFileExtension(file) {
		var loadedFile = file;
		var extension = "";
		var isValid = false;

		if (loadedFile.value.lastIndexOf(".") > 0) {
			extension = loadedFile.value.substring(loadedFile.value.lastIndexOf(".") + 1, loadedFile.value.length);
			alert("extension is " + extension);
		}

		if (extension === "xml" || extension === "txt") {
			isValid = true;
		} else {
			alert("The file you submitted was not an XML");
			isValid = false;
		}

		return isValid;
	} /* extension checker */



	// THE SAVE XML CODE
	// Try to make a single file for this to be loaded by load

	function saveXML() { // called by save when clicked
		alert("Save not implemented yet");
	} /* called by save when clicked */
  });

  Template.hello.helpers({
    cardList: function () {
      return cardList.find({});
    },
    versionList: function () {
      return versionList.find({});
    }
  });

  Template.Units.events({
'click .dropdown-toggle': function (e) {
    e.defaultPrevented();
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
      console.log(attrclass);
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
    },
    'click .reset1': function (event, template){
      //event.defaultPrevented();
      var classString = $(event.target).attr("class").split(" ")[4];
      console.log(classString);
      var x = confirm("You are about to reset the form");
      if(x == true){
        document.getElementById(classString).reset();
      }else{
      //do nothing
      }
      return false;
    },
    'click .addCard': function(event) {
      console.log("add card button clicked, num cards: " + Session.get('numCards'));
	Session.set('numCards', Session.get('numCards') + 1);
	cardList.insert({cardNum:Session.get('numCards')});
    },
    'click .addVersion': function(event) {
      console.log("add cardVersion button clicked, num versions: " + Session.get('numVersions'));
	Session.set('numVersions', Session.get('numVersions') + 1);
	versionList.insert({versionNum:Session.get('numVersions')});
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
    },
    'click .reset1': function (event, template){
      //event.defaultPrevented();
      var classString = $(event.target).attr("class").split(" ")[4];
      console.log(classString);
      var x = confirm("You are about to reset the form");
      if(x == true){
        document.getElementById(classString).reset();
      }else{
      //do nothing
      }
      return false;
    }

  });
}


if (Meteor.isServer) {
  unitList = new Mongo.Collection('unitList');
  cardList = new Mongo.Collection('cardList');
  versionList = new Mongo.Collection('versionList');
  //Session.setDefault('numUnitsInt', 0);
  Meteor.startup(function() {
    // code to run on server at startup
	unitList.remove({});
	cardList.remove({});
	versionList.remove({});
   

  });

}
