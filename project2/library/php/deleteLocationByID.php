<?php

	// example use from browser
	// http://localhost/project2/library/php/deleteLocationByID.php?id=<id>



	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

    $locationId = $_POST['id'];

	// Check if location is assigned to department
	$checkDept = $conn->prepare('SELECT COUNT(id) as deptCount FROM department WHERE locationID = ?');

	$checkDept->bind_param("i", $locationId);

	$checkDept->execute();

	$deptResult = $checkDept->get_result()->fetch_assoc();

	// Check if location is assigned to personnel
	$checkPersonnel = $conn->prepare('
		SELECT COUNT(*) as persCount 
		FROM personnel p 
		JOIN department d ON p.departmentID = d.id 
		WHERE d.locationID = ?
	');

	$checkPersonnel->bind_param("i", $locationId);

	$checkPersonnel->execute();

	$persResult = $checkPersonnel->get_result()->fetch_assoc();

	if ($deptResult['deptCount'] > 0 || $persResult['persCount'] > 0) {
		$output['status']['code'] = "409";
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "Location is still assigned to department(s) or personnel";
		$output['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}


	// SQL statement accepts parameters and so is prepared to avoid SQL injection.

	$query = $conn->prepare('DELETE FROM location WHERE id = ?');
	
	$query->bind_param("i", $_POST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>