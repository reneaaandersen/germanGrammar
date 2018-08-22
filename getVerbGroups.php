<?php
	header('Content-Type: application/json; charset=utf-8');

	include_once 'config.php';
	
	$connection = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);
	
	if ( $connection->connect_error ) {
		echo '{ "status": "error", "message": "Unable to connect to database"}';
		exit();
	}
	$connection->set_charset("utf8mb4");
	$result = $connection->query("SELECT DISTINCT tags.tagDescription FROM tags INNER JOIN verbstotags ON tags.tagID = verbstotags.tagID INNER JOIN verbs ON verbstotags.verbID = verbs.id ORDER BY verbs.infinitiv");
	
	$message = '"';
	if ( $result->num_rows > 0 ) {
		while ( $row = $result->fetch_assoc()) {
			$message = $message . $row['tagDescription'] . '", "';
		}
		$message = substr($message, 0, strlen($message)-3);
	}
	
	mysqli_close($connection);
	
	echo '{ "status": "OK", "message": [' . $message . '] }';
?>