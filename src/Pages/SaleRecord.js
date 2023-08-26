import React  , {useState , useEffect} from 'react';
import api from '../api';
import './SaleRecord.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from  'react-loader-spinner'
import { AiFillCaretLeft , AiFillCaretRight , AiFillDelete } from 'react-icons/ai';

const SaleRecord = () => {

  const [saleDet, setSaleDet] = useState([]);
  const [prodName,setProdName] = useState('');
  const [startDate,setStartDate] = useState('');
  const [endDate,setEndDate] = useState('');
  const [filterParam, setFilterParam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading , setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [paymentCheck , setPaymentCheck] = useState('');
  const [morePayment, setMorePayment] = useState('');
  const [rowId, setRowId] = useState('');
  const [totalAmount , setTotalAmount] = useState('');
  const [updater, setUpdater] = useState(false);
  const [error, setError] = useState('');





  const notifyDeleteSale = () => toast.success("Success, Sale is deleted.");
  const notifyUpdated = () => toast.success("Payment is updated.");



  const removeFilters = () => {
    setProdName('');
    setStartDate('');
    setEndDate('');
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = currentDate.getDate();
  const localDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;  

  const lastFifteenDaysHandler = () => {
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 15);
    
    const year15 = sevenDaysAgo.getFullYear();
    const month15 = sevenDaysAgo.getMonth() + 1; // Months are 0-indexed, so add 1
    const day15 = sevenDaysAgo.getDate();     
    const fifteenDaysAgoLocalDateString = `${year15}-${month15 < 10 ? '0' : ''}${month15}-${day15 < 10 ? '0' : ''}${day15}`;
    setStartDate(fifteenDaysAgoLocalDateString);
    setEndDate(localDateString);

  }

  const lastMonthHandler = () => {
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 30);
    
    const year30 = sevenDaysAgo.getFullYear();
    const month30 = sevenDaysAgo.getMonth() + 1; // Months are 0-indexed, so add 1
    const day30 = sevenDaysAgo.getDate();     
    const thirtyDaysAgoLocalDateString = `${year30}-${month30 < 10 ? '0' : ''}${month30}-${day30 < 10 ? '0' : ''}${day30}`;
    setStartDate(thirtyDaysAgoLocalDateString);
    setEndDate(localDateString);

  }

  const lastSevenDaysHandler = () => {
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
      
      const year7 = sevenDaysAgo.getFullYear();
      const month7 = sevenDaysAgo.getMonth() + 1; // Months are 0-indexed, so add 1
      const day7 = sevenDaysAgo.getDate();     
      const sevenDaysAgoLocalDateString = `${year7}-${month7 < 10 ? '0' : ''}${month7}-${day7 < 10 ? '0' : ''}${day7}`;
      setStartDate(sevenDaysAgoLocalDateString);
      setEndDate(localDateString);
    }

    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId');
    const headers = {
      Authorization: token,
      'user-id': userId,
    };

  useEffect(()=>{
    fetchData();
  },[prodName,startDate,endDate,filterParam , updater])

  const fetchData = async()=> {
    setIsLoading(true);
    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId');
    const headers = {
      Authorization: token,
      'user-id': userId,
    };
      try {
        const response = await api.get('/api/auth/Sale', {
          params: {prodName , startDate , endDate , filterParam }, 
          headers : headers
        });
        console.log('sales are', response.data.sales);
        const result = response.data.sales;
        console.log('result is' , result)
        setSaleDet(result)
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }

      const handleDelete = async (saleId) => {
        setIsLoading(true)
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId');
        const headers = {
          Authorization: token,
          'user-id': userId,
        };
        try {
          const response = await api.delete('/api/auth/Sale', {
            params: {saleId}, 
            headers : headers
          });
          console.log('Sale Deleted:', response)
          notifyDeleteSale();
          const updatedItems = saleDet.filter((sale) => sale._id !== saleId);
          setSaleDet(updatedItems); 
          setIsLoading(false);
        } catch (error) {
          console.error('Error deleting data:', error);
          setIsLoading(false);
        }
      }



const checkData = {
  PaymentCheck : morePayment,
  _id : rowId
}

const handlePaymentCheck = async() => {
  setPaymentCheck(morePayment)
  const token = localStorage.getItem('token'); 
  const userId = localStorage.getItem('userId');
  const headers = {
    Authorization: token,
    'user-id': userId,
  };
  const valid = {};
  if (morePayment > totalAmount) {
      valid.paymenterror = `Payment can not be more than ${totalAmount}`
  }
  setError(valid);
  if (Object.keys(valid).length === 0) {
    setIsLoading(true);
    try {
      const response = await api.put('/api/auth/Sale', checkData , {
        headers : headers,
      });
      console.log('Payment status is updated:', response.data);
      notifyUpdated();
      setIsLoading(false);
      setUpdater(!updater);
  
      const updatedSaleDet = saleDet.map((sale) => {
        if (sale._id === rowId) {
          sale.PaymentCheck = checkData.morePayment;
        }
        return sale;
      });   
      setSaleDet(updatedSaleDet);
      setMorePayment('');
      setRowId('');
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating the status:', error);
      setIsLoading(false);
    }
  }


}



        


 
const totalSale = saleDet.reduce((total, item)=> total + item.TotalPrice, 0);
const totalQuantity = saleDet.reduce((total, item)=> total + item.NumberOfItem, 0);
const totalDoscount = saleDet.reduce((total, item)=> total + item.discount, 0);

const indexOfLastItem = currentPage * itemsPerPage;
// Calculate index of the first item on the current page
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// Get the current items to be displayed
const currentItems = saleDet.slice(indexOfFirstItem, indexOfLastItem);
console.log('current items aare: ' , currentItems)

function getBackgroundColor(payment , total) {
  if (total === payment) {
      return '#Cdf5a5';
  }
  if (payment > 0 & payment < total) {
      return '#F9f1c4';
  }
  if (payment === 0) {
      return '#Fbabab';
  }
  return 'white'; // Default color if payment value doesn't match any of the above
}

const handleclose = () => {
  setError('');
  setTotalAmount(''); setClientName(''); setClientPhone(''); setShowPopup(false) ; setMorePayment('');
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
      <div className={showPopup ? 'background' : ''}>
      <div className = {`Table-container  ${isLoading ? 'loading' : ''}`}>
      <h1 className='mobile-heading'>Sales Details</h1>
      <div className='Table-input-container'>
        <div className='input-btn'>
          <input style={{paddingLeft:'0' , textAlign:'center' , fontSize: '15px' , width: '180px'}} className='SRinput' type="text" name = 'prodName' value = {prodName} placeholder = 'Search by Product' onChange={(e)=>setProdName(e.target.value)}></input>
          <button className='button' style ={{width: '120px'}} onClick = {lastSevenDaysHandler}>Last 7 Days</button>
        </div>
        <div className='input-btn'>
          <input style={{paddingLeft:'0' , textAlign:'center' , fontSize: '15px' , width: '180px'}} className='SRinput' type="text" name = 'startDate' value = {startDate} placeholder ='Starting date (yyyy-mm-dd)' onChange={(e)=>setStartDate(e.target.value)}></input>
          <button className='button' style ={{width: '120px'}} onClick = {lastFifteenDaysHandler}>Last 15 Days</button>
        </div>
        <div className='input-btn'>
          <input style={{paddingLeft:'0' , textAlign:'center' , fontSize: '15px' , width: '180px'}} className='SRinput' type="text" name = 'endDate' value = {endDate} placeholder ='Ending date (yyyy-mm-dd)' onChange={(e)=>setEndDate(e.target.value)}></input>
          <button className='button' style ={{width: '120px'}} onClick = {lastMonthHandler}>Last 30 Days</button>
        </div>

      </div>
      <div className='Table-btn-container'>  
        <button className='button' style ={{width: '140px'}} onClick={removeFilters}>Remove Filters</button>  
        
          <select value={filterParam}  onChange={(e)=>setFilterParam(e.target.value)} className='sort-select'>
            <option value=''  key=''>Sort By</option>
            <option value='AscendingLetter'  key='1' >Product (A-Z)</option>
            <option value='DescendingLetter'  key='2' >Product (Z-A)</option>
            <option value='NewestOnTop'  key='3'  >Date (Newest On Top)</option>
            <option value='OldestOnTop'  key='4'  >Date (Oldest On Top)</option>
          </select>
        
      </div>
      <table>
          <thead>
          <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Disc</th>
              <th>Total</th>
              <th>Date</th>
              <th>Delete</th>
          </tr>
      </thead>
          <tbody style = {{backgroundColor: 'white'}}>
              {currentItems.map((sale)=>(
                  <tr   key={sale._id} style={{ backgroundColor: getBackgroundColor(sale.PaymentCheck,sale.TotalPrice) }}
                      onClick={()=>{
                        setShowPopup(true);
                        setClientName(sale.ClientName);
                        setClientPhone(sale.ClientPhone); 
                        setPaymentCheck(sale.PaymentCheck);
                        setTotalAmount(sale.TotalPrice);
                        setRowId(sale._id);
                      }}
                  >
                      <td>{sale.ProductName}</td>
                      <td>{sale.NumberOfItem}</td>
                      <td>{sale.PricePerItem}</td>
                      <td>{sale.discount}</td>
                      <td>{sale.TotalPrice}</td>
                      <td>{sale.Timestamp}</td>
                      <td onClick={(e) =>{ e.stopPropagation();handleDelete(sale._id)}} className='icon-btn delete-btn'><AiFillDelete/></td>
                  </tr>
               ))}
          </tbody>  
            <tfoot >
            <tr style = {{backgroundColor: 'grey'}}>
              <td>Total</td>
              <td>{totalQuantity}</td>
              <td></td>
              <td>{totalDoscount}</td>
              <td>{totalSale}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
      </table>
      <div className="pagination">
        <button style={{width: '30px' , boxShadow:'none' , color: 'green' , backgroundColor: 'white'}} className='button icon-btn' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><AiFillCaretLeft/></button>
        <span style = {{margin: 'auto 30px' , fontSize:'20px'}}>Page {currentPage}</span>
        <button style={{width: '30px' , boxShadow:'none' , color: 'green' , backgroundColor: 'white'}} className='button icon-btn' onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= saleDet.length}><AiFillCaretRight/></button>
      </div>
      </div>
      
      </div>

        { showPopup && 
          <div className='popup-container'>
            <div className='popup'><h4 style={{margin: '0px'}}>Customer Name:  {clientName ? clientName : 'Not Provided'}</h4></div>
            <div className='popup'><h4 style={{margin: '0px'}}>Contact Number: {clientPhone ? clientPhone : 'Not Provided'}</h4></div>
            <div className='popup'><h4 style={{margin: '0px'}}>Payment Recieved: {paymentCheck ? paymentCheck : 'Not Provided'}</h4></div>
            <div className='popup'><h4 style={{margin: '0px'}}>Payment Remaining: {totalAmount - paymentCheck > 0 ? totalAmount - paymentCheck : '0'}</h4></div>
            <div className='popup2'>
            <div className='popup'><input style = {{width: '200px' , textAlign: 'center' ,  margin: 'auto' }} class='SRinput' type='number' placeholder='Update Payment' name = "morePayment" value = {morePayment} onChange={(e)=>setMorePayment(e.target.value)}></input></div>
            {error.paymenterror && <span style = {{ margin: '0.2px'}} className='error'>{error.paymenterror}</span>}
            <button onClick= {handlePaymentCheck}>Update and Close</button>
            <button onClick= {handleclose}>Close</button>
            </div>
            
          </div>       
        }
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
    


 
    
  )
}

export default SaleRecord