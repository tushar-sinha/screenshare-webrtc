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
            $("#candidate1").val(JSON.stringify(e.candidate))
        }
    }
    navigator.mediaDevices.getDisplayMedia({video: true}) // use addtrack after getting all tracks from gdm
    .then(stream => {
        localPeer.addStream(stream); // deprecated
        document.getElementsByTagName('video')[0].srcObject = stream;
        return localPeer.createOffer();
    })
    .then(offer => {
        let sdp = new RTCSessionDescription(offer)
        return localPeer.setLocalDescription(sdp);
    })
    .then(()=>{
        $("#offer").val(JSON.stringify(localPeer.localDescription))
    })

    console.log('peer state: ', localPeer.iceConnectionState)

    localPeer.oniceconnectionstatechange = () => {
        console.log(localPeer.iceConnectionState)
    }
});

$("#startStream").click(async ()=>{
    await localPeer.setRemoteDescription(JSON.parse($("#answer").val()));
    localPeer.addIceCandidate(JSON.parse($("#candidate2").val()));
    console.log('peer state: ', localPeer.iceConnectionState)
});

$("#hangup").click(()=>{
    localPeer.close();
    localPeer = null;
    console.log("ending call.")
})