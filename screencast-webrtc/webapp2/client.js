'use strict';
const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
            ]
        },
        {
            "urls": [
                "turn:13.250.13.83:3478?transport=udp"
            ],
            "username": "YzYNCouZM1mhqhmseWk6",
            "credential": "YzYNCouZM1mhqhmseWk6"
        }
    ]
};  // Allows for RTC server configuration.
let localPeer;

$("#callButton").click(()=>{
    localPeer = new RTCPeerConnection(servers);
    localPeer.onicecandidate = e => {
        if(e.candidate) {
            localPeer.addIceCandidate(JSON.parse($("#candidate1").val()));
            $("#candidate2").val(JSON.stringify(e.candidate));
        }
    }
    
    let offerDesc = new RTCSessionDescription(JSON.parse($("#offer").val()));
    
    localPeer.setRemoteDescription(offerDesc)
    localPeer.createAnswer(async function (answerDesc) {
        await localPeer.setLocalDescription(answerDesc)
        $("#answer").val(JSON.stringify(localPeer.localDescription))
    }, function () {console.warn("Couldn't create offer")});

    localPeer.ontrack = e => {
        document.getElementsByTagName('video')[0].srcObject = e.streams[0];
        console.log('streaming from remote.')
    }
    console.log('peer state: ', localPeer.iceConnectionState)
        
    localPeer.oniceconnectionstatechange = () => {
        console.log(localPeer.iceConnectionState)
    }
});


$("#hangup").click(()=>{
    localPeer.close();
    localPeer = null;
    console.log("ending call.")
})

