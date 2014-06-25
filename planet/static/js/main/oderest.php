<?php
header('Content-type: application/json');
$westernlon = $_GET['westernlon'];
$easternlon = $_GET['easternlon'];
$minlat = $_GET['minlat'];
$maxlat = $_GET['maxlat'];
$pdsid = $_GET['pdsid'];
$oderest = 'http://oderest.rsl.wustl.edu/live/';
$json_string = 'query=product&results=x$proj=c0&output=JSON&limit=1000&loc=f&westernlon='.$westernlon.'&easternlon='.$easternlon.'&minlat='.$minlat.'&maxlat='.$maxlat.'&pdsid='.$pdsid;
//dsid=MRO-M-CRISM-3-RDR-TARGETED-V1.0';
$results = file_get_contents($oderest.'?'.$json_string);
echo $results;
?>
