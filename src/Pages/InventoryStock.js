import React , {useState , useEffect} from 'react'
import { Link } from 'react-router-dom';
import api from '../api';
import { Bars } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InventoryStock = () => {


        const [productName, setProductName] = useState([]);
        const [inventoryData , setInventoryData] = useState([])
        const [selectedProduct, setSelectedProduct] = useState('');
        const [numberOfItems, setNumberOfItems] = useState('');
        const [saleDet, setSaleDet] = useState([]);
        const [productSale, setProductSale] = useState({});
        const [isLoading , setIsLoading] = useState(true);
        const [errorMsg, setErrorMsg] = useState({});
        const [updater, setUpdater] = useState(false);

        const notifyAddInventory = () => toast.success("Success, Inventory is added.");

        useEffect(()=>{
            fetchProduct();
            fetchSaleData();
            fetchInventoryData();
            console.log('updater is:' , updater);

        }, [updater]);
        const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = currentDate.getDate();
  const localDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId');
        const headers = {
          Authorization: token,
          'user-id': userId,
        };
        const fetchInventoryData = async() => {
            setIsLoading(true);
            try {
              const response = await api.get('/api/auth/inventory' , {
               
                headers : headers
              });
              const result = await response.data;
              const InventoryAdd = result.map((inventory) => inventory)        
              setInventoryData(InventoryAdd);
              setIsLoading(false);
        
            } catch (err) {
              console.log("error fetching inventory" , err);
              setIsLoading(false);
            }
          }
      
            const fetchSaleData = async()=> {
                const token = localStorage.getItem('token'); 
                const userId = localStorage.getItem('userId');
                const headers = {
                  Authorization: token,
                  'user-id': userId,
                };
                  try {
                    const response = await api.get('/api/auth/Sale', { 
                      headers : headers
                    });
                    const result = await response.data.sales;
                    const SalesData = await result.map((product) => product);
                    setSaleDet(SalesData)
                    setIsLoading(false);
 
                  } catch (error) {
                    console.error('Error fetching data:', error);
                    setIsLoading(false);
                  }
                }

            const fetchProduct = async() =>{
                try {
                    const response = await api.get('/api/auth/product' , {headers : headers});
                    if(response.status === 200) {
                        const Products = response.data  
                        const productNames = Products.map((product) => product.ProductName);
                        setProductName(productNames);       
                    }
                }
                catch(error) {
                    console.error("Could not fetch products", error);
                }        
            };
            const reqData = {
                ProductName : selectedProduct,
                NumberOfItem : numberOfItems,
                Timestamp : localDateString
            }

        const addtoStockHandler = async() => {
            const valid = {};
            if(selectedProduct === '') {
              valid.selectedProduct = "Please select a product";
            }
            if (numberOfItems === '') {
              valid.numberOfItems = "Enter Quantity please ";
            }
            if (numberOfItems < 1 ) {
              valid.numberOfItemsError = "Quantity should be more than zero"
            }
            setErrorMsg(valid);
            if (Object.keys(valid).length === 0) {
              try {
                const response = await api.post('/api/auth/inventory', reqData, {
                    headers: headers,
                  });
                const result = response.data;
                console.log('inventory is add to db', result)
                notifyAddInventory();
                setSelectedProduct('');
                setNumberOfItems('');
                setIsLoading(false);
                setUpdater(!updater);
               } catch (error) {
                console.log('error adding inventory', error)
                setIsLoading(false);
              }
            }
            else {
              setIsLoading(false);
            }
        }

      const productSales = saleDet.reduce((acc, sale) => {
        const { ProductName, NumberOfItem } = sale;
        acc[ProductName] = (acc[ProductName] || 0) + NumberOfItem;
        return acc;
      }, {});
   
      
      // Calculate the total items added to inventory for each product
      const productInventory = inventoryData.reduce((acc, inventory) => {
        const { ProductName, NumberOfItem } = inventory;
        acc[ProductName] = (acc[ProductName] || 0) + NumberOfItem;
        return acc;
      }, {}); 

      
      // Calculate the remaining items for each product
      const productRemaining = {};
      for (const product in productInventory) {
        productRemaining[product] = productInventory[product] - (productSales[product] || 0);
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
    <div  className={`container-1  ${isLoading ? 'loading' : ''}`}>
        <div style={{marginBottom : '0'}} className='container2'>
            <div className='container4'>
            <h1 className='mobile-heading'>Enter Inventory</h1>
                <div className='container5'>
                    <select style = {{textAlign: 'center' , width: '200px' , marginRight:'5px'}} className='SRinput' onChange={(e)=>{setSelectedProduct(e.target.value); setErrorMsg({});}} value={selectedProduct} name="productName" id="productName">
                    <option value=''>Select Product</option>
                        {productName.map((prod,index) => (
                        <option value={prod} key={index}>{prod}</option>
                    ))}       
                    </select>   
                    <input style={{width: '100px'}} className='SRinput' type='number' min={0} placeholder='Quantity' name='NumberOfItem' value = {numberOfItems} onChange={(e)=>{setNumberOfItems(e.target.value); setErrorMsg({});}} ></input>
                </div>
                <div>{errorMsg.selectedProduct && <span className='error'>{errorMsg.selectedProduct}</span>}</div>
                <div>{errorMsg.numberOfItems && <span className='error'>{errorMsg.numberOfItems}</span>}</div>
                <div>{errorMsg.numberOfItemsError && <span className='error'>{errorMsg.numberOfItemsError}</span>}</div>
                <button className='button' onClick={addtoStockHandler}  style = {{textAlign: 'center' , width: '120px'}} >Add to Stock</button> 
                <Link to='/InventoryRecord'><button className='button' style={{width: '120px'}}>Stock Record</button></Link>
            </div>
        </div>
        <div style = {{marginTop : '0'}} className='container2'>
            <h1 style = {{marginTop : '0'}}>Your Stock</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty Sold</th>
                        <th>Qty Added</th>
                        <th>Remaining</th>
                    </tr>
                </thead>
                <tbody style = {{backgroundColor: 'white'}}>
                {productName.map((product) => (
                    <tr key={product}>
                      <td>{product}</td>
                      <td>{productSales[product] || 0}</td>
                      <td>{productInventory[product] || 0}</td>
                      <td>{productRemaining[product] < 0 ? 'Add Stock 😂' : productRemaining[product]}</td>
                    </tr>
                  ))}
                </tbody>  
            </table>       
        </div>  
    </div>
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

export default InventoryStock