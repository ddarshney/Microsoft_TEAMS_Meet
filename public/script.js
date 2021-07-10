// Creating a client

const socket = io('/')
const videoGrid = document.getElementById('video-grid')



var myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '8569'
})

var username= prompt("whats your name","user");
socket.emit('new-user', username)
//user is prompted to give hs name
// getting the name of user so that it can be used in chat

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

// Joining the video call meet and getting the user's audio, video
function joinMeet(){
  document.getElementById('meet').style.display = "flex";
  document.getElementById('start').style.display = "none";
}

 // Disconnecting the user
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
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
        if(e.which==13 && text.val().length!==0) {   // 13 is used because numeric value for enter is 13
            socket.emit('message', text.val(), username) ;
            text.val('')  // resetting the text typed to blank
        }
})
  
// adding the message on chat window with the name of sender
 socket.on('createmsg', (msg,username)=> {
        $('ul').append(`<li class="message"><b>${username}</b><br/>${msg}</li>`)
        scrollbottom() ;  // to scroll till last msg in chat window
    })
    
// function to scroll the chat window till bottom every time a message is added 
const scrollbottom=() => {
    let d= $('.chat_window') ;
    d.scrollTop(d.prop("scrollHeight")) ;

}

// Setting the functions of mute or unmute audio buttons
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


// Setting the functions of play or stop video buttons
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


//adding invite link button
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

// Leaving the videocall meet
function leave(){
  document.getElementById('meet').style.display = "none";
  document.getElementById('start').style.display = "flex";
  localStream.getAudioTracks()[0].enabled = false;
  localStream.getVideoTracks()[0].enabled = false;
  stream.removeTrack(stream.getVideoTracks()[0]);

}       


//When record button is clicked
document.getElementById( 'record' ).addEventListener( 'click', ( e ) => {
  /**
   * Ask user what they want to record.
   * Get the stream based on selection and start recording
   */
  if ( !mediaRecorder || mediaRecorder.state == 'inactive' ) {
      h.toggleModal( 'recording-options-modal', true );
  }

  else if ( mediaRecorder.state == 'paused' ) {
      mediaRecorder.resume();
  }

  else if ( mediaRecorder.state == 'recording' ) {
      mediaRecorder.stop();
  }
} );


//When user choose to record screen
document.getElementById( 'record-screen' ).addEventListener( 'click', () => {
  h.toggleModal( 'recording-options-modal', false );

  if ( screen && screen.getVideoTracks().length ) {
      startRecording( screen );
  }

  else {
      h.shareScreen().then( ( screenStream ) => {
          startRecording( screenStream );
      } ).catch( () => { } );
  }
} );


//When user choose to record own video
document.getElementById( 'record-video' ).addEventListener( 'click', () => {
  h.toggleModal( 'recording-options-modal', false );

  if ( myStream && myStream.getTracks().length ) {
      startRecording( myStream );
  }

  else {
      h.getUserFullMedia().then( ( videoStream ) => {
          startRecording( videoStream );
      } ).catch( () => { } );
  }
}) 


function toggleRecordingIcons( isRecording ) {
  let e = document.getElementById( 'record' );

  if ( isRecording ) {
      e.setAttribute( 'title', 'Stop recording' );
      e.children[0].classList.add( 'text-danger' );
      e.children[0].classList.remove( 'text-white' );
  }

  else {
      e.setAttribute( 'title', 'Record' );
      e.children[0].classList.add( 'text-white' );
      e.children[0].classList.remove( 'text-danger' );
  }
}


function startRecording( stream ) {
  mediaRecorder = new MediaRecorder( stream, {
      mimeType: 'video/webm;codecs=vp9'
  } );

  mediaRecorder.start( 1000 );
  toggleRecordingIcons( true );

  mediaRecorder.ondataavailable = function ( e ) {
      recordedStream.push( e.data );
  };

  mediaRecorder.onstop = function () {
      toggleRecordingIcons( false );

      h.saveRecordedStream( recordedStream, username );

      setTimeout( () => {
          recordedStream = [];
      }, 3000 );
  };

  mediaRecorder.onerror = function ( e ) {
      console.error( e );
  };
}

const recordingBtn = document.getElementById("recording-toggle");
const chunks = [];
var recorder;
recordingBtn.addEventListener("click", (e) => {
    const currentElement = e.target;
    const indicator = document.querySelector(".recording-indicator");

    // recording start
    if (indicator == null) {
        currentElement.setAttribute("tool_tip", "Stop Recording");
        currentElement.classList.add("tooltip-danger");
        currentElement.classList.add("blink");
        const recordingElement = document.createElement("div");
        recordingElement.classList.add("recording-indicator");
        recordingElement.innerHTML = `<div></div>`;
        myVideo.previousSibling.appendChild(recordingElement);
        // recording
        record(myVideoStream);
        recorder.start(1000);
    }
    // recording stop
    else {
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        var anchor = document.createElement("a");
        document.body.appendChild(anchor);
        anchor.style = "display: none";
        var url = window.URL.createObjectURL(completeBlob);
        anchor.href = url;
        anchor.download = `aaaa.mp4`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        recorder.stop();
        currentElement.setAttribute("tool_tip", "Start Recording");
        currentElement.classList.remove("tooltip-danger");
        currentElement.classList.remove("blink");
        indicator.remove();
        while (chunks.length) {
            chunks.pop();
        }
    }
});

const record = (stream) => {
    recorder = new MediaRecorder(stream, {
        mineType: "video/webm;codecs=H264",
    });
    recorder.onstop = (e) => {
        delete recorder;
    };
    recorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };
};

//raise hand

const raiseHand = document.getElementById("raiseHand");
  raiseHand.addEventListener("click", (e) => {
  //emit through socket when button is clicked
  socket.emit('raise-hand');                                               
});


//listening for raiseHand event
socket.on('raiseHand', username =>{                  
    $('ul').append(`<li class="message"><b>${username}</b><br/>:✋</li>`)
});

//exit button 

const exitButton = document.querySelector('.main__exit_button');

exitButton.addEventListener("click", (e) => {
  //window.close();
  //process.exit()
  //open(location, '_self').close();
  if(confirm("Are you sure?")){
  var win = window.open("leave.html", "_self");
  win.close();
  }
});
