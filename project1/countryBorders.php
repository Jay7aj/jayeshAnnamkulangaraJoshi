<?php
$executionStartTime= microtime(true);
header("Content-Type: application/json; charset=UTF-8");
echo file_get_contents("countryBorders.json");

?>