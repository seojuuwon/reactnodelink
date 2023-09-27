const express = require('express');
const app = express();

// const session = require('express-session');
// const fileStore = require('session-file-store')(session);

const indexRouter = require('./routes');
const userRouter = require('./routes/user');

const path = require('path');
// cross 오류를 해결하기 위한 모듈
// npm i cors
const cors = require('cors');

// cross 오류를 해결하기 위한 미들웨어
app.use(cors());

// body-parser 미들웨어를 대체하는 express 내장 모듈 사용
app.use(express.urlencoded({ extended : true }));
app.use(express.json());


app.set('port', process.env.PORT || 3001);

// 정적인 파일 관리
app.use(express.static(path.join(__dirname, 'react-project', 'build')));

// 세션 저장소 관리
// app.use(session({
//     httpOnly : true,
//     resave : false,
//     secret : 'secret',
//     store : new fileStore()
// }))

// 라우터 미들웨어
app.use('/', indexRouter);
app.use('/user', userRouter);
// 라우트 와일드카드
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'react-project', 'build', 'index.html'))
});


app.listen(app.get('port'), ()=>{
    console.log('port waiting ..🪐')
});