import React, { useEffect, useState } from 'react';
import './App.css';
import { Calendar } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import Header from './Components/Header/Header';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from "axios";

function App() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [workoutValue, setWorkoutValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [distanceValue, setDistanceValue] = useState('');
    const [roleValue, setRoleValue] = useState('EASY');
    const [workoutsByDate, setWorkoutsByDate] = useState({});
    const [isWorkoutOnSelectedDate, setIsWorkoutOnSelectedDate] = useState(false);
    const [workoutsOnSelectedDate, setWorkoutsOnSelectedDate] = useState([]);



    const handleRoleChange = (event) => {
        setRoleValue(event.target.value);

    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);

        const dateKey = newDate.toISOString().split('T')[0];
        const dailyWorkouts = workoutsByDate[dateKey] || [];

        setWorkoutsOnSelectedDate(dailyWorkouts);
        setIsWorkoutOnSelectedDate(dailyWorkouts.length > 0);
        setShowPopup(true);
    };


    const handleWorkoutChange = (event) => {
        setWorkoutValue(event.target.value);
    };

    const handleDistanceChange = (event) => {
        setDistanceValue(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescriptionValue(event.target.value);
    };


    let data = {
        "workOutName": workoutValue,
        "distance": distanceValue,
        "workoutDate": selectedDate,
        "role": roleValue,
        "completed": false,
        "user": {"customerId": 1},
        "workOutDescription" :descriptionValue
    };

    function createNewWorkout(){
        axios.post("http://localhost:8082/workouts", data)
            .then(function (response){
                console.log(response);
                fetchAndOrganizeWorkouts();
                setWorkoutValue("");
                setDistanceValue("");
                setShowPopup(false);

            })
            .catch(function (error){
                console.log(error);
            });
    }

    async function getWorkoutsById() {
        try {
            const response = await axios.get("http://localhost:8082/customers/1/workouts");
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const fetchAndOrganizeWorkouts = async () => {
        const workoutsData = await getWorkoutsById();
        if (workoutsData) {
            const organizedWorkouts = organizeWorkoutsByDate(workoutsData);
            setWorkoutsByDate(organizedWorkouts);
        }
    };

    useEffect(() => {
        fetchAndOrganizeWorkouts();
    }, []); // Empty dependency array means this runs once on mount


    function deleteWorkoutsById(workoutId) {
        axios.delete(`http://localhost:8082/workout/${workoutId}?`)
            .then(function (response) {
                console.log('Workout deleted:', response);
                // Refetch workouts to update the state
                setShowPopup(false)
                fetchAndOrganizeWorkouts();

            })
            .catch(function (error) {
                console.log('Error deleting workout:', error);
            });
    }

    function updateWorkout(workoutId){
        axios.put(`http://localhost:8082/workout/${workoutId}?`, data).then(function (respone){
            console.log(respone)
            fetchAndOrganizeWorkouts();
            setShowPopup(false);
        }).catch(function (error){console.log(error)})
    }


    function organizeWorkoutsByDate(workouts) {
        const workoutsByDate = {};
        workouts.forEach(workout => {
            const dateKey = workout.workoutDate.split('T')[0];
            if (!workoutsByDate[dateKey]) {
                workoutsByDate[dateKey] = [];
            }
            workoutsByDate[dateKey].push(workout);
        });
        return workoutsByDate;
    }

    const roleColors = {
        EASY: 'lightgreen',
        TEMPO: 'lightblue',
        INTERVAL: 'orange',
        RECOVERY: 'lightpink',
    };

    const completedLine = {
        false: "",
        true: "line-through"
    }

    function  renderCalendarCell(date) {
        const dateKey = date.toISOString().split('T')[0];
        const dailyWorkouts = workoutsByDate[dateKey];

        return (
            <div className="calendarCell">
                {dailyWorkouts && dailyWorkouts.length > 0 ? (
                    <>
                        <div className="workoutEntry" style={{ backgroundColor: roleColors[dailyWorkouts[0].role] || 'gray' }}>
                            <span style={{textDecoration : completedLine[dailyWorkouts[0].completed]}}>{dailyWorkouts[0].workOutName} - {dailyWorkouts[0].distance} km</span>
                        </div>
                        {dailyWorkouts.length > 1 && (
                            <div className="showMore">
                                +{dailyWorkouts.length - 1} more workouts
                            </div>
                        )}
                    </>
                ) : (
                    <div className="noWorkout">REST DAY</div>
                )}
            </div>
        );
    }


    function addNewWorkout(){
        setIsWorkoutOnSelectedDate(false)
    }

    const [selectedWorkoutIdForUpdate, setSelectedWorkoutIdForUpdate] = useState(null);
    const [selectedWorkoutIdForView, setSelectedWorkoutIdForView] = useState(null);

    function handleUpdateClick(workout) {
        // Set the form values to the values of the selected workout
        setWorkoutValue(workout.workOutName);
        setDistanceValue(workout.distance.toString()); // Assuming distance is a number
        setRoleValue(workout.role);
        setSelectedWorkoutIdForUpdate(workout.workoutID);
    }

    function handleViewClick(workout) {
        setSelectedWorkoutIdForView(workout.workoutID);
    }

    function handleCompleteClick(workout){
        axios.put(`http://localhost:8082/workout/${workout}?`, {"completed" : true}).then(function (response){
            console.log(response)
            fetchAndOrganizeWorkouts()
            setShowPopup(false)
        }).catch(function (error){
            console.log(error)
        })
    }


    return (
        <div className={"Body"}>
            <Header />
            <div style={{display: 'block', width: "80%", marginLeft:"10%", textAlign:"center"}}>
                <h4>Calendar</h4>
                <Calendar
                    bordered={true}
                    onSelect={handleDateChange}
                    isoWeek={true}
                    renderCell={renderCalendarCell}
                />
            </div>

            <Popup className={"pop"} open={showPopup} onClose={() => {
                setShowPopup(false);
                setWorkoutValue('');
                setDistanceValue('');
                setDescriptionValue('');
                setRoleValue('EASY');
                setSelectedWorkoutIdForUpdate(null)
                setSelectedWorkoutIdForView(null)
            }}
                   position="right center"
            >
                <div className={"PopUp"} >
                    <h4 className={"popUpTitle"}>{selectedDate ? selectedDate.toDateString() : 'No date selected'}</h4>
                    {isWorkoutOnSelectedDate ? (
                        //Workout already added
                        <div className={"popUpEmpty"}>
                            {workoutsOnSelectedDate.map((workout, index) => (
                                <div key={index} className={"nonEmpty"} >
                                    <div className={"buttons"}>

                                        <h5 className={"workoutInfo"} style={{color:"#4C424A", textDecoration:completedLine[workout.completed]}}>{workout.workOutName} - {workout.distance} km ({workout.role}) </h5>
                                        <div className={"buttonGroup"}>
                                            {(workout.completed === false) && (
                                                <button className={"actionBtn"} onClick={ () => handleCompleteClick(workout.workoutID)}>Completed</button>
                                            )}
                                        <button id={"viewButton"} className={"actionBtn"} onClick={() => handleViewClick(workout)} >View</button>
                                            <button className={"actionBtn"} onClick={() => handleUpdateClick(workout)}>Update</button>
                                        <button className={"actionBtn"} style={{marginLeft:"3px"}} onClick={() => deleteWorkoutsById(workout.workoutID)}>Delete</button>
                                        </div>

                                    </div>
                                    {(selectedWorkoutIdForView === workout.workoutID) && (
                                        <div className={"field"}>
                                            <p>{workout.workOutDescription}</p>
                                        </div>
                                    )}
                                    {(selectedWorkoutIdForUpdate === workout.workoutID) && (
                                        <div className={"inputs"}>
                                            <div className="field">
                                                <input id="workoutName" type="text"  value={workoutValue} onChange={handleWorkoutChange}/>
                                                <label htmlFor="workoutName">Workout Name</label>
                                            </div>
                                            <div className="field">
                                                <input id="distance" type="number" step="0.01" value={distanceValue} placeholder=" " onChange={handleDistanceChange}/>
                                                <label htmlFor="distance">Distance (km)</label>
                                            </div>
                                            <div className="field">
                                                <select name="roles" value={roleValue} onChange={handleRoleChange}>
                                                    <option value="EASY">Easy</option>
                                                    <option value="TEMPO">Tempo</option>
                                                    <option value="INTERVALL">Intervall</option>
                                                    <option value="RECOVERY">Recovery</option>
                                                </select>
                                                <label htmlFor="role">Role</label>
                                            </div>
                                            <button className={"submitBtn"} onClick={() => updateWorkout(workout.workoutID)}>Update workout</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button className={"submitBtn"} onClick={addNewWorkout}>New workout</button>


                        </div>
                    ) : (
                        //Workout not added
                        <div className="popUpEmpty">
                            <div className="field">
                                <input id="workoutName" type="text" placeholder=" " value={workoutValue} onChange={handleWorkoutChange}/>
                                <label htmlFor="workoutName">Workout Name</label>
                            </div>
                            <div className="field">
                                <input id="distance" type="number" step="0.01" value={distanceValue} placeholder=" " onChange={handleDistanceChange}/>
                                <label htmlFor="distance">Distance (km)</label>
                            </div>
                            <div className="field">
                                <select name="roles" value={roleValue} onChange={handleRoleChange}>
                                    <option value="EASY">Easy</option>
                                    <option value="TEMPO">Tempo</option>
                                    <option value="INTERVALL">Interval</option>
                                    <option value="RECOVERY">Recovery</option>
                                </select>
                                <label htmlFor="role">Role</label>
                            </div>
                            { (roleValue === 'TEMPO' || roleValue === "INTERVALL") && (
                                <div className="field additionalInfo">
                                    <textarea value={descriptionValue} onChange={handleDescriptionChange} name="roledescription" id="roleD" cols="40" rows="3"></textarea>
                                    <label htmlFor="description">Additional description for {roleValue} workout</label>
                                </div>
                            )}

                            <button className="submitBtn" onClick={createNewWorkout}>Submit</button>
                        </div>

                    )}
                </div>
            </Popup>

        </div>
    );
}

export default App;
