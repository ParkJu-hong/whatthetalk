import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import socketIOClient from "socket.io-client";

function Chat() {
    const [text, setText] = React.useState('');
    const [messages, setMessages] = React.useState();
    const socket = socketIOClient("http://localhost:80");

    const onSubmit = (e : any) => {
        e.preventDefault();
        socket.emit('send message', { text });
    }
    React.useEffect(() => {
        socket.on('receive message', ( payload ) => {
            console.log(payload);
          })
    }, [])
    return (
        <>
            <section>

            </section>
            <form onSubmit={onSubmit}>
                <input 
                type="text" 
                value={text}
                onChange={(e: any)=>{setText(e.target.value)}}
                />
                <input type="submit" value="전송" />
            </form>
        </>
    )
}

export default Chat
