import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLocation , useParams } from 'react-router-dom'; // Use React Router for routing

const EmailVerification = () => {
  const {verificationtoken} = useParams();
/*   const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verificationtoken = searchParams.get('verificationtoken'); */
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const [hasRunEffect, setHasRunEffect] = useState(false);

  useEffect(()=> {
    verifier();
  }, [])



  const verifier = async () => {
    console.log(verificationtoken)
    if (!hasRunEffect) {
      try {
        const res = await api.get(`/api/auth/verify?verificationtoken=${verificationtoken}`)
        console.log('response is:' , res.data);
        setVerificationStatus(res.data.message);
        setHasRunEffect(!hasRunEffect);
      } catch (error) {
        console.log('Error verifying email:', error);
      }
    }

  }

 

  return (
    <div style={{ textAlign: 'center' }}>
      
      <h1>Email Verification</h1>
      <h3>{verificationStatus}</h3>
    </div>
  );
};

export default EmailVerification;
