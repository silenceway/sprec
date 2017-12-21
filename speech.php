<?php
# Includes the autoloader for libraries installed with composer
require __DIR__ . '/vendor/autoload.php';

$settings = require __DIR__ . '/config.php';

# Imports the Google Cloud client library
use Google\Cloud\Speech\SpeechClient;

if(!is_dir(dirname(__FILE__) . '/recordings')){
	$res = mkdir("recordings",0777); 
}

date_default_timezone_set($settings['timezone']);

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

# Your Google Cloud Platform project ID
// $projectId = ;

# Instantiates a client
$speech = new SpeechClient([
    'keyFilePath' => $settings['keyFilePath'],
    'languageCode' => $settings['languageCode'],
]);

# The name of the audio file to transcribe
$fileName = __DIR__ . '/recordings/' . $filename;

# The audio file's encoding and sample rate
$options = [
    'encoding' => 'LINEAR16',
/*    'sampleRateHertz' => 44100, */
];

# Detects speech in the audio file
$results = $speech->recognize(fopen($fileName, 'r'), $options);

unlink($fileName);

$output = array();
foreach ($results[0]->alternatives() as $alternative) {
    // echo 'Transcription: ' . $alternative['transcript'] . PHP_EOL;
    $output['results'][] = $alternative['transcript'];
}

print json_encode($output);