import React , {useState , useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import api from '../api'
import { Bars } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';

const Passwordrestter = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const resettoken = queryParams.get('reset');

    const [data, setData] = useState({password:'',confirmpassword:''});
    const [errors,setErrors] = useState({});
    const [errorMessages,setErrorMessages] = useState('');
    const [isLoading , setIsLoading] = useState(false);
    const [registerationSuccess,setRegisterationSuccess]=useState(false);


    const handleChange = (e) => {
        setErrorMessages('');
        setErrors({});
        const {name,value}=e.target;
        setData({...data,[name]:value});
    }

    const validation = async() => {
        const regexNum = /^(?=.*\d).+/;
        const regexCap = /^(?=.*[A-Z]).+/;
  
        let validationErrors = {};
    
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
        if (Object.keys(validationErrors).length === 0) {
            handleSubmit();
        }  
      };

      const reqdata = {
        password: data.password,
        resettoken: resettoken,
      }

      const notifySuccess = () => toast.success("Password updated successfully, please login.");
      const notifyUserNotFount = () => toast.error("User not found");
      const notifyerror = () => toast.error("Try again later");

    const handleSubmit = async() => {
            setIsLoading(true);
            setData({password:'',confirmpassword:''});
            try {
                const response = await api.post('/api/auth/reset', reqdata)
                console.log('respoonse is:' , response);
                setIsLoading(false);
                if (response.status === 200) {
                    notifySuccess();
                }

            } catch (error) {
                setIsLoading(false);
                if (error.response.status === 404) {
                    notifyUserNotFount();
                }
                if (error.response.status === 500) {
                    notifyerror();
                }

            }
    };



    useEffect(() => {
        console.log(resettoken);
    }, []);
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
            <h1 style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>Reset Password</h1>
            <input className='SRinput' value={data.password} onChange={handleChange} name="password" type='password' placeholder='Password'></input>
            {errors.pass&& <p className='error'>{errors.pass}</p>}
            {errors.passlen&& <p className='error'>{errors.passlen}</p>}
            {errors.passcap&& <p className='error'>{errors.passcap}</p>}
            {errors.passnum&& <p className='error'>{errors.passnum}</p>}
            <input className='SRinput' value={data.confirmpassword} onChange={handleChange} name="confirmpassword" type='password' placeholder='Repeat Password'></input>
            {errors.Conpass&& <span className='error'>{errors.Conpass}</span>} 
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center' }}><button className='button' onClick={validation}>Reset</button></div>
     </div>
     <ToastContainer
     position="top-center"
     autoClose={4000}
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
  )
}

export default Passwordrestter