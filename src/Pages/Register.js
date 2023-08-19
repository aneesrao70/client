import React, {useState} from 'react'
import './Register.css';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import api from '../api'



const Register = () => {
    const [data, setData] = useState({uname:'',email:'',password:'',confirmpassword:''});
    const [errors,setErrors] = useState({});
    const [isChecked,setIsChecked] = useState(false);
    const [errorMessages,setErrorMessages] = useState('');
    const [registerationSuccess,setRegisterationSuccess]=useState(false);
  
    const handleCheck = (e)=> {
      setIsChecked(e.target.checked);
    }
    function handleChange(e) {
      setErrorMessages('');
      setErrors({});
      const {name,value}=e.target;
      setData({...data,[name]:value});
    }

    const validation = async() => {
      const regexNum = /^(?=.*\d).+/;
      const regexCap = /^(?=.*[A-Z]).+/;

      let validationErrors = {};
      if (data.uname.trim() === '') {
          validationErrors.na = "Please enter your name";
      }
  
      if (data.email.trim() === '') {
        validationErrors.em = "Please enter your email address"}
        else if (!/\S+@\S+\.\S+/.test(data.email)) {
          validationErrors.em1 = 'Invalid email format';
        }
  
      if (data.password.trim() === '') { 
        validationErrors.pass = "Provide password"}
        else {
          if (data.password.length<8) {
              validationErrors.passlen = "Password length must be 8 or more charaacters"};
          if (!regexNum.test(data.password)) {
              validationErrors.passnum = "Password must have at least one numeric character"};
          if (!regexCap.test(data.password)) {
              validationErrors.passcap = "Password must have at least one capital character"};
        }
      
      if (data.confirmpassword.trim() !== data.password.trim()) {
        validationErrors.Conpass = "Password is not same"};
      
      if (!isChecked) {
        validationErrors.che = "Please agree with terms and conditions";
      } 
      setErrors(validationErrors);
     return Object.keys(errors).length === 0;
    };
    const reqData = {
      ...data,
        agree: isChecked,
    };
    const handleSubmit = async (e) => {
      e.preventDefault();  
      validation();    
        try {
          const response =await api.post('/api/auth/register', reqData);
          console.log('Data posted successfully:', response);
          setData(setRegisterationSuccess(true))
          setErrorMessages('');
          
          setData({uname:'',email:'',password:'',confirmpassword:''});
        } catch (error){
          console.error('Error posting data:', error.response.status);
          if (error.response.status === 409) {
            setErrorMessages("Email already exists, please sign in.")
          }
        }       
    };
 
    
  return (
    <div className='container1'>
    {registerationSuccess && <Navigate to="/SignIn" />}
            <h1 style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>Register</h1>
            <input className='SRinput' onChange={handleChange} value={data.uname} name="uname" type="text" placeholder='First Name'></input>
            {errors.na&& <span className='error'>{errors.na}</span>}
            <input className='SRinput' value={data.email} onChange={handleChange} name="email" type='email' placeholder='Email'></input>
            {errorMessages !== '' && <span className='error'>Email alreay exists, please sign in.</span>}
            {errors.em&& <span className='error'>{errors.em}</span>}
            {errors.em1&& <span className='error'>{errors.em1}</span>}
            <input className='SRinput' value={data.password} onChange={handleChange} name="password" type='password' placeholder='Password'></input>
            {errors.pass&& <p className='error'>{errors.pass}</p>}
            {errors.passlen&& <p className='error'>{errors.passlen}</p>}
            {errors.passcap&& <p className='error'>{errors.passcap}</p>}
            {errors.passnum&& <p className='error'>{errors.passnum}</p>}
            <input className='SRinput' value={data.confirmpassword} onChange={handleChange} name="confirmpassword" type='password' placeholder='Repeat Password'></input>
            {errors.Conpass&& <span className='error'>{errors.Conpass}</span>} 
            <div className='inline'>
                <input className='inline-div' id='check' type='checkbox' checked={isChecked} onChange={handleCheck} name='flexCheck'  />
                <label className='inline-div' id='check' htmlFor='flexCheck'>I agree with all terms and conditions.</label><br />
            </div>
            {errors.che&& <p className='error'>{errors.che}</p>}
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center' }}><button onClick={handleSubmit}>Register</button></div>
            <h3 className='footing'>Already have an account? <Link to = "/SignIn"> Sign In</Link></h3>
     </div>
  );
}

export default Register