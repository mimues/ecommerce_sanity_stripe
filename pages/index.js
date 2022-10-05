import React from "react";

import { client } from "../lib/client";
import { HeroBanner, FooterBanner, Product } from "../components";

// Props coming from getServerSideProps
const Home = ({ products, bannerData }) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData && bannerData[0]} />
      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products?.map((product) => <Product key={product._id} product={product} />)}
      </div>
      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </>
  );
};

// Server side fetching, it renders in server and hidrates in client
// getServerSideProps is used for very dynamic data, e.g. an e-commerce when stocks are changing constantly
// for more static data (e.g. blog), we could use getStaticProps, which executes at build time or at page refresh
export const getServerSideProps = async () => {
  //sanity query
  const query = '*[_type == "product"]'
  const products = await client.fetch(query)

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery)

  return {
    props: {products, bannerData}
  }
}

export default Home;
