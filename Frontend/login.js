const BASE_URL = 'http://localhost:5000'

const response = await axios.get(`${BASE_URL}/users/${id}`)
const user = response.data

   //นำข้อมูลที่ได้มา มาแสดงในฟอร์ม
      let emailDOM = document.querySelector('input[name=email]')
      let passwordDOM = document.querySelector('input[name=password]')

const validateData = (userData) => {
    let errors = []
    if (!userData.email) {
      errors.push('กรุณากรอกอีเมล')
    }
    if (!userData.password) {
      errors.push('กรุณากรอกรหัสผ่าน')
    }
    return errors
  }

  const submitData = async () => {
    let emailDOM = document.querySelector('input[name=email]')
    let passwordDOM = document.querySelector('input[name=password]')
    let messageDOM = document.getElementById('message')

    const login = async () => {
        try{
            let emailDOM = document.querySelector('input[name=email]');
            let passwordDOM = document.querySelector('input[name=passwordd]');
            let messageDOM = document.getElementById('message');

            let userData = {
                email: emailDOM.value,
                password: passwordDOM.value
            };

            // validate
            let error = validateData(userData);
            if (error.length > 0){
                messageDOM.innerText = error.join(',');
                return;
            }
            //ยิงเข้า Backend
            const response = await axios.post(`${BASE_URL}/login`, userData);

            //ถ้าสำเร็จ
            messageDOM.innerText = 'เข้าสู่ระบบสำเร็จ';
            console.log(response.data);

        } catch (error) {
            let messageDOM = document.getElementById('message');

            if (error.response){
            //error จาก Backend
            messageDOM.innerText = error.response.data.message;
            }else {
                messageDOM.innerText = 'เกิดข้อผิดพลาด';
            }
        }
    }
};