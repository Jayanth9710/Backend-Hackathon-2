const router = require("express").Router();
const amzn = require("../models/AmazonData")

router.get("/amzn", async (req,res)=>{
    try {
        const amznData = await amzn.find({}).toArray();
        res.status(200).json(amznData)
    } catch (error) {
        res.status(500).json(error)
        
    }
})

module.exports = router