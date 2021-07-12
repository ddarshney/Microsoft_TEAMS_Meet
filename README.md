# Microsoft_TEAMS_Meet 💯

A video conference Web Application made during the Microsoft Engage Mentorship Programme 2021 that offer you to have a multi-user video conversation using WebRTC and Socket.io.

<img src = "https://www.businessinsider.in/photo/80131632/How-to-use-custom-background-in-Google-Meet-Zoom-and-Microsoft-Teams.jpg?imgsize=155990" >

# Features 💿⭐
<ul><li>Multi-user video call</li><li>Group chat feature using socket.io</li><li>Screen share</li><li>Video/Audio toggling</li><li>Raise hand feature  in conversation</li><li>Timings in chat</li>
<li>Notification when the user leaves or join the meeting</li></ul>

## 📕 Agile methodology used :


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
- Adding more features like record screen
- Giving admin  ability to mute/ remove other participants.
- Customizing chat feature.

# Contributors ✨
- <a href= 'https://github.com/ddarshney'> Dibya Darshney</a> - darshneyd@gmail.com

# Feature Suggestion 💎🌠
- Create an Issue explaining the Feature

# Contributing 🤝
- Fork the Project
- Set origin to new fork ```git remote set-url origin new.git.url/here```
- Create your Feature Branch ```git checkout -b feature/AmazingFeature```
- Commit your Changes ```git commit -m 'Add some AmazingFeature'```
- Push to the Branch ```git push origin feature/AmazingFeature```
- Open a Pull Request

# Issues  🔓
If you find any errors/issues, feel free to create an Issue



