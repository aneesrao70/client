import React, {useState} from 'react'
import './SignIn.css';
import {Link , Navigate , useNavigate } from 'react-router-dom';
import api from '../api';
import { Bars } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const SignIn = ({isLoggedIn , setIsLoggedIn}) => {
    const [sData,setSData] = useState({email: '', password: ''});
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFailure, setLoginFailure] = useState('');
    const [errorMsgEmail , setErrorMsgEmail] = useState('');
    const [errorMsgPassword, setErrorMsgPassword] = useState('');
    const [isLoading , setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const notify = () => toast.success("Success, Your are logged in.");
    const History = useNavigate();
    function handleChange(e) {
      setErrorMsgEmail('');
      setErrorMsgPassword('');
      setLoginFailure('');
        const {name,value}  = e.target;
        setSData({...sData,[name]:value});      
    } 
    const handleLogin = async () => {
      setIsLoading(true);
      try {
          const response = await api.post('/api/auth/login', sData);

          if (response.status === 200) {
            const token = response.data.token;
            const userId = response.data.userId;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
              console.log('Login successful');
              setIsLoggedIn(true); 
              setIsLoading(false);
              notify();
              setTimeout(() => {
                History('/'); // Replace '/' with your homepage URL
              }, 1600); 
          } else {
            setLoginSuccess(!loginSuccess);
              console.log('Login failed');
              setIsLoading(false);
          }
      } catch (error) {
        setIsLoading(false);
        setLoginSuccess(!loginSuccess);
          console.error('Error logging in', error.response);
          if (error.response.status === 401) {
            setErrorMsgEmail(error.response.data.message);
          }
          if (error.response.status === 402) {
            setErrorMsgPassword(error.response.data.message);
          }
      }
  };


  return (
      <div>
        { isLoading && (<div className = 'loader-overlay'>
        <div className='loader'>
          <Bars
            height="60"
            width="60"
            color="blue"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          </div>
        </div>)}
        
      <div className = {`container1  ${isLoading ? 'loading' : ''}`}>

          <h1>Sign In</h1>
          <input className='SRinput' value={sData.email} onChange={handleChange} name="email" type='email' placeholder='Email'></input>
          {errorMsgEmail && <span className='error'>{errorMsgEmail}</span>}
          <input className='SRinput' value={sData.password} onChange={handleChange} name="password" type='password' placeholder='Password'></input>
          {errorMsgPassword && <span className='error'>{errorMsgPassword}</span>}
          {loginFailure !== '' && <span className='error'>{loginFailure}</span>}
          <button className='button' onClick={handleLogin} >Sign In</button>
          <h5 style={{margin: '0'}}><Link to="/resetpassword">Forgot Password?</Link></h5>
          <h4 style={{margin: '0'}} className = 'footing'>Already have an account? <Link to = "/Register"> Register</Link></h4>
          <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
              />
          
      </div>
      
      </div>
  )
}

export default SignIn