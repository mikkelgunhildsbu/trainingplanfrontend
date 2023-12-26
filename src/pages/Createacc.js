import './Login.css'
import { useNavigate } from 'react-router-dom';




function Createacc(){
    let navigate = useNavigate();


    const handleClick = () => {
        navigate('/');

    };

    return(

        <div className="login-view">
            <div className="form">
                <div className="text-wrapper-3">Create Account</div>
                <div className="span">
                    <div className="text-wrapper-4">

                    </div>

                </div>
                <div className={"field"}>
                    <input type="email"/>
                    <label htmlFor="Email">EMAIL</label>
                </div>
                <div className={"field"}>
                    <input type="text"/>
                    <label htmlFor="Username">USERNAME</label>
                </div>
                <div className={"field"}>
                    <input type="password"/>
                    <label htmlFor="password">PASSWORD</label>
                </div>
                <div className={"field"}>
                    <input type="password"/>
                    <label htmlFor="passwor">REPEAT PASSWORD</label>
                </div>
                <button className={"submitBtn"} onClick={handleClick} >Sign in</button>

            </div>
        </div>

    )
}

export default Createacc