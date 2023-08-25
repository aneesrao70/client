import React , {useState , useEffect , useRef} from 'react'
import { Link, json } from 'react-router-dom';
import api from '../api';
import { Bars } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const SaleEntry = () => {

  const [productName, setProductName] = useState([]);
  const [addProduct, setAddProduct] =useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pricePerItem , setPricePerItem] = useState(' ');
  const [numberOfItem, setNumberOfItem] = useState('');
  const [discount , setDiscount] = useState('');
  const [isLoading , setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState({});
  const [clientName, setClientName] = useState('');
  const [clientPhone , setClientPhone] = useState('');
  const [paymentCheck, setPaymentCheck] = useState('');

  const notifyAddProduct = () => toast.success("Success, Product is added.");
  const notifyDeleteProduct = () => toast.success("Success, Product is deleted.");
  const notifyAddSale = () => toast.success("Success, Sale is added.");
  
  const token = localStorage.getItem('token'); 

  const headers = {
    Authorization: token,

  };
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
      const day = currentDate.getDate();
      const localDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;  
      const reqSaleData = {
      NumberOfItem: numberOfItem,
      PricePerItem: pricePerItem,
      discount: numberOfItem * pricePerItem > discount ? discount : numberOfItem * pricePerItem,
      TotalPrice : numberOfItem * pricePerItem - (numberOfItem * pricePerItem > discount ? discount : numberOfItem * pricePerItem),
      Timestamp : localDateString,
      ProductName : selectedProduct,
      ClientName : clientName,
      ClientPhone : clientPhone,
      PaymentCheck : paymentCheck
  }


  const handleSale = async(e) => {
    setErrorMsg({});
    const valid = {};

    if (selectedProduct === '') {
      valid.selectedProduct = "Please select a product";
    }
    if (pricePerItem === undefined) {
      valid.PricePerItem = "Please add a price per item";
    }
    if (pricePerItem < 1) {
      valid.PricePerItemError = "Price per Item should be more than zero.";
    }
    if (numberOfItem === undefined) {
        valid.NumberOfItem = "Please add a number of items";
    }
    if (numberOfItem < 1) {
      valid.NumberOfItemError = "Number of item should be more than zero";
    }
    if (discount === undefined) {
      valid.discount = "Please add a discount ";
    }
    if (discount < 0) {
      valid.discountError1 = "discount can not be less than zero";
    }
    if (discount > (numberOfItem < 0 ? -numberOfItem : numberOfItem) * (pricePerItem < 0 ? -pricePerItem : pricePerItem)) {
      valid.discountError = `Discount can not be more than ${numberOfItem * pricePerItem}`;
    }
    if (paymentCheck < 0) {
      valid.paymentCheckError = "This can not be negative";
    }
    setErrorMsg(valid);
    e.preventDefault(); 
    console.log('error msg is : ' , JSON.stringify(errorMsg));
    if (Object.keys(valid).length === 0) {
       setIsLoading(true);
      try {
        const response = await api.post('/api/auth/Sale', reqSaleData, { headers });
        console.log("data posted to DB", response);
        notifyAddSale();
        setSelectedProduct('');
        setNumberOfItem('');
        setPricePerItem('');
        setDiscount('');
        setIsLoading(false);
        setClientName('');
        setClientPhone('');
        setPaymentCheck('');
      } catch (error) {
        console.error("error posting data to DB", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }
 
  useEffect(()=>{
      fetchProduct();
      
  },[]);
  const fetchProduct = async() =>{
    setIsLoading(true);
      try {
          const response = await api.get('/api/auth/product' , {headers : headers});
          if(response.status === 200) {
              const Products = response.data  
              const productNames = Products.map((product) => product.ProductName);
              setProductName(productNames);
              setIsLoading(false)

          }
      }
      catch(error) {
          console.error("Could not fetch products", error);
          setIsLoading(false)
      }

  }

  const reqData = {
        ProductName: addProduct,
    };

  const handleAddProduct = async(e) => {
      setErrorMsg({});
      const valid = {};
      if (addProduct.trim() === '') {
        valid.addProduct = "Please write the product name";
      }
      setErrorMsg(valid);
      e.preventDefault(); 
      if (Object.keys(valid).length === 0) {
        setIsLoading(true);
        try {
          const response = await api.post('/api/auth/product', reqData , {headers});
          console.log("data posted to DB", response);
          setProductName([...productName, addProduct]);
          notifyAddProduct();
          setAddProduct('');
          setIsLoading(false);
          } catch(error) {
          console.error("error posting data to DB", error);
          setIsLoading(false);
          }
        }
        else {
          setIsLoading(false);
        }

  }

  const handleDelete = async() => {
    setErrorMsg({});
    const valid = {};
    if (selectedProduct === '') {
      valid.selectedProduct = "Please select a product";
    }
    setErrorMsg(valid);
    if (selectedProduct !== '') {
      setIsLoading(true);
          try {
            const response = await api.delete('/api/auth/product', {data:{ProductName: selectedProduct} , headers: headers});
            console.log("Product deleted", response);
            notifyDeleteProduct();
            setProductName(productName.filter((product) => product !== selectedProduct));
            setSelectedProduct('');
            setIsLoading(false);
        }
        catch(error) {
            console.error("error deleting the product", error);
            setIsLoading(false);
        }  
    }
    else {
      console.log("product is not selected for deletion"); 
      setIsLoading(false);    
    }    
  }



  return (
    <div className='main-container'>
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
      <div className = {`container-1  ${isLoading ? 'loading' : ''}`}>
          <h1 className='mobile-heading'>Your Sales Entry</h1>
          <div className='container2'>
            <div className='container3'> 
              <input style = {{width: '170px', marginRight:'5px'}}  className='SRinput' type='text' value={addProduct} onChange={(e)=>{(setAddProduct(e.target.value)); setErrorMsg({});}}></input>
              <button className='button' onClick={handleAddProduct} style = {{width: '120px'}} >Add Product</button>
            </div>
            {errorMsg.addProduct && <span className='error'>{errorMsg.addProduct}</span>}
            <div className='container3'>
              <select style = {{width: '185px' , marginRight:'5px'}} className='SRinput' onChange={(e)=>{setSelectedProduct(e.target.value);setErrorMsg({})}} value={selectedProduct} name="productName" id="productName">
              <option value=''>Select Product</option>
                  {productName.map((prod,index) => (
                  <option value={prod} key={index}>{prod}</option>
              ))}       
              </select>   
              <button className='button' onClick={handleDelete}  style = {{width: '120px'}} >delete</button> 
            </div>
            {errorMsg.selectedProduct&& <span className='error'>{errorMsg.selectedProduct}</span>}
          </div>
          <div className='container2'>
                <input className='SRinput' type='number' min={0} placeholder='Number Of Items' name='NumberOfItem' value = {numberOfItem} onChange={(e) => {setNumberOfItem(e.target.value); setErrorMsg({})}} ></input>
                {errorMsg.NumberOfItem && <span className='error'>{errorMsg.NumberOfItem}</span>}
                {errorMsg.NumberOfItemError && <span className='error'>{errorMsg.NumberOfItemError}</span>}
                <input className='SRinput' type='number' min={0} placeholder='Price Per Item' name='PricePerItem' value = {pricePerItem} onChange={(e)=>{setPricePerItem(e.target.value); setErrorMsg({})}} ></input>
                {errorMsg.PricePerItem && <span className='error'>{errorMsg.PricePerItem}</span>}
                {errorMsg.PricePerItemError && <span className='error'>{errorMsg.PricePerItemError}</span>}
                <input className='SRinput' type='number' min={0} placeholder='Discount' name='discount' value = {discount} onChange={(e) => {setDiscount(e.target.value); setErrorMsg({})}} ></input>
                {errorMsg.discount && <span className='error'>{errorMsg.discount}</span>}
                {errorMsg.discountError && <span className='error'>{errorMsg.discountError}</span>}
                {errorMsg.discountError1 && <span className='error'>{errorMsg.discountError1}</span>}
                <input className='SRinput' type='text' placeholder='Customer Name (Optional)' name='clientName' value = {clientName} onChange={(e) => {setClientName(e.target.value); setErrorMsg({})}} ></input>
                <input className='SRinput' type="tel" id="phone" placeholder="03XX-XXXXXXX (Optional)" pattern="03[0-9]{2}-[0-9]{7}" name='clientPhone' value = {clientPhone} onChange={(e) => {setClientPhone(e.target.value); setErrorMsg({})}} ></input>
                <input className='SRinput' type='number' min={0} placeholder='Total Payment Recieved' name='paymentCheck' value = {paymentCheck} onChange={(e)=>{setPaymentCheck(e.target.value); setErrorMsg({})}} ></input>
                {errorMsg.paymentCheckError && <span className='error'>{errorMsg.paymentCheckError}</span>}
                <button className='button' onClick={handleSale}>Add Sale</button> 
                <Link to='/SaleRecord'><button className='button'>Record</button></Link>
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

export default SaleEntry;