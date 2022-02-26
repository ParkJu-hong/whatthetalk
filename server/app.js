const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, { cors: { origin: "*"}});


app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));

app.use(cookieParser());

app.use(session({
    secret: 'secret key',
    resave: true,
    saveUninitialized: false,
    secure: false, 
    store: new FileStore()
}));

let userInfo = {
    name: '이름은 홍길동이렷다'
}

let strategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
}, (req, email, password, done) => {
    if(email === 'test123@naver.com' && password === '1234'){
        done(null,  userInfo)
    }else{
        done(null, false , {message: '아이디 혹은 비밀번호가 틀렸어요!'});
    }
})

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
 console.log("serializeUser user : ", user);
 done(null, user);
}); // 로그인 성공했을때 호출됌
passport.deserializeUser(function (user, done) {
 console.log("deserializeUser user : ", user);
 done(null, user); // 여기 유저는 serializeUser에서 done으로 넘겨준 user임
 // 여기서 최종으로 넘기면 세션에 저장되서 req.user로 사용가능하다?
}); // 모든요청마다 호출됌


app.get('/', (req, res) => {
    console.log('req.user : ', req.user);
    // Authorization을 하기 위한 코드
    if(req.user !== undefined){
        res.json({ result: 'User have sesseion' });
    }else{
        res.json({ result : 'User have not sesseion'});
    }
})

app.post('/login', (req, res, next) => {
    console.log('실행됌?');
    passport.authenticate('local', {}, (err, user, message)=>{
        if(user !== undefined){
            console.log('실행됌?');
            req.logIn(user, (err) => {
                if(err)return next(err);
                res.json({ result: 'User have sesseion' });
            });
        }
    })(req, res, next);
})
app.get('/logout', (req, res) => {
    req.logOut();
    res.json({ result : 'User have not sesseion'});
})

/* socket.io 통신 */
io.on("connection", (socket) => {
    socket.on("send message", (payload) => {
        console.log(payload);
        io.emit('receive message', { payload })
    })
});

httpServer.listen(80, ()=>{
    console.log('80 실행됌!')
})