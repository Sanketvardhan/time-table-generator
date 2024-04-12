import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Lecture = ({ subject, teacher }) => (
  <div>
    <p>Subject: {subject}</p>
    <p>Teacher: {teacher}</p>
  </div>
);

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);

  const generateTimetable = () => {
    const start_time = moment("09:30", "HH:mm");
    const lunch_start = moment("11:30", "HH:mm");
    const lunch_end = moment("13:30", "HH:mm");
    const end_time = moment("17:30", "HH:mm");
    const num_days = 5;
    const teachers = ['abc', 'ef', 'fds', 'afd', 'fdssa'];
    const subjects = ['IIS', 'DBS', 'SS', 'CN', 'EVS', 'IIS-TUT', 'CN-TUT', 'SS-TUT', 'IIS-Lab', 'CN-LAB', 'SS-LAB'];
    const num_lectures = [3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1];
    const timetableData = [];

    const totalMinutesPerDay = moment.duration(end_time.diff(start_time)).asMinutes();

    for (let day = 1; day <= num_days; day++) {
      const currentStartTime = moment(start_time).add(day - 1, 'days');
      const currentEndTime = moment(currentStartTime).add(totalMinutesPerDay, 'minutes');

      let lecturesForDay = [];
      let remainingMinutes = totalMinutesPerDay;

      for (let i = 0; i < num_lectures.length; i++) {
        let amountOfNumber = num_lectures[i];
        let subject = subjects[i];
        let teacher = teachers[i];
        
        if (amountOfNumber > 0) {
          const lecture = { subject, teacher };
          lecturesForDay.push(lecture);
          amountOfNumber--;
          num_lectures[i] = amountOfNumber;
          remainingMinutes -= 60; // Assuming each lecture is 1 hour
        }

        while (remainingMinutes >= 60) {
          if (lunch_start.isBetween(currentStartTime, currentEndTime) && remainingMinutes > lunch_start.diff(currentStartTime, 'minutes')) {
            remainingMinutes -= lunch_end.diff(lunch_start, 'minutes');
            lecturesForDay.push({ subject: "LUNCH BREAK", teacher: "" });
            currentStartTime.add(lunch_end.diff(lunch_start, 'minutes'), 'minutes');
          }

          // Allocate lecture or break as per remaining time
          if (remainingMinutes >= 60) {
            lecturesForDay.push({ subject: "OFFICE HOURS", teacher: "" });
            remainingMinutes -= 60; // Assuming each lecture is 1 hour
            currentStartTime.add(60, 'minutes');
          }
        }
      }

      timetableData.push([day, lecturesForDay]);
    }

    setTimetable(timetableData);
  };

  useEffect(() => {
    generateTimetable();
  }, []);

  const printTimetable = () => {
    // Print timetable logic here
  };

  return (
    <div>
      <h2>Timetable</h2>
      {timetable.map(([day, lectures]) => (
        <div key={day}>
          <h3>Day {day}</h3>
          <div>
            {lectures.map((lecture, idx) => (
              <Lecture key={idx} subject={lecture.subject} teacher={lecture.teacher} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timetable;
