var allPrepositions = 	[     
							[ 	"Dativ",		
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

$("#prepositionVerbs .gameButtonReset").click(function(){
	activeVerbGroup = [];
	for ( var index = 0; index < allVerbs.length; index++ ) {
		if ( allVerbs[index][8] != "" ) {
			activeVerbGroup.push(allVerbs[index]);
		}
	}
	
	$(this).siblings(".gameButtonStop").click();
});

$("#prepositionClass .gameButtonReset").click(function(){
	activePrepositionGroup = allPrepositions.slice();
	
	$(this).siblings(".gameButtonStop").click();
});

$("#prepositionVerbs .gameButtonStop").click(function(){
	activePreposition = getRandomArrayIndex(activePrepositionGroup);
	
	$("#prepositionVerbs").children("h5").text("");
	$("#prepositionVerbs").children("h6").text("");
	
	$("#prepositionVerbs input").each(function() {
		$(this).prop('checked', false);
	});
});

$("#prepositionClass .gameButtonStop").click(function(){
	activePreposition = getRandomArrayIndex(activePrepositionGroup);
	
	$("#prepositionClass").children("h5").text("");
	$("#prepositionClass").children("h6").text("");
	
	$("#prepositionClass input").each(function() {
		$(this).prop('checked', false);
	});
});

$("#prepositionClass .gameButtonStart").click(function(){
	$("#prepositionClass").children("h5").text(activePrepositionGroup[activePreposition][3]);
	$("#prepositionClass").children("h6").text("");
	
	$("#prepositionClass input").each(function() {
		$(this).prop('checked', false);
	});
});

$("#prepositionVerbs .gameButtonStart").click(function(){
	$("#prepositionVerbs").children("h5").text(activeVerbGroup[activeVerb][3]);
	$("#prepositionVerbs").children("h6").text("");
	
	$("#prepositionVerbs input").each(function() {
		$(this).prop('checked', false);
	});
});

$("#prepositionVerbs .gameButtonCheck").click(function(){
	var isCorrect = true;
	switch (activePrepositionGroup[activePreposition][8]) {
		case "Dativ":
			if ( $("#prepositionVerbs .dativPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
		case "Akkusativ":
			if ( $("#prepositionVerbs .akkusativPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
		case "Genitiv":
			if ( $("#prepositionVerbs .genitivPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
		case "Combined":
			if ( $("#prepositionVerbs .combinedPreposition:checked").val() != "on" ) {
				isCorrect = false;
			}
			break;
	}
	if ( isCorrect ) {
		setAnimationForElement($("#prepositionVerbs :checked").parent().parent(), "correct 1s");
		$(this).siblings(".gameButtonNext").removeClass("d-none");
		$(this).siblings(".gameButtonSkip").addClass("d-none");
		$(this).addClass("d-none");
	}
	else {
		setAnimationForElement($("#prepositionVerbs :checked").parent().parent(), "wrong 1s");
	}
});


$("#prepositionClass .gameButtonCheck").click(function(){
	var isCorrect = true;
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
		setAnimationForElement($("#prepositionClass :checked").parent().parent(), "correct 1s");
		$(this).siblings(".gameButtonNext").removeClass("d-none");
		$(this).siblings(".gameButtonSkip").addClass("d-none");
		$(this).addClass("d-none");
	}
	else {
		setAnimationForElement($("#prepositionClass :checked").parent().parent(), "wrong 1s");
	}
});

$("#prepositionVerbs .gameButtonNext").click(function(){	
	activeVerbGroup.splice(activeVerb, 1);
	
	if ( activeVerbGroup.length == 0 ) {
		alert("Congratulations you have done it!!");
		$(this).siblings(".gameButtonReset").click();
		return;
	}
	
	var oldPreposition = activeVerb;
	
	if ( activeVerbGroup.length > 1 || activeVerb >= activeVerbGroup.length ) {
		while ( activeVerb == oldPreposition ) {
			activeVerb = getRandomArrayIndex(activeVerbGroup);
		}
	}
	
	$("#prepositionVerbs").children("h5").text(activeVerbGroup[activeVerb][3]);
	$("#prepositionVerbs").children("h6").text("");
	
	$("#prepositionVerbs input").each(function() {
		$(this).prop('checked', false);
	});
	
	$(this).siblings(".gameButtonCheck").removeClass("d-none");
	$(this).siblings(".gameButtonSkip").removeClass("d-none");
	$(this).addClass("d-none");
});

$("#prepositionClass .gameButtonNext").click(function(){	
	activePrepositionGroup.splice(activePreposition, 1);
	
	if ( activePrepositionGroup.length == 0 ) {
		$("#myModal").modal();
		$(this).siblings(".gameButtonReset").click();
		return;
	}
	
	var oldPreposition = activePreposition;
	
	if ( activePrepositionGroup.length > 1 || activePreposition >= activePrepositionGroup.length ) {
		while ( activePreposition == oldPreposition ) {
			activePreposition = getRandomArrayIndex(activePrepositionGroup);
		}
	}
	
	$("#prepositionClass").children("h5").text(activePrepositionGroup[activePreposition][3]);
	$("#prepositionClass").children("h6").text("");
	
	$("#prepositionClass input").each(function() {
		$(this).prop('checked', false);
	});
	
	$(this).siblings(".gameButtonCheck").removeClass("d-none");
	$(this).siblings(".gameButtonSkip").removeClass("d-none");
	$(this).addClass("d-none");
});

$("#prepositionVerbs .gameButtonSkip").click(function(){
	var oldVerb = activeVerb;
	
	if ( activeVerbGroup.length > 1 ) {
		while ( activeVerb == oldVerb ) {
			activeVerb = getRandomArrayIndex(activeVerbGroup);
		}
	}
	
	$("#prepositionVerbs").children("h5").text(activeVerbGroup[activeVerb][3]);
	$("#prepositionVerbs").children("h6").text("");
	
	$("#prepositionVerbs input").each(function() {
		$(this).prop('checked', false);
	});
});

$("#prepositionClass .gameButtonSkip").click(function(){
	var oldPreposition = activePreposition;
	
	if ( activePrepositionGroup.length > 1 ) {
		while ( activePreposition == oldPreposition ) {
			activePreposition = getRandomArrayIndex(activePrepositionGroup);
		}
	}
	
	$("#prepositionClass").children("h5").text(activePrepositionGroup[activePreposition][3]);
	$("#prepositionClass").children("h6").text("");
	
	$("#prepositionClass input").each(function() {
		$(this).prop('checked', false);
	});
});