const prisma = require("../config/prisma");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.payment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
       return res.status(401).json({ message: "Unauthorized: ไม่พบข้อมูลผู้ใช้งานในระบบ" });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: req.user.id,
      },
    });

    // ดัก
    if (!cart) {
       return res.status(400).json({ message: "ไม่พบตะกร้าสินค้าของคุณ" });
    }

    const amountTHB = cart.cartTotal * 100;

    // PaymentIntent/Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};