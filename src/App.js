
import logo from './logo.svg';
import './App.css';

import React, { useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { getFirestore, collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from "firebase/firestore";

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useState } from 'react';


import Cookies from 'universal-cookie';
import { signOut } from 'firebase/auth';
const cookies = new Cookies()

const config = {
  apiKey: "AIzaSyA3zgNS3HkObepf4y3lSwz3dlvTbOv2l5g",
  authDomain: "chatapp-40180.firebaseapp.com",
  projectId: "chatapp-40180",
  storageBucket: "chatapp-40180.appspot.com",
  messagingSenderId: "1008782062869",
  appId: "1:1008782062869:web:13527dc9d81a75c1eb251c",
  measurementId: "G-Y4S3YXT6FS"

}

const app = firebase.initializeApp(config)
const Auth = firebase.auth(app);
const db = getFirestore(app);

/*function ChatMessage(props){

  console.log("messaged")

  const {text, uid, photoUrl} = props.message;
  const msgClass = uid === firebase.auth.currentUser.uid ? 'sent' : 'received';

return(
<>
  <div className={`message ${msgClass}`}>

    <p>
      {text}
    </p>

  </div>

</>

)}*/


function ChatRoom(){

  const messageRef = collection(db, "msgs");
  const [newMsg, setNewMsg] = useState("")
  const [msgs, setMsgs] = useState([])

  //const query = messageRef.orderBy('createdAt').limit(25)
  //const [messages] = useCollectionData(query, {idField: 'id'});


useEffect(() => {
  const queryMsgs = query(messageRef, orderBy('createdAt'))
  let disconnect = onSnapshot(queryMsgs, (snapshot) => {
    let msgs = []
    snapshot.forEach((doc) => {
      msgs.push({ ...doc.data(), id: doc.id})
    });
    setMsgs(msgs);
  })

  return () => disconnect;
}, [])

  const SendNewMsg = async(e) => {

    e.preventDefault();
    console.log(newMsg);

    if (newMsg === "") return;

    await addDoc (messageRef,{
        text: newMsg,
        createdAt: serverTimestamp(),
        user: Auth.currentUser.displayName,
        photoURL: Auth.currentUser.photoURL,
    });

    setNewMsg("")
  }

  return(
  <div className='chatRoomHeader'>

    <div className='msgs'>
      {" "}
      {msgs.map((msg) => (
      <div className='main' key = {msg.id}>
        <span className = 'userList' >
        {msg.user}:
        </span>


        <div className = 'msg__text' > 
        <img className='pfp' src={msg.photoURL} width="30" height="30"/>
        {msg.text} 
        </div>

        </div>
      ))}

    </div>
      <form className='newMsgForm' onSubmit={SendNewMsg}>
        <input 
        className='newMsgForm' 
        placeholder='enter a message ..' 
        onChange= {(e) => setNewMsg(e.target.value)} 
        value={newMsg} />

        <button type='submit' className='sendButton'>
          Send
        </button>
      </form>



    </div>



  )

}


function SignIn(){
  const signInGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    Auth.signInWithPopup(provider);
  };

  return(
    <button onClick={signInGoogle} className='SignIn'> 
      Sign In
      </button>
  )
}

function SignOut() {
return Auth.currentUser && (
  <button onClick={() => {
    Auth.signOut()
    
  }} className='SignOut'>
    Sign Out
  </button>
)

}

function App() {

  const[user] = useAuthState(Auth);

  return (
    
    <div className="App" type = "text/babel">
      <h1 className="main_header">
        Chat App By Reactive! 💥
        <h2> Chat with Friends! 💬 </h2>
      </h1>


      <section>
        {user ? <ChatRoom /> : <SignIn/>}
        {user ? <SignOut /> : null}
      </section>


    </div>
  );
}

// {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}

export default App;
