'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '@/app/assets/components/navbar/page';
import Rightnav from '@/app/assets/components/rightnav/page';
import createAPI from '@/app/lib/axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Stripe() {
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const api = createAPI();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the amount
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      return;
    }

    try {
      // Create a Stripe token from the CardElement
      const { token, error: stripeError } = await stripe.createToken(elements.getElement(CardElement));

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // Send the token to Stripe API and process payment
      const charge = await stripe.charges.create({
        amount: amount * 100, // Amount in cents
        currency: 'usd',
        source: token.id,
        description: 'Deposit Funds',
      });

      if (charge.status === 'succeeded') {
        // After successful payment, call the deposit API with the transaction ID
        setPaymentSuccess(true);
        alert('Payment successful!');

        // Call your custom API to log the transaction after successful payment
        await handleDepositSuccess(charge.id);
      } else {
        setError('Payment failed.');
      }
    } catch (err) {
      setError('Error processing payment.');
    }
  };

  const handleDepositSuccess = async (transactionId) => {
    try {
      // Send the form data to your /api/deposite/add-fund endpoint
      const formData = new FormData();
      formData.append('gateway_id', '2'); // Stripe gateway ID
      formData.append('transaction_id', transactionId); // Transaction ID from Stripe

      const response = await api.post('/api/deposite/add-fund', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === '200') {
        alert('Deposit completed successfully');
      } else {
        setError('Failed to complete the deposit.');
      }
    } catch (err) {
      console.error('Error processing deposit:', err);
      setError('Error processing deposit.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/user-wallet');
        if (response.data.status === '200') {
          setBalance(response.data.amount);
        } else {
          setError('Failed to fetch wallet data.');
        }
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadingSpinner = (
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        {loadingSpinner}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded mt-4">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3 mt-4">
              <div className="card shadow-lg border-0 mb-4 p-3">
                <div className="card-body">
                  <h5 className="text-dark fw-bold">Total Balance</h5>
                  <h4 className="text-dark fw-bold">
                    {balance === null ? loadingSpinner : `$${(Number(balance) || 0).toFixed(2)}`}
                  </h4>
                </div>
              </div>

              <div className="card shadow-lg p-3 border-0">
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-center text-dark fw-bold mb-4 mt-3">
                    Deposit Funds
                  </h5>
                  <div className="d-flex justify-content-center">
                    <form className="w-50" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="amount" className="form-label text-muted">
                          Amount
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter Deposit"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted">Payment Details</label>
                        <CardElement className="form-control" />
                      </div>
                      <button className="btn btn-success w-100" type="submit" disabled={!stripe || !amount}>
                        Deposit Funds
                      </button>
                    </form>
                  </div>

                  {paymentSuccess && (
                    <div className="alert alert-success mt-3">
                      Payment was successful! Your deposit has been processed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  