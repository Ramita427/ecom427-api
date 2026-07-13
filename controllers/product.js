const prisma = require('../config/prisma')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.create = async(req,res)=>{
    try{
        // code
        const { title, description, price, quantity,images, categoryId } = req.body
        const product = await prisma.product.create({
            data: {
                title : title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id  : item.asset_id,
                        public_id : item.public_id,
                        url       : item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.list = async(req,res)=>{
    try{
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count) ,
            include: {
                category:true,
                images:true
            }
        })
        res.json(products)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.read = async(req,res)=>{
    try{
        const { id } = req.params
        const product = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category:true,
                images:true
            }
        })
        res.send(product)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.update = async(req,res)=>{
    try{
        const { title, description, price, quantity,images, categoryId } = req.body
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title : title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id  : item.asset_id,
                        public_id : item.public_id,
                        url       : item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.createImages = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `JantShop-${Date.now()}`,
            resource_type: 'auto',
            folder: 'MyEcomJant'
        })
        res.send(result)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // 1 check
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการลบ" });
    }

    await prisma.image.deleteMany({
      where: { productId: Number(id) }
    });

    // 2. delete
    await prisma.product.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: "ลบสินค้าสำเร็จ" });

  } catch (err) {
    console.log("เกิดข้อผิดพลาดตอนลบสินค้า:", err);
    
    if (err.code === 'P2003') {
       return res.status(400).json({ 
          message: "ไม่สามารถลบได้ เนื่องจากสินค้านี้มีประวัติการสั่งซื้ออยู่ในออเดอร์ของลูกค้าแล้ว" 
       });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
exports.listby = async(req,res)=>{
    try{
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)
        const products = await prisma.product.findMany({
            take:limit ,
            orderBy: {
                [sort]: order
            },
            include: {
                category:true,
                images: true
            }
        })
        res.json(products)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
const handleQuery = async (req, res, query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                images: true
            }

        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Search Error" })
    }
}
const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error ' })
    }
}
const handleCategory = async (req, res, categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error ' })
    }
}
exports.searchFilters = async (req, res) => {
    try {
        const { query, category, price } = req.body

        if (query) {
            console.log('query-->', query)
            await handleQuery(req, res, query)
        }
        if (category) {
            console.log('category-->', category)
            await handleCategory(req, res, category)
        }
        if (price) {
            console.log('price-->', price)
            await handlePrice(req, res, price)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}