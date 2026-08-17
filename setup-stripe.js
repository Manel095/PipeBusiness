const Stripe = require('stripe');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripe() {
  console.log('Creating Stripe Products and Prices...');

  try {
    // Create Pro Product
    const proProduct = await stripe.products.create({
      name: 'PipeBusiness Pro',
      description: '20 processes, 10 sources per process, unlimited charts',
    });

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1900, // $19.00
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    console.log('Pro Price ID:', proPrice.id);

    // Create Business Product
    const bizProduct = await stripe.products.create({
      name: 'PipeBusiness Business',
      description: 'Unlimited processes, unlimited sources, unlimited charts',
    });

    const bizPrice = await stripe.prices.create({
      product: bizProduct.id,
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    console.log('Business Price ID:', bizPrice.id);

    // Write to a temporary file so the agent can read them
    fs.writeFileSync('stripe_prices.json', JSON.stringify({
      proPriceId: proPrice.id,
      bizPriceId: bizPrice.id
    }));

    console.log('Successfully created Stripe products and prices!');
  } catch (err) {
    console.error('Error setting up Stripe:', err);
  }
}

setupStripe();
