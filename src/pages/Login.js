import './Login.css'
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';




function Login(){
    let navigate = useNavigate();
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    let loginData = {
        "email" : emailValue,
        "password" : passwordValue
    }

    const handleClick = () => {
        axios.post("http://localhost:8082/login", loginData).then(
            function (response){
                Cookies.set('Token', response.data.token);
                console.log(response.data.token)
                navigate('/menu');
            }
        ).catch(function (error){ console.log(error)})
    };

    const handleEmailChange = (event) => {
        setEmailValue(event.target.value)

    }

    const handlePasswordChange = (event) => {
        setPasswordValue(event.target.value)

    }

    return(

        <div className="login-view">
            <div className="form">
                <div className="text-wrapper-3">LOG IN</div>
                <div className="span">
                    <div className="text-wrapper-4">
                        <NavLink to="/createaccount" activeClassName="active">New user? Create account</NavLink>

                    </div>

                </div>
                <div className={"field"}>
                    <input type="email" id={"email"} value={emailValue} onChange={handleEmailChange}/>
                    <label htmlFor="Email">EMAIL</label>

                </div>
                <div className={"field"}>
                    <input type="password"  id={"password"} value={passwordValue} onChange={handlePasswordChange}/>
                    <label htmlFor="Email">PASSWORD</label>

                </div>
                <button className={"submitBtn"} onClick={handleClick} >Sign in</button>

            </div>
        </div>

    )
}

export default Login