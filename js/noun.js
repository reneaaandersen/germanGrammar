var allNouns = 	[];
var activeNounGroup = allNouns.slice();
var activeNoun = 0;
var nounGroups = {};



// Get each and every tag group that exists for nouns
$.get("getNounGroups.php", function(data, status) {
	if ( data.status == "error" || data.message.length == 0 ) {
		$("#errorModal .modal-body").text(data.message);
		$("#errorModal").modal();
	}
	else {	
		for ( var index = 0; index < data.message.length; index++ ) {
			fetchNouns(data.message[index]);
			nounGroups[data.message[index]] = 1;
			
			$("#nounCase .dropdown-menu").append('<a class="dropdown-item" href="#">' + data.message[index] + '</a>');
			$("#nounTranslation .dropdown-menu").append('<a class="dropdown-item" href="#">' + data.message[index] + '</a>');
		}
	}
});



// Helper function. Used per tag group to fetch all nouns that matches it
function fetchNouns(group) {
	$.get("getNounList.php?limit=100&tags=" + group, function(data, status) {
		if ( data.status == "error" || data.message.length == 0 ) {
			$("#errorModal .modal-body").text(data.message);
			$("#errorModal").modal();
		}
		else {
			for ( var index = 0; index < data.message.length; index++ ) {
				var hadMatch = false;
				
				// Check if there is already an identical noun with different tags and merge their tags if there is
				for ( var nounIndex = 0; nounIndex < allNouns.length; nounIndex++ ) {
					if ( data.message[index][0] == allNouns[nounIndex][1] &&  data.message[index][1] == allNouns[nounIndex][2] &&  data.message[index][2] == allNouns[nounIndex][3] ) {
						if ( !allNouns[nounIndex][0].includes(group) ) {
							allNouns[nounIndex][0] += " " + group;
						}
						hadMatch = true;
						break;
					}
				}
				if ( !hadMatch ) {
					var noun = [group, data.message[index][0], data.message[index][1], data.message[index][2], true, true];
					
					if ( data.message[index][4] == "—" ) {
						noun[4] = false;
					}
					if ( data.message[index][5] == "—" ) {
						noun[5] = false;
					}
					
					allNouns.push(noun);
				}
			}
		}
	});
}

$("#nounCase").delegate("", "keypress", function(event) {
	if ( event.which == 13 ) {
		if ( $("#nounCase button.gameButtonCheck").hasClass("d-none") ) {
			$("#nounCase button.gameButtonNext").click();
		}
		if ( $("#nounCase button.gameButtonNext").hasClass("d-none") ) {
			$("#nounCase button.gameButtonCheck").click();
		}
	}
});

$("#nounCase").delegate("input", "keypress", function(event) {
	if ( event.which == 13 ) {
		if ( $("#nounCase button.gameButtonCheck").hasClass("d-none") ) {
			$("#nounCase button.gameButtonNext").click();
		}
		if ( $("#nounCase button.gameButtonNext").hasClass("d-none") ) {
			$("#nounCase button.gameButtonCheck").click();
		}
	}
});

// Check button handler for nounCase quiz
$("#nounCase button.gameButtonCheck").click(function() {
	// Each get-key/selector pair
	var checkNounSelectors = [ 	[ "&ns=", "#nounCase input.nominativSingular"],
								[ "&gs=", "#nounCase input.genitivSingular"],
								[ "&np=", "#nounCase input.nominativPlural"],
								[ "&dp=", "#nounCase input.dativPlural"]];
	
	// Send it
	$.get(formGetRequest("validateNoun.php", activeNounGroup[activeNoun][3], checkNounSelectors), function(data, status) {
		if ( data.status == "OK" ) {
			var allCorrect = true;
			
			// Check if the user input was correct, and if it isn't indicate it with the "wrong" animation
			for ( var index = 0; index < checkNounSelectors.length; index++ ) {
				if ( data.message[index] == 0 && activeNounGroup[activeNoun][4+Math.floor(index/2)] ) {
					setAnimationForElement(checkNounSelectors[index][1], "wrong 1s");
					allCorrect = false;
				}
			}
			
			if ( allCorrect ) {
				correctWordsHandler("#nounCase")
			}
		}
	});
});



// Check button handler for nounTranslation quiz
$("#nounTranslation button.gameButtonCheck").click(function() {
	// Each get-key/selector pair
	var checkNounSelectors = [ 	[ "&ns=", "#nounTranslation input.nominativSingular"],
								[ "&np=", "#nounTranslation input.nominativPlural"]];
	
	$.get(formGetRequest("validateNoun.php", activeNounGroup[activeNoun][3], checkNounSelectors), function(data, status) {
		if ( data.status == "OK" ) {
			var allCorrect = true;
			
			if ( data.message[0] == 0 && activeNounGroup[activeNoun][4] ) {
				setAnimationForElement("#nounTranslation input.nominativSingular", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[2] == 0 && activeNounGroup[activeNoun][5] ) {
				setAnimationForElement("#nounTranslation input.nominativPlural", "wrong 1s");
				allCorrect = false;
			}
			
			if ( allCorrect ) {
				correctWordsHandler("#nounTranslation");
			}
		}
	});
});


// Used to disable the text input fields that does not have a singular or plural
function disableNounInputs(selector) {
	// Disable the input for nouns that has no singular/plural
	if ( activeNounGroup[activeNoun][4] == false ) {
		$(selector + " input.nominativSingular").attr("disabled", "enabled");
		$(selector + " input.genitivSingular").attr("disabled", "enabled");
	}
	if ( activeNounGroup[activeNoun][5] == false ) {
		$(selector + " input.nominativPlural").attr("disabled", "enabled");
		$(selector + " input.dativPlural").attr("disabled", "enabled");
	}
}



// Dropdown handler for noun games
function nounGroupClick(event) {
	activeNounGroup = [];
	pickActiveGroup(event.target, event.data.selector, allNouns, activeNounGroup);
}
$("#nounTranslation").delegate(".dropdown-item", "click", {selector: "#nounTranslation"}, nounGroupClick);
$("#nounCase").delegate(".dropdown-item", "click", {selector: "#nounCase"}, nounGroupClick);



// Stop button handler for noun games
function nounButtonStop(event) {
	activeNoun = nextQuizElement(activeNoun, activeNounGroup, -1, -1, event.data.selector);
}
$("#nounCase button.gameButtonStop").click({selector: "#nounCase"}, nounButtonStop);
$("#nounTranslation button.gameButtonStop").click({selector: "#nounTranslation"}, nounButtonStop);



// Start button handler for noun games
function nounButtonStart(event) {
	activeNoun = nextQuizElement(activeNoun, activeNounGroup, 1, 2, event.data.selector);
	disableNounInputs(event.data.selector);
}
$("#nounCase button.gameButtonStart").click({selector: "#nounCase"}, nounButtonStart);
$("#nounTranslation button.gameButtonStart").click({selector: "#nounTranslation"}, nounButtonStart);



// Skip button handler for noun games
function nounButtonSkip(event) {
	activeNoun = nextQuizElement(activeNoun, activeNounGroup, 1, 2, event.data.selector);
	disableNounInputs(event.data.selector);
}
$("#nounCase button.gameButtonSkip").click({selector: "#nounCase"}, nounButtonSkip);
$("#nounTranslation button.gameButtonSkip").click({selector: "#nounTranslation"}, nounButtonSkip);



// Helper function to reset noun related games
function nounButtonReset(event) {
	activeNounGroup = allNouns.slice();
	
	$(event.data.selector + " > .dropdown > button").text("Alle navneord");
	$(event.data.selector).children(".gameButtonStop").click();
}
$("#nounCase button.gameButtonReset").click({selector: "#nounCase"}, nounButtonReset);
$("#nounTranslation button.gameButtonReset").click({selector: "#nounTranslation"}, nounButtonReset);



// Next button handler for noun games
function nounButtonNext(event) {
	if ( !commonButtonNext(event.data.selector, activeNoun, activeNounGroup) ) {
		activeNoun = nextQuizElement(activeNoun, activeNounGroup, 1, 2, event.data.selector);
		disableNounInputs(event.data.selector);
	}
}
$("#nounCase button.gameButtonNext").click({selector: "#nounCase"}, nounButtonNext);
$("#nounTranslation button.gameButtonNext").click({selector: "#nounTranslation"}, nounButtonNext);