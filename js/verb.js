var allVerbs = 	[]					// A complete list of all verbs. Filled by fetchVerbs
var verbGroups = {};				// All the different verb groups aka tags
var activeVerbGroup = [];			// The group of verbs that's selected for the active round
var activeVerb = 0;					// The current verb in activeVerbGroup that's selected

// Get each and every tag group that exists for nouns
$.get("getVerbGroups.php", function(data, status) {
	if ( data.status == "error" || data.message.length == 0 ) {
		$("#errorModal .modal-body").text(data.message);
		$("#errorModal").modal();
	}
	else {	
		for ( var index = 0; index < data.message.length; index++ ) {
			fetchVerbs(data.message[index]);
			verbGroups[data.message[index]] = 1;
			
			$("#verbConjugation .dropdown-menu").append('<a class="dropdown-item" href="#">' + data.message[index] + '</a>');
			$("#verbTranslation .dropdown-menu").append('<a class="dropdown-item" href="#">' + data.message[index] + '</a>');
		}
	}
});

// Helper function. Used per tag group to fetch all nouns that matches it
function fetchVerbs(group) {
	return $.get("getVerbList.php?limit=100&tags=" + group, function(data, status) {
		if ( data.status == "error" || data.message.length == 0 ) {
			$("#errorModal .modal-body").text(data.message);
			$("#errorModal").modal();
		}
		else {
			for ( var index = 0; index < data.message.length; index++ ) {
				var hadMatch = false;
				
				for ( var verbIndex = 0; verbIndex < allVerbs.length; verbIndex++ ) {
					if ( data.message[index][0] == allVerbs[verbIndex][1] &&  data.message[index][1] == allVerbs[verbIndex][2] &&  data.message[index][2] == allVerbs[verbIndex][3] ) {
						allVerbs[verbIndex][0] += " " + group;
						hadMatch = true;
						break;
					}
				}
				if ( !hadMatch ) {
					allVerbs.push([group, data.message[index][0], data.message[index][1], data.message[index][2]]);
				}
			}
		}
	});
}
				












$("#verbConjugation").delegate(".dropdown-item", "click", function(){
	var groupTag = $(this).text();
	
	activeVerbGroup = [];
	
	for ( var i = 0; i < allVerbs.length; i++ ) {
		var tags = allVerbs[i][0].split(" ");
		
		
		
		for ( var tagCtr = 0; tagCtr < tags.length; tagCtr++ ) {
			if (tags[tagCtr] == groupTag ) {
				console.log(tags[tagCtr] + " contains " + groupTag + " --> " + allVerbs[i]);
				
				activeVerbGroup.push(allVerbs[i]);
			}
		}
	}
	
	$(this).parent().siblings("button").text(groupTag);
	
	$("#verbConjugation button.gameButtonStop").click();
});

$("#verbTranslation button.gameButtonReset").click(function() {
	activeVerbGroup = allVerbs.slice();
	activeVerb = 0;
	
	$("#verbTranslation > .dropdown > button").text("Alle udsagnsord");
	$(this).siblings(".gameButtonStop").click();
});

$("#verbConjugation button.gameButtonReset").click(function() {
	activeVerbGroup = allVerbs.slice();
	activeVerb = 0;
	
	$("#verbConjugation > .dropdown > button").text("Alle udsagnsord");
	$(this).siblings(".gameButtonStop").click();
});

$("#verbConjugation button.gameButtonStart").click(function() {
	activeVerb = getRandomArrayIndex(activeVerbGroup);
	
	$(this).siblings("h5").text(activeVerbGroup[activeVerb][1]);
	$(this).siblings("h6").text(activeVerbGroup[activeVerb][2]);
	
	clearInputs("#verbConjugation");
});

$("#verbTranslation button.gameButtonStart").click(function() {
	activeVerb = getRandomArrayIndex(activeVerbGroup);
	
	clearInputs("#verbTranslation");
	
	$(this).siblings("h5").text(activeVerbGroup[activeVerb][1]);
	$(this).siblings("h6").text(activeVerbGroup[activeVerb][2]);	
});

$("#verbTranslation button.gameButtonStop").click(function() {
	activeVerb = 0;
	
	clearInputs("#verbTranslation");
	
	$(this).siblings("h5").text("");
	$(this).siblings("h6").text("");
});

$("#verbConjugation button.gameButtonStop").click(function() {
	activeVerb = 0;
	
	clearInputs("#verbConjugation");
	
	$(this).siblings("h5").text("");
	$(this).siblings("h6").text("");
});

$("#verbTranslation").delegate(".dropdown-item", "click", function(){
	var groupTag = $(this).text();
	
	activeVerbGroup = [];
	
	for ( var i = 0; i < allVerbs.length; i++ ) {
		var tags = allVerbs[i][0].split(" ");
		
		for ( var tagCtr = 0; tagCtr < tags.length; tagCtr++ ) {
			if (tags[tagCtr] == groupTag ) {
				activeVerbGroup.push(allVerbs[i]);
				
			}
		}
	}
	
	$(this).parent().siblings("button").text(groupTag);
	
	$("#verbTranslation button.gameButtonStop").click();
});

$("#verbConjugation button.gameButtonCheck").click(function() {
	var inf = $("#verbConjugation input.verbInfinitiv").val();
	var pre = $("#verbConjugation input.verbThirdPresent").val();
	var past = $("#verbConjugation input.verbThirdPast").val();
	var kon = $("#verbConjugation input.verbKonjunktiv").val();
	var par = $("#verbConjugation input.verbPartizip").val();
	
	var getString  = "validateVerb.php?baseword=" + activeVerbGroup[activeVerb][3];
	    getString += "&inf="+inf;
	    getString += "&pre="+pre;
	    getString += "&past="+past;
	    getString += "&kon="+kon;
		getString += "&par="+par;
	
	$.get(getString.toLowerCase(), function(data, status) {
		if ( data.status == "OK" ) {
			var allCorrect = true;
			
			if ( data.message[0] == 0 ) {
				setAnimationForElement("#verbConjugation input.infinitiv", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[1] == 0 ) {
				setAnimationForElement("#verbConjugation input.verbThirdPresent", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[2] == 0 ) {
				setAnimationForElement("#verbConjugation input.verbThirdPast", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[3] == 0 ) {
				setAnimationForElement("#verbConjugation input.verbKonjunktiv", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[4] == 0 ) {
				setAnimationForElement("#verbConjugation input.verbPartizip", "wrong 1s");
				allCorrect = false;
			}
			
			if ( allCorrect ) {
				$("#verbConjugation button.gameButtonCheck").siblings(".form-group").children("input").each(function () {
					// Don't blink if it's disabled
					if ( $(this).attr("disabled") != "disabled" ) {
						setAnimationForElement(this, "correct 1s");
					}
				});
				$("#verbConjugation button.gameButtonCheck").addClass("d-none");
				$("#verbConjugation button.gameButtonNext").removeClass("d-none");
				$("#verbConjugation button.gameButtonSkip").addClass("d-none");
			}
		}
	});
});


// Handler for the check button for verb translations
// NOTE: We do not need to query the database in this case
//       because we fetch all the data needed from the server
//       in the beginning, to build the allVerbs array.
$("#verbTranslation button.gameButtonCheck").click(function() {
	if ( $(this).siblings(".form-group").children("input.verbInfinitiv").val().toLowerCase() != activeVerbGroup[activeVerb][3].toLowerCase() ) {
		setAnimationForElement("#verbTranslation input.verbInfinitiv", "wrong 1s");
	}
	else {
		correctVerbHandler("#verbTranslation")
	}
});

// Common code for events that happen on a correct verb 
// - Flash the input fields
// - Hide check and skip buttons 
// - Show the next button
function correctVerbHandler(selector) {
	$(selector + " .form-group").children("input").each(function () {
		setAnimationForElement(this, "correct 1s");
	});
	
	$(selector + " .gameButtonCheck").addClass("d-none");
	$(selector + " .gameButtonSkip").addClass("d-none");
	$(selector + " .gameButtonNext").removeClass("d-none");
}

// Next button handler for the verb conjugation quiz
$("#verbConjugation button.gameButtonNext").click(function() {
	nextRound("#verbConjugation");
});

// Next button handler for the verb translation quiz
$("#verbTranslation button.gameButtonNext").click(function() {
	nextRound("#verbTranslation");
});

// Helper function that contains the common code for the two next button handlers
function nextRound(selector) {
	$(selector + " > button.gameButtonNext").addClass("d-none");
	$(selector + " > button.gameButtonCheck").removeClass("d-none");
	
	// Remove the current verb from the list
	activeVerbGroup.splice(activeVerb, 1);
	
	// If there is no more verbs, we win!
	if ( activeVerbGroup.length == 0 ) {
		$("#myModal").modal();
		$(selector + " > button.gameButtonReset").click();
	}
	else {
		setNextVerb(selector);
		$(selector + " > button.gameButtonSkip").removeClass("d-none");
	}	
}

// Skip button handler for the verb translation quiz
$("#verbTranslation button.gameButtonSkip").click(function() {
	setNextVerb("#verbTranslation");
});

// Skip button handler for the verb conjugation quiz
$("#verbConjugation button.gameButtonSkip").click(function() {
	setNextVerb("#verbConjugation");
});

// Helper function that contains the common code for the two skip button handlers
// Switches the active verb to another one if there is any others in the list and sets the 
// danish translation and danish description.
function setNextVerb(container) {
	var oldVerb = activeVerb;
	
	// Keep trying a random list element ONLY if there is actually another element to switch to
	if ( activeVerbGroup.length > 1 || activeVerb > activeVerbGroup.length ) {
		while ( activeVerb == oldVerb || activeVerb > activeVerbGroup.length ) {
			activeVerb = getRandomArrayIndex(activeVerbGroup);
		}
	}	
	
	// Set the danish text and description
	$(container + " > h5").text(activeVerbGroup[activeVerb][1]);
	$(container + " > h6").text(activeVerbGroup[activeVerb][2]);
	
	clearInputs(container);
}