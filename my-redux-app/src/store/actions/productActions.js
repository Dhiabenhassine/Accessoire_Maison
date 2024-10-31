import axios from 'axios';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const FETCH_VIP_REQUEST = 'FETCH_VIP_REQUEST';
export const FETCH_VIP_SUCCESS = 'FETCH_VIP_SUCCESS';
export const FETCH_VIP_FAILURE = 'FETCH_VIP_FAILURE';
export const FETCH_PRODUCTSById_REQUEST = 'FETCH_PRODUCTSById_REQUEST';
export const FETCH_PRODUCTSById_SUCCESS = 'FETCH_PRODUCTSById_SUCCESS';
export const FETCH_PRODUCTSById_FAILURE = 'FETCH_PRODUCTSById_FAILURE';
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  
  try {
    const response = await axios.get('http://localhost:5000/Products/SelectAllProducts');
    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: response.data.products,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.message,
    });
  }
};

export const fetchVIP = () => async (dispatch) => {
  dispatch({ type: FETCH_VIP_REQUEST });
  try {
    const response = await axios.get('http://localhost:5000/Products/selectVedette');
    
    const { products, images } = response.data;

    const productsWithImages = products.map((product) => ({
      ...product,
      images: images.filter(image => image.ID_Product === product.ID_Product),
    }));
    dispatch({
      type: FETCH_VIP_SUCCESS,
      payload: productsWithImages, 
    });
  } catch (error) {
    dispatch({
      type: FETCH_VIP_FAILURE,
      payload: error.message,
    });
  }
};
export const SelectProductById = (ID_Product)=> async(dispatch)=>{
  dispatch({type: FETCH_PRODUCTSById_REQUEST})
  try{
    const response = await axios.post(`http://localhost:5000/Products/selectProductByID`,{ID_Product})
    const {products, images}=response.data
    const productWithImage= products.map((product)=>({
      ...product,
      images: images.filter(image => image.ID_Product === product.ID_Product),
    }))
    dispatch({
      type: FETCH_PRODUCTSById_SUCCESS,
      payload: productWithImage,
    })
  }catch (error) {
    dispatch({
      type: FETCH_PRODUCTSById_FAILURE,
      payload: error.message,
    })
  }
}