// Overall start button click 
$(".gameButtonStart").click(function() {
	$(this).siblings(".gameButtonStop").removeClass("d-none");
	$(this).siblings(".gameButtonCheck").removeClass("d-none");
	$(this).siblings(".gameButtonSkip").removeClass("d-none");
	$(this).addClass("d-none");
});

// Overall stop button click
$(".gameButtonStop").click(function() {
	$(this).siblings(".gameButtonStart").removeClass("d-none");
	$(this).siblings(".gameButtonCheck").addClass("d-none");
	$(this).siblings(".gameButtonNext").addClass("d-none");
	$(this).siblings(".gameButtonSkip").addClass("d-none");
	$(this).addClass("d-none");
});

$(".nav .dropdown-item").click(function() {
	$(".container > .container").each(function(){
		$(this).addClass("d-none");
		clearInputs("#"+$(this).attr("id"));
	});
	
	$("#" + $(this).attr("data-container")).removeClass("d-none");
	$("#" + $(this).attr("data-container") + " button.gameButtonReset").click();
});

$(".container > .container").each(function(){
	$(this).addClass("d-none");
});
$("#homeContainer").removeClass("d-none");

$(".gameButtonCheck").each(function() {
	$(this).addClass("d-none");
});
$(".gameButtonNext").each(function() {
	$(this).addClass("d-none");
});
$(".gameButtonReset").each(function() {
	$(this).addClass("d-none");
});
$(".gameButtonStop").each(function() {
	$(this).addClass("d-none");
});



// Helper function cuz CSS animation restart is tough
function setAnimationForElement(selector, animation) {
	var oldElement = $(selector);
	var newElement = $(selector).clone();
	oldElement.before(newElement);
	oldElement.remove();
	newElement.css("animation", animation);
}

function getRandomNumber(min, max) {
	return Math.floor((Math.random()*max) + min);
}

function getRandomNumber(max) {
	return Math.floor((Math.random()*max));
}

function getRandomArrayIndex(array) {
	return getRandomNumber(array.length);
}

function getRandomArrayElement(array) {
	return array[getRandomNumber(array.length)];
}

function clearInputs(selector) {
	$(selector).children(".form-group").children("input").each(function () {
		$(this).val("");
		$(this).removeAttr("disabled");
		$(this).removeAttr("style");
		$(this).prop('checked', false)
	});
}

function pickActiveGroup(sourceElement, sourceArray, destinationArray) {
	var groupTag = sourceElement.text();
	
	// Go through all the nouns in the list ..
	for ( var i = 0; i < sourceArray.length; i++ ) {
		// .. split the tags for the specific noun ..
		var tags = sourceArray[i][0].split(" ");
		for ( var tagCtr = 0; tagCtr < tags.length; tagCtr++ ) {
			// .. and check if it matches the tag the user selected ..
			if (tags[tagCtr] == groupTag ) {
				// .. if it does add it to the noun list
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

$(".gameButtonFlag").click(function() {
	var velocityX = 10-getRandomNumber(20);
	var velocityY = 2-getRandomNumber(10);
	var velocityRotation = 5-getRandomNumber(10);
	var width = (getRandomNumber(20)+1)*10;
	var height = width/6.0*4.0;
	var posX = window.innerWidth / 2;
	var posY = 100;
	$("body").append("<img src='images/flag.png' data-velocityRotation='" + velocityRotation + "' data-rotation='" + 0 + "' data-velocityX='" + velocityX + "' data-velocityY='" + velocityY + "' class='celebrationFlag' style='float: left; z-index: 0; position: absolute; top: "+posY+"px; left: "+posX+"px; width: "+width+"px; height: "+height+"px; transform: rotate(20deg);'>");
});

function flagThingie() {
	$(".celebrationFlag").each(function(){
		var topPositionAsString = $(this).css('top');
		var topPositionAsNumber = parseFloat(topPositionAsString.slice(0, topPositionAsString.indexOf("px")));
		var velocityY = parseFloat($(this).attr('data-velocityY'));
		//console.log("tfeop: " + $(this).attr('data-velocityY'));
						$(this).attr('data-velocityY', velocityY+0.1);
		
		//console.log("top: " + topPositionAsNumber + " " + velocityY);
		$(this).css('top', (topPositionAsNumber + velocityY) + "px");
		
		var leftPositionAsString = $(this).css('left');
		var leftPositionAsNumber = parseFloat(leftPositionAsString.slice(0, leftPositionAsString.indexOf("px")));
		
		var velocityX = parseFloat($(this).attr('data-velocityX'));
		//console.log(leftPositionAsNumber);
		$(this).css('left', (leftPositionAsNumber + velocityX) + "px");
		
		var velocityRotation = parseFloat($(this).attr('data-velocityRotation'));
		var rotation = parseFloat($(this).attr('data-rotation'));
		
		rotation += velocityRotation;
		
		$(this).attr('data-rotation', rotation)
		
		$(this).css({'transform' : 'rotate('+ rotation +'deg)'});
		
		if ( topPositionAsNumber > 1000 ) {
			console.log("removed?");
			$(this).remove();
		}
	});
	
	flagLoopTimer = window.setTimeout(flagThingie, 20);
}

// var flagLoopTimer = window.setTimeout(flagThingie, 20);
// var flagDisplayTimer = window.setTimeout(spawnFlag, 20);

function spawnFlag() {
	//console.log("Spawn? " + $('#myModal').is(':visible'));
	if ( $('#myModal').is(':visible') ) {
		$(".gameButtonFlag").click();
	}
	flagDisplayTimer = window.setTimeout(spawnFlag, getRandomNumber(1000)+50);
}