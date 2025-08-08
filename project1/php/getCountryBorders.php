<?php

$executionStartTime = microtime(true);

$jsonFile = '../library/countryBorders.json';
$result = file_get_contents($jsonFile);
$decode = json_decode($result, true);

if (!isset($decode['features']) || !is_array($decode['features'])) {
    echo json_encode([
        "status" => [
            "code" => "400",
            "name" => "error",
            "description" => "Invalid JSON structure"
        ],
        "data" => null
    ]);
    exit;
}

$data = null;
$requestedCode = $_GET['code'] ?? null; 

foreach ($decode['features'] as $feature) {
    $isoCode = $feature['properties']['iso_a2'] ?? null;

    if ($isoCode === $requestedCode) {
        $data = $feature;
        break;
    }
}

if (empty($data)) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No feature data found!";
    $output["status"]["filepath"] = $jsonFile;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . "ms";
    $output["data"] = $data; 
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);
?>
