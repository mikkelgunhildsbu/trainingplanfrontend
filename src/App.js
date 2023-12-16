import React, { useState } from 'react';
import './App.css';
import { Calendar } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import Header from './Components/Header/Header';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from "axios";

function getTodoList(date) {
    const day = date.getDate();

    switch (day) {
        case 10:
            return [
                { time: '10:30 am', title: 'Meeting' },
                { time: '12:00 pm', title: 'Lunch' }
            ];
        case 15:
            return [
                { time: '09:30 pm', title: 'Products Introduction Meeting' },
                { time: '12:30 pm', title: 'Client entertaining' },
                { time: '02:00 pm', title: 'Product design discussion' },
                { time: '05:00 pm', title: 'Product test and acceptance' },
                { time: '06:30 pm', title: 'Reporting' },
                { time: '10:00 pm', title: 'Going home to walk the dog' }
            ];
        default:
            return [];
    }
}


function App() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [DateDate,setDateDate]  = useState(null);
    const [workoutValue, setWorkoutValue] = useState()
    const [distanceValue, setDistanceValue] = useState()

    const handleDateChange = (newDate) => {
        setDateDate(newDate)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(newDate);
        setSelectedDate(formattedDate);
        setShowPopup(true);
    };


    const handleWorkoutChange = (event) => {
        setWorkoutValue(event.target.value)


    };
    const handleDistanceChange = (event) => {
        setDistanceValue(event.target.value)
    };

    let data = {
        "workOutName": workoutValue,
        "distance": distanceValue,
        "workoutDate": DateDate,
        "role": "EASY",
        "completed": false
    }

    function createNewWorkout(){
        axios.post("http://localhost:8082/workouts", data).then(function (response){console.log(response); setWorkoutValue(""); setDistanceValue("")}
        ).catch(function (error){console.log(error); console.log(data)})


    }
    return (
        <div className={"Body"} style={{align: 'center'}}>
            <div>
                <Header></Header>
            </div>
            <div style={{display: 'block', width: 600, paddingLeft: 30}}>
                <h4>Calendar</h4>
                <Calendar
                    bordered={true}
                    onSelect={handleDateChange}
                    isoWeek = {true}
                />
            </div>

            <Popup open={showPopup} onClose={() =>{
                setShowPopup(false)
                setWorkoutValue('');
                setDistanceValue('');
            }}
                   position="right center"
            >
                <div className={"PopUp"}>
                    <h4>{selectedDate ? selectedDate.toString() : 'No date selected'}</h4>
                    <div>
                        <p>Workout:</p>
                        <input id={"workoutValue"} type="text" value={workoutValue} onChange={handleWorkoutChange}/>
                    </div>
                    <div>
                        <p>Distance:</p>
                        <input id={"distanceValue"}  step="0.01" type= "number" value={distanceValue} onChange={handleDistanceChange}/>
                    </div>
                    <div>
                        <p>Role</p>
                        <select name="roles" id="roles">
                            <option value="easy">Easy</option>
                            <option value="tempo">Tempo</option>
                            <option value="interval">Interval</option>
                            <option value="recovery">Recovery</option>
                        </select>
                    </div>
                    <button style={{width : "50%", height: "20px", backgroundColor: "white"}} onClick={createNewWorkout}>Submit</button>
                </div>
            </Popup>
        </div>
    );
}

export default App;
