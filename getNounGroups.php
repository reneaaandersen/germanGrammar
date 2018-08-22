<?php
	header('Content-Type: application/json; charset=utf-8');
	
	include_once 'config.php';
	
	$connection = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);
	
	if ( $connection->connect_error ) {
		echo '{ "status": "error", "message": "Unable to connect to database"}';
		exit();
	}
	$connection->set_charset("utf8mb4");
	$result = $connection->query("SELECT DISTINCT tags.tagDescription FROM tags INNER JOIN nounstotags ON tags.tagID = nounstotags.tagID INNER JOIN nouns ON nounstotags.nounID = nouns.id ORDER BY nouns.base");
	
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