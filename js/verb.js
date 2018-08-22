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
				
				// Check if there is already an identical verb with different tags and merge their tags if there is
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

// Reset button handler function for all verb quizes
function verbButtonReset(event) {
	activeVerbGroup = allVerbs.slice();
	
	$(event.data.selector + " > .dropdown > button").text("Alle udsagnsord");
	$(event.data.selector + " .gameButtonStop").click();
}
$("#verbTranslation button.gameButtonReset").click({selector: "#verbTranslation"}, verbButtonReset);
$("#verbConjugation button.gameButtonReset").click({selector: "#verbConjugation"}, verbButtonReset);

// Start button handler function for all verb quizes
function verbButtonStart(event) {
	activeVerb = nextQuizElement(activeVerb, activeVerbGroup, 1, 2, event.data.selector);
}
$("#verbConjugation button.gameButtonStart").click({selector: "#verbConjugation"}, verbButtonStart);
$("#verbTranslation button.gameButtonStart").click({selector: "#verbTranslation"}, verbButtonStart);

// Stop button handler function for all verb quizes
function verbButtonStop(event) {
	activeVerb = nextQuizElement(activeVerb, activeVerbGroup, -1, -1, event.data.selector);
}
$("#verbTranslation button.gameButtonStop").click({selector: "#verbTranslation"}, verbButtonStop);
$("#verbConjugation button.gameButtonStop").click({selector: "#verbConjugation"}, verbButtonStop);

// Next button handler function for all verb quizes
function verbButtonNext(event) {
	$(event.data.selector + " > button.gameButtonNext").addClass("d-none");
	$(event.data.selector + " > button.gameButtonCheck").removeClass("d-none");
	
	// Remove the current verb from the list
	activeVerbGroup.splice(activeVerb, 1);
	
	// If there is no more verbs, we win!
	if ( activeVerbGroup.length == 0 ) {
		$("#myModal").modal();
		$(event.data.selector + " > button.gameButtonReset").click();
	}
	else {
		activeVerb = nextQuizElement(activeVerb, activeVerbGroup, 1, 2, event.data.selector);
		$(event.data.selector + " > button.gameButtonSkip").removeClass("d-none");
	}	
}
$("#verbConjugation button.gameButtonNext").click({selector: "#verbConjugation"}, verbButtonNext);
$("#verbTranslation button.gameButtonNext").click({selector: "#verbTranslation"}, verbButtonNext);

// Skip button handler function for all verb quizes
function verbButtonSkip(event) {
	activeVerb = nextQuizElement(activeVerb, activeVerbGroup, 1, 2, event.data.selector);
}
$("#verbConjugation button.gameButtonSkip").click({selector: "#verbConjugation"}, verbButtonSkip);
$("#verbTranslation button.gameButtonSkip").click({selector: "#verbTranslation"}, verbButtonSkip);

// Click handler for each verb group menu 
function verbGroupClick(event) {
	activeVerbGroup = [];
	
	for ( var i = 0; i < allVerbs.length; i++ ) {
		var tags = allVerbs[i][0].split(" ");
		
		for ( var tagCtr = 0; tagCtr < tags.length; tagCtr++ ) {
			if (tags[tagCtr] == $(this).text() ) {
				activeVerbGroup.push(allVerbs[i]);
			}
		}
	}
	
	$(event.data.selector + " .dropdown button").text($(this).text());
	$(event.data.selector + " button.gameButtonStop").click();
}
$("#verbConjugation").delegate(".dropdown-item", "click", {selector: "#verbConjugation"}, verbGroupClick);
$("#verbTranslation").delegate(".dropdown-item", "click", {selector: "#verbTranslation"}, verbGroupClick);


$("#verbConjugation button.gameButtonCheck").click(function() {
	// Each get-key/selector pair
	var checkVerbSelectors = [ 	[ "&inf=", "#verbConjugation input.verbInfinitiv"],
								[ "&pre=", "#verbConjugation input.verbThirdPresent"],
								[ "&past=", "#verbConjugation input.verbThirdPast"],
								[ "&kon=", "#verbConjugation input.verbKonjunktiv"],
								[ "&par=", "#verbConjugation input.verbPartizip"]];
	
	// Form the get request
	var getString  = "validateVerb.php?baseword=" + activeVerbGroup[activeVerb][3];
	for ( var index = 0; index < checkVerbSelectors.length; index++ ) {
		getString += checkVerbSelectors[index][0]+$(checkVerbSelectors[index][1]).val();
	}
	
	// Send it
	$.get(getString.toLowerCase(), function(data, status) {
		if ( data.status == "OK" ) {
			var allCorrect = true;
			
			// Check if the user input was correct, and if it isn't indicate it with the "wrong" animation
			for ( var index = 0; index < checkVerbSelectors.length; index++ ) {
				if ( data.message[index] == 0 ) {
					console.log(index + " " + checkVerbSelectors[index][1]);
					setAnimationForElement(checkVerbSelectors[index][1], "wrong 1s");
					allCorrect = false;
				}
			}
			
			if ( allCorrect ) {
				correctVerbHandler("#verbConjugation")
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

/* correctVebHandler: Common code for events that happen on a correct verb 
 * - selector is the selector of the quiz container
 */
function correctVerbHandler(selector) {
	// Show the "corret" animation for each input field
	$(selector + " .form-group").children("input").each(function () {
		setAnimationForElement(this, "correct 1s");
	});
	
	// Show check and skip buttons
	$(selector + " .gameButtonCheck").addClass("d-none");
	$(selector + " .gameButtonSkip").addClass("d-none");
	
	// Hide the next button
	$(selector + " .gameButtonNext").removeClass("d-none");
}
