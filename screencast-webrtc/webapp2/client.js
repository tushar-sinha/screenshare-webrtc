'use strict';
let localPeer;
const servers = {
    iceServers: [
        {
            url: 'stun:stun.l.google.com:19302'
        }
    ]
};  // Allows for RTC server configuration.

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
    localPeer.createAnswer(function (answerDesc) {
      localPeer.setLocalDescription(answerDesc)
      $("#answer").val(JSON.stringify(answerDesc))
    }, function () {console.warn("Couldn't create offer")});

    localPeer.ontrack = e => {
        document.getElementsByTagName('video')[0].srcObject = e.streams[0];
        console.log('streaming from remote.')
    }
    console.log('peer state: ', localPeer.iceConnectionState)
});


$("#hangup").click(()=>{
    localPeer.close();
    localPeer = null;
    console.log("ending call.")
})

