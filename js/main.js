var audio_context,
    recorder,
    buttonText;

function __log(e, data) {
    log.innerHTML += "\n" + e + " " + (data || '');
}

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    __log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');

    recorder = new Recorder(input);
    __log('Recorder initialised.');
}

function startRecording(button) {
    recorder && recorder.record();
    buttonText = $(button).text();
    $(button).text('Terminar');
    // button.disabled = true;
    // button.nextElementSibling.disabled = false;
    __log('Recording...');
}

function stopRecording(button) {
    recorder && recorder.stop();
    $(button).text(buttonText);
    buttonText = '';
    // button.disabled = true;
    // button.previousElementSibling.disabled = false;
    __log('Stopped recording.');

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
}
function createDownloadLink() {
    recorder && recorder.exportWAV(function (blob) {
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');

        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);
        uploadAudio(blob);
    });
}

function uploadAudio(wavData) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var fd = new FormData();
        var wavName = encodeURIComponent('audio_recording_' + new Date().getTime() + '.wav');
        console.log("wavName = " + wavName);
        fd.append('fname', wavName);
        fd.append('data', event.target.result);
        $.ajax({
            type: 'POST',
            url: 'speech.php',
            data: fd,
            processData: false,
            contentType: false
        }).done(function (data) {
            //console.log(data);
            log.innerHTML += "\n" + data;
        });
    };
    reader.readAsDataURL(wavData);
}

window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        __log('Audio context set up.');
        __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
        __log('No live audio input: ' + e);
    });
};
