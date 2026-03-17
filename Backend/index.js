const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const e = require('express');
const app = express();
const cors = require('cors');
const port = 5000

app.use(bodyParser.json());
app.use(cors());

let users = []
let counter = 1 ;
let conn = null

const initDBConnection = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 5500
    })
}

    //path = GET / users สำหรับ get ข้อมูล  user ทั้งหมด
      app.get('/urers', async (req, res) => {
        const results = await conn.query('SELECT * FROM users')
         res.json(results[0]);  
        
    });
       
    const validateData = (userData) => {
    let errors = [];
    if (!userData.title) {
        errors.push('กรุณาเลือกคำนำหน้า')
    }
    if (!userData.first_name) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.last_name) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.date_of_birth) {
        errors.push('กรุณาเลือกวันเกิด');
    }
    if (!userData.email) {
        errors.push('กรุณากรอกอีเมล');
    }
    if (!userData.password) {
        errors.push('กรุณากรอกรหัสผ่าน');
    }
    if (!userData.role) {
        errors.push('กรุณากรอกบทบาท');
    }
    if (!userData.education_level) {
        errors.push('กรุณาเลือกระดับการศึกษา');
    }
    if (!userData.province) {
        errors.push('กรุณาเลือกจังหวัด');
    }
    
    return errors;
}
// path = POST /users สำหรับเพิ่ม user ใหม่  
app.post('/users', async (req, res) => {
    try{
       let user = req.body;
       const error = validateData(user);
       if (error.length > 0) {
        //    //ถ้ามี
        //    throw {
        //     message: 'กรอกข้อมูลไม่ครบถ้วน',
        //     error: error
        // }
     }
     const results = await conn.query('INSERT INTO users SET ?', user);
     res.json({
        message: 'User created successfully',
        data: results[0]
    })
} catch(error) {
    const errorMessage = error.message || 'Error crasting user';
    const errors = error.errors || [];
    console.error('Error creating user:',error.message);
    res.status(500).json({
        message: errorMessage,
        errors:errors
    });
   }
});


app.listen(port, async () => {
    await initDBConnection();
    console.log(`Server is running on port ${port}`)
});