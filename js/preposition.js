// All the prepositions that is known to the human kind
// (or what can be found within 15 minutes of googling :)
// FIXME?: Why is the case set twice for an element?
// ------> The first element is not used, but the effort to remove it is much larger than the need for removal
// NOTE: As it is currently the danish translations are not needed, however if a
//       preposition translation quiz is added they might be.
var allPrepositions = 	[	[ 	"Dativ",		
								"Fra",				"noget",				"Aus",				"Dativ"],
							[ 	"Dativ",		
								"Undtagen",			"Uden for (fare)",		"Außer",			"Dativ"],
							[ 	"Dativ",		
								"Fra",				"noget",				"Bei",				"Dativ"],
							[ 	"Dativ",		
								"Fra",				"noget",				"Gegenüber",		"Dativ"],
							[ 	"Dativ",		
								"Fra",				"noget",				"Mit",				"Dativ"],
							[ 	"Dativ",		
								"Fra",				"noget",				"Nach",				"Dativ"],
							[ 	"Dativ",		
								"Fra",				"noget",				"Seit",				"Dativ"],
							[ 	"Dativ",		
								"Fra",				"noget",				"Von",				"Dativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Bis",				"Akkusativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Durch",			"Akkusativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Für",				"Akkusativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Gegen",			"Akkusativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Ohne",				"Akkusativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Um",				"Akkusativ"],
							[ 	"Akkusativ",		
								"Fra",				"noget",				"Wider",			"Akkusativ"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Anstatt",			"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Außerhalb",		"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Diesseits",		"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Innerhalb",		"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Jenseits",			"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Statt",			"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Trotz",			"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Unweit",			"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Während",			"Genitiv"],
							[ 	"Genitiv",		
								"Fra",				"noget",				"Wegen",			"Genitiv"],
							[ 	"Combined",		
								"Fra",				"noget",				"An",				"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Auf",				"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Entlang",			"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Hinter",			"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"In",				"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Neben",			"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Über",				"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Unter",			"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Vor",				"Combined"],
							[ 	"Combined",		
								"Fra",				"noget",				"Zwischen",			"Combined"],
						];
var activePrepositionGroup = allPrepositions.slice();
var activePreposition = 0;

// Handler for whenever the game reset button is pressed
$("#prepositionClass .gameButtonReset").click(function(){
	activePrepositionGroup = allPrepositions.slice();
	$(this).siblings(".gameButtonStop").click();
});

// Handler for whenever the game stop button is pressed
$("#prepositionClass .gameButtonStop").click(function(){
	nextQuizElement(activePreposition, activePrepositionGroup, -1, -1, "#prepositionClass");
});

// Handler for whenever the game start button is pressed
$("#prepositionClass .gameButtonStart").click(function(){
	activePreposition = nextQuizElement(activePreposition, activePrepositionGroup, 3, -1, "#prepositionClass");
});

// Handler for whenever the game check button is pressed
$("#prepositionClass .gameButtonCheck").click(function(){
	var isCorrect = true;
	
	// Check based on the case in the array element
	switch (activePrepositionGroup[activePreposition][4]) {
		case "Dativ":
			if ( $("#prepositionClass .dativPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
		case "Akkusativ":
			if ( $("#prepositionClass .akkusativPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
		case "Genitiv":
			if ( $("#prepositionClass .genitivPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
		case "Combined":
			if ( $("#prepositionClass .combinedPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
	}
	if ( isCorrect ) {
		// Flash all the elements when the correct choice is picked
		setAnimationForElement($("#prepositionClass :checked").parent().parent(), "correct 1s");
		$(this).siblings(".gameButtonNext").removeClass("d-none");
		$(this).siblings(".gameButtonSkip").addClass("d-none");
		$(this).addClass("d-none");
	}
	else {
		// Flash the wrong element only when it's picked (else it would be easy to see which one is correct)
		setAnimationForElement($("#prepositionClass :checked").parent().parent(), "wrong 1s");
	}
});

// Handler for whenever the game next button is pressed
$("#prepositionClass .gameButtonNext").click(function(){
	if ( !commonButtonNext("#prepositionClass", activePreposition, activePrepositionGroup) ) {
		activePreposition = nextQuizElement(activePreposition, activePrepositionGroup, 3, -1, "#prepositionClass");
	}
});

// Handler for whenever the game skip button is pressed
$("#prepositionClass .gameButtonSkip").click(function(){
	activePreposition = nextQuizElement(activePreposition, activePrepositionGroup, 3, -1, "#prepositionClass");
});

// Enter and escape handler for preposition quizzes
$("#prepositionClass").delegate("", "keypress", {selector: "#prepositionClass"}, escapeHandler);