import React, { useEffect } from 'react';
import './BestSeller.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVIP } from '../../store/actions/productActions';

function BestSeller() {
  const dispatch = useDispatch();
  const { loading, vipProducts, error } = useSelector((state) => state.vip);

  useEffect(() => {
    dispatch(fetchVIP());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',marginBottom: '2rem' ,marginTop:'2rem'}}>Our Best Products</h2>
      <div className="bestseller-container">
        {vipProducts.map((item) => (
          <div className="book" key={item.ID_Product}>
            <p className="book-price">${item.Price}</p>
            <h3 className="book-title">{item.NameProduct}</h3>
            <div className="cover">
              {item.images.length > 0 ? (
                item.images.map((image) => (
                  <img
                    key={image.ID_Images}
                    src={image.Urlimage}
                    className="cover-image"
                    alt={item.NameProduct}
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestSeller;
