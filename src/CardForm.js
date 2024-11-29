// src/CardForm.js
import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import './CardForm.css';
import { token } from './config';

const CardForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardName, setCardName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true); // Show loading modal

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: cardName,
                email: email,
            },
        });

        if (error) {
            console.log('[error]', error);
            setIsLoading(false); // Hide loading modal on error
        } else {
            console.log('PaymentMethod:', paymentMethod);
            const url = "http://localhost:9090/v1/api/cards";

            try {
                const response = await axios.post(url, {
                    paymentMethodId: paymentMethod.id,
                    cardName: cardName,
                    email: email
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Server response:', response.data);
                setShowSuccessModal(true); // Show success modal on success
            } catch (error) {
                console.error('Error posting data:', error);
            } finally {
                setIsLoading(false); // Hide loading modal after request completes
            }
        }
    };

    const closeSuccessModal = () => setShowSuccessModal(false);

    return (
        <div>
            <form onSubmit={handleSubmit} className="card-form">
                <h2 className="form-title">Payment Information</h2>
                <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Cardholder Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="card-element">Card Details</label>
                    <CardElement id="card-element" className="card-element" />
                </div>
                <button type="submit" className="submit-button" disabled={!stripe || isLoading}>
                    {isLoading ? 'Processing...' : 'Submit Payment'}
                </button>
            </form>

            {isLoading && (
                <div className="modal loading-modal">
                    <div className="modal-content">
                        <p>Processing payment...</p>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="modal success-modal">
                    <div className="modal-content">
                        <h2>Payment Successful!</h2>
                        <p>Your payment was processed successfully.</p>
                        <button onClick={closeSuccessModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardForm;
