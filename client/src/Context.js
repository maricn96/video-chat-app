import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import axios from 'axios';
import { SERVER_URL } from './environment.js'

const SocketContext = createContext();
const socket = io(SERVER_URL);

const ContextProvider = ({ children }) => {


  const [stream, setStream] = useState();
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  // const [callDeclined, setCallDeclined] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      })

    let currentUser = window.sessionStorage.getItem('currentUser');
    socket.on('me', (id) => {
      setMe(id);
      currentUser !== '' ? window.sessionStorage.setItem('currentSocketId', id) : window.sessionStorage.setItem('currentSocketId', '');
      let user = {
        'socketId': window.sessionStorage.getItem('currentSocketId'),
        'email': currentUser
      }
      axios.post(SERVER_URL + '/assignSocketId', user)
        .then(res => {
        })
    });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    })

    socket.on('callEnded', (signal) => {
      setCallEnded(true);
    })

    // socket.on('callDeclined', (signal) => {
    //   setCallDeclined(true);
    // })

  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      config: {
        iceServers: [
          {
            urls: 'stun:ec2-54-197-17-134.compute-1.amazonaws.com:3478?transport=udp'
          },
          {
            urls: 'turn:ec2-54-197-17-134.compute-1.amazonaws.com:3478?transport=udp',
            username: 'admin',
            credential: 'admin'
          }
        ]
      },
      initiator: false,
      trickle: false,
      stream
    })

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log(new Date());
      console.log(currentStream);
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;

  }

  // const declineCall = () => {
  //   socket.disconnect();
  //   setCallDeclined(true);
  //   connectionRef.current.destroy();
  //   // window.location.reload();
  // }

  const callUser = (id) => {
    const peer = new Peer({
      config: {
        iceServers: [
          {
            urls: 'stun:ec2-54-197-17-134.compute-1.amazonaws.com:3478?transport=udp'
          },
          {
            urls: 'turn:ec2-54-197-17-134.compute-1.amazonaws.com:3478?transport=udp',
            username: 'admin',
            credential: 'admin'
          }
        ]
      }, initiator: true, trickle: false, stream
    });
    peer.on('signal', (data) => {
      window.sessionStorage.setItem('callingUser', id);
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
    })

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    })

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    })

    connectionRef.current = peer;

  }

  const leaveCall = () => {
    window.sessionStorage.removeItem('callingUser');
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  }

  return (
    <SocketContext.Provider value={{ call, callAccepted, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall }}>
      {children}
    </SocketContext.Provider>
  )
}

export { ContextProvider, SocketContext };