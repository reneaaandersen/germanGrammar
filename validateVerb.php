<?php
	header('Content-Type: application/json; charset=utf-8');
	
	include_once 'config.php';
	
	// Test that the base word is set, else we won't have anything to compare it to
	if ( !isset($_GET['baseword']) || $_GET['baseword'] == "" ) {
		echo '{ "status": "error", "message": "Base word is not set."}';
		exit();
	}
	$baseword = $_GET['baseword'];

	// Establish a connection to the database
	$connection = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);
	if ( $connection->connect_error ) {
		echo '{ "status": "error", "message": "Unable to connect to the database"}';
		exit();
	}
	$connection->set_charset("utf8mb4");
	
	$infinitiv = "";
	$present = "";
	$past = "";
	$konjunktiv = "";
	$partizip = "";
	
	// If no words is set, we have nothing to validate
	if ( !isset($_GET['inf']) && !isset($_GET['pre']) && !isset($_GET['past']) && !isset($_GET['kon']) && !isset($_GET['par']) ) {
		echo '{ "status": "error", "message": "Nothing to validate."}';
		exit();
	}
	
	if ( isset($_GET['inf']) ) {
		$infinitiv = $_GET['inf'];
	}
	if ( isset($_GET['pre']) ) {
		$present = $_GET['pre'];
	}
	if ( isset($_GET['past']) ) {
		$past = $_GET['past'];
	}
	if ( isset($_GET['kon']) ) {
		$konjunktiv = $_GET['kon'];
	}
	if ( isset($_GET['par']) ) {
		$partizip = $_GET['par'];
	}
	
	// If all the words are blank, we still do not have anything to validate
	if ( $infinitiv == "" && $present == "" && $past == "" && $konjunktiv == "" && $partizip == "" ) {
		echo '{ "status": "error", "message": "Nothing to validate."}';
		exit();
	}
	
	// Fetch the verbs that match the base word
	$query = 'SELECT * FROM verbs where infinitiv="' . mysqli_real_escape_string($connection, $baseword) . '"';
	$result = $connection->query($query);
	
	// For standard usage we should only match words that are in the database, but we validate to ensure proper functioning
	if ( !$result ) {
		echo '{ "status": "error", "message": "Invalid base word."}';
		exit();
	}
	
	// Validation array. 0 is incorrect, 1 is correct. The indexes are:
	// 1. Infinitif
	// 2. Present 3rd person
	// 3. Past 3rd person
	// 4. Konjunktiv
	// 5. Partizip
	$validation = [0, 0, 0, 0, 0];
	
	if ( $result->num_rows > 0 ) {
		while ( $row = $result->fetch_assoc()) {
			if ( $row['infinitiv'] == $infinitiv ) {
				$validation[0] = 1;
			}
			if ( $row['presentThird'] == $present ) {
				$validation[1] = 1;
			}
			if ( $row['pastFirst'] == $past ) {
				$validation[2] = 1;
			}
			if ( $row['konjunktivIIFirst'] == $konjunktiv ) {
				$validation[3] = 1;
			}
			if ( helpVerb3rdPerson($row['helpVerb']) . " " . $row['partizipII'] == $partizip ) {
				$validation[4] = 1;
			}
		}
	}
	
	mysqli_close($connection);
	
	// Send the validation array to the client
	echo '{ "status": "OK", "message": [' . $validation[0] . ", " . $validation[1] . ", " . $validation[2] . ", " . $validation[3] . ", " . $validation[4] . '] }';
	
	// Helper function to convert the genus in the database to the article, so we can actually validate the user input
	function helpVerb3rdPerson($helpVerb) {
		if ( $helpVerb == "haben" ) {
			return "hat";
		}
		if ( $helpVerb == "sein" ) {
			return "ist";
		}
	}
?>