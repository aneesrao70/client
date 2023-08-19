import React, {useState} from 'react'
import './SignIn.css';
import {Link , Navigate } from 'react-router-dom';
import api from '../api';

const SignIn = ({isLoggedIn , setIsLoggedIn}) => {
    const [sData,setSData] = useState({email: '', password: ''});
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFailure, setLoginFailure] = useState('');



    function handleChange(e) {
      setLoginFailure('');
        const {name,value}  = e.target;
        setSData({...sData,[name]:value});      
    } 
    const handleLogin = async () => {
      try {
          const response = await api.post('/api/auth/login', sData);

          if (response.status === 200) {
            const token = response.data.token;
            const userId = response.data.userId;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
              console.log('Login successful');
              setIsLoggedIn(true); 
          } else {
            setLoginSuccess(!loginSuccess);
              console.log('Login failed');
          }
      } catch (error) {
        setLoginSuccess(!loginSuccess);
          console.error('Error logging in', error.response);

      }
  };


  return (
    <div className='container1'>
    {isLoggedIn && <Navigate to="/" />}
        <h1>Sign In</h1>
        <input className='SRinput' value={sData.email} onChange={handleChange} name="email" type='email' placeholder='Email'></input>
        <input className='SRinput' value={sData.password} onChange={handleChange} name="password" type='password' placeholder='Password'></input>
        {loginFailure !== '' && <span className='error'>{loginFailure}</span>}
        <button onClick={handleLogin} >Sign In</button>
        <h4 className = 'footing'>Already have an account? <Link to = "/Register"> Register</Link></h4>
        
    </div>
  )
}

export default SignIn