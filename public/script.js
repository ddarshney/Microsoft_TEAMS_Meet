
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");


var myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '8569'
})

var name= prompt("whats your name","user");

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    setTimeout(() => connectToNewUser(userId, stream),3000)
  })
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

  // getting the name of user so that it can be used in chat
var text= $('input') ;
// jquery function to send the message to all the peers when enter is pressed on keyboard
$('html').keydown((e)=> {
        if(e.which==13 && text.val().length!==0) {   // 13 is used because numeric value for enter is 13
            socket.emit('message', text.val(), name) ;
            text.val('')  // resetting the text typed to blank
        }
})
  
// adding the message on chat window with the name of sender
 socket.on('createmsg', (msg,name)=> {
        $('ul').append(`<li class="message"><b>${name}</b><br/>${msg}</li>`)
        scrollbottom() ;  // to scroll till last msg in chat window
    })
    
// function to scroll the chat window till bottom every time a message is added 
const scrollbottom=() => {
    let d= $('.chat_window') ;
    d.scrollTop(d.prop("scrollHeight")) ;

}



send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
}); 


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

const inviteButton = document.querySelector("#inviteButton");
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});



// share screen
const shareScreenBtn = document.getElementById("share-screen");
shareScreenBtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("true")) return;
    e.target.setAttribute("tool_tip", "You are already presenting screen");
    e.target.classList.add("true");
    navigator.mediaDevices
        .getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            },
        })
        .then((stream) => {
            var videoTrack = stream.getVideoTracks()[0];
            myVideoTrack = myVideoStream.getVideoTracks()[0];
            replaceVideoTrack(myVideoStream, videoTrack);
            for (peer in peers) {
                let sender = peers[peer].peerConnection
                    .getSenders()
                    .find(function (s) {
                        return s.track.kind == videoTrack.kind;
                    });
                sender.replaceTrack(videoTrack);
            }
            const elementsWrapper = document.querySelector(".elements-wrapper");
            const stopBtn = document.createElement("button");
            stopBtn.classList.add("video-element");
            stopBtn.classList.add("stop-presenting-button");
            stopBtn.innerHTML = "Stop Sharing";
            elementsWrapper.classList.add("screen-share");
            elementsWrapper.appendChild(stopBtn);
            videoTrack.onended = () => {
                elementsWrapper.classList.remove("screen-share");
                stopBtn.remove();
                stopPresenting(videoTrack);
            };
            stopBtn.onclick = () => {
                videoTrack.stop();
                elementsWrapper.classList.remove("screen-share");
                stopBtn.remove();
                stopPresenting(videoTrack);
            };
        });
});

const stopPresenting = (videoTrack) => {
    shareScreenBtn.classList.remove("true");
    shareScreenBtn.setAttribute("tool_tip", "Present Screen");
    for (peer in peers) {
        let sender = peers[peer].peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        });
        sender.replaceTrack(myVideoTrack);
    }
    replaceVideoTrack(myVideoStream, myVideoTrack);
};


const crossBtnClickEvent = (e) => {
    const videoWrapper = e.target.parentElement;
    if (videoWrapper.classList.contains("zoom-video")) {
        videoWrapper.classList.remove("zoom-video");
        e.target.removeEventListener("click", crossBtnClickEvent);
        e.target.remove();
    }
};

const replaceVideoTrack = (stream, videoTrack) => {
  stream.removeTrack(stream.getVideoTracks()[0]);
  stream.addTrack(videoTrack);
};

       

