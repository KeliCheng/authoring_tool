//Client side
if (Meteor.isClient) {
	//initializers for lists and counters
	unitList = new Mongo.Collection('unitList');
	cardList = new Mongo.Collection('cardList');
	versionList = new Mongo.Collection('versionList');
	Session.setDefault('numUnitsInt', 1);
	Session.setDefault('numCards', 1);
	Session.setDefault('numVersions', 1);

	Template.body.events({
  		'click .master': function (event) {
  		// event.preventDefault();
    	// This function is called when the master form is submitted
			console.log("bibadi");

			var x = document.forms["masterForm"]["modulename"].value;
			var y = document.getElementById("numberofcards").value;
			var z = document.getElementsByName("nameofversion")[0].value

    		if (x == null || x == "") {
    			console.log("bobadi")
        		confirm("Elements are missing, are you sure to submit?");
        		document.getElementById("moduleName").focus();
        		document.getElementById("numberofcards").focus();
        		console.log("boo");
    		}

    		return false;
  		},
  		'click .publish':function(event){
			form = {};
			$.each($('#masterForm').serializeArray(), function() {
   				form[this.name] = this.value;
   			});

			var str = $('#masterForm').serialize();
    		console.log(form);
   			//legacy code
   			//document.getElementById("testing").value = str;//form[this.name];
   			parserTDF(str);
   			parserSTIM(str);
   			//TODO check for correctness 
	   		//may not need this
   			/*
   			MyCollection.insert(form, function(err) {
    	   		if(!err) {
    	       		alert("Submitted!");
       	    		$('#masterform')[0].reset();
       	    		//
       			}
       			else {
        	   		alert("Something is wrong");
           			console.log(err);
       			}
			})
			*/
		//get Parse 
		}
	});


	Template.load.events ({

		'change .load1': function(event, template){

			event.defaultPrevented; 
		
			// var loadedFile = document.getElementById('realLoad');
			// document.getElementById('realLoad').addEventListener('click', readingFiles);
			// loadedFile.click();
			// document.getElementById('realLoad').removeEventListener('click', readingFiles); //need to end the Listener or else it adds 1 more each time load is clicked
			//also, it runs the listen event before i can pick a file, making me click load twice, clicking it a 3rd time fixes the unit section? what?

			//function readingFiles(evt) {
			//var file = evt.target.files[0]; //do these 3 lines do the same thing?
			var file = document.getElementById("load1").files[0];
			//var file = template.find('input type=["file"]').files[0];
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
					currentUnitNum = 1;
					for(i = 0; i < sections.length - 1; i++){
							
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
								var addCardClick = document.getElementById('addCard');
								addCardClick.click();
							} // hopefully this adds cards when needed

							while(sections[i].indexOf("</cluster>") == -1) { //continues through the array doing things for this specific card
								if (sections[i].indexOf("<displayType>") != -1) {
									// seen Sound and Image in example files
									temp = sections[i].split("<")[1].split(">")[1]; 
									//document.getElementById('').value  =  temp;
								} else if (sections[i].indexOf("<display>") != -1) {
									if(document.getElementById('cardPrompt'+ currentCardNum + "-" + currentCardVersion) == null){
										var addCardVersion = document.getElementById('addCardVersion');
										addCardVersion.click();
									} //does this add versions when needed?
									
									// card question
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('cardPrompt'+ currentCardNum + "-" + currentCardVersion).value = temp;
								} else if (sections[i].indexOf("<response>") != -1) {
									// card response, first response is correctly
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('cardResponse' + currentCardNum + "-" + currentCardVersion).value  +=  temp;
									//currentCardVersion++; //figure out a way to add versions better?
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
								var addUnitClick = document.getElementById('addUnit');
								addUnitClick.click();
							}
							
							//to fix the triple click, go through it and add each unit needed then set them then go through each unit
							//change the below indexOf to </tutor>, to signify end of doc, and have it click add unit for each one, then go through it again and set each unit, then finally set the contents of each units
							var unitType = "instructions";
							for(j = i; sections[j].indexOf("</unit>") == -1; j++){ //checks which unit section to add
								if (sections[j].indexOf("<assessmentsession>") != -1) {
									unitType = "assessment";
								} else if (sections[j].indexOf("<learningsession>") != -1) {
									unitType = "learning";
								}
							}
							if (unitType == "instructions") {
								document.getElementById('instruction' + currentUnitNum).click();
								console.log("clicked instructions");
								console.log(currentUnitNum);
							} else if (unitType == "assessment") {
								document.getElementById('assessment' + currentUnitNum).click();
								console.log("clicked assessment");
								console.log(currentUnitNum);
							} else if (unitType == "learning") {
								document.getElementById('learningsession' + currentUnitNum).click();
								console.log("clicked learningsession");
								console.log(currentUnitNum);
							}
							while(sections[i].indexOf("</unit>") == -1) {
								if (sections[i].indexOf("<unitname>") != -1) {
									//the name of the unit
									temp = sections[i].split("<")[1].split(">")[1];
									document.getElementById('unitname' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<unitinstructions>") != -1) {
									//the instructions of the unit
									temp = "";
									if(sections[i].indexOf("CDATA") != -1){
										temp = sections[i].split("![CDATA[")[1].split("]]>")[0];
									}else {
										temp = sections[i].split("<")[1].split(">")[1]; 
									}
									console.log(temp);
									document.getElementById('unitinstructions' + currentUnitNum).value  =  temp;
								} else if (sections[i].indexOf("<purestudy>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// purestudy is study alone
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('purestudy').value  =  temp;
								} else if (sections[i].indexOf("<readyprompt>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// readyprompt is intercard interval
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('readyprompt').value  =  temp;
								} else if (sections[i].indexOf("<reviewstudy>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// reviewstudy is incorrect feedback
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('reviewstudy').value  =  temp;
								} else if (sections[i].indexOf("<correctprompt>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// correctprompt is correct feedback
									temp = sections[i].split("<")[1].split(">")[1]; 
									document.getElementById('correctprompt').value  =  temp;
								} else if (sections[i].indexOf("<drill>") != -1) {
									//not in the unit itself but before it in the timing section, but its in all unit tags
									// drill is drill
									temp = sections[i].split("<")[1].split(">")[1]; 
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
								} else if (sections[i].indexOf("<assessmentsession>") != -1) {
									//assessment unit related tag loop
									while(sections[i].indexOf("</assessmentsession>") == -1){
										if (sections[i].indexOf("<conditionaltemplatesbygroup>") != -1){
											// another loop?
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<initialpostions>") != -1) {
											//
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<randomchoices>") != -1) {
											//
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<randomizegrups>") != -1) {
											// true or false
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<clusterlist>") != -1) {
											//
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<assignrandomclusters>") != -1) {
											// true or flase
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<permutefinalresult>") != -1) {
											//
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else {
										}
										i++;
									}
								} else if (sections[i].indexOf("<learningsession>") != -1) {
									//learning unit related tag loop
									while(sections[i].indexOf("</learningsession>") == -1){
										if (sections[i].indexOf("<allowquit>") != -1){
											//true or false
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<allowpause>") != -1) {
											//true or false
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<unending>") != -1) {
											//true or false
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else if (sections[i].indexOf("<mindurationtime>") != -1) {
											// 
											temp = sections[i].split("<")[1].split(">")[1]; 
											//document.getElementById('').value  =  temp;
										} else {
										}
										i++;
									}
									
								} else {
								}
								i++;
							}
							currentUnitNum++;
						} else if (sections[i].indexOf("hi6283") != -1) {
							// placeholder for any other line to be added
						}
					}
				}
			} else {
				alert("Failed to load file. Reclick it if you did/do pick a file.");
			}
		}
	});

	Template.hello.helpers({
		cardList: function () {
			return cardList.find({});
		},
		versionList: function () {
			return versionList.find({});
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
		// 'click .demo': function (event){
		// 	// if (document.getElementById("message").style.visibility == "hidden"){
		// 	// 	document.getElementById("message").style.visibility = "visible";
		// 	// }else{
		// 	// 	document.getElementById("message").style.visibility = "hidden";
		// 	// }
		// 	return false; //to avoid click on tooltips; 
		// },
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
	 		console.log("add card button clicked, num cards: " + Session.get('numCards'));
			Session.set('numCards', Session.get('numCards') + 1);
			cardList.insert({cardNum:Session.get('numCards')});
		},
		'click .addVersion': function(event) {
			console.log("add cardVersion button clicked, num versions: " + Session.get('numVersions'));
			Session.set('numVersions', Session.get('numVersions') + 1);
			versionList.insert({versionNum:Session.get('numVersions')});
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

	Template.Units.events({
		//'click .dropdown-toggle': function (e) {
			//e.defaultPrevented();
			//$(e.target).find('.dropdown-menu').toggle();
		//},
		'click .addUnit': function(event) {
			console.log("add unit button clicked");
			Session.set('numUnitsInt', Session.get('numUnitsInt') + 1);
			unitList.insert({num:Session.get('numUnitsInt'),
						instructions:true,
						learningsessions:false,
						assessments:false});
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
//FUNCTIONS

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
	};10
	counter--;
	spec = concat("clusters", clusters, true, counter);
	counter--;
	s = concat("setspec", spec, true, counter);

	console.log(s);	
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
		if(tags[i].sustring(0,tags[i].indexOf("=")) == "skipstudy"){

		}
	};
	counter ++;
	var timer = concat("purestudy", tags[j].substring(tags[j].indexOf("=")+1)*1000, false, counter);
	if(ss){
		timer += concat("skipstudy", "true", false, counter);
	}
	else{
		timer += concat("readyprompt", tags[j+2].substring(tags[j].indexOf("=")+1)*1000, false, counter);
	}
	timer += concat("reviewstudy", tags[j+4].substring(tags[j].indexOf("=")+1)*1000, false, counter);
	timer += concat("correctprompt", tags[j+3].substring(tags[j].indexOf("=")+1)*1000, false, counter);
	timer += concat("drill", tags[j+1].substring(tags[j].indexOf("=")+1)*1000, false, counter);
	timer += concat("timebeforefeedback", "500", false, counter);
	timer += concat("timeuntilstimulus", "500", false, counter);
	
	counter --;
	//units section 
	//unit content
	var firstunit = true;
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
		}else if(tags[i].substring(0,tags[i].indexOf("=")) == "unitnameB"){
			counter++;
			unit = concat("unitname", tags[i].substring(tags[i].indexOf("=")+1), false, counter);			
			unit += concat("unitinstructions", tags[i+1].substring(tags[i+1].indexOf("=")+1), false, counter);			
			unit += concat("deliveryparams", timer, true, counter);
			unit += concat("deliveryparams", timer, true, counter);
			unit += concat("assessmentsession", "", true, counter);
			//assessment session will need to have something in it.
			counter--;
			units+= concat("unit", unit, true, counter);
			//do things
		}else if(tags[i].substring(0,tags[i].indexOf("=")) == "unitnameC"){
			counter++;
			unit = concat("unitname", tags[i].substring(tags[i].indexOf("=")+1), false, counter);			
			unit += concat("unitinstructions", tags[i].substring(17), true, counter);
			unit += concat("buttontrial", "false", false, counter);
			unit += concat("deliveryparams", timer, true, counter);
			counter++;
			//get learning session
			counter--;
			unit += concat("learningsessions", "", true, counter);
			counter--;
			units+= concat("unit", unit, true, counter);
		}
		//concat other things as well
		};
		//error checking
	}
	tutor += units;
	var finS = concat("tutor", tutor, true, counter);
	finS += concat("deliveryparams", timer, true, 0);
	console.log(finS);
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

//Server Side
if (Meteor.isServer) {
	unitList = new Mongo.Collection('unitList');
	cardList = new Mongo.Collection('cardList');
	versionList = new Mongo.Collection('versionList');
	Meteor.startup(function() {
		// code to run on server at startup
		unitList.remove({});
		unitList.insert({num:1,
				instructions:true,
				learningsessions:false,
				assessments:false});
		cardList.remove({});
		cardList.insert({cardNum:1});
		versionList.remove({});
		versionList.insert({versionNum:1});
	});
}
