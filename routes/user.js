/**
 * User와 관련된 Router 모음
 * - DB와 연결 가능
 * - 기능 : 회원가입, 아이디 중복체크, 로그인, 회원탈퇴, 로그아웃, 회원검색
 * - 작성자 : 서주원 (23.09.19.) v11
 */

const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 회원가입 시, ID 중복 체크
router.post("/checkId", (req, res) => {
    console.log("check ID Router❕", req.body);
    let { id } = req.body;

    let sql = `select id from project_member where id = ?`;
    conn.query(sql, [id], (err, rows) => {
        console.log("rows", rows);
        console.log("err", err);

        if (err == null) {
            // 오류가 없다면
            if (rows.length > 0) {
                // 중복 데이터 존재하면
                res.json({ result: "dup" });
            } else {
                // 가입 가능
                res.json({ result: "uniq" });
            }
        }
    });
});

// 회원가입 라우터
router.post("/join", (req, res) => {
    console.log("join Router❕");
    let { id, pw, name, email } = req.body;
    console.log("join : ", req.body);

    let sql = `insert into project_member values (?, ?, ?, ?)`;
    conn.query(sql, [id, pw, name, email], (err, rows) => {
        console.log("rows", rows);
        console.log("err", err);

        if (rows.affectedRows > 0) {
            // 회원가입 성공
            res.json({
                msg: "success",
                name: name,
            });
        } else {
            // 회원가입 실패
            res.json({ msg: "failed" });
        }
    });
});

// 로그인 라우터
router.post("/login", (req, res) => {
    console.log("login Router!");
    let { id, pw } = req.body;
    console.log("login", req.body);

    let sql = `select id, user_name, address from project_member where id = ? and pw = ?`;
    conn.query(sql, [id, pw], (err, rows) => {
        // console.log('rows : ', rows)
        console.log("user : ", rows[0]);

        if (rows.length > 0) {
            // req.session.user = rows[0]
            // console.log('session 저장', req.session.user)

            res.json({
                msg: "success",
                user: rows[0],
            });
        } else {
            res.json({
                msg: "failed",
            });
        }
    });
});

// 비밀번호 수정 라우터
router.post("/checkPw", (req, res) => {
    console.log('checkPw Router!');
    let { id, currentPW,  changePW } = req.body;
    console.log('비밀번호 수정, ', req.body);

    // 아이디, 비번이 동일한 데이터가 있는지 먼저 확인 (우리회원인지)
    let selSql = `select id, pw from project_member where id = ? and pw = ?`;
    let UpSql = `update project_member set pw = ? where id = ?`;

    conn.query(selSql, [id, currentPW], (err, rows) => {
        console.log('current rows, ', rows)

        if (rows.length > 0) {
            // 아이디와 비번이 있다면 변경 실행
            conn.query(UpSql, [changePW, id], (err, rows) => {
                console.log('change pw, ', rows)

                if (rows.affectedRows > 0) {
                    // 비밀번호 변경 성공
                    res.json({
                        msg: 'success'
                    })
                }
            })
        } else {
            // 변경에 실패했거나, 해당 아이디와 비번이 없는 경우
            res.json({
                mag: 'failed'
            })
        }
    })
});

// 회원정보 수정 라우터
router.post('/modify', (req, res) => {
    console.log('modify Router!')
    let {id, new_name, new_email} = req.body
    console.log(req.body)

    let sql = `update project_member set user_name = ?, address = ? where id = ?`;

    conn.query(sql, [new_name, new_email, id], (err, rows) => {
        console.log('회원정보 수정이 됐는가..', rows)

        if (rows.affectedRows > 0) {
            // 수정이 됐다면 다시 정보를 가져와서 세션에 넣을 값 넘겨주기
            // update문은 넘길 데이터가 없어서 select문으로 가져와줌
            let sql2 = `select * from project_member where id = ?`;
            conn.query(sql2, [id], (err, rows) => {
                res.json({
                    msg: 'success',
                    user: rows[0]
                })
            })
        } else {
            res.json({
                msg: 'failed'
            })
        }
    })
})

// 회원탈퇴 라우터
router.post('/delete', (req, res) => {
    console.log('delete Router!')
    let {id, pw, currentId} = req.body;

    let sql = `delete from project_member where id = ? and pw = ?`;
    
    conn.query(sql, [id, pw], (err, rows) => {
        console.log('회원탈퇴가 됐는지.. 확인 ....', rows)

        if (rows.affectedRows > 0) {
            // 회원탈퇴 성공
            res.json({
                msg : 'success',
            })
        } else {
            // 회원탈퇴 실패
            res.json({
                msg : 'failed'
            })
        }
    })
})

// 회원리스트 라우터
router.post('/select', (req, res) => {
    console.log('select Router!')

    let allListSql = `select id, user_name, address from project_member`;
    conn.query(allListSql, (err, rows) => {
        console.log('모든 회원정보 리스트', rows)
        res.json({
            allList: rows
        })
    })
})

// 회원검색
router.post('/search', (req, res) => {
    let {searchId} = req.body
    let searchSql = `select id, user_name, address from project_member where id = ?`;
    conn.query(searchSql, [searchId], (err, rows) => {
        console.log('검색------------------', rows[0])
        res.json({
            user: rows[0]
        })
    })
})

module.exports = router;
