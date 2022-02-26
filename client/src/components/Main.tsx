import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Chat from './Chat';

function Main() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    useEffect(()=>{
        axios.get('http://localhost:80/',
            { withCredentials: true}
        )
        .then((data)=>{
            if(data.data.result === 'User have sesseion'){
                setIsLogin(true)
            } 
        })
    },[])

    const onChange = (e: any) => {
        const { target: { name, value } } = e;
        if (name === 'email') {
            setEmail(value)
        } else {
            setPassword(value);
        }
    }
    const onSubmit = (e: any) => {
        e.preventDefault();
        axios
        .post("http://localhost:80/login",
        {
            email,
            password
        }, { withCredentials: true })
        .then((data) => {
            console.log(data);
            if(data.data.result === 'User have sesseion'){
                setIsLogin(true)
            }
        })
        .catch((err) => {
            console.error(err);
        })
        setEmail('');
        setPassword('');
    }

    return (
        <>
            <div style={{
                width: '30vw',
                margin: '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <h1>실시간 채팅 앱</h1>
                {isLogin ? <Chat /> : <div style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="email"
                            placeholder="email"
                            value={email}
                            onChange={onChange}
                        ></input>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            onChange={onChange}
                        ></input>
                        <LoginButton 
                        type="submit"
                        value="로그인"
                    />
                    </form>
                </div>}
            </div>
        </>
    )
}

const LoginButton = styled.input`
    width: 10vw;
    border: 1px solid skyblue;
    background-color: rgba(0,0,0,0);
    color: skyblue;
    padding: 5px;
`
const LogoutButton = styled.button`
    width: 10vw; 
    border: 1px solid skyblue;
    background-color: rgba(0,0,0,0);
    color: skyblue;
    padding: 5px;
`

export default Main
