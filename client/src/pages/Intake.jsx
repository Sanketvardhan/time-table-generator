import React, { useState } from 'react'
import axios from 'axios'

function Intake() {
  const [info, setInfo] = useState({
    subject_id: null,
    name_of_subject: '',
    number_of_lectures_per_week: null,
    teacher_id: null,
    first_name: '',
    last_name: '',
  })
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handelClick = async (e) => {
    e.preventDefault()
    try {
      console.log(info)
      const res = await axios.post('http://localhost:8800/insertinfo', info)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className='container'>
      <form on onSubmit={handelClick}>
        <h1>Information</h1>
        <input
          type="number"
          placeholder="Subject ID"
          onChange={handleChange}
          name="subject_id"
          required
          />
        <input
          type="text"
          placeholder="Subject Name"
          onChange={handleChange}
          name="name_of_subject"
          required
          />
        <input
          type="number"
          placeholder="No. Lecture"
          onChange={handleChange}
          name="number_of_lectures_per_week"
          required
          />
        <input
          type="number"
          placeholder="Teacher ID"
          onChange={handleChange}
          name="teacher_id"
          required
          />
        <input
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          name="first_name"
          required
          />
        <input
          type="text"
          placeholder="Last Name"
          onChange={handleChange}
          name="last_name"
          required
        />
        <button className='btn'>Submit</button>
      </form>
    </div>
  )
}

export default Intake
