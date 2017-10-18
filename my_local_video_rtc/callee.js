/**
 * RTC callee 
 *
 * ice servers config STUN / TURN ...
 */
/**
 * callee peer connection
 */
var callee_peer_connect = new RTCPeerConnection(peer_conf);

/**
 * peer connect listeners 
 */
callee_peer_connect.onicecandidate = calleeOnIceCandidateHandler;
callee_peer_connect.onaddstream = calleeOnAddStreamHandler;
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
	callee_peer_connect.setRemoteDescription(session_description);

	createAnswer();
}

function createAnswer() {
	callee_peer_connect
		.createAnswer()
		.then(calleeSetLocalSessionDescription)
		.then(sendAnswerToCaller)
		.catch(calleeErrorLog);
}

function calleeSetLocalSessionDescription(session_description) {
	callee_peer_connect.setLocalDescription(session_description);
}

function sendAnswerToCaller(){
	var caller_offer = {
      name: 'callee',
      target: 'caller',
      type: "video-offer",
      sdp: callee_peer_connect.localDescription
    };

    // TODO send to server
    reciveCalleeAnswer(callee_peer_connect.localDescription);
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
	debugger;

	/** @var RTCIceCandidate evt.candidate */

	if (evt.candidate) sendCandidateToCaller(evt.candidate);
    
}

// TODO use ICE server
function sendCandidateToCaller(candidate) {

	// sent to server;
	setTimeout(function(){
		reciveCalleeCandidate(candidate);
	}, 1000);
}

function reciveCallerCandidate(candidate){
	callee_peer_connect.addIceCandidate(new RTCIceCandidate(candidate));
}

function calleeOnAddStreamHandler(evt) {
	// debugger;

	var callee_video_elem = document.getElementById('callee_play');
	callee_video_elem.srcObject = evt.stream;
	callee_video_elem.play();
}

function calleeMultiHandler(evt){
	// debugger;
}

function calleeErrorLog(e) {
	console.dir(e);
}
