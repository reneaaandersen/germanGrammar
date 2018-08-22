var allNouns = 	[];
var activeNounGroup = allNouns.slice();
var activeNoun = 0;
var nounGroups = {};

// Get each and every tag group that exists for nouns
$.get("getNounGroups.php", function(data, status) {
	if ( data.status == "error" || data.message.length == 0 ) {
		// TODO: Add better error reporting
		console.log("Error while fetching the noun groups.");
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
			console.log("Error while fetching the noun groups.");
		}
		else {
			for ( var index = 0; index < data.message.length; index++ ) {
				allNouns.push([group, data.message[index][0], data.message[index][1], data.message[index][2]]);
			}
		}
		compactNounArray();
	});
}

// Helper function. Used to combine tags for identical nouns
function compactNounArray() {
	var newNounArray = [];

	while ( allNouns.length > 0 ) {
		var noun = allNouns.pop();
		
		for ( var index = allNouns.length-1; index >= 0; index-- ) {		
			// If it matches the danish word, the danish description and the german base word then it's most likely the same word
			if ( allNouns[index][1] == noun[1] && allNouns[index][2] == noun[2] && allNouns[index][3] == noun[3] ) {
				if ( !noun[0].includes(allNouns[index][0]) ) {
					noun[0] += " " + allNouns[index][0];
					allNouns.pop();
				}
			}
		}
		
		newNounArray.push(noun);
	}
	
	allNouns = newNounArray;
}

// Helper function to check if the user input matches a noun or an alternative way of spelling
function checkNoun(userInputSelector, noun) {
	var userInput = $(userInputSelector).val();
	
	// Because we use slashes for alternative spelling we have to check if
	// the user entered one. If not he might get a correct for "Des Hundes/Des Hunds"
	if ( userInput.indexOf("/") != -1 ) {
		setAnimationForElement(userInputSelector, "wrong 1s");
		return false;
	}
	
	// Check each way of spelling
	var nounAlts = noun.split("/");
	for ( var index = 0; index < nounAlts.length; index++ ) {
		// If there is a complete match, we're done
		if ( nounAlts[index] == userInput ) {
			return true;
		}
	}
	
	// No match, no cookie :(
	setAnimationForElement(userInputSelector, "wrong 1s");
	return false;
}

// Helper function to reset noun related games
function nounReset(selector) {
	activeNounGroup = allNouns.slice();
	activeNoun = 0;
	
	$(selector + " > .dropdown > button").text("Alle udsagnsord");
	$(selector).children(".gameButtonStop").click();
}

// Helper function to set the next noun, title and whether or not a field is inactive
function setNextNoun(selector) {
	var oldNoun = activeNoun;
	
	if ( activeNounGroup.length > 1 ) {
		while ( activeNoun == oldNoun ) {
			activeNoun = getRandomArrayIndex(activeNounGroup);
		}
	}
	
	$(selector).children("h5").text(activeNounGroup[activeNoun][1]);
	$(selector).children("h6").text(activeNounGroup[activeNoun][2]);
	
	// Clear all inputs
	clearInputs(selector);
	
	if ( activeNounGroup[activeNoun][4] == "" ) {
		$(selector + " input.nominativSingular").attr("disabled", "disabled");
	}
	if ( activeNounGroup[activeNoun][5] == "" ) {
		$(selector + " input.genitivSingular").attr("disabled", "disabled");
	}
	if ( activeNounGroup[activeNoun][6] == "" ) {
		$(selector + " input.nominativPlural").attr("disabled", "disabled");
	}
	if ( activeNounGroup[activeNoun][7] == "" ) {
		$(selector + " input.dativPlural").attr("disabled", "disabled");
	}
}

//================================
//--------------------------------
// Dropdown handler for noun games
//--------------------------------
//================================
$("#nounTranslation").delegate(".dropdown-item", "click", function(){
	activeNounGroup = [];
	pickActiveGroup($(this), allNouns, activeNounGroup);
});

$("#nounCase").delegate(".dropdown-item", "click", function(){
	activeNounGroup = [];
	pickActiveGroup($(this), allNouns, activeNounGroup);
});

//================================
//--------------------------------
// Start button handler for noun games
//--------------------------------
//================================
$("#nounCase button.gameButtonStart").click(function() {
	setNextNoun("#nounCase");
});

$("#nounTranslation button.gameButtonStart").click(function() {
	setNextNoun("#nounTranslation");
});

//================================
//--------------------------------
// Stop button handler for noun games
//--------------------------------
//================================
$("#nounCase button.gameButtonStop").click(function() {
	activeNoun = 0;
	
	clearInputs("#nounCase");
	
	$(this).siblings("h5").text("");
	$(this).siblings("h6").text("");
	
	$(this).siblings(".gameButtonSkip").addClass("d-none");
});


$("#nounTranslation button.gameButtonStop").click(function() {
	activeNoun = 0;
	
	clearInputs("#nounTranslation");
	
	$(this).siblings("h5").text("");
	$(this).siblings("h6").text("");
	
	$(this).siblings(".gameButtonSkip").addClass("d-none");
});

//================================
//--------------------------------
// Skip button handler for noun games
//--------------------------------
//================================
$("#nounCase button.gameButtonSkip").click(function() {
	setNextNoun("#nounCase");
});

$("#nounTranslation button.gameButtonSkip").click(function() {
	setNextNoun("#nounTranslation");
});

//================================
//--------------------------------
// Check button handler for noun games
//--------------------------------
//================================
$("#nounCase button.gameButtonCheck").click(function() {
	var formGroup = $(this).siblings(".form-group");
	
	var ns = $("#nounCase input.nominativSingular").val();
	var gs = $("#nounCase input.genitivSingular").val();
	var np = $("#nounCase input.nominativPlural").val();
	var dp = $("#nounCase input.dativPlural").val();
	
	var getString  = "validateNoun.php?baseword=" + activeNounGroup[activeNoun][3];
	    getString += "&ns="+ns;
		getString += "&gs="+gs;
		getString += "&np="+np;
		getString += "&dp="+dp;
	
	console.log(getString);
	$.get(getString, function(data, status) {
		if ( data.status == "OK" ) {
			var allCorrect = true;
			
			if ( data.message[0] == 0 ) {
				setAnimationForElement("#nounCase input.nominativSingular", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[1] == 0 ) {
				setAnimationForElement("#nounCase input.genitivSingular", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[2] == 0 ) {
				setAnimationForElement("#nounCase input.nominativPlural", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[3] == 0 ) {
				setAnimationForElement("#nounCase input.dativPlural", "wrong 1s");
				allCorrect = false;
			}
			
			if ( allCorrect ) {
				$("#nounCase button.gameButtonCheck").siblings(".form-group").children("input").each(function () {
					// Don't blink if it's disabled
					if ( $(this).attr("disabled") != "disabled" ) {
						setAnimationForElement(this, "correct 1s");
					}
				});
				$("#nounCase button.gameButtonCheck").addClass("d-none");
				$("#nounCase button.gameButtonNext").removeClass("d-none");
				$("#nounCase button.gameButtonSkip").addClass("d-none");
			}
		}
	});
});

$("#nounTranslation button.gameButtonCheck").click(function() {
	var formGroup = $(this).siblings(".form-group");
	
	var ns = $("#nounTranslation input.nominativSingular").val();
	var np = $("#nounTranslation input.nominativPlural").val();
	
	var getString  = "validateNoun.php?baseword=" + activeNounGroup[activeNoun][3];
	    getString += "&ns="+ns;
		getString += "&np="+np;
	
	console.log(getString);
	$.get(getString, function(data, status) {
		if ( data.status == "OK" ) {
			var allCorrect = true;
			
			if ( data.message[0] == 0 ) {
				setAnimationForElement("#nounTranslation input.nominativSingular", "wrong 1s");
				allCorrect = false;
			}
			if ( data.message[2] == 0 ) {
				setAnimationForElement("#nounTranslation input.nominativPlural", "wrong 1s");
				allCorrect = false;
			}
			
			if ( allCorrect ) {
				$("#nounTranslation button.gameButtonCheck").siblings(".form-group").children("input").each(function () {
					// Don't blink if it's disabled
					if ( $(this).attr("disabled") != "disabled" ) {
						setAnimationForElement(this, "correct 1s");
					}
				});
				$("#nounTranslation button.gameButtonCheck").addClass("d-none");
				$("#nounTranslation button.gameButtonNext").removeClass("d-none");
				$("#nounTranslation button.gameButtonSkip").addClass("d-none");
			}
		}
	});
});

//================================
//--------------------------------
// Reset button handler for noun games
//--------------------------------
//================================
$("#nounCase button.gameButtonReset").click(function() {
	nounReset("#nounCase");
});

$("#nounTranslation button.gameButtonReset").click(function() {
	nounReset("#nounTranslation");
});

//================================
//--------------------------------
// Next button handler for noun games
//--------------------------------
//================================
$("#nounCase button.gameButtonNext").click(function() {
	nextNounHandler($(this), "#nounCase");
});

$("#nounTranslation button.gameButtonNext").click(function() {
	//nextNounHandler($(this), "#nounTranslation");
	activeNoun = nextQuizElement(activeNoun, activeNounGroup, 1, 2, "#nounTranslation");
});

// Helper function for common code for the next buttons
function nextNounHandler(sourceElement, selector) {
	sourceElement.addClass("d-none");
	sourceElement.siblings(".gameButtonCheck").removeClass("d-none");
	
	activeNounGroup.splice(activeNoun, 1);
	
	if ( activeNounGroup.length == 0 ) {
		$("#myModal").modal();
		sourceElement.siblings(".gameButtonReset").click();
	}
	else {
		setNextNoun(selector);
		
		$(selector + " button.gameButtonSkip").removeClass("d-none");
	}
}