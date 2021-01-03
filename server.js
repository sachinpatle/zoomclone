const express = require('express');
const { emit } = require('process');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);
const { v4:uuidv4} = require('uuid');

const { ExpressPeerServer} = require('peer');
const peerserver = ExpressPeerServer(server,{
    debug:true
}); 

app.set("view engine","ejs")

app.use(express.static('public'))

app.use('/peerjs',peerserver);

app.get("/:roomid",(req,res)=>{
    res.render("room",{roomid:req.params.roomid})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomid,userid)=>{
        console.log("joined the room"); 
        socket.join(roomid);
        socket.to(roomid).broadcast.emit('user-connected',userid);
        socket.on('message',message=>{
            io.to(roomid).emit('createmessage',message)
        })
    })
    })

app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})



    
server.listen(3030,()=>{
    console.log("server is listing")
})
