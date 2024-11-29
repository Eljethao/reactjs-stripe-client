import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QHnHyP0CO32Nc2pthHNvUkbjFNTI6dM2uhgjJ3UopYA4cmabKkR86fpKGmaiJ4r2woMRXwhH31fTYaVb9QjSVRz00VBfHEP7H');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);

