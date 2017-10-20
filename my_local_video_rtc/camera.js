/*
 * open camera for global variable share
 */
window.local_media_stream = null;

var media_conf = {
    audio: false,
    video: {
        height: 200,
        width: 200
    }
}

var is_ios = navigator.userAgent.indexOf('iPhone') > 1;
if (is_ios) media_conf.video = {
    facingMode: 'user'
};


/**
 * click capture btn 
 */
function capture() {
    navigator.mediaDevices
        .getUserMedia(media_conf)
        .then(initCallerVideo)
        .catch(logCaptureError);
}

/**
 * if change video size capture again is ok
 */
function initCallerVideo(media_stream) {
    var video_elem = document.getElementById('caller_play');
    video_elem.srcObject = media_stream;
    if (! is_ios) video_elem.play();

    setLocalMediaStream(media_stream);

    callerAddStream(media_stream);
    // testVideoPipe(media_stream);
}

function setLocalMediaStream(media_stream) {
    // local_media_stream.getTracks()

    window.local_media_stream = media_stream;
}

function logCaptureError(e) {
    console.dir(e);
}

/** @test */
function testVideoPipe(media_stream) {
    new VideoPipe(media_stream, e => {
        debugger
    });
}