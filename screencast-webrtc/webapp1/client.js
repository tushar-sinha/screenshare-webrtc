'use strict';
const servers = {
    iceServers: [
        {
            url: 'stun:stun.l.google.com:19302'
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
    navigator.mediaDevices.getDisplayMedia({video: true})
    .then(stream => {
        localPeer.addStream(stream);
        document.getElementsByTagName('video')[0].srcObject = stream;
        return localPeer.createOffer();
    })
    .then(offer => {
        let sdp = new RTCSessionDescription(offer)
        localPeer.setLocalDescription(sdp)
        $("#offer").val(JSON.stringify(localPeer.localDescription))
    })
    console.log('peer state: ', localPeer.iceConnectionState)
});

$("#startStream").click(()=>{
    localPeer.setRemoteDescription(JSON.parse($("#answer").val()));
    localPeer.addIceCandidate(JSON.parse($("#candidate2").val()));
    console.log('peer state: ', localPeer.iceConnectionState)
});

$("#hangup").click(()=>{
    localPeer.close();
    localPeer = null;
    console.log("ending call.")
})