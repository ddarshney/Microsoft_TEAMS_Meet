// Creating a client

const socket = io('/')
const videoGrid = document.getElementById('video-grid')



var myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443',
})

var username = prompt("Please enter your name....","user");
socket.emit('new-user', username)
//user is prompted to give hs name
// getting the name of user so that it can be used in chat room

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id, username)
})

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

  socket.on('user-connected', (userId, username) => {
    setTimeout(() => connectToNewUser(userId, stream),3000)

    $("ul").append(`<br><h6 style="color: blue"><li class="message">
    <b>${username}</b> has joined the call</li></h6><br>`);

    scrollToBottom()

  })

});

 // Disconnecting the user
socket.on('user-disconnected', ( userId, username) => {
  if (peers[userId]) 
  {
   $("ul").append(`<br><h6 style="color: #b31b1b;">
   <li class="message"><b>${username}</b> has left the call</li></h6><br>`);
   scrollToBottom()
   peers[userId].close()
  }

})



//Connecting the user to videocall meet
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

// Adding the new user's stream to the video grid
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

// Taking the chat message input and displaying it to all clients

var text= $('input') ;
// jquery function to send the message to all the peers when enter is pressed on keyboard
$('html').keydown((e)=> {
        if(e.which==13 && text.val().length!==0) {  
           // numeric value for enter is 13
            socket.emit('message', text.val(), username) ;
            text.val('') 
            // resetting the text typed to blank
        }
})

const time = new Date();
// working of the send button widget
send.addEventListener("click", (e) => {
  if (text.val().length!== 0) {
    socket.emit('message', text.val(), username) ;
            text.val('') 
          }
});
  
// adding the message on chat window with the name of sender
 socket.on('createmsg', (msg,username)=> {
        $('ul').append(`<div class="message"><b><i class="far fa-user-circle"></i><span>${username}</span></b><span>${msg}</span><span class="time">${time.toLocaleString(
          "en-US", { hour: "numeric", minute: "numeric", hour12: true })}</span><br/></div>`)
        scrollbottom() ;  // to scroll till last msg in chat window
    })
     
// function to scroll the chat window till bottom every time a message is added 
const scrollbottom=() => {
    let d= $('.chat_window') ;
    d.scrollTop(d.prop("scrollHeight")) ;
}

// Setting the functions of mute or unmute audio buttons when mute button is clicked
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


// Setting the functions of play or stop video buttons when the video button is clicked
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


// runs when the invite link button is clicked
const inviteButton = document.querySelector("#inviteButton");
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});



//  executed when the share screen button is clicked
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

// replacing your video stream with the shared screen stream
const replaceVideoTrack = (stream, videoTrack) => {
  stream.removeTrack(stream.getVideoTracks()[0]);
  stream.addTrack(videoTrack);
};
  
//raise hand feature
const raiseHand = document.getElementById("raiseHand");
  raiseHand.addEventListener("click", (e) => {
  //emit through socket when button is clicked
  socket.emit('raise-hand',username);                                               
});


//listening for raiseHand event
socket.on('raiseHand', username =>{                  
    $('ul').append(`<div class="message"><b>${username}</b>:✋</div><br/>`)
});

//when hang up button is clicked 
const exitButton = document.querySelector("#exit_button");

exitButton.addEventListener("click", (e) => {
  if(confirm("Do you want to leave the meeting?")){
    var leave = window.open("leftmeet.html", "_self");
    leave.close();
    }
  }
);
