/**
 * RTC callee 
 *
 * ice servers config STUN / TURN ...
 */
/**
 * callee peer connection
 */
var callee_peer_connect = new RTCPeerConnection(peer_conf);

callee_peer_connect.ondatachannel = function(event) {
    debugger;
    var channel = event.channel;
    channel.onopen = function(event) {
        channel.send('Hi back!');
    }
    channel.onmessage = function(event) {
        console.log(event.data);
    }
};


/**
 * peer connect listeners 
 */
callee_peer_connect.onicecandidate = calleeOnIceCandidateHandler;
// @deprecated use ontrack
// callee_peer_connect.onaddstream = calleeOnAddStreamHandler;
callee_peer_connect.ontrack = calleeOnAddTrackHandler;
callee_peer_connect.ondatachannel = calleeMultiHandler;
callee_peer_connect.oniceconnectionstatechange = calleeMultiHandler;
callee_peer_connect.onicegatheringstatechange = calleeMultiHandler;
callee_peer_connect.onremovestream = calleeMultiHandler;
callee_peer_connect.onsignalingstatechange = calleeMultiHandler;
callee_peer_connect.onnegotiationneeded = calleeMultiHandler;

/**
 * after creat offee caller should set local descrition 
 */
function reciveCallerOffer(session_description) {

    callee_peer_connect.setRemoteDescription(new RTCSessionDescription(session_description))
    	.then(createAnswer);
    // debugger;
}

function createAnswer() {
    callee_peer_connect
        .createAnswer()
        .then(calleeSetLocalSessionDescription)
        .then(sendAnswerToCaller)
        .catch(calleeErrorLog);
}

function calleeSetLocalSessionDescription(session_description) {
	debugger;
    return callee_peer_connect.setLocalDescription(session_description);
}

function sendAnswerToCaller() {
	debugger;

    sendToServer({
        type: 'answer',
        answer: callee_peer_connect.localDescription
    });

    // TODO send to server
    // console.log('reciveCalleeAnswer();');
    // console.log(JSON.stringify(callee_peer_connect.localDescription));
    // reciveCalleeAnswer(callee_peer_connect.localDescription);
}


// TODO use ICE server
function sendCandidateToCaller(candidate) {

    sendToServer({
        type: 'candidate-to-caller',
        candidate: candidate
    });

    // sent to server;
    // setTimeout(function() {
    // console.log('reciveCalleeCandidate();');
    // console.log(JSON.stringify(candidate));
    // reciveCalleeCandidate(candidate);
    // }, 1000);
}

function reciveCallerCandidate(candidate) {

    callee_peer_connect.addIceCandidate(new RTCIceCandidate(candidate));
}


// why must add ice candidate can stream alive
/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate
 * 
 * peer 之间除了要交换SDP（session description），还要交换关于网络连接的信息
 * 
 * 用来传递候选 peer 的状态，当 evt.candidate 为 null 时，刚表示所有候选 peer 已传递完毕 ？
 */
function calleeOnIceCandidateHandler(evt) {
    // debugger;
    console.log("%s :Callee:", evt.type);
    /** @var RTCIceCandidate evt.candidate */

    if (evt.candidate) sendCandidateToCaller(evt.candidate);

}

function calleeOnAddStreamHandler(evt) {
    debugger;
    // console.log("%s :Callee:", evt.type);

    var callee_video_elem = document.getElementById('callee_play');
    callee_video_elem.srcObject = evt.streams;
    callee_video_elem.play();
}

function calleeOnAddTrackHandler(evt) {
    debugger;
    // console.log("%s :Callee:", evt.type);

    var callee_video_elem = document.getElementById('callee_play');
    callee_video_elem.srcObject = evt.streams[0];
    callee_video_elem.play();
}

function calleeMultiHandler(evt) {
    // console.log("%s :Callee:", evt.type);
    // debugger;
}

function calleeErrorLog(e) {
    console.dir(e);
}