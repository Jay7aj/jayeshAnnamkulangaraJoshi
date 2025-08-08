
<?php
ini_set('display_errors', 0);
error_reporting(0);
$executionStartTime= microtime(true);

$url= 'https://api.exchangerate.host/live?access_key=9a73b529d53d9efa0b7a0eb8ce5cfa15';
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

if (!isset($decode["quotes"]) || empty($decode["quotes"])) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No Conversion quotes data found!";
    $output["status"]["url"] = $url;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"]= intval((microtime(true) - $executionStartTime) *1000). "ms";
    $output["data"] = $decode["quotes"];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);

?>