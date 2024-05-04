import React, { useState, useEffect } from 'react'
import Info from '../pages/Info'
import Intake from '../pages/Intake'
import Deletion from '../pages/Deletion'
import Timeintake from '../pages/Timeintake'
import { Grid } from 'gridjs-react'
import './Home.css'

function Home() {
  const [pythonResult, setPythonResult] = useState(null)
  const [pyodide, setPyodide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeinfo, setTimeinfo] = useState({
    start_time: '',
    lunch_start: '',
    lunch_end: '',
    end_time: '',
    num_days: '',
    name_of_subject: [],
    number_of_lectures_per_week: [],
    probability: null,
  })

  const handleTimeinfoChange = (updatedTimeinfo) => {
    setTimeinfo(updatedTimeinfo)
  }

  useEffect(() => {
    // Load Pyodide when the component mounts
    async function loadPyodide() {
      if (!window.languagePluginLoader || !window.pyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
        })
        setPyodide(pyodide)
      } else {
        setPyodide(window.pyodide)
      }
      setLoading(false)
    }
    loadPyodide()
  }, [])

  const handleClick = async () => {
    if (!pyodide || loading) {
      console.log('Pyodide is not yet loaded')
      return
    }

    const pythonScript = `
    import datetime
    import random
    import json
    
    class Lecture:
        def __init__(self, subject):
            self.subject = subject
    
    def generate_timetable(start_time, lunch_start, lunch_end, end_time, subjects, num_lectures, num_days, l):
        timetable = []
    
        # Calculate the total number of minutes available for lectures in a day
        total_minutes_per_day = (end_time - start_time).seconds // 60
        # Deduct the time for lunch break if any
    
    
    
        if start_time <= lunch_start < lunch_end:
            Break_start = total_minutes_per_day - ((lunch_start - start_time).seconds // 60)
            Break_end = total_minutes_per_day - ((lunch_end - start_time).seconds // 60)
    
    
    
        # Calculate the default duration for each subject (assuming 1 hour)
        default_subject_duration = 60  # minutes
    
        # Calculate the number of days in a week
        num_days_in_week = num_days  # Assuming a 5-day school week
    
        # Generate timetable for each day of the week
        for day in range(1, num_days_in_week + 1):
            # Calculate the current day's start and end time
            current_start_time = start_time + datetime.timedelta(days=day - 1)
    
            # Check if it's lunchtime
            if lunch_start <= current_start_time < lunch_end:
                current_start_time = lunch_end
    
            # Allocate lectures for the day
            lectures_for_day = []
            real_num_of_lectur=[]
            pos=[0,1]
            remaining_minutes = total_minutes_per_day
            for i in range(0,len(num_lectures)):
                if num_lectures[i] > 0:
                    temp=random.choices(pos , weights=[l,len(subjects)] , k=1 )
                    temp=temp[0]
                    real_num_of_lectur.append(temp)
                else:
                    real_num_of_lectur.append(0)
    
            while remaining_minutes >= default_subject_duration:
                # Choose a random subject from the list of subjects
                if (Break_start >= remaining_minutes) and (remaining_minutes > Break_end) :
                    remaining_minutes -= (Break_start - Break_end)
                    lecture = Lecture("LUNCH BREAK")
                    lectures_for_day.append((current_start_time, lecture))
                    current_start_time += datetime.timedelta(minutes=Break_start - Break_end)
                    pass
                
                amount_of_number=num_lectures.pop(0)
                second_fac_oth=real_num_of_lectur.pop(0) if real_num_of_lectur else None
                
                subject = subjects.pop(0)
                subjects.append(subject)  # Rotate subjects to ensure all subjects are used
    
                # Create a lecture object
                if ((amount_of_number > 0) and (second_fac_oth == 1)):
                    lecture = Lecture(subject)
                    lectures_for_day.append((current_start_time, lecture))
                    amount_of_number-=1
                    # Update remaining minutes and current start time
                    num_lectures.append(amount_of_number)
                    real_num_of_lectur.append(0)
                    remaining_minutes -= default_subject_duration
                    current_start_time += datetime.timedelta(minutes=default_subject_duration)
                else:
                    subject = "OFFICE HOURS"
                    lecture = Lecture(subject)
                    lectures_for_day.append((current_start_time, lecture))
                    num_lectures.append(amount_of_number)
                    real_num_of_lectur.append(0)
                    remaining_minutes -= default_subject_duration
                    current_start_time += datetime.timedelta(minutes=default_subject_duration)
    
            # Add the lectures for the day to the timetable
            timetable.append((day, lectures_for_day))
    
        return timetable
    
    def export_json(timetable):
        timetabledict={}
        tm=[]
        for day, lectures in timetable:
            for time, lecture in lectures:
                tm.append(f"{time}"[11:-3])
            timetabledict["TIME"]=tm
            break
        
        for day, lectures in timetable:
            sub=[]
            timetabledict[f"day{day}"]={}
            for time, lecture in lectures:
                sub.append(lecture.subject)
            timetabledict[f"day{day}"]=sub
    
        # Extracting columns
        columns = ["TIME"]
        for day in timetabledict.keys():
            if day != "TIME":
                columns.append(day)
    
        # Extracting rows
        rows = []
        for i in range(len(timetabledict["TIME"])):
            row = [timetabledict["TIME"][i]]
            for day in timetabledict.keys():
                if day != "TIME":
                    row.append(timetabledict[day][i])
            rows.append(row)
    
        # Creating the desired format
        result = {"col": columns}
        for i in range(len(rows)):
            result[f"row{i+1}"] = rows[i]
            
        
        obj=json.dumps(result)
        return obj
    
        timetabledict={}
        tm=[]
        for day, lectures in timetable:
            for time, lecture in lectures:
                tm.append(f"{time}"[11:-3])
            timetabledict["TIME"]=tm
            break
        
        for day, lectures in timetable:
            sub=[]
            timetabledict[f"day{day}"]={}
            for time, lecture in lectures:
                sub.append(lecture.subject)
            timetabledict[f"day{day}"]=sub
        
        
        obj=json.dumps(timetabledict)
        # with open("data.json","w") as file:
        #     file.write(obj)
        return obj
    
    
    
    def main():
        start_time = "${timeinfo.start_time}"
        lunch_start = "${timeinfo.lunch_start}"
        lunch_end = "${timeinfo.lunch_end}"
        end_time = "${timeinfo.end_time}"
    
        num_days = ${timeinfo.num_days}

        if num_days > 6:
            num_days = 6

        subjects = ${JSON.stringify(timeinfo.name_of_subject)}
    
        num_lectures = ${JSON.stringify(timeinfo.number_of_lectures_per_week)}

        l = ${timeinfo.probability}
    
        start_time = datetime.datetime.strptime(start_time, "%H:%M")
        lunch_start = datetime.datetime.strptime(lunch_start, "%H:%M")
        lunch_end = datetime.datetime.strptime(lunch_end, "%H:%M")
        end_time = datetime.datetime.strptime(end_time, "%H:%M")
    
        timetable = generate_timetable(start_time, lunch_start, lunch_end, end_time, subjects, num_lectures, num_days,l)
        return export_json(timetable)
    main()
    `
    var result = await pyodide.runPythonAsync(pythonScript)
    result = JSON.parse(result)
    setPythonResult(result)
  }

  const handleProbChange = (e) => {
    const prob = e.target.value
    setTimeinfo((prevState) => ({
      ...prevState,
      probability: prob,
    }))
  }

  const columnNames = [
    'TIME',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return (
    <div className="Home">
      {/* Page Starting from here */}
      <h1 className='Heading'>Time-Table Generator</h1>
      <Intake />
      <Info />
      <Deletion />
      <Timeintake setTimeinfo={handleTimeinfoChange} timeinfo={timeinfo} />
      <div className="end">
        {/* {console.log(timeinfo.name_of_subject)} */}
        {timeinfo.name_of_subject.length !== 0 ? (
          <div className="prob">
            <label htmlFor="prob">Probability:</label>
            <select
              id="prob"
              name="prob"
              className="btn"
              value={timeinfo.probability}
              onChange={handleProbChange}
            >
              <option value="">Select Probability</option>
              {timeinfo.name_of_subject.map((subject, index) => (
                <option key={index} value={index}>
                  {index+1}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <button className="btn" onClick={handleClick} disabled={loading}>
          Generate Timetable
        </button>
      </div>

      {pythonResult && (
        <div className="InfoTable">
          <Grid
            data={Object.keys(pythonResult)
              .slice(1)
              .map((key) => {
                return pythonResult[key]
              })}
            columns={columnNames}
          />
        </div>
      )}
    </div>
  )
}

export default Home
