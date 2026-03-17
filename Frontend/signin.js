const BASE_URL = 'http://localhost:5000'


const response = await axios.get(`${BASE_URL}/users/${id}`)
const user = response.data

validateData = (userData) => {
    let errors = []
    if (!userData.title) {
      errors.push('กรุณาเลือกคำนำหน้า')
    }
    if (!userData.first_name) {
      errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.last_name) {
      errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.date_of_birth) {
      errors.push('กรุณาเลือกวันเกิด')
    }
    if (!userData.email) {
      errors.push('กรุณากรอกอีเมล')
    }
    if (!userData.passwor) {
      errors.push('กรุณากรอกรหัสผ่าน')
    }
    if (!userData.role) {
      errors.push('กรุณาเลือกบทบาท')
    }
    if (!userData.education_level) {
      errors.push('กรุณาเลือกระดับการศึกษา')
    }
    if (!userData.province) {
      errors.push('กรุณาเลือกจังหวัด')
    }

    return errors
  }

  const submitData = async () => {
    let titleDOM = document.querySelector('input[name = titlename]')
      let firstNameDOM = document.querySelector('input[name = first_name]')
      let lastNameDOM = document.querySelector('input[name = last_name]')
      let date_of_birthDOM = document.querySelector('input[name = date_of_birth')
      let emailDOM = document.querySelector('input[name = email]') 
      let passwordDOM = document.querySelector('input[name= password')
      let roleDOM = document.querySelector('input[name = role')
      let education_levelDOM = document.querySelector('input[name = education_level')
      let provinceDOM = document.querySelector('input[name = province')

    let messageDOM = document.getElementById('message')

    try {
      const userData =  {
        title : titleDOM.value,
        firstName : firstNameDOM.value,
        lastName : lastNameDOM.value,
        date_of_birth : date_of_birthDOM.value,
        passwordDOM : passwordDOM.value,
        roleDOM : roleDOM.value,
        education_level : education_levelDOM.value,
        province : provinceDOM.value
      }
      
      console.log('submit data', userData)

      const errors = validateData(userData)

      if (errors.length > 0) {
        throw {
          message: 'กรอกข้อมูลไม่ครบ!',
          errors: errors
        }
      }

      const response = await axios.post(`${BASE_URL}/users`, userData)
      console.log('response', response.data)

      messageDOM.innerHTML = 'สมัครสมาชิกสำเร็จ!'
      messageDOM.className = 'message success'

    } catch (error) {
      console.log('error', error.erros)

      if (error.response) {
        error.message = error.response.data.message
        error.errors = error.response.data.errors
      }

      let html = `<div>${error.message}</div>`
      if (error.errors && error.errors.length > 0) {
        html += '<ul>'
        error.errors.forEach(e => { html += `<li>${e}</li>` })
        html += '</ul>'
    }

      messageDOM.innerHTML = html
      messageDOM.className = 'message danger'
    }
  }