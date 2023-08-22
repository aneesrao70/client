import React , {useState , useEffect} from 'react'
import { Link } from 'react-router-dom';
import api from '../api';
import { Bars } from  'react-loader-spinner'

const InventoryStock = () => {


        const [productName, setProductName] = useState([]);
        const [selectedProduct, setSelectedProduct] = useState('');
        const [numberOfItems, setNumberOfItems] = useState('');
        const [saleDet, setSaleDet] = useState([]);
        const [productSale, setProductSale] = useState({});
        const [isLoading , setIsLoading] = useState(true);

        useEffect(()=>{
            fetchProduct();
            fetchSaleData();

        }, [isLoading]);
        const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = currentDate.getDate();
  const localDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

        console.log("productSale are:" , productSale)
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId');
        const headers = {
          Authorization: token,
          'user-id': userId,
        };
      
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
                    console.log('sales are', response.data.sales);
                    const result = await response.data.sales;
                    const SalesData = await result.map((product) => product);
                    setSaleDet(SalesData)
                    const totals = {};
                    const EachProductSale = await saleDet.forEach((sale) => {
                    if (totals[sale.ProductName]) {
                        totals[sale.ProductName] += sale.NumberOfItem;
                    }
                    else {
                        totals[sale.ProductName] = sale.NumberOfItem;
                    }
                    setProductSale(totals);
                    });
                    console.log(EachProductSale);
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
            setIsLoading(true);
  
            const token = localStorage.getItem('token'); 
            const userId = localStorage.getItem('userId');

            const headers = {
              Authorization: token,
              'user-id': userId,
            };

            try {
                const response = await api.post('/api/auth/inventory', reqData, {
                    headers: headers,
                  });
                const result = response.data;
                console.log('inventory is add to db', result)
                setSelectedProduct('');
                setNumberOfItems('');
                setIsLoading(false);

            } catch (error) {
                console.log('error adding inventory', error)
                setIsLoading(false);
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
    <div className={`container-1  ${isLoading ? 'loading' : ''}`}>
        <div className='container2'>
            <div className='container4'>
            <h1>Enter Inventory</h1>
                <div className='container5'>
                    <select style = {{textAlign: 'center' , width: '200px' , marginRight:'5px'}} className='SRinput' onChange={(e)=>setSelectedProduct(e.target.value)} value={selectedProduct} name="productName" id="productName">
                    <option value=''>Select Product</option>
                        {productName.map((prod,index) => (
                        <option value={prod} key={index}>{prod}</option>
                    ))}       
                    </select>   
                    <input style={{width: '100px'}} className='SRinput' type='number' min={0} placeholder='Quantity' name='NumberOfItem' value = {numberOfItems} onChange={(e)=>{setNumberOfItems(e.target.value)}} ></input>
                </div>
                <button onClick={addtoStockHandler}  style = {{textAlign: 'center' , width: '120px'}} >Add to Stock</button> 
                <Link to='/InventoryRecord'><button style={{width: '120px'}}>Stock Record</button></Link>
            </div>
        </div>
        <div className='container2'>
            <h1>Your Stock</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody style = {{backgroundColor: 'white'}}>
                        {Object.keys(productSale).map((componentName) => (
                            <tr key={componentName}>
                            <td>{componentName}</td>
                            <td>{productSale[componentName]}</td>
                            </tr>
                        ))}
                </tbody>  
            </table>       
        </div>  
    </div>
    </div>
  )
}

export default InventoryStock