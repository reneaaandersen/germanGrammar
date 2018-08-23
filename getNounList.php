<?php
	// Ensure proper encoding, else we will be sad
	header('Content-Type: application/json; charset=utf-8');
	
	include_once 'config.php';
	
	define("MAX_LIMIT_FOR_QUERY", 100);				// Max limit is 100

	$limit = 0;
	
	// Test if GET parameter 'limit' is a valid number
	if ( !isset($_GET['limit']) OR !is_numeric($_GET['limit']) ) {
		echo '{ "status": "error", "message": "Invalid limit." }';
		exit();
	}
	
	$limit = intval($_GET['limit']);
	
	// Ensure that we don't query too high number
	if ( $limit > MAX_LIMIT_FOR_QUERY ) {
		$limit = MAX_LIMIT_FOR_QUERY;
	}
	
	if ( $limit < 0 ) {
		echo '{ "status": "error", "message": "Invalid limit." }';
		exit();
	}
	
	// Attempt to connect to the database
	$connection = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);
	if ( $connection->connect_error ) {
		echo '{ "status": "error", "message": "Unable to connect to database"}';
		exit();
	}
	
	// Set the charset that we use when communicating with the database (or we will be even more sad)
	$connection->set_charset("utf8mb4");
	$query = "";
	
	// Test if GET parameter 'tags' is valid
	if ( !isset($_GET['tags']) || strlen($_GET['tags']) == 0 ) {
		$query = "SELECT DISTINCT * from nouns INNER JOIN nounstotags ON nounstotags.nounID = nouns.id INNER JOIN tags ON tags.tagID = nounstotags.tagID ORDER BY nouns.base LIMIT " . $limit;
	}
	else {
		// Seperate the list with quotes
		$tagsWithQuotes = "\"";
		foreach (explode(",", $_GET['tags']) as $tag) {
			$tagsWithQuotes = $tagsWithQuotes . mysqli_real_escape_string($connection, $tag) . "\", \"";
		}
		// Remove the last quote and comma
		$tagsWithQuotes = substr($tagsWithQuotes, 0, strlen($tagsWithQuotes)-3);
		
		// Form the query
		$tagsWithQuotes = $tagsWithQuotes;
		$query = "SELECT DISTINCT * from nouns INNER JOIN nounstotags ON nounstotags.nounID = nouns.id INNER JOIN tags ON tags.tagID = nounstotags.tagID AND tags.tagDescription IN (" . $tagsWithQuotes . ") ORDER BY nouns.base LIMIT " . $limit;
	}

	// Perform the query
	$result = $connection->query($query);
	
	// Test to make sure that no error occured.
	if ( !$result ) {
		echo '{ "status": "error", "message": "An error ocurred while querying the database.' . $query . '" }';
		exit();
	}
	
	// Form the JSON array to send to the user
	$message = '';
	if ( $result->num_rows > 0 ) {
		while ( $row = $result->fetch_assoc()) {
			$message = $message . '[';
			$message = $message . '"' . $row['danish'] . '",';
			$message = $message . '"' . $row['danishDescription'] . '",';
			$message = $message . '"' . $row['base'] . '",';
			$message = $message . '"' . $row['nominativSingular'] . '",';
			$message = $message . '"' . $row['genitivSingular'] . '",';
			$message = $message . '"' . $row['nominativPlural'] . '",';
			$message = $message . '"' . $row['dativPlural'] . '"';
			$message = $message . '], ';
		}
		$message = substr($message, 0, strlen($message)-2);
	}
	
	mysqli_close($connection);
	
	// Return the matching verbs (empty array ok too)
	echo '{ "status": "OK", "message": [' . $message . '] }';
	
	function genusToArticle($genus, $kasus) {
		if ( $kasus == "akkusativ" ) {
			return "Der ";
		}
	}
?>