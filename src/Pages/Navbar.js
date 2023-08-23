  import React , {useRef , useEffect} from 'react'
import { Link } from 'react-router-dom'
import {FaBars} from 'react-icons/fa';
import './Navbar.css'

const Navbar = ({isLoggedIn,setIsLoggedIn}) => {
    const navRef = useRef();

    const showNavbar = () => {
      navRef.current.classList.toggle('responsive-nav');
    }
    const hideNavbar = () => {
      navRef.current.classList.toggle('responsive-nav'); 
    };

    const lgot = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
    }
 

  return (
    <div className='navbar-container'>
      <h1><Link to="/">Logo</Link></h1>
        <ul ref={navRef} onClick={hideNavbar} className='ul-container'>

            {isLoggedIn ? (
              <>
                <li><Link to="/SaleEntry">Add Sale</Link></li>
                <li><Link to="/SaleRecord">Sales Record</Link></li>
                <li><Link to="/InventoryStock">Stock</Link></li>
                <li><Link to="/InventoryRecord">Stock Record</Link></li>
                <li className='logOut' ><Link onClick={lgot}  to="/">Log Out</Link></li>
              </>
              ) : (
                <>           
                  <li><Link to="/SignIn">Login</Link></li>
                  <li><Link to="/Register">Register</Link></li> 
                </>
            )}
        </ul>
        <button style = {{margin:'0'}} className='button nav-btn' onClick={showNavbar}><FaBars/></button>
    </div>
  )
}

export default Navbar