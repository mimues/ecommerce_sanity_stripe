// const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
import Stripe from 'stripe'
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const params = {
        // EXTRA
        submit_type: 'pay',
        mode:'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
            { shipping_rate: 'shr_1LOGmlI0QzeE24VL1Pd7jI2d' },
            { shipping_rate: 'shr_1LOGnfI0QzeE24VL4X6tw3ze' },
        ],
        // END OF EXTRA
        line_items: req.body.map((item) => {
            const img = item.image[0].asset._ref
            // use sanity project id in order to get images from sanity by replacing the reference
            const newImage = img.replace('image-', 'https://cdn.sanity.io/images/m0l54ut5/production/').replace('-webp', '.webp').replace('-jpeg', '.jpeg').replace('-png', '.png')

            // each product
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                        images: [newImage]
                    },
                    unit_amount: item.price * 100,
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item.quantity
            }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session)
      
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
