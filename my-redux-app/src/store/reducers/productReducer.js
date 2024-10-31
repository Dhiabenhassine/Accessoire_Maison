import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_VIP_REQUEST,
  FETCH_VIP_SUCCESS,
  FETCH_VIP_FAILURE,
} from '../actions/productActions';

const initialProductState = {
  loading: false,
  products: [],
  error: '',
};

const initialVIPState = {
  loading: false,
  vipProducts: [],
  error: '',
};

export const productReducer = (state = initialProductState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: '' };
    case FETCH_PRODUCTS_FAILURE:
      return { loading: false, products: [], error: action.payload };
    default:
      return state;
  }
};

export const vipReducer = (state = initialVIPState, action) => {
  switch (action.type) {
    case FETCH_VIP_REQUEST:
      return { ...state, loading: true };
    case FETCH_VIP_SUCCESS:
      return { loading: false, vipProducts: action.payload, error: '' };
    case FETCH_VIP_FAILURE:
      return { loading: false, vipProducts: [], error: action.payload };
    default:
      return state;
  }
};
