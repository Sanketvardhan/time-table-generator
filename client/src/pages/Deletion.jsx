import React, { useState } from 'react'
// import './Sty.css'
import axios from 'axios'

function Delete() {
  const [del, setDel] = useState({
    subject_id: null,
  })
  const handleChange = (e) => {
    setDel((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handelClick = async (e) => {
    e.preventDefault()
    try {
      console.log(del)
      const res = await axios.post('http://localhost:8800/deletion', del)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className='container'>
      <form on onSubmit={handelClick}>
        <h1>Deletion</h1>
        <input
          type="number"
          placeholder="Subject ID"
          onChange={handleChange}
          name="subject_id"
          required
          />
        <button className='btn'>Delete</button>
      </form>
    </div>
  )
}

export default Delete
