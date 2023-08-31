import SignIn from "./Pages/SignIn";
import Register from './Pages/Register';
import SaleEntry from './Pages/SaleEntry';
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import InventoryStock from "./Pages/InventoryStock";
import SaleRecord from "./Pages/SaleRecord";
import InventoryRecord from "./Pages/InventoryRecord";
import EmailVerification from "./Pages/EmailVerification"; 
import Passwordreset from "./Pages/passswordreset";
import Passwordrestter from "./Pages/passwordrestter";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {useState , useEffect} from 'react';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

    } else {
      setIsLoggedIn(false);
    }
    const clearLocalStorageOnExit = () => {
      localStorage.removeItem('token');
      // You can remove other items as needed
    };

    window.addEventListener('beforeunload', clearLocalStorageOnExit);

    return () => {
      window.removeEventListener('beforeunload', clearLocalStorageOnExit);
    };
  }, []);

  document.title = 'YourInventoryManager';

 

  return (
    <BrowserRouter>
    <Navbar isLoggedIn = {isLoggedIn}  />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route style = {{color: 'green' , display: 'flex', textAlign:'center', justifyContent: 'center'}} path="/SignIn" element={<SignIn isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/SaleEntry" element={<SaleEntry />} />
        <Route path="/InventoryStock" element={<InventoryStock />} />
        <Route path="/SaleRecord" element={<SaleRecord />} />
        <Route path="/InventoryRecord" element={<InventoryRecord />} />
        <Route path="/verify/:verificationtoken" element={<EmailVerification/>} />
        <Route path="/verify" element={< Passwordrestter />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/resetpassword" element={< Passwordreset />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
