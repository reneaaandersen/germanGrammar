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
	
	$nominativSingular = "";
	$genitivSingular = "";
	$nominativPlural = "";
	$dativPlural = "";
	
	// If no words is set, we have nothing to validate
	if ( !isset($_GET['ns']) && !isset($_GET['gs']) && !isset($_GET['np']) && !isset($_GET['dp']) ) {
		echo '{ "status": "error", "message": "Nothing to validate."}';
		exit();
	}
	
	if ( isset($_GET['ns']) ) {
		$nominativSingular = $_GET['ns'];
	}
	if ( isset($_GET['gs']) ) {
		$genitivSingular = $_GET['gs'];
	}
	if ( isset($_GET['np']) ) {
		$nominativPlural = $_GET['np'];
	}
	if ( isset($_GET['dp']) ) {
		$dativPlural = $_GET['dp'];
	}
	
	// If all the words are blank, we still do not have anything to validate
	if ( $nominativSingular == "" && $genitivSingular == "" && $nominativPlural == "" && $dativPlural == "" ) {
		echo '{ "status": "error", "message": "Nothing to validate."}';
		exit();
	}
	
	// Fetch the nouns that match the base word
	$query = 'SELECT * FROM nouns where base="' . mysqli_real_escape_string($connection, $baseword) . '"';
	$result = $connection->query($query);
	
	// For standard usage we should only match words that are in the database, but we validate to ensure proper functioning
	if ( !$result ) {
		echo '{ "status": "error", "message": "Invalid base word."}';
		exit();
	}
	
	// Validation array. 0 is incorrect, 1 is correct. The indexes are:
	// 1. Nominativ singular
	// 2. Genitiv singular
	// 3. Nominativ plural
	// 4. Dativ plural
	$validation = [0, 0, 0, 0];
	
	if ( $result->num_rows > 0 ) {
		while ( $row = $result->fetch_assoc()) {
			$genus = $row['genus'];
			
			if ( ( genusToArticle($genus, "n") . " " . $row['nominativSingular'] ) == $nominativSingular ) {
				$validation[0] = 1;
			}
			if ( ( genusToArticle($genus, "g") . " " . $row['genitivSingular'] ) == $genitivSingular ) {
				$validation[1] = 1;
			}
			if ( ( genusToArticle("p", "n") . " " . $row['nominativPlural'] ) == $nominativPlural ) {
				$validation[2] = 1;
			}
			if ( ( genusToArticle("p", "d") . " " . $row['dativPlural'] ) == $dativPlural ) {
				$validation[3] = 1;
			}
		}
	}
	
	mysqli_close($connection);
	
	// Send the validation array to the client
	echo '{ "status": "OK", "message": [' . $validation[0] . ", " . $validation[1] . ", " . $validation[2] . ", " . $validation[3] . '] }';
	
	// Helper function to convert the genus in the database to the article, so we can actually validate the user input
	function genusToArticle($genus, $kasus) {
		// Nominativ
		if ( $kasus == "n" ) {
			if ( $genus == "m" ) {
				return "Der";
			}
			if ( $genus == "f" ) {
				return "Die";
			}
			if ( $genus == "n" ) {
				return "Das";
			}
			if ( $genus == "p" ) {
				return "Die";
			}
		}
		// Genitiv
		else if ( $kasus == "g" ) {
			if ( $genus == "m" ) {
				return "Des";
			}
			if ( $genus == "f" ) {
				return "Der";
			}
			if ( $genus == "n" ) {
				return "Des";
			}
			if ( $genus == "p" ) {
				return "Der";
			}
		}
		// Dativ
		else if ( $kasus == "d" ) {
			if ( $genus == "m" ) {
				return "Dem";
			}
			if ( $genus == "f" ) {
				return "Der";
			}
			if ( $genus == "n" ) {
				return "Dem";
			}
			if ( $genus == "p" ) {
				return "Den";
			}
		}
		// Akkusativ
		else if ( $kasus == "a" ) {
			if ( $genus == "m" ) {
				return "Den";
			}
			if ( $genus == "f" ) {
				return "Die";
			}
			if ( $genus == "n" ) {
				return "Das";
			}
			if ( $genus == "p" ) {
				return "Die";
			}
		}
		
		return "";
	}
?>