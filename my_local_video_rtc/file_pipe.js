/**
 * 本地测试 RTC 用来发送文件管道
 * 
 */
var file_caller_peer;
var file_callee_peer;

function sendFile() {
    // Create the local connection and its event listeners

    file_caller_peer = new RTCPeerConnection();

    // Create the data channel and establish its event listeners
    file_send_channel = file_caller_peer.createDataChannel("sendChannel");
    file_send_channel.onopen = sendMessage;
    file_send_channel.onclose = handleSendChannelStatusChange;

    // Create the remote connection and its event listeners

    file_callee_peer = new RTCPeerConnection();
    file_callee_peer.ondatachannel = receiveChannelCallback;

    // Set up the ICE candidates for the two peers

    file_caller_peer.onicecandidate = e => !e.candidate ||
        file_callee_peer.addIceCandidate(e.candidate)
        .catch(handleAddCandidateError);

    file_callee_peer.onicecandidate = e => !e.candidate ||
        file_caller_peer.addIceCandidate(e.candidate)
        .catch(handleAddCandidateError);

    // Now create an offer to connect; this starts the process

    file_caller_peer.createOffer()
        .then(offer => file_caller_peer.setLocalDescription(offer))
        .then(() => file_callee_peer.setRemoteDescription(file_caller_peer.localDescription))
        .then(() => file_callee_peer.createAnswer())
        .then(answer => file_callee_peer.setLocalDescription(answer))
        .then(() => file_caller_peer.setRemoteDescription(file_callee_peer.localDescription))
        .catch(handleCreateDescriptionError);


    // Handle errors attempting to create a description;
    // this can happen both when creating an offer and when
    // creating an answer. In this simple example, we handle
    // both the same way.

    function handleCreateDescriptionError(error) {
        console.log("Unable to create an offer: " + error.toString());
    }

    function handleAddCandidateError() {
        console.log("Oh noes! addICECandidate failed!");
    }

    // Handles clicks on the "Send" button by transmitting
    // a message to the remote peer.

    function sendMessage() {
        file_send_channel.send('message from caller');
    }

    // Handle status changes on the local end of the data
    // channel; this is the end doing the sending of data
    // in this example.

    function handleSendChannelStatusChange(event) {

    }

    // Called when the connection opens and the data
    // channel is ready to be connected to the remote.

    function receiveChannelCallback(event) {
        file_receive_channel = event.channel;
        file_receive_channel.onmessage = handleReceiveMessage;
        file_receive_channel.onopen = handleReceiveChannelStatusChange;
        file_receive_channel.onclose = handleReceiveChannelStatusChange;
    }

    // Handle onmessage events for the receiving channel.
    // These are the data messages sent by the sending channel.

    function handleReceiveMessage(event) {
        var el = document.createElement("p");
        var txtNode = document.createTextNode(event.data);

        el.appendChild(txtNode);
        document.body.appendChild(el);
    }

    // Handle status changes on the receiver's channel.

    function handleReceiveChannelStatusChange(event) {

    }


}