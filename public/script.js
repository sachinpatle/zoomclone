// const { text } = require("express");


const socket = io('/');
const videogrid = document.getElementById('video-grid')
const myvideo = document.createElement('video');
myvideo.muted = true;
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
}); 

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream = stream;
    addVideoStream(myvideo,stream);

    peer.on('call',call=>{
        call.answer(stream)
        const video =document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',(userid)=>{
        connectToUser(userid,stream)
    })
}).catch(err=>{
    console.log(err)
})

peer.on('open',id=>{
    socket.emit('join-room',roomid,id);
})


const connectToUser=(userid,stream)=>{ 
    const call = peer.call(userid,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)  
    })
}



const addVideoStream = (myvideo,stream)=>{
    myvideo.srcObject = stream;
    myvideo.addEventListener('loadedmetadata',()=>{
        myvideo.play();
    })
    videogrid.append(myvideo)
}

let text  = $('input')
$('html').keydown((e)=>{
if (e.which  == 13  && text.val().length  !== 0){
    console.log(text.val())
    socket.emit('message', text.val());
    text.val('');
}
})
socket.on('createmessage',message=>{
    $('ul').append(`<li class="message"><b>User</b><br/>${message}</li>`)
})