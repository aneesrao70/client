import React , {useState , useEffect} from 'react'
import { Link } from 'react-router-dom';
import api from '../api';

const InventoryStock = () => {


        const [productName, setProductName] = useState([]);
        const [selectedProduct, setSelectedProduct] = useState('');
        const [numberOfItems, setNumberOfItems] = useState('');
        const [saleDet, setSaleDet] = useState([]);
        const [productSale, setProductSale] = useState({});

        useEffect(()=>{
            fetchProduct();
            fetchSaleData();

        }, []);

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
 
                  } catch (error) {
                    console.error('Error fetching data:', error);
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

        const addtoStockHandler = async() => {
  
            const token = localStorage.getItem('token'); 
            const userId = localStorage.getItem('userId');
            const headers = {
              Authorization: token,
              'user-id': userId,
            };

            try {
                    const response = await api.post('/api/auth/inventory' , {
                    params : {selectedProduct , numberOfItems},
                    headers : headers
                });
                const resutl = response.data;
                console.log('inventory is add to db', resutl)

            } catch (error) {
                console.log('error adding inventory', error)
            }
        }





  return (
    <div className='container-1'>
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
  )
}

export default InventoryStock