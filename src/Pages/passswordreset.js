import React , {useState , useEffect} from 'react'
import {Link , Navigate , useNavigate } from 'react-router-dom';
import api from '../api';
import { Bars } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';

const Passswordreset = () => {
    const [useremail , setUseremail] = useState('');
    const [errorMsgEmail , setErrorMsgEmail] = useState('');
    const [isLoading , setIsLoading] = useState(false);

    const notifyReset = () => toast.success("A verification email has been sent to your email, verify your email and then rest the password");

    const handleChange = (e) => {
        setUseremail(e.target.value);
        setErrorMsgEmail('');
    }



    const verifyEmail = async() => {
        if (useremail === '') {
            setErrorMsgEmail("Please write the email address");
        }
        if (useremail !== '') {
            setIsLoading(true);
            try{ 
                const response = await api.post('/api/auth/resetpassword' , {email: useremail});
                console.log("response is :" , response.data)
                setIsLoading(false);
                setUseremail('');
                if (response.status === 200) {
                    notifyReset();
                }

            } catch(error) {
                console.log("error is :" , error);
                if (error.response.status === 404) {
                    setErrorMsgEmail("Email not found, Please register");
                }
                setIsLoading(false);
                
            }
        }

    }

    
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

      <h1>Reset Password</h1>
      <input className='SRinput' value={useremail} onChange={handleChange} name="useremail" type='email' placeholder='Email'></input>
      {errorMsgEmail && <span className='error'>{errorMsgEmail}</span>}
      <button style = {{width: '150px'}} className='button' onClick={verifyEmail} >Verify Email</button>
      <ToastContainer
      position="top-center"
      autoClose={5000}
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

export default Passswordreset