
<?php
$executionStartTime= microtime(true);

$url = 'https://en.wikipedia.org/api/rest_v1/page/summary/'. rawurlencode($_GET["name"]);
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

if (!isset($decode) || empty($decode)) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No Wikipedia data found!";
    $output["status"]["url"] = $url;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["url"] = $url;
    $output["status"]["returnedIn"]= intval((microtime(true) - $executionStartTime) *1000). "ms";
    $output["data"] = $decode;
}
  
header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);

?>