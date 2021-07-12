# Microsoft Teams Meet : Let's Connect 💯

A Microsoft Teams Meet clone Web Application made during the **Microsoft Engage Mentorship Programme 2021** that offer you to have a Multi-user video conversation and Group Chat using WebRTC and Socket.io.

<img src = "https://www.businessinsider.in/photo/80131632/How-to-use-custom-background-in-Google-Meet-Zoom-and-Microsoft-Teams.jpg?imgsize=155990" >

# Features 💿⭐
<ul><li>Multi-user video call</li><li>Group chat feature using socket.io</li><li>Screen share</li><li>Video/Audio toggling</li><li>Raise hand feature  in conversation</li><li>Timings in chat</li>
<li>Notification when the user leaves or join the meeting</li></ul>

## 📕 Agile methodology used :
 I have used Agile methodology to build my prototype. <br>
 Each iteration consists of two- to four-week sprints, where each sprint’s goal is to build the most important features first and come out with a potentially deliverable       product. More features are built into the product in subsequent sprints and are adjusted based on stakeholder and customer feedback between sprints.
 Agile development methodology is a concept that includes different techniques that provide the ability to adapt quickly to new conditions.
 
 The whole mentorship program was divided into 4 sprints of 1 week duration.

-    **�⭐Week 1: Research and Design**
     Research on the resources to be followed in a time -bound manner.
     Made a basic low-level design of the product I ideated.
     Learning some web development technologies- JavaScript NodeJS, read about Web RTC and Socket.io to implement real time communication btw 2 users.
     Learning about WebRTC — an open-source framework providing web browsers and mobile applications with real-time communication via simple APIs.
     
-    **�⭐Week 2: Build phase**
     Working on the mandatory feature of the project that is to make video call with peers. I used WebRTC Peer to peer library, Nodejs, Socket.io, Express.
     reating a unique room in the server. I have used uuid library to create a random unique URL for each room. UUID is a javascript library that
     allows us to create unique Ids. I have used PeerJS library that simplifies WebRTC peer-to-peer data, video, and audio calls. PeerJS uses PeerServer for session metadata    and candidate signaling.
     
-   **�⭐Week 3: Additional features and deployment** - Adding a prompt to take custom custom
user names and map it with the user id.
Share Screen functionality while streaming
by the user on the server.
Leave button functionality that will direct
the user to the leavemeeting html page and
the participant leaves the meeting.
Also added a join new meeting button if the
left participant wants to start the new
meeting.

-   **�⭐Week 4: Adapt phase**  Added the text messaging facility with other members in the same room ,
with the custom username being the display name - kind of a basic chat
application facility using socket.io. I added the notification facility when the user joins/leaves and raise hand feature.



## Live Demo 🌞

For deploy the project I use [heroku](https://heroku.com)

[Microsoft Meet Clone](https://microsoft-teams-meet.herokuapp.com)
## Tools / Web technologies used 🧰: 

-   [Node Js](https://nodejs.org/en/) - The Backend
-   [Peer JS](https://peerjs.com/) - PeerJS simplifies WebRTC peer-to-peer data, video, and audio calls.
-   [SocketIo](https://socket.io/) - For realtime communication
-   [NPM](https://www.npmjs.com/) - Dependency Management
-   [GIT](https://git-scm.com/) - Used for version control
-   [Heroku](https://heroku.com) - Used to Deploy Node.js applications

# Running Locally 🖥️
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
You have to install [Node.js](https://nodejs.org/en/) in your machine.

After installing node clone the repo by using git

```
git clone https://github.com/ddarshney/Microsoft_TEAMS_Meet.git
       
```
Or you can also download the zip file.

Then open cmd or git bash on the project folder to install some modules that I used to build this project

Install Once

```
npm install
```

[Nodemon](https://www.npmjs.com/package/nodemon) For automatically restart the server as a dev dependency (optional)

```
npm i --sav-dev nodemon
```

If you install nodemon the you can use. (devStart script is already added to the package.json)

```
npm run devStart
```
or
```
node server.js
```

- Run the App on 
```localhost:8569```

# Plans for future release 📆
- Adding authentication
- Keeping chat window active before and after the video meeting
- Adding a whiteboard for collaborative editing.
- Continue the group chat before and after the meeting using pre-built APIs. 
- Automatic text wrapping in chat messages.
- Adding more features like record screen.
- Adding and saving Participant list.
- Giving admin ability to mute/ remove other participants.
- Customizing chat feature- Adding emoticons in chat messages.


# Contributors ✨
- <a href= 'https://github.com/ddarshney'> Dibya Darshney</a> - darshneyd@gmail.com

# Feature Suggestion 💎🌠
- Create an Issue explaining the Feature

# Special thanks to my Mentors for their valuable feedback and inputs✨

 - gauravsehgal@microsoft.com
 - Harshit.Sharma@microsoft.com

# Contributing 🤝
- Fork the Project
- Set origin to new fork ```git remote set-url origin new.git.url/here```
- Create your Feature Branch ```git checkout -b feature/AmazingFeature```
- Commit your Changes ```git commit -m 'Add some AmazingFeature'```
- Push to the Branch ```git push origin feature/AmazingFeature```
- Open a Pull Request

# Issues  🔓
If you find any errors/issues, feel free to create an Issue



