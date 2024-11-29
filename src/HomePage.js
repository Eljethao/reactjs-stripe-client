// src/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';
import { token } from './config';

const HomePage = () => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const products = [
        {
            id: 1,
            name: 'Adidas Shoes',
            price: 100,
            image: 'https://brand.assets.adidas.com/image/upload/v1717008412/Training_SS_24_Strength_global_Launch_What_shoes_should_you_wear_to_the_gym_image_Rapidmove_fc98ca311b.jpg',
        },
        {
            id: 2,
            name: 'Google shirt',
            price: 200,
            image: 'https://googlestore.printo.in/wp-content/uploads/2022/01/t-shirt-1.jpg',
        },
        {
            id: 3,
            name: 'Bag',
            price: 300,
            image: 'https://claytonandcrume.com/cdn/shop/files/DublinBucketBag_hero_E1.jpg?v=1699636573&width=1400',
        },
    ];

    const handlePayment = (product) => {
        setSelectedProduct(product);
        setIsLoading(true); // Start loading

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`); // Replace with your actual token

        const raw = JSON.stringify({
            stripeCardId: "pm_1QI4qHP0CO32Nc2piZOov7Aq", // Replace with actual card ID
            price: product.price,
            topupPackage: product.name,
            credit: product.price * 2, // Example credit calculation
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("http://localhost:9090/v1/api/payment-histories/stripe-payment", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log("Payment Success:", result);
                setShowSuccessPopup(true); // Show success popup
            })
            .catch((error) => {
                console.error("Payment Error:", error);
                alert("Payment failed. Please try again.");
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
        setSelectedProduct(null);
    };

    return (
        <div className="home-page">
            <h1>Explore Our Products</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />
                        <h2>{product.name}</h2>
                        <p className="product-price">Price: ${product.price}</p>
                        <button
                            className="buy-button"
                            onClick={() => handlePayment(product)}
                            disabled={isLoading} // Disable button during loading
                        >
                            {isLoading ? "Processing..." : "Buy Now"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Payment Successful!</h2>
                        <p>You have purchased {selectedProduct?.name}.</p>
                        <button className="close-popup" onClick={closePopup}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
