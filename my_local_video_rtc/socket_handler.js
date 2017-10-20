/*
 * 前端signal信号交换处理 
 */

var server_url = "wss://" + location.hostname +":6503";

var web_socket = new WebSocket(server_url, "json");

web_socket.onopen = function(evt) {
    // debugger;
};

web_socket.onmessage = function(evt) {
    // console.log(evt.data);
    handleWebSockeMessageByType(JSON.parse(evt.data));
};

/**
 * send msg to socket server
 * @param {*} msg 
 */
function sendToServer(msg) {
    msg.to = getToSocketId();
    if (!msg.to) return alert('require to id');

    var msgJSON = JSON.stringify(msg);

    // console.log("Sending '" + msg.type + "' message: " + msgJSON);

    web_socket.send(msgJSON);
}

function handleWebSockeMessageByType(msg) {
    switch (msg.type) {
        case 'id':
            setLocalSocketId(msg.id);
            break;

        case 'offer':
            reciveCallerOffer(msg.offer);
            break;

        case 'answer':
            reciveCalleeAnswer(msg.answer);
            break;

        case 'candidate-to-callee':
            reciveCallerCandidate(msg.candidate);
            break;

        case 'candidate-to-caller':
            reciveCalleeCandidate(msg.candidate);
            break;

        default:
            return console.warn('unknow message type from server');

    };
}

function setLocalSocketId(id) {
    var local_id_input = document.getElementById('my_socket_id');
    var romote_id_input = document.getElementById('to_socket_id');
    local_id_input.value = id;
    romote_id_input.value = id;
}

function getToSocketId() {
    var romote_id_input = document.getElementById('to_socket_id');
    return romote_id_input.value;
}