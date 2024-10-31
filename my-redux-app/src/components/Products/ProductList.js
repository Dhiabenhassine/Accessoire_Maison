import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/actions/productActions';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.NameProduct} className="card">
            <h2>{product.NameProduct}</h2>
           
            <img src={product.URLimage} alt={product.NameProduct} />
            <p>Price: ${product.Price}</p>
            <p>Stock: {product.Stock_Qte}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
