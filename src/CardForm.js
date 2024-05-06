// src/CardForm.js
import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import axios from 'axios'; // Make sure to install axios: npm install axios

const CardForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    // Optional: State for handling form fields like cardName and email
    const [cardName, setCardName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not loaded yet.
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: cardName,
                email: email, // Include email if required
            },
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('PaymentMethod:', paymentMethod);
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YXllZXRoYW8xNkBnbWFpbC5jb20iLCJpZCI6IjY2MjhiYTVmODlkNjMyNmFkNDExYTNmNyIsInN0YXR1cyI6IlRFTVBPUkFSWV9SRUdJU1RSQVRJT04iLCJpYXQiOjE3MTQ5NjE0MzYsImV4cCI6MTcxNTA0NzgzNn0.JDB20Ca9fCX-OB_CWFArUijEdEYxDa0O7fW7LUcryg8"
            // Post the paymentMethod.id to your server
            axios.post('http://localhost:8000/api/v1/cards/', {
                paymentMethodId: paymentMethod.id,
                cardName: cardName,
                email: email
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Server response:', response.data);
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Cardholder Name"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
            />
            <button type="submit" disabled={!stripe}>
                Submit Payment
            </button>
        </form>
    );
};

export default CardForm;
