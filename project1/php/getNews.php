<?php
$executionStartTime= microtime(true);

$url = 'https://newsdata.io/api/1/latest?apikey=pub_4f61efc00891436e9a30217981224a7e&q='.urlencode($_GET["keyword"]);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

$cURLERROR = curl_errno($ch);

curl_close($ch);

if ($cURLERROR) {

$output['status']['code'] = $cURLERROR;
$output['status']['name'] = "Failure - cURL";
$output['status']['description'] = curl_strerror($cURLERROR);
$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
$output['data'] = null;

echo json_encode($output);

exit;
}

$decode = json_decode($result,true);

if (!isset($decode["results"]) || empty($decode["results"])) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No News data found!";
    $output["status"]["url"] = $url;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"]= intval((microtime(true) - $executionStartTime) *1000). "ms";
    $output["data"] = $decode["results"];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);

?>