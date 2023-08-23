import React , {useState , useEffect , useRef} from 'react'
import { Link } from 'react-router-dom';
import api from '../api';
import { Bars } from  'react-loader-spinner'



const SaleEntry = () => {

  const initialSaleDetail = {
    PricePerItem: '',
    NumberOfItem: '',
    discount: '',
    TotalPrice: ''
};

  const [productName, setProductName] = useState([]);
  const [addProduct, setAddProduct] =useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [saleDetail,setSaleDatail] = useState(initialSaleDetail);
  const [isLoading , setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState({});
  
  const token = localStorage.getItem('token'); 

  const headers = {
    Authorization: token,

  };
      const handleSaleChange = (e) => {
        const {name,value}=e.target;
        setSaleDatail({...saleDetail,[name]:value});
        setErrorMsg({});
      }
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
      const day = currentDate.getDate();
      const localDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;  
      const reqSaleData = {
      ...saleDetail,
      TotalPrice : saleDetail.NumberOfItem * saleDetail.PricePerItem - saleDetail.discount,
      Timestamp : localDateString,
      ProductName : selectedProduct
  }


  const handleSale = async(e) => {
    setErrorMsg({});
    setIsLoading(true);
    const valid = {};

    if (selectedProduct === '') {
      valid.selectedProduct = "Please select a product";
    }
    if (saleDetail.PricePerItem === '') {
      valid.PricePerItem = "Please add a price per item";
    }
    if (saleDetail.NumberOfItem === '') {
        valid.NumberOfItem = "Please add a number of items";
    }
    if (saleDetail.discount === '') {
      valid.discount = "Please add a discount ";
    }
    setErrorMsg(valid);
    e.preventDefault(); 
    console.log(errorMsg);
    if (selectedProduct !== "") {
        try {
            const response = await api.post('/api/auth/Sale', reqSaleData , {headers} );
            console.log("data posted to DB", response);
            setSaleDatail(initialSaleDetail);
            setSelectedProduct('');
            console.log(saleDetail);
            setIsLoading(false);
        }   catch(error) {
            console.error("error posting data to DB", error);
            setIsLoading(false);
        }}
    else {
            console.error('Product is not Selected')
            setIsLoading(false);
    }
  }
 
  useEffect(()=>{
      fetchProduct();
      
  },[])
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
      if (addProduct === '') {
        valid.addProduct = "Please write the product name";
      }
      setErrorMsg(valid);
      console.log('errorMsg is : ' , errorMsg)
    setIsLoading(true);
      e.preventDefault(); 
      try {
          const response = await api.post('/api/auth/product', reqData , {headers});
          console.log("data posted to DB", response);
          setProductName([...productName, addProduct]);
          setAddProduct('');
          setIsLoading(false);
      }
      catch(error) {
          console.error("error posting data to DB", error);
          setIsLoading(false);
      }
  }

  const handleDelete = async() => {
    setIsLoading(true);
    setErrorMsg({});
    const valid = {};
    if (selectedProduct === '') {
      valid.selectedProduct = "Please select a product";
    }
    setErrorMsg(valid);
    const token = localStorage.getItem('token'); 
    
    const headers = {
      Authorization: token,
      
    };
      try {

          const response = await api.delete('/api/auth/product', {data:{ProductName: selectedProduct} , headers: headers});
          console.log("Product deleted", response);
          setProductName(productName.filter((product) => product !== selectedProduct));
          setSelectedProduct('');
          setIsLoading(false);
      }
      catch(error) {
          console.error("error deleting the product", error);
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
          <h1>Your Sales Entry</h1>
          <div className='container2'>
            <div className='container3'> 
              <input style = {{width: '170px', marginRight:'5px'}}  className='SRinput' type='text' value={addProduct} onChange={(e)=>(setAddProduct(e.target.value))}></input>
              <button onClick={handleAddProduct} style = {{width: '120px'}} >Add Product</button>
            </div>
            {errorMsg.addProduct && <span className='error'>{errorMsg.addProduct}</span>}
            <div className='container3'>
              <select style = {{width: '185px' , marginRight:'5px'}} className='SRinput' onChange={(e)=>{setSelectedProduct(e.target.value);setSaleDatail(initialSaleDetail);setErrorMsg({})}} value={selectedProduct} name="productName" id="productName">
              <option value=''>Select Product</option>
                  {productName.map((prod,index) => (
                  <option value={prod} key={index}>{prod}</option>
              ))}       
              </select>   
              <button onClick={handleDelete}  style = {{width: '120px'}} >delete</button> 
            </div>
            {errorMsg.selectedProduct&& <span className='error'>{errorMsg.selectedProduct}</span>}
          </div>
          <div className='container2'>
                <input className='SRinput' type='number' min={0} placeholder='Number Of Items' name='NumberOfItem' value = {saleDetail.NumberOfItems} onChange={handleSaleChange} ></input>
                {errorMsg.NumberOfItem && <span className='error'>{errorMsg.NumberOfItem}</span>}
                <input className='SRinput' type='number' min={0} placeholder='Price Per Item' name='PricePerItem' value = {saleDetail.PricePerItem} onChange={handleSaleChange} ></input>
                {errorMsg.PricePerItem && <span className='error'>{errorMsg.PricePerItem}</span>}
                <input className='SRinput' type='number' min={0} placeholder='Discount' name='discount' value = {saleDetail.discount} onChange={handleSaleChange} ></input>
                {errorMsg.discount && <span className='error'>{errorMsg.discount}</span>}
                <button onClick={handleSale}>Add Sale</button> 
                <Link to='/SaleRecord'><button>Record</button></Link>
          </div>  
        </div> 
    </div>
  )
}

export default SaleEntry;