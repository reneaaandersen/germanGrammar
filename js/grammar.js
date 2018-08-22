// Handler for the navigation bar
$(".nav .dropdown-item").click(function() {
	// Hide all the quiz containers (and clear their input fields)
	$(".container > .container").each(function(){
		$(this).addClass("d-none");
		clearInputs("#"+$(this).attr("id"));
	});
	
	// Because we hid all the quiz containers, we need to unhide the one the user selected
	$("#" + $(this).attr("data-container")).removeClass("d-none");
	
	// Perform a reset of the quiz selected
	$("#" + $(this).attr("data-container") + " button.gameButtonReset").click();
});

// Hide all the quiz containers
$(".container > .container").each(function(){
	$(this).addClass("d-none");
});

// Display the welcome page (because all the containers were hidden :)
$("#homeContainer").removeClass("d-none");

// Common handler for whenever a start button is pressed
$(".gameButtonStart").click(function() {
	$(this).siblings(".gameButtonStop").removeClass("d-none");
	$(this).siblings(".gameButtonCheck").removeClass("d-none");
	$(this).siblings(".gameButtonSkip").removeClass("d-none");
	$(this).addClass("d-none");
});

// Common handler for whenever a stop button is pressed
$(".gameButtonStop").click(function() {
	$(this).siblings(".gameButtonStart").removeClass("d-none");
	$(this).siblings(".gameButtonCheck").addClass("d-none");
	$(this).siblings(".gameButtonNext").addClass("d-none");
	$(this).siblings(".gameButtonSkip").addClass("d-none");
	$(this).addClass("d-none");
});

// Sets every check button as hidden by default
$(".gameButtonCheck").each(function() {
	$(this).addClass("d-none");
});

// Sets every next button as hidden by default
$(".gameButtonNext").each(function() {
	$(this).addClass("d-none");
});

// Sets every reset button as hidden by default
$(".gameButtonReset").each(function() {
	$(this).addClass("d-none");
});

// Sets every stop button as hidden by default
$(".gameButtonStop").each(function() {
	$(this).addClass("d-none");
});

/* setAnimationForElement
 * - selector is the selector for the element to be animated
 * - animation is the animation to be set
 * NOTE: This will clone the element and delete the original in order to trigger
 *       the animation if the same animation is applied multiple times.
 */
function setAnimationForElement(selector, animation) {
	var oldElement = $(selector);
	var newElement = $(selector).clone();
	oldElement.before(newElement);
	oldElement.remove();
	newElement.css("animation", animation);
}

/* getRandomNumber
 * - max is the limit of the numbers generated and is not inclusive
 */
function getRandomNumber(max) {
	return Math.floor((Math.random()*max));
}

/* getRandomArrayIndex
 * - array is the array from which we get the index
 */
function getRandomArrayIndex(array) {
	return getRandomNumber(array.length);
}

/* getRandomArrayElement
 * - array is the array from which we get the element
 */
function getRandomArrayElement(array) {
	return array[getRandomNumber(array.length)];
}

/* clearInputs
 * - selector is the jQuery selector for the quiz container 
 */
function clearInputs(selector) {
	$(selector).children(".form-group").children("input").each(function () {
		$(this).val("");		
		$(this).removeAttr("disabled");			// If it was disabled clear it. This could be the case for nouns with no plural for example.
		//$(this).prop('checked', false)		// We can reuse this function to clear the prepositions checkboxes too
	});
}

/* pickActiveGroup
 * - sourceElement is the element that the user clicked to trigger the change of active group
 * - sourceArray is the array containing all the words (nouns/verbs) and their tags
 * - destinationArray is the array that all the words will go into if they match the tag
 */
function pickActiveGroup(sourceElement, sourceArray, destinationArray) {
	var groupTag = sourceElement.text();
	
	// Go through all the words in the list ..
	for ( var i = 0; i < sourceArray.length; i++ ) {
		// .. split the tags for the specific word ..
		var tags = sourceArray[i][0].split(" ");
		for ( var tagCtr = 0; tagCtr < tags.length; tagCtr++ ) {
			// .. and check if it matches the tag the user selected ..
			if (tags[tagCtr] == groupTag ) {
				// .. if it does add it to the word list
				destinationArray.push(sourceArray[i]);
			}
		}
	}
	
	// Make the drop-down button show the selected group
	sourceElement.parent().siblings("button").text(groupTag);
	
	// And use the stop button to reset back to a known state
	//$("#nounTranslation button.gameButtonStop").click();
	sourceElement.parent().parent().siblings(".gameButtonStop").click();
}

// The most generalized set new element function 
function nextQuizElement(currentElement, allElements, titleIndex, descriptionIndex, containerSelector) {
	var newElement = currentElement;
	
	if ( allElements.length > 1 || newElement >= allElements.length ) {
		while ( currentElement == newElement ) {
			newElement = getRandomArrayIndex(allElements);
		}
	}		
	
	if ( titleIndex == -1 ) {
		$(containerSelector).children("h5").text("");
	}
	else {
		$(containerSelector).children("h5").text(allElements[newElement][titleIndex]);
	}
	
	if ( descriptionIndex == -1 ) {
		$(containerSelector).children("h6").text("");
	}
	else {
		$(containerSelector).children("h6").text(allElements[newElement][descriptionIndex]);
	}
	
	$(containerSelector + " input").each(function() {
		$(this).prop('checked', false);
		// Do NOT remove the val of a radio/checkbox it'll make you sad
		if ( $(this).prop('type') == 'text' ) {
			$(this).removeAttr("disabled");
			$(this).val("");
		}		
	});
	
	return newElement;
}