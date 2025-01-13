import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json(
        { error: 'No token provided.' },
        { status: 400 }
      );
    }

    // Create the charge with the provided tokenId
    const charge = await stripe.charges.create({
      amount: 1000, // Example amount in cents ($10)
      currency: 'usd',
      source: tokenId,
      description: 'Deposit Funds',
    });

    if (charge.status === 'succeeded') {
      // Send the transaction ID back as part of the response
      return NextResponse.json(
        { success: true, transactionId: charge.id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Payment failed.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
