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
app.get('/users', async (req, res) => {
    try {
        // ใช้ YEAR() เพื่อดึงปี ค.ศ. ออกมา
        // และดึงฟิลด์อื่นๆ มาให้ครบตามโครงสร้างตารางของคุณ
        const [results] = await conn.query(`
            SELECT 
                users_id,
                title,
                first_name,
                last_name,
                DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth ,
                email,
                role,
                education_level,
                province
            FROM users
        `);

        res.status(200).json({
            message: "ดึงข้อมูลสำเร็จ",
            data: results
        });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message
        });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const[results] = await conn.query(`
            SELECT 
                u.users_id,
                u.title,
                u.first_name,
                u.last_name,
                DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth, 
                u.email,
                u.role,
                u.education_level,
                u.province
            FROM users u 
            WHERE u.users_id = ?
        `, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้งาน' });
        }

        res.json(results[0]);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
            error: error.message
        });
    }
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