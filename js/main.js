var audio_context,
    recorder,
    buttonText;

function __log(e, data) {
    // log.innerHTML += "\n" + e + " " + (data || '');
    if (console && console.log)
        console.log(e + " " + (data || ''));
}

function initRecorder() {
    recorder = new Recorder({
      monitorGain: 0,
      numberOfChannels: 1,
      wavBitDepth: 16,
      encoderPath: "js/waveWorker.min.js"
    });

    recorder.addEventListener( "start", function(e){
      __log('Recorder is started');
    });
    recorder.addEventListener( "stop", function(e){
      __log('Recorder is stopped');
    });
    recorder.addEventListener( "pause", function(e){
      __log('Recorder is paused');
    });
    recorder.addEventListener( "resume", function(e){
      __log('Recorder is resuming');
    });
    recorder.addEventListener( "streamError", function(e){
      __log('Error encountered: ' + e.error.name );
    });
    recorder.addEventListener( "streamReady", function(e){
      __log('Audio stream is ready.');
    });
    recorder.addEventListener( "dataAvailable", function(e){
      var dataBlob = new Blob( [e.detail], { type: 'audio/wav' } );
      var loading = '<i class="fa fa-2x fa-spinner fa-spin"></i>';
      processField(loading);
      uploadAudio(dataBlob);
    });
    recorder.initStream();
    return;
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
    recorder && recorder.start();
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
}

function uploadAudio(wavData) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var fd = new FormData();
        var wavName = encodeURIComponent('audio_recording_' + new Date().getTime() + '.wav');
        __log("wavName = " + wavName);
        fd.append('fname', wavName);
        fd.append('data', event.target.result);
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'speech.php',
            data: fd,
            processData: false,
            contentType: false
        }).done(function (data) {
            if (data && data.results && data.results[0]) {
                __log(data.results[0]);
                processField(data.results[0]);
            }
        }).always(function () {
            initRecorder();
        });
    };
    reader.readAsDataURL(wavData);
}

function processField(granResultadovariable) {
    if (loQueEstoyReconociendo == "nombre") {
        granResultadoNombre = granResultadovariable;
        textolresultadonombre.innerHTML = granResultadovariable;
    } else if (loQueEstoyReconociendo == "reporte") {
        granResultadoReporte = granResultadovariable;
        textoresultadoReporte.innerHTML = granResultadovariable;
    } else if (loQueEstoyReconociendo == "plan") {
        granResultadoPlan = granResultadovariable;
        textoresultadoPlanDeaccion.innerHTML = granResultadovariable;
    }
}

window.onload = function init() {
    initRecorder();
};
