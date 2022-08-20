const Stripe = require('stripe');
const config = require('../config')
const stripe = Stripe(config.is_production==='true' ? config.stripe_live_key : config.stripe_test_key);

// Case when client source code is below //
/*
  <Script url="https://checkout.stripe.com/checkout.js"/>
  onGetStripeToken(token) {
    fetch(STRIPE_API_HOST, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json;charset=UTF-8', 
      },
      body: JSON.stringify({
        source: token.id,
        amount: this.state.amount,
        receipt_email: token.email
      })
    }).then( res => res.json() )
    .then( (res) => {
      console.log(res);

      this.setState({stripe_token: ''});
    });
  }

  strip_config: {
    key: IS_PRODUCTION ? STRIPE_LIVE_KEY : STRIPE_TEST_KEY,
    image: "https://stripe.com/img/documentation/checkout/marketplace.png",
    locale: 'auto',
    billingAddress: true,
    token: this.onGetStripeToken.bind(this)
  },

  this.stripeHandler = window.StripeCheckout.configure(this.state.strip_config);
  this.stripeHandler.open({
    name: 'Stripe',
    description: 'Stripe checkout dialog',
    amount: this.state.amount * 100, // 10 USD -> 1000 cents
    currency: 'usd'
  });
*/
const stripeCharge = async (source, amount, email) => {
    const charge = await stripe.charges.create({
      amount: 100 * Number(amount),
      currency: 'usd',
      source,
      receipt_email: email
    })

    if (!charge) throw new Error('charge unsuccessful')

    return charge;
}

module.exports = { stripeCharge }
