//Client side
if (Meteor.isClient) {
	//initializers for lists and counters
	unitList = new Mongo.Collection('unitList');
	cardList = new Mongo.Collection('cardList');
	versionList = new Mongo.Collection('versionList');
	Session.setDefault('numUnitsInt', 1);
	Session.setDefault('numCards', 1);
	Session.setDefault('numVersions', 1);

	//BODY TEMPLATE EVENTS
	Template.body.events({
		'click .create': function (event){
			// event.defaultPrevented();
			var x = confirm("Are you sure to clear the form and create a new one? ");
			if(x == true){
				document.getElementById("masterForm").reset(); 
				// var inputs = document.getElementsByTagName('input');

				// for(var i = 0; i < inputs.length; i++) {
				//     if(inputs[i].type.toLowerCase() == 'text') {
				//     	inputs[i].value='';
				//     }
				//     else if(inputs[i].type.toLowerCase() == 'textarea') {
				//     	inputs[i].value='';
				//     }
				//     else if(inputs[i].type.toLowerCase() == 'checkbox') {
				//     	inputs[i].removeAttr('checked');
				//     }
				//     else if(inputs[i].type.toLowerCase() == 'number') {
				//     	inputs[i].value=0;
				//     }
				//     else if(inputs[i].type.toLowerCase() == 'radio') {
				//     	inputs[i].value=false;
				//     }

				// }
		
	 		} else {
	 			//do nothing
	 		}
	 		return false;

		},
  		// 'click .master': function (event) {
  		// 	// event.preventDefault();
    // 			// This function is called when the master form is submitted
    // 		var inputs = document.getElementsByTagName('input');
    // 		var isEmpty= false;
				// for(var i = 0; i < inputs.length; i++) {
				// 	if (inputs[i].value == null || inputs[i].value == "") {
				// 		inputs[i].style.borderColor = "red";
				// 		isEmpty = true; 
    // 				}

				// }
				// if (isEmpty == true){
				// 	var x =confirm("Elements are missing, are you sure to submit?");
				// }
    // 			return false;

  		// },
  		'click .publish':function(event){
    			
			if (formValidation() == true){
				form = {};
				$.each($('#masterForm').serializeArray(), function() {
	   				form[this.name] = this.value;
	   			});
				
				var str = $('#masterForm').serialize();
	    		console.log(form);
	   			

	   			var TDF = parserTDF(str);
	   			var STIM = parserSTIM(str);

				// console.log(TDF);
				// console.log(STIM);

				alert(TDF);
				alert(STIM);
				//get Parse 

			}else{
				return false; 
			}
			return false; 
		}
	});

	//LOAD TEMPLATE EVENTS
	Template.load.events ({
		'change .load1': function(event, template){
			event.preventDefault();
			document.getElementById("masterForm").reset(); //reset the form before loading
			var file = document.getElementById("load1").files[0];

			if (file) {
				var reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = function (evt) {
					//console.log(reader); // puts the file into the log
					var contents = evt.target.results;
					var ct = reader.result;
					var sections = ct.split('\n');
					//alert("got the file.\n" + "name: " + file.name + "\n" + "fileType: " + file.type); //gets the file
					currentCardNum = 1;
					currentCardVersion = 1;
					currentUnitNum = 2;
					for (i = 0; i < sections.length - 1; i++) {
						sections[i] = sections[i].trim();
						var temp = null;
						//console.log(sections[i]); //puts the line into the log
						if (sections[i].indexOf("<lessonname>") != -1) {
							//Name of Cards
							temp = sections[i].split("<")[1].split(">")[1]; //gets the value we want from between the brackets
							document.getElementById('lessonName').value  =  temp; //has to be done by Id
						} else if (sections[i].indexOf("<stimulusfile>") != -1) {
							// the Stimulus file, useless to load right now
							temp = sections[i].split("<")[1].split(">")[1]; 
							document.getElementById('numberofcards').value  =  temp;
						} else if (sections[i].indexOf("<clustermodel>") != -1) {
							//
							temp = sections[i].split("<")[1].split(">")[1]; 
							//document.getElementById('').value  =  temp;
						} else if (sections[i].indexOf("<clustersize>") != -1) {
							//
							temp = sections[i].split("<")[1].split(">")[1]; 
							//document.getElementById('').value  =  temp;
						} else if (sections[i].indexOf("<shuffleclusters>") != -1) {
							//
							temp = sections[i].split("<")[1].split(">")[1]; 
							document.getElementById('shuffleClusters').value  =  temp;
						} else if (sections[i].indexOf("<lfparameter>") != -1) {
							// Levenshtien Proportion
							temp = sections[i].split("<")[1].split(">")[1]; 
							//document.getElementById('lfParameter').value  =  temp;
						} else if (sections[i].indexOf("<isModeled>") != -1) {
							//
							temp = sections[i].split("<")[1].split(">")[1]; 
							//document.getElementById('').value  =  temp;
						} else if (sections[i].indexOf("<timeoutInSeconds>") != -1) {
							//
							temp = sections[i].split("<")[1].split(">")[1]; 
							//document.getElementById('').value  =  temp;
						} else if (sections[i].indexOf("<experimentTarget>") != -1) {
							//
							temp = sections[i].split("<")[1].split(">")[1]; 
							//document.getElementById('').value  =  temp;
						} else if (sections[i].indexOf("<cluster>") != -1) {
							//the cards
							if (document.getElementById('cardPrompt'+ currentCardNum + "-" + currentCardVersion) == null) {
								addCard();
							} // hopefully this adds cards when needed

							while(sections[i].indexOf("</cluster>") == -1) { //continues through the array doing things for this specific card
								if (sections[i].indexOf("<displayType>") != -1) {
									// seen Sound and Image in example files
									temp = sections[i].split("<")[1].split(">")[1]; 
									//document.getElementById('').value  =  temp;
								} else if (sections[i].indexOf("<display>") != -1) {
									if(document.getElementById('cardPrompt'+ currentCardNum + "-" + currentCardVersion) == null){
										addCardVersion();
									} //does this add versions when needed?
								
									// card question
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('cardPrompt'+ currentCardNum + "-" + currentCardVersion).value = temp;
								} else if (sections[i].indexOf("<response>") != -1) {
									// card response, first response is correctly
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('cardResponse' + currentCardNum + "-" + currentCardVersion).value  =  temp;
									currentCardVersion++; //figure out a way to add versions better?
								} else {
									//in case of a unused line
								}
								i++;
							}
						
							currentCardNum++;
							currentCardVersion = 1;
						} else if (sections[i].indexOf("<unit>") != -1) {
							//the different units
							//click the add unit button at this point then have the following loop work with the added units
							if (document.getElementById('unitDrop' + currentUnitNum) == null) {
								//to fix the triple click, go through it and add each unit needed then set them then go through each unit
								//change the below indexOf to </tutor>, to signify end of doc, and have it click add unit for each one, then go through it again and set each unit, then finally set the contents of each units
								var unitType = "instructions";
								for (j = i; sections[j].indexOf("</unit>") == -1; j++) { //checks which unit section to add
									if (sections[j].indexOf("<assessmentsession>") != -1) {
										unitType = "assessment";
									} else if (sections[j].indexOf("<learningsession>") != -1) {
										unitType = "learning";
									}
								}
								if (unitType == "instructions") {
									addInstructions();
									console.log("clicked instructions");
									console.log(currentUnitNum);
								} else if (unitType == "assessment") {
									addAssessment();
									console.log("clicked assessment");
									console.log(currentUnitNum);
								} else if (unitType == "learning") {
									addLearning();
									console.log("clicked learningsession");
									console.log(currentUnitNum);
								}
							}
							while(sections[i].indexOf("</unit>") == -1) {
								if (sections[i].indexOf("<unitname>") != -1) {
									//the name of the unit
									temp = sections[i].split("<")[1].split(">")[1];
									document.getElementById('unitname' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<unitinstructions>") != -1) {
									//the instructions of the unit
									temp = "";
									if (sections[i].indexOf("CDATA") != -1) {
										temp = sections[i].split("![CDATA[")[1].split("]]>")[0];
									} else {
										temp = sections[i].split("<")[1].split(">")[1]; 
									}
									console.log(temp);
									document.getElementById('unitinstructions' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<purestudy>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// purestudy is study alone
									temp = sections[i].split("<")[1].split(">")[1]; 
									temp = temp / 1000;
									document.getElementById('purestudy').value  =  temp;
								} else if (sections[i].indexOf("<readyprompt>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// readyprompt is intercard interval
									temp = sections[i].split("<")[1].split(">")[1]; 
									temp = temp / 1000;
									document.getElementById('readyprompt').value  =  temp;
								} else if (sections[i].indexOf("<reviewstudy>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// reviewstudy is incorrect feedback
									temp = sections[i].split("<")[1].split(">")[1]; 
									temp = temp / 1000;
									document.getElementById('reviewstudy').value  =  temp;
								} else if (sections[i].indexOf("<correctprompt>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// correctprompt is correct feedback
									temp = sections[i].split("<")[1].split(">")[1]; 
									temp = temp / 1000;
									document.getElementById('correctprompt').value  =  temp;
								} else if (sections[i].indexOf("<drill>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// drill is drill
									temp = sections[i].split("<")[1].split(">")[1]; 
									temp = temp / 1000;
									document.getElementById('drill').value  =  temp;
								} else if (sections[i].indexOf("<timebeforefeedback>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// we dont have but to be called Time Before Feedback when we make
									temp = sections[i].split("<")[1].split(">")[1]; 
									//document.getElementById('').value  =  temp;
								} else if (sections[i].indexOf("<timeuntilstimulus>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// we dont have but to be called Time Until Stimulus when we make
									temp = sections[i].split("<")[1].split(">")[1]; 
									//document.getElementById('').value  =  temp;
								} else if (sections[i].indexOf("<buttontrial>") != -1) {
									//either true or false, buttontrial isnt in units but above cards
									temp = sections[i].split("<")[1].split(">")[1]; 
									//document.getElementById('').value  =  temp;
								} else if (sections[i].indexOf("<groupnames>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('groupnames' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<clustersrepeated>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('clustersrepeated' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<templatesrepeated>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('templatesrepeated' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<group>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('group' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<initialpostions>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('initialpositions' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<randomchoices>") != -1) {
									// not in the html, but number of templates is
									temp = sections[i].split("<")[1].split(">")[1]; 
									//document.getElementById('randomchoices' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<randomizegroups>") != -1) {
									// true or false
									temp = sections[i].split("<")[1].split(">")[1]; 
									if (temp === "true") {
										temp = true;
									} else {
										temp = false;
									}
									document.getElementById('randomizegroups' + currentUnitNum).checked  =  temp;
								} else if (sections[i].indexOf("<clusterlist>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('clusterlist' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<assignrandomclusters>") != -1) {
									// true or flase
									temp = sections[i].split("<")[1].split(">")[1]; 
									if (temp === "true") {
										temp = true;
									} else {
										temp = false;
									}
									document.getElementById('assignrandomclusters' + currentUnitNum).checked  =  temp;
								} else if (sections[i].indexOf("<permutefinalresult>") != -1) {
									//
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('permutefinalresults' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<allowquit>") != -1){
									//true or false
									temp = sections[i].split("<")[1].split(">")[1]; 
									if (temp === "true") {
										temp = true;
									} else {
										temp = false;
									}
									document.getElementById('allowquit' + currentUnitNum).checked  =  temp;
								} else if (sections[i].indexOf("<allowpause>") != -1) {
									//true or false
									temp = sections[i].split("<")[1].split(">")[1]; 
									if (temp === "true") {
										temp = true;
									} else {
										temp = false;
									}
									document.getElementById('allowpause' + currentUnitNum).checked  =  temp;
								} else if (sections[i].indexOf("<unending>") != -1) {
									//true or false
									temp = sections[i].split("<")[1].split(">")[1]; 
									if (temp === "true") {
										temp = true;
									} else {
										temp = false;
									}
									document.getElementById('unending' + currentUnitNum).checked  =  temp;
								} else if (sections[i].indexOf("<mindurationtime>") != -1) {
									// 
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('mindurationtime' + currentUnitNum).value  =  temp;
								}
								i++;
							}
							currentUnitNum++;
						} else if (sections[i].indexOf("placeholder") != -1) {
							// placeholder for any other line to be added
						}
					}
				}
			} else {
				alert("Failed to load file. Reclick it if you did/do pick a file.");
			}
		}
	});

	//HELLO TEMPLATE HELPERS
	Template.hello.helpers({
		cardList: function () {
			return cardList.find({});
		},
		versionList: function () {
			return versionList.find({});
		}
	});

	//UNITS TEMPLATE HELPERS
	Template.Units.helpers({
		unitList: function () {
			return unitList.find({});
		},
		unitVal: function () {
			return Session.get('unitVal');
		}
	});

	//HELLO TEMPLATE EVENTS
	Template.hello.events({
		'click .unitType': function (event) {
			//console.log("unitType changed");
			var v = $(event.target).attr("class").split(" ")[2];
			//console.log(v);
			//console.log($(event.target).attr("class"));
			var attrclass = $(event.target).attr("class").split('m')[1];
	 		var x = unitList.findOne({num: parseInt(attrclass)})._id;
			
			unitList.update({_id: x}, {$set: {instructions: false}});
			unitList.update({_id: x}, {$set: {learningsessions: false}});
			unitList.update({_id: x}, {$set: {assessments: false}});
	 		if (v == "instruction") {
				unitList.update({_id: x}, {$set: {instructions: true}});
	 		} else if (v == "learningsession") {
				unitList.update({_id: x}, {$set: {learningsessions: true}});
	 		} else if (v == "assessment") {
				unitList.update({_id: x}, {$set: {assessments: true}});
	 		} else {
	 			Session.set('unitVal', 'invalid');
	 		}
		},
		'click .reset1': function (event, template){
			//event.defaultPrevented();

		 	var classString ='.' + $(event.target).attr("class").split(" ")[4];
		 	console.log(classString);
		 	var x = confirm("You are about to reset the form");
		 	if(x == true){
			 	$(classString).find('input[type="text"]').val('');
			 	$(classString).find('input[type="textarea"]').val('');
			 	$(classString).find('input[type="checkbox"]').prop('checked',false);
				$(classString).find('input[type="number"]').val('0');
				$(classString).find('input[type="radio"]').prop('checked',false);
				//$(classString).find('option[value="0"]').prop('selected',true);
	 		} else {
	 			//do nothing
	 		}
	 		return false;
		},
		'click .addCard': function(event) {
	 		// console.log("add card button clicked, num cards: " + Session.get('numCards'));
			addCard();
		},
		'click .addVersion': function(event) {
			// console.log("add cardVersion button clicked, num versions: " + Session.get('numVersions'));
			addCardVersion();
		},
		'click .subCard': function(event) {
			if (Session.get('numCards') > 1) {
		 		console.log("sub card button clicked, num cards: " + Session.get('numCards'));
				var x = cardList.findOne({cardNum:Session.get('numCards')});
				cardList.remove({_id: x._id});
				Session.set('numCards', Session.get('numCards') - 1);
			}
		},
		'click .subVersion': function(event) {
			if (Session.get('numVersions') > 1) {
		 		console.log("sub cardVersion button clicked, num versions: " + Session.get('numVersions'));
				var x = versionList.findOne({versionNum:Session.get('numVersions')});	
				versionList.remove({_id: x._id});
				Session.set('numVersions', Session.get('numVersions') - 1);
			}
		}
	});

	//UNITS TEMPLATE EVENTS
	Template.Units.events({
		'click .addUnit': function(event) {
			// console.log("add unit button clicked");
			addInstructions();
		},	
		'click .deleteUnit': function(event) {
			if (Session.get('numUnitsInt') > 1) {
				console.log("sub unit button clicked");
			 	console.log($(event.target).attr("class").split("unitNum")[1] );
				var x = unitList.findOne({num: Session.get('numUnitsInt')});
				try {		
					unitList.remove({_id: x._id});
				} catch (e) {
					console.log(e.printStackTrace());
				}
				Session.set('numUnitsInt', Session.get('numUnitsInt') - 1);
			}
		},
		'click .reset1': function (event, template){
			//event.defaultPrevented();

			var classString ='.' + $(event.target).attr("class").split(" ")[4];
			console.log(classString);
			var x = confirm("You are about to reset the form");
			if(x == true){
				$(classString).find('input[type="text"]').val('');
				$(classString).find('input[type="textarea"]').val('');
				$(classString).find('input[type="checkbox"]').prop('checked',false);
				$(classString).find('input[type="number"]').val('0');
				$(classString).find('input[type="radio"]').prop('checked',false);
		
	 		} else {
	 			//do nothing
	 		}
	 		return false;
		},
		'click .radio': function(event, tmplate){
			event.prop(checked,!checked)
		}
	});
}

//Server Side
if (Meteor.isServer) {
	unitList = new Mongo.Collection('unitList');
	cardList = new Mongo.Collection('cardList');
	versionList = new Mongo.Collection('versionList');
	Meteor.startup(function() {
		// code to run on server at startup
		unitList.remove({});
		cardList.remove({});
		cardList.insert({cardNum:1});
		versionList.remove({});
		versionList.insert({versionNum:1});
	});
}

// BEGIN EXTERNAL FUNCTIONS
function formValidation(){
	// form validation before submitting 
			var x = false; 
  			var inputs = document.getElementsByTagName('input');
    		var isEmpty= false;
			for(var i = 0; i < inputs.length; i++) {
				if (inputs[i].value == null || inputs[i].value == "") {
					inputs[i].style.borderColor = "red";
					isEmpty = true; 
    			}

			}
			if (isEmpty == true){
				x =confirm("Elements are missing, are you sure to submit?");
			}
			return x;

}
function parserSTIM(string){
	var counter = 2;
	var spec = "";
	var clusters = "";
	var cluster = "";

	var tags = string.split("&");
	
	for (var i = 6; i < tags.length; i++) {
		if(tags[i].substring(0,10) == "cardPrompt"){
			counter++;
			cluster =  concat("display", tags[i].substring(tags[i].indexOf("=")+1), false, counter);
			cluster += concat("response", tags[i+1].substring(tags[i+1].indexOf("=")+1), false, counter);
			counter--;
			clusters += concat("cluster", cluster, true, counter);
		}
	};
	counter--;
	spec = concat("clusters", clusters, true, counter);
	counter--;
	s = concat("setspec", spec, true, counter);
	return s;
	//console.log(s);	
};

function parserTDF(string){
	var counter = 2;
	var s = "";
	var tutor = "";
	var tags = string.split("&");
	console.log(tags);
	var spec ="";
	spec += concat("lessonname",tags[0].substring(11),false, counter);
	spec += concat("stimulusfile", tags[0].substring(11)+"stims.xml", false, counter);
	var cluster;
	spec += concat("clustermodel", "", false, counter);
	spec += concat("clustersize", "1", false, counter);
	spec += concat("shuffleclusters", tags[4].substring(16), false, counter);
	spec += concat("swapclusters", tags[5].substring(13), false, counter);
	spec += concat("lfparameter", tags[3].substring(12), false, counter);
	spec += concat("isModeled", "false", false, counter);
	spec += concat("timeoutInSeconds", "15", false, counter);
	spec += concat("experimentTarget", "swa", false, counter);
	
	counter--;
	tutor += concat("setspec",spec, true, counter);
	console.log(tutor);
	//TODO grab timing section
	var j = 0;
	var ss = false;
	for (var i = 0; i < tags.length; i++) {
		
		if(tags[i].substring(0,9) == "purestudy"){
			j =i;
			console.log("ding");
		}
		if(tags[i].substring(0, tags[i].indexOf("=")) == "skipstudy"){
			ss = true;
		}tags
	}
	counter ++;
	var timer = concat("purestudy", tags[j].substring(tags[j].indexOf("=")+1)*1000, false, counter);
	if(ss){
		timer += concat("skipstudy", "true", false, counter);
	}
	timer += concat("readyprompt", tags[j+2].substring(tags[j+2].indexOf("=")+1)*1000, false, counter);
	timer += concat("reviewstudy", tags[j+4].substring(tags[j+4].indexOf("=")+1)*1000, false, counter);
	timer += concat("correctprompt", tags[j+3].substring(tags[j+3].indexOf("=")+1)*1000, false, counter);
	timer += concat("drill", tags[j+1].substring(tags[j+1].indexOf("=")+1)*1000, false, counter);
	timer += concat("timebeforefeedback", "500", false, counter);
	timer += concat("timeuntilstimulus", "500", false, counter);
	
	counter --;
	//units section 
	//unit content
	//var firstunit = true;
	var units = "";
	var unit = "";
	//for instructions 
	for (var i = 6; i < tags.length; i++) {
		
		//console.log(tags[i].substring(0,8));
		if(tags[i].substring(0,9) == "unitnameA"){
			//
			//put this in a unit
			counter++;
			unit = concat("unitname", tags[i].substring(tags[i].indexOf("=")+1), false, counter);			
			unit += concat("unitinstructions", tags[i+1].substring(tags[i+1].indexOf("=")+1), false, counter);			
			counter--;
			units += concat("unit", unit, true, counter);
			//do things
		};
		if(tags[i].substring(0,tags[i].indexOf("=")) == "unitnameC"){
			counter++;
			unit = concat("unitname", tags[i].substring(tags[i].indexOf("=")+1), false, counter);			
			unit += concat("unitinstructions", tags[i+1].substring(tags[i+1].indexOf("=")+1), false, counter);			
			unit += concat("deliveryparams", timer, true, counter);			
			unit += concat("buttontrial", "false", false, counter);
			counter++;
			//get assessment session
			var assessmentParam = "";
			var conditionTemplate = "";
			var permuteFinal;
			var initPos;
			var group; // split the groups array into an array for input split on +
			var groups; // split the group txt area on %0D%0A

			for (var j = i+1; j < endOfUnit(tags, j); j++) {
				//should only find 1 group
				if(tags[j].substring(0, tags[j].indexOf("=")) == "group"){
					groups = tags[j].substring(tags[j].indexOf("=")+1).split("%0D%0A");
					counter ++;
					conditionTemplate = concat("groupnames",getGroupName(groups.length),false, counter);
					conditionTemplate = concat("clustersrepeated", "1" , false, counter);
					conditionTemplate = concat("templatesrepeated","1",false,counter);
					console.log(groups);
					for (var k = 0; k < groups.length; k++) {
						group = groups[k].split("+");
						var temp = "";
						var ntemp = 0;
						console.log(group);
						for (var l = 0; l < group.length; l++) {
							if(group[l].substring(0,1)=="a"){
								temp += group[l].substring(1) +",f,a,"+ ntemp + " ";

								ntemp++;
							}else if(group[l].substring(0,1)=="d"){
								temp += group[l].substring(1) +",f,d,"+ ntemp + " ";
								ntemp++;
							}else if(group[l].substring(0,1)=="s"){
								if(group[l].substring(1,2)!="k"){
									temp += group[l].substring(1) +",f,s,"+ ntemp +" ";
									ntemp++;
								};
							};
							if (group[l].substring(0,4) == "skip") {
								var xtemp = parseInt(group[l].substring(4));
								
								ntemp = ntemp + xtemp;
								console.log(ntemp);
							};
						};
						conditionTemplate += concat("group", temp, false, counter)
					};
					counter --;
					assessmentParam +=  concat("conditiontemplatebygroup",conditionTemplate, true, counter);
				};
				//do something
				if(tags[j].substring(0, tags[j].indexOf("=")) == "initialpositions"){
					initPos = tags[j].substring(tags[j].indexOf("=")+1).split("+")
					var z = "";
					for (var k = 0; k < initPos.length; k++) {
						z += initPos[k]+"_1";
					};
					assessmentParam +=  concat("initialpositions", z, true, counter);
					//add in random choices
					assessmentParam +=  concat("randomchoices","", false, counter);
					assessmentParam +=  concat("randomizegroups","false", false, counter);
				}
				if(tags[j].substring(0, tags[j].indexOf("=")) == "clusterlist"){
					assessmentParam +=  concat("clusterlist",tags[j].substring(tags[j].indexOf("=")+1), false, counter);					
					assessmentParam +=  concat("assignrandomclusters","false", false, counter);
				}
				if(tags[j].substring(0, tags[j].indexOf("=")) == "permutefinalresult"){
					assessmentParam +=  concat("permutefinalresult",tags[j].substring(tags[j].indexOf("=")+1), false, counter);
				}								
			};

			counter--;

			unit += concat("assessmentsession", assessmentParam, true, counter);
			//assessment session will need to have something in it.
			counter--;
			units+= concat("unit", unit, true, counter);
			//do things
		};
		if(tags[i].substring(0,tags[i].indexOf("=")) == "unitnameB"){
			counter++;
			unit = concat("unitname", tags[i].substring(tags[i].indexOf("=")+1), false, counter);			
			unit += concat("unitinstructions", tags[i+1].substring(17), true, counter);
			unit += concat("deliveryparams", timer, true, counter);
			unit += concat("buttontrial", "false", false, counter);

			counter++;
			//set learning session
			var learningparam = "";
			var allowpause = false;
			var allowquit = false;
			var unending = false;
			for (var k = i; k < endOfUnit(tags, i); k++) {
				if(tags[k].substring(0,tags[k].indexOf("="))== "allowpause"){
					allowpause = true;
				};
				if (tags[k].substring(0,tags[k].indexOf("="))== "allowquit") {
					allowquit = true;
				};
				if (tags[k].substring(0,tags[k].indexOf("="))== "unending") {
					unending = true;
				};
			};

			if (allowquit) {
				learningparam += concat("allowquit", "true", false, counter);
			} else{
				learningparam += concat("allowquit", "false", false, counter);
			};

			if (allowpause) {
				learningparam += concat("allowpause", "true", false, counter);
			} else{
				learningparam += concat("allowpause", "false", false, counter);
			};

			if (unending) {
				learningparam += concat("unending", "true", false, counter);
			} else{
				learningparam += concat("unending", "false", false, counter);
			};
			counter--;
			unit += concat("learningsessions", learningparam, true, counter);
			counter--;
			units+= concat("unit", unit, true, counter);
		};
		//concat other things as well
	};
	//error checking
	tutor += units;
	var finS = concat("tutor", tutor, true, counter);
	return finS;
};

function endOfUnit (tags, startPose){
	for (var i = startPose+1; i < tags.length; i++) {
		if (tags[i].substring(0, tags[i].indexOf("=")-1) == "unitname") {
			return i;
		} else{
			return tags.length;
		};
	};
};

function getGroupName(number){
	var groupName;
	switch(number){
		case 1:
			groupName = "A";
			break;
		case 2:
			groupName = "A B";
			break;
		case 3:
			groupName = "A B C";
			break;
		case 4:
			groupName = "A B C D";
			break;
		case 5:
			groupName = "A B C D E";
			break;
		case 6:
			groupName = "A B C D E F";
			break;
		case 7:
			groupName = "A B C D E F G";
			break;
		case 8:
			groupName = "A B C D E F G H";
			break;
		case 9:
			groupName = "A B C D E F G H I";
			break;
		case 10:
			groupName = "A B C D E F G H I J";
			break;
		case 11:
			groupName = "A B C D E F G H I J K";
			break;
		case 12:
			groupName = "A B C D E F G H I J K L";
			break;
		case 13:
			groupName = "A B C D E F G H I J K L M";
			break;
		case 14:
			groupName = "A B C D E F G H I J K L M N";
			break;
		case 15:
			groupName = "A B C D E F G H I J K L M N O";
			break;
		case 16:
			groupName = "A B C D E F G H I J K L M N O P";
			break;
		case 17:
			groupName = "A B C D E F G H I J K L M N O P Q";
			break;
		case 18:
			groupName = "A B C D E F G H I J K L M N O P Q R";
			break;
		case 19:
			groupName = "A B C D E F G H I J K L M N O P Q R S";
			break;
		case 20:
			groupName = "A B C D E F G H I J K L M N O P Q R S T";
			break;
		case 21:
			groupName = "A B C D E F G H I J K L M N O P Q R S T U";
			break;
		case 22:
			groupName = "A B C D E F G H I J K L M N O P Q R S T U V";
			break;
		case 23:
			groupName = "A B C D E F G H I J K L M N O P Q R S T U V W";
			break;
		case 24:
			groupName = "A B C D E F G H I J K L M N O P Q R S T U V W X";
			break;
		case 25:
			groupName = "A B C D E F G H I J K L M N O P Q R S T U V W X Y";
			break;
		case 26:
			groupName = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
			break;
		default :
			groupName = "";
	};
	return groupName;
};
	
function concat(tag, source, vertical, numSpace){
	var s = "";
	for(i = 0; i< numSpace; i++){
		s += " ";
	}
	s+="<"+tag+">";
	if (vertical){
		s+= "\n";
	}
	s+= source;
	if (vertical){
		s+= "\n";
		for(i = 0; i< numSpace; i++){
			s += " ";
		}
	}
	s+="</"+tag+">\n";
	return s;
};

function addInstructions(){
	Session.set('numUnitsInt', Session.get('numUnitsInt') + 1);
	unitList.insert({num:Session.get('numUnitsInt'),
		instructions:true,
		learningsessions:false,
		assessments:false});
};

function addLearning(){
	Session.set('numUnitsInt', Session.get('numUnitsInt') + 1);
	unitList.insert({num:Session.get('numUnitsInt'),
		instructions:false,
		learningsessions:true,
		assessments:false});
};

function addAssessment(){
	Session.set('numUnitsInt', Session.get('numUnitsInt') + 1);
	unitList.insert({num:Session.get('numUnitsInt'),
		instructions:false,
		learningsessions:false,
		assessments:true});
};

function addCard(){
	Session.set('numCards', Session.get('numCards') + 1);
	cardList.insert({cardNum:Session.get('numCards')});
};

function addCardVersion(){
	Session.set('numVersions', Session.get('numVersions') + 1);
	versionList.insert({versionNum:Session.get('numVersions')});
};

//END EXTERNAL FUNCTIONS
