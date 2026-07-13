const prisma = require("../config/prisma");
const stripe = require("stripe")(
  "sk_test_51Ti75ZLoLstgiAl5JB2l4ORSXYLMAl70ZVBJZvzm7mYjTXeAN2uqwDZ2lo8LKG5oyfwDAlkm7nTxLO9KJoOsQWph00prxEQCZC"
);
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