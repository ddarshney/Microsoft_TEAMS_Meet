
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");



const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
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

  socket.on('user-connected', userId => {
    setTimeout(() => connectToNewUser(userId, stream),3000)
    
  })
   // input value
   let text = $("input");
   // when press enter send message
   $('html').keydown(function (e) {
     if (e.which == 13 && text.val().length !== 0) {
       socket.emit('message', text.val());
       text.val('')
     }
   });
   socket.on("createMessage", message => {
     $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
     scrollToBottom()
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

// input value
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
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

const inviteButton = document.querySelector("#inviteButton");
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName }
          </span> </b>
        <span>${message}</span>
    </div>`;
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

class SE {
    constructor(mediaStream) {
        this.mediaStream = mediaStream;
    }
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("effect-container");
        const a1 = document.createElement("div");
        a1.classList.add("o1");
        const a2 = document.createElement("div");
        a2.classList.add("o2");
        const a3 = document.createElement("div");
        a3.classList.add("o1");
        this.element.appendChild(a1);
        this.element.appendChild(a2);
        this.element.appendChild(a3);

        this.audioCTX = new AudioContext();
        this.analyser = this.audioCTX.createAnalyser();
        console.log(this.audioCTX);
        const source = this.audioCTX.createMediaStreamSource(this.mediaStream);
        source.connect(this.analyser);

        const frameLoop = () => {
            window.requestAnimationFrame(frameLoop);
            let fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(fbc_array);
            let o1 = fbc_array[20] / 300;
            let o2 = fbc_array[50] / 200;
            o1 = o1 < 0.5 ? 0.19 : o1 > 1 ? 1 : o1;
            o2 = o2 < 0.4 ? 0.19 : o2 > 1 ? 1 : o2;
            a1.style.height = `${o1 * 100}%`;
            a3.style.height = `${o1 * 100}%`;
            a2.style.height = `${o2 * 100}%`;
        };
        frameLoop();
        return this.element;
    }
    replaceStream(stream) {
        this.mediaStream = stream;
        this.audioCTX.close().then((e) => {
            console.log("audiCTX close");
        });
        this.element = this.createElement();
    }
    deleteElement() {
        this.audioCTX.close().then((e) => {
            console.log("audiCTX close");
        });
        this.element.remove();
    }
}

