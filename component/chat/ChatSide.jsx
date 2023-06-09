import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import style from "./styles/chatside.module.scss";
import {useRouter} from "next/router"
const socket = io(process.env.NEXT_PUBLIC_SOCKET);
import axios from "axios"
export default function ChatSide() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [id, setID] = useState("");
  let api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  useEffect(() => {
    // alert("hi")
    axios.get(`${api}api/chats`).then((e)=>{
      setMessages([...messages, e.data.chats.flat(Infinity)].flat(Infinity));
      console.log(e.data.chats)
    })
  }, []);
  console.log(messages)
  useEffect(()=>{
    const id = localStorage.getItem("id")
    !id && router.push("/")
    // alert(id)
    setID(id)
  },[])
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  function handleKeyPress(event) {
    if (event.key === "Enter"&& text !=="") {
      socket.emit("message", {text,id});
      setText("");
    }
  }

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={style.chatSideMain}>
      <div className={style.messageContainer}>
        <div className={style.chatList}>
          {messages.map((message) => (
            <Chat key={message.id} message={message} />
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className={style.inputDiv}>
        <div className="input-box">
          <input
            type="text"
            className="input-box__input"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="input-box__button">Send</button>
        </div>
      </div>
    </div>
  );
}

const Chat = ({ message }) => {
  const { name, text } = message;
  return (
    <div className={style.chatBox}>
      <img src="favicon.ico" alt="" />
      <div>
        <h1>{name}</h1>
        <p>{text}</p>
        {/* <span>{timestamp}</span> */}
      </div>
    </div>
  );
};
