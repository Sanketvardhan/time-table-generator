import React, {  useEffect } from 'react'
import axios from 'axios'

function Timeintake({timeinfo, setTimeinfo}) {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8800/timeintake')
        const data = res.data
        const subjectNames = []
        const numberOfLectures = []

        data.forEach((item) => {
          subjectNames.push(item.name_of_subject)
          numberOfLectures.push(item.number_of_lectures_per_week)
        })

        setTimeinfo((prev) => ({
          ...prev,
          name_of_subject: subjectNames,
          number_of_lectures_per_week: numberOfLectures,
        }))
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    setTimeinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      console.log(timeinfo)

      // const res = await axios.post('http://localhost:8800/insertinfo', timeinfo);
      // console.log(res);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='container'>
      <form onSubmit={handleClick}>
        <h1>Time Information</h1>
        <input
          type="text"
          placeholder="Start Time"
          onChange={handleChange}
          name="start_time"
        />
        <input
          type="text"
          placeholder="Lunch Start"
          onChange={handleChange}
          name="lunch_start"
        />
        <input
          type="text"
          placeholder="Lunch End"
          onChange={handleChange}
          name="lunch_end"
        />
        <input
          type="text"
          placeholder="End Time"
          onChange={handleChange}
          name="end_time"
        />
        <input
          type="number"
          placeholder="Number Of Days"
          onChange={handleChange}
          name="num_days"
        />
        <button className='btn' type="submit">Submit</button>
      </form>
    </div>
  )
}



export default Timeintake