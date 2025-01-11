"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"; // Import Stripe components
import { loadStripe } from "@stripe/stripe-js"; // Stripe.js library
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Wallet() {
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe(); // Stripe instance
  const elements = useElements(); // Elements instance
  const api = createAPI();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      // Make sure Stripe.js has loaded 
      return;
    }
  
    try {
      // Fetch the amount from the form input or use a predefined value
      const amountInCents = amount * 100; // amount in cents
  
      // Make an API request to create a PaymentIntent on the backend
      const response = await api.post('/api/create-payment-intent', {
        amount: amountInCents, // pass the amount to your backend API
      });
  
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
  
      const clientSecret = response.data.clientSecret; // The clientSecret from the backend
  
      // Confirm the card payment using the client secret
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (error) {
        setError(error.message); // Show error if any from Stripe
      } else {
        if (paymentIntent.status === 'succeeded') {
          setPaymentSuccess(true); // Set payment success state to true
          alert("Payment successful!");
  
          // Now that payment is successful, call the API with gateway_id and transaction_id
          const transactionId = paymentIntent.id; // Get transaction ID from Stripe response
  
          try {
            // Make API call to add funds to the user's wallet
            const apiResponse = await api.post('/api/deposite/add-fund', {
              gateway_id: 2, // Gateway ID as per your requirement
              transaction_id: transactionId, // Stripe transaction ID
            });
  
            if (apiResponse.data.status === "200") {
              // Handle success (e.g., show confirmation message)
              console.log("Funds added successfully.");
            } else {
              // Handle error response
              setError("Failed to add funds.");
            }
          } catch (err) {
            // Handle API error
            setError("Error adding funds.");
          }
        }
      }
    } catch (err) {
      setError("Error processing payment.");
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await api.get("/api/user-wallet");
          if (response.data.status === "200") {
            setBalance(response.data.amount);
          } else {
            setError("Failed to fetch wallet data.");
          }
        } catch (err) {
          setError("Error fetching data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  const loadingSpinner = (
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
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
                    {balance === null ? loadingSpinner : `$${balance}`}
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
