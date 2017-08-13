<?php

if(!is_dir(dirname(__FILE__) . '/recordings')){
	$res = mkdir("recordings",0777); 
}

// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
// decode it
$decodedData = base64_decode($data);
// print out the raw data, 
//echo ($decodedData);
$filename = 'audio_recording_' . date( 'Y-m-d-H-i-s' ) .'.wav';
// write the data out to the file
$fp = fopen(dirname(__FILE__) . '/recordings/'.$filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);

$data = json_encode(array(
    'config' => array(
        'encoding' => 'LINEAR16',
        'sample_rate' => 16000,
        'language_code' => 'en-US'
    ),
    'audio' => array(
        'content' => base64_encode(file_get_contents(dirname(__FILE__) . '/recordings/'.$filename))
    )
));

$ch = curl_init('https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=XXX');

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length: ' . strlen($data)));

$result = json_decode(curl_exec($ch));

$text = (isset($result->results[0]->alternatives[0]->transcript) ? $result->results[0]->alternatives[0]->transcript : '');

echo $text;