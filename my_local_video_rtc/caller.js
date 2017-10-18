/**
 * RTC caller 
 *
 * ice servers config STUN / TURN ...
 */
var peer_conf = {
	iceServers: [
		// stun server can query IP + port
		{ url: "stun:stun.l.google.com:19302" }
	]
};

peer_conf = null;

/**
 * caller peer connection
 */
var caller_peer_connect = new RTCPeerConnection(peer_conf);

/**
 * peer connect listeners 
 */
caller_peer_connect.onicecandidate = callerOnIceCandidateHandler;
caller_peer_connect.onaddstream = callerMultiHandler;
caller_peer_connect.ondatachannel = callerMultiHandler;
caller_peer_connect.oniceconnectionstatechange = callerMultiHandler;
caller_peer_connect.onicegatheringstatechange = callerMultiHandler;
caller_peer_connect.onremovestream = callerMultiHandler;
caller_peer_connect.onsignalingstatechange = callerMultiHandler;
caller_peer_connect.onnegotiationneeded = callerMultiHandler;

/** 
 * add stream to caller peer connect then create offer 
 * the order of add and addStream is serious ?
 */
function callerAddStream(stream) {
	caller_peer_connect.addStream(stream);

	createOffer();
}
/**
 * create new Offer if find some callee can chat
 */
function createOffer(){
	caller_peer_connect
		.createOffer()
		.then(setLocalDesciption)
		.then(sendOfferToCallee)
		.catch(errorLog);
}

/**
 * after creat offer caller should set local descrition 
 */
function setLocalDesciption(session_description) {	
	caller_peer_connect.setLocalDescription(session_description);
}

/**
 * Send the offer to the remote peer using the signaling server
 * after set caller local description should send 
 * offer to callee through server
 */
function sendOfferToCallee() {
	var caller_offer = {
      name: 'caller',
      target: 'callee',
      type: "video-offer",
      sdp: caller_peer_connect.localDescription
    };
    // TODO send to server
    reciveCallerOffer(caller_peer_connect.localDescription);
}

function reciveCalleeAnswer(session_description) {
	caller_peer_connect.setRemoteDescription(session_description);
}

// TODO why must add ice candidate can stream alive 
function callerOnIceCandidateHandler(evt) {
	debugger;

	// why candidate would be empty sometime??
	if (evt.candidate) sendCandidateToCallee(evt.candidate);
    
}

// TODO send through server
function sendCandidateToCallee(candidate) {

	// to server 
	setTimeout(function(){
		reciveCallerCandidate(candidate);
	}, 1000);
}

function reciveCalleeCandidate(candidate){
	caller_peer_connect.addIceCandidate(new RTCIceCandidate(candidate));
}

function callerMultiHandler(evt) {
	// debugger;
}

function errorLog(e) {
	console.dir(e);
}
