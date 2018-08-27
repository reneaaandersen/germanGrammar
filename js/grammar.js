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
	var hadFocus = oldElement.is(":focus");
	var newElement = $(selector).clone();
	oldElement.before(newElement);
	oldElement.remove();
	
	// If the old element had focus, we can set it for the new element too
	if ( hadFocus && newElement.attr("type") == "text" ) {
		newElement.focus();
	
		// Reinsert the old elements text to move the cursor to the end
		// Actual correct positioning of the cursor is browser dependent
		var oldText = newElement.val();
		newElement.val("");
		newElement.val(oldText);
	}
	newElement.css("animation", animation);
}

/* getRandomNumber
 * - max is the limit of the numbers generated and is not inclusive
 */
function getRandomNumber(max) {
	return Math.floor((Math.random()*max));
}

/* getRandomArrayElement
 * > Returns 	A random array element
 * - array 		The array from which we get the element
 */
function getRandomArrayIndex(array) {
	return getRandomNumber(array.length);
}

/* getRandomArrayElement
 * > Returns 	A random array element
 * - array 		The array from which we get the element
 */
function getRandomArrayElement(array) {
	return array[getRandomNumber(array.length)];
}

/* clearInputs: Clears all the inputs of the given quiz container
 * > Returns	Nothing
 * - selector 	The jQuery selector for the quiz container 
 */
function clearInputs(selector) {
	var firstElement = null;
	
	$(selector + " input").each(function() {
		if ( firstElement == null ) {
			firstElement = $(this);
		}
		$(this).prop('checked', false);
		// Do NOT remove the val of a radio/checkbox it'll make you sad
		if ( $(this).attr('type') == 'text' ) {
			$(this).removeAttr("disabled");
			$(this).val("");
		}		
	});
	if ( firstElement != null && firstElement.attr('type') == 'text' ) {
		if ( $(selector + " .gameButtonStart").hasClass("d-none") ) {
			firstElement.focus();
		}
		else {
			$(selector + " .gameButtonStart").focus();
		}
	}
}

/* pickActiveGroup: Common code for changing the sub-group of the quiz
 * > Returns 			Nothing
 * - sourceElement 		The element that the user clicked to trigger the change of active group
 * - sourceArray 		The array containing all the words (nouns/verbs) and their tags
 * - destinationArray 	The array that all the words will go into if they match the tag
 */
function pickActiveGroup(sourceElement, selector, sourceArray, destinationArray) {
	var groupTag = $(sourceElement).text();
	
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
	
	$(selector + " .dropdown button").text(groupTag);
	$(selector + " button.gameButtonStop").click();
}

/* nextQuizElement: Picks the next element from the list and sets the correct sub-titles
 * > Returns 			The next element from the list
 * - currentElement		The currently selected element
 * - allElements		A list of all elements to pick from
 * - titleIndex			The index in the element array where the title is located, -1 for blank
 * - descriptionIndex	The index in the element array where the description is located, -1 for blank
 * - containerSelector	A selector for the parent quiz container
 */
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
	
	clearInputs(containerSelector);
	
	return newElement;
}

/* commonButtonNext: Common code for next button handlers
 * > Returns 		True if we used all the words in the list, false if we didn't
 * - selector		The selector of the parent quiz container
 * - activeElement	The element in the activeGroup we need to remove
 * - activeGroup	The group to remove the active element from
 */
function commonButtonNext(selector, activeElement, activeGroup) {
	$(selector + " .gameButtonNext").addClass("d-none");
	$(selector + " .gameButtonCheck").removeClass("d-none");
	
	activeGroup.splice(activeElement, 1);
	
	if ( activeGroup.length == 0 ) {
		$("#myModal").modal();
		$(selector + " .gameButtonReset").click();
		return true;
	}
	else {
		$(selector + " .gameButtonSkip").removeClass("d-none");
	}
	return false;
}

/* escapeHandler: Common keypress handler 
 * > Returns	Nothing
 * - event		The event data (selector must be set)
 */
function escapeHandler(event) {
	if ( event.key == "Escape" ) {
		console.log(event.data.selector + " button.gameButtonStop");
		$(event.data.selector + " button.gameButtonStop").click();
	}
	if ( event.which == 13 ) {
		if ( $(event.data.selector + " button.gameButtonCheck").hasClass("d-none") && $(event.data.selector + " button.gameButtonStart").hasClass("d-none") ) {
			$(event.data.selector + " button.gameButtonNext").click();
		}
		if ( $(event.data.selector + " button.gameButtonNext").hasClass("d-none") && $(event.data.selector + " button.gameButtonStart").hasClass("d-none") ) {
			$(event.data.selector + " button.gameButtonCheck").click();
		}
	}
}

/* correctVebHandler: Common code for events that happen on a correct word 
 * > Returns	Nothing
 * - selector   The selector of the quiz container
 */
function correctWordsHandler(selector) {
	// Show the "corret" animation for each input field
	$(selector + " .form-group").children("input").each(function () {
		// Check that it's not a disabled field
		if ( $(this).attr("disabled") == undefined ) {
			setAnimationForElement(this, "correct 1s");
		}
	});
	
	// Show check and skip buttons
	$(selector + " .gameButtonCheck").addClass("d-none");
	$(selector + " .gameButtonSkip").addClass("d-none");
	
	// Hide the next button
	$(selector + " .gameButtonNext").removeClass("d-none");
}

/* formGetRequest: Forms a get request used when fetching words from the database
 * > Returns    A string representing the get request
 * - page 		The url to send the get request to
 * - baseword 	The base form of the word we want to request from the database
 * - selectors  An array of two element arrays, first element describing the get key needed,
 *              second descriping the selector of the element we get the value from
 */
function formGetRequest(page, baseword, selectors) {
	var getString  = page + "?baseword=" + baseword;
	for ( var index = 0; index < selectors.length; index++ ) {
		getString += selectors[index][0]+$(selectors[index][1]).val();
	}
	
	return getString;
}