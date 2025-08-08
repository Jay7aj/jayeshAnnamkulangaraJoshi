
<?php
$executionStartTime= microtime(true);

$url = 'https://api.opencagedata.com/geocode/v1/json?key=3a363e7c8dc34ca1885138925785c5eb&q='.urlencode($_GET['lat']).'+'.urlencode($_GET['lng']).'&no_annotations=1';
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

if (!isset($decode['results'][0]['components']['ISO_3166-1_alpha-2']) || empty($decode['results'][0]['components']['ISO_3166-1_alpha-2'])) {
    $output["status"]["code"] = "400";
    $output["status"]["name"] = "error";
    $output["status"]["description"] = "No Country iso data found!";
    $output["status"]["url"] = $url;
    $output["data"] = null;
} else {
    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"]= intval((microtime(true) - $executionStartTime) *1000). "ms";
    $output["data"] = $decode['results'][0]['components']['ISO_3166-1_alpha-2'];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($output);

?>