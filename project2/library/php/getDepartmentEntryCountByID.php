<?php

	// example use from browser
	// http://localhost/project2/library/php/getDepartmentEntryCountByID.php?id=<id>

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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.

	$query = $conn->prepare('SELECT id, name, locationID FROM department WHERE id =  ?');

	$query->bind_param("i", $_POST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		echo json_encode($output); 
	
		mysqli_close($conn);
		exit;

	}

	$result = $query->get_result();

   	$department = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($department, $row);

	}

	// second query
	$checkQuery = $conn->prepare('SELECT COUNT(id) as count FROM personnel WHERE departmentID = ?');

	$checkQuery->bind_param("i", $_POST['id']);

	$checkQuery->execute();

	$checkResult = $checkQuery->get_result()->fetch_assoc();
	
	if (!$checkResult) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$count = $checkResult["count"];


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['department'] = $department;
	$output['data']['count'] = $count;

	echo json_encode($output); 

	mysqli_close($conn);

?>