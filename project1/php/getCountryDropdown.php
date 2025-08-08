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

$countryList = [];

foreach ($decode['features'] as $feature) {
    $isoCode = $feature['properties']['iso_a2'] ?? null;
    $name = $feature['properties']['name'] ?? null;

    if ($isoCode && $name) {
        $countryList[] = [
            'iso_a2' => $isoCode,
            'name' => $name
        ];
    }
}

if (empty($countryList)) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No Country data found!";
    $output["status"]["filepath"] = $jsonFile;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . "ms";
    $output["data"] = $countryList; 
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);
?>
