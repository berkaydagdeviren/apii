import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import './RetailTracking.css';

const RetailTracking = () => {
  const [sales, setSales] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchSales().catch(error => console.error("Fetching sales failed", error));
    const fetchCompaniesAndProducts = async () => {
      try {
        const companiesResponse = await axios.get('https://apii-iviq.onrender.com/api/companies');
        setCompanies(companiesResponse.data.map(company => ({ label: company.name, value: company._id })));
        const productsResponse = await axios.get('https://apii-iviq.onrender.com/api/products');
        setProducts(productsResponse.data.map(product => ({ label: product.name, value: product._id, price: product.price, kdv:product.KDV_ORANI })));
      } catch (error) {
        console.error("Error fetching companies or products:", error.response ? error.response.data : error.message);
      }
    };
    console.log(products)
    fetchCompaniesAndProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('https://apii-iviq.onrender.com/api/sales');
      setSales(response.data);
    } catch (error) {
      console.error("Failed to fetch sales:", error.response ? error.response.data : error.message);
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`https://apii-iviq.onrender.com/api/sales/${id}`);
      fetchSales(); // Refresh the list after deleting
    } catch (error) {
      console.error("Failed to delete sale:", error.response ? error.response.data : error.message);
    }
  };

  const handleAddProduct = (selectedOption) => {
    const product = products.find(product => product.value === selectedOption.value);
    
    const newProduct = { ...product, quantity: 1, price: '', isDifferentPrice: false, priceColor: '' };
    //setSelectedProducts([...selectedProducts, newProduct]);
    setSelectedProducts(selectedOption)
    console.log(selectedOption)
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  const updateProductDetails = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;
    setSelectedProducts(updatedProducts);
  };

  const validateForm = () => {
    let errors = {};
    selectedProducts.forEach((product, index) => {
      if (product.quantity <= 0 || !Number.isInteger(product.quantity)) {
        errors[`quantity-${index}`] = 'Quantity must be a positive integer.';
      }
      //if (product.price && (isNaN(product.price) || product.price <= 0)) {
      //  errors[`price-${index}`] = 'Price must be a positive number.';
      //}
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop the form submission if validation fails
    }
    try {
      
      const saleData = {
        companyName: selectedCompany.value,
        itemsSold: selectedProducts.map(({ label, value, quantity, price, isDifferentPrice, priceColor, kdv }) => ({
          itemName: label,
          productId: value, // Changed from value to productId to match the backend model
          quantity,
          price: price || undefined,
          isDifferentPrice,
          priceColor,
          kdv
        }))
      };
      console.log(saleData)
      await axios.post('https://apii-iviq.onrender.com/api/sales', saleData);
      alert('Sale record added successfully');
      setSelectedProducts([]);
      setSelectedCompany(null); // Reset selected company after successful submission
      setValidationErrors({}); // Clear validation errors
      fetchSales(); // Refresh the sales list
    } catch (error) {
      console.error("Failed to submit sale:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="retail-tracking">
      <h2>İrsaliye Takip</h2>
      <form onSubmit={handleSubmit}>
        <Select
          value={selectedCompany}
          onChange={setSelectedCompany}
          options={companies}
          placeholder="Firma Seç"
        />
        {selectedCompany && (
          <>
            <Select
              isMulti
              onChange={handleAddProduct}
              options={products}
              placeholder="Ürünleri Seç"
            />
            {selectedProducts.map((product, index) => (

              <div key={index} className="product-item">
                <span>{product.label}</span>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProductDetails(index, 'quantity', parseInt(e.target.value))}
                  required
                  min="1"
                  placeholder='Miktar'
                />
                <input
                  type="text"
                  value={product.price}
                  onChange={(e) => updateProductDetails(index, 'price', e.target.value)}
                  placeholder={`Price (stock: ${product.price})`}
                />
                <div>
                  <input
                    type="checkbox"
                    checked={product.isDifferentPrice}
                    onChange={(e) => updateProductDetails(index, 'isDifferentPrice', e.target.checked)}
                  /> Farklı Fiyat?
                </div>
                {product.isDifferentPrice && (
                  <div>
                    <input
                      type="radio"
                      name={`priceColor-${index}`}
                      value="white"
                      checked={product.priceColor === 'white'}
                      onChange={(e) => updateProductDetails(index, 'priceColor', e.target.value)}
                    /> Beyaz
                    <input
                      type="radio"
                      name={`priceColor-${index}`}
                      value="black"
                      checked={product.priceColor === 'black'}
                      onChange={(e) => updateProductDetails(index, 'priceColor', e.target.value)}
                    /> Siyah
                  </div>
                )}
                <button type="button" onClick={() => handleRemoveProduct(index)}>X</button>
                {validationErrors[`quantity-${index}`] && <div style={{ color: 'red' }}>{validationErrors[`quantity-${index}`]}</div>}
                {validationErrors[`price-${index}`] && <div style={{ color: 'red' }}>{validationErrors[`price-${index}`]}</div>}
              </div>
            ))}
            <button type="submit">İrsaliye Kaydet</button>
          </>
        )}
      </form>
      <div className="sales-list">
        
        {
          
          sales.map((sale, saleIndex) => (
            
            <div key={sale._id} className="sale-card">
              <h3>{sale.companyName.name}</h3> <h5>{
              sale.createdAt.split("").slice(0,10).join("").split("-").reverse().join("/")
              }</h5>
              <p><br/><br/> 
                {
              sale.itemsSold.length > 0 ? sale.itemsSold.map((item, itemIndex) => <span key={`${sale.itemIndex}-${itemIndex}`}>{`${item.itemName} - Quantity: ${item.quantity}, Price: ${item.price || 'N/A'}, KDV: ${item.kdv}`}</span>).reduce((acc, curr, index, array) => index < array.length - 1 ? [...acc, curr, ', '] : [...acc, curr], []) : "No items sold"
              }</p>
              <button onClick={() => deleteSale(sale._id)}>İrsaliye Sil</button>
              <Link to={`/edit-sale/${sale._id}`}></Link>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default RetailTracking;
