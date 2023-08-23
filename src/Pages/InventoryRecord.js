import React , {useState , useEffect} from 'react'
import api from '../api';
import { AiFillCaretLeft , AiFillCaretRight , AiFillDelete } from 'react-icons/ai';
import { Bars } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InventoryRecord = () => {
  const [inventoryData , setInventoryData] = useState([])
  const [prodName,setProdName] = useState('');
  const [startDate,setStartDate] = useState('');
  const [endDate,setEndDate] = useState('');
  const [filterParam, setFilterParam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading , setIsLoading] = useState(true);

  const notifyDeleteSale = () => toast.success("Success, Inventory is deleted.");

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
  const headers = {
    Authorization: token
  };

  useEffect(() => {
    fetchData();

  },[prodName,startDate,endDate,filterParam]);

  const fetchData = async() => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/auth/inventory' , {
        params: {prodName , startDate , endDate , filterParam }, 
        headers : headers
      });
      const result = await response.data;
      const InventoryAdd = result.map((inventory) => inventory)

      setInventoryData(InventoryAdd);
      console.log('inventory data is:' , inventoryData);

      console.log('Inventory record is: ' , result);
      setIsLoading(false);

    } catch (err) {
      console.log("error fetching inventory" , err);
      setIsLoading(false);
    }
  }
  const handleDelete = async(saleId) => {
    setIsLoading(true);
    try {
      const response = await api.delete('/api/auth/inventory', {
        params: {saleId}, 
        headers : headers
      });
      console.log('Inventory Deleted:', response)
      notifyDeleteSale();
      const updatedItems = inventoryData.filter((sale) => sale._id !== saleId);
      setInventoryData(updatedItems); 
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      setIsLoading(false);
    }

  }

/*   <tfoot >
  <tr style = {{backgroundColor: 'grey'}}>
    <td>Total</td>
    <td>{totalQuantity}</td>
    <td></td>
    <td>{totalDoscount}</td>
    <td>{totalSale}</td>
    <td></td>
    <td></td>
  </tr>
</tfoot> */

const indexOfLastItem = currentPage * itemsPerPage;
// Calculate index of the first item on the current page
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// Get the current items to be displayed
const currentItems = inventoryData.slice(indexOfFirstItem, indexOfLastItem);
console.log('current items aare: ' , currentItems)

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
    <div className = {`Table-container  ${isLoading ? 'loading' : ''}`}>
    <h1>Your Inventory Details</h1>
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
            <th>Date</th>
            <th>Delete</th>
        </tr>
    </thead>
        <tbody style = {{backgroundColor: 'white'}}>
            {currentItems.map((sale)=>(
                <tr key={sale._id}>
                    <td>{sale.ProductName}</td>
                    <td>{sale.NumberOfItem}</td>
                    <td>{sale.Timestamp}</td>
                    <td onClick={() => handleDelete(sale._id)} className='icon-btn delete-btn'><AiFillDelete/></td>
                </tr>
             ))}
        </tbody>  

    </table>
    <div className="pagination">
      <button style={{width: '30px' , boxShadow:'none' , color: 'green' , backgroundColor: 'white'}} className='button icon-btn' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><AiFillCaretLeft/></button>
      <span style = {{margin: 'auto 30px' , fontSize:'20px'}}>Page {currentPage}</span>
      <button style={{width: '30px' , boxShadow:'none' , color: 'green' , backgroundColor: 'white'}} className='button icon-btn' onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= inventoryData.length}><AiFillCaretRight/></button>
    </div>
  </div>
  <ToastContainer
  position="top-center"
  autoClose={2000}
  hideProgressBar={false}
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

export default InventoryRecord