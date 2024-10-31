import React from 'react'
import BestSeller from './Home/BestSeller'
import ProductList from './Products/ProductList'
import './Home.css'
import Footer from './Footer'
import Sponsor from './Sponsor'
function HomePage() {
  return (
    <div>
        <BestSeller />
        <div className="line-container">
      <div className="line"></div>
    </div>
        <ProductList /> 
        <Sponsor />  
        <Footer />
    </div>
  )
}

export default HomePage