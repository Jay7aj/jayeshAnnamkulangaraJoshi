<?php
$executionStartTime= microtime(true);

$url = 'http://api.geonames.org/countryInfoJSON?lang=english&country='.urlencode($_POST["country"]).'&username=jayeshannam';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

if (!isset($decode["geonames"]) || empty($decode["geonames"])) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No Country data found!";
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"]= intval((microtime(true) - $executionStartTime) *1000). "ms";
    $output["data"] = $decode["geonames"][0];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);

?>