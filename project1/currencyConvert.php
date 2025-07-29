
<?php
$executionStartTime= microtime(true);

$url='https://api.exchangerate.host/convert?access_key=9a73b529d53d9efa0b7a0eb8ce5cfa15&from='. urlencode($_POST["currency"]).'&to='. urlencode($_POST["convertTo"]).'&amount='. urlencode($_POST["amount"]);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

if (!isset($decode) || empty($decode)) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No Country data found!";
    $output["status"]["url"] = $url;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"]= intval((microtime(true) - $executionStartTime) *1000). "ms";
    $output["data"] = $decode;
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);

?>