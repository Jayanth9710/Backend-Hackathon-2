const {MongoClient} = require("mongodb")
const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.DB;
const dotenv = require('dotenv')
dotenv.config();


app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());


const url = "mongodb+srv://jayanth_10:admin%40123@cluster0.07wx1.mongodb.net/demo?retryWrites=true"

async function main() {

    
    const client = new MongoClient(url);
    var browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.goto("https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&as-pos=1&as-type=HISTORY");
    //-------------------------------------Flipkart Data--------------------------------------------->
    //<--------------------Getting price------------>
  
    var prices = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-5-12.nlI3QM > div._3tbKJL > div > div._30jeq3._1_WHN1",
        (price) => {
            return price.map((x) => x.textContent);
        }
    );
  
        //<---------------Converting prices Array into Price object----------------->
    var Price = (Object.assign({}, prices));
    //<-------------------Separating each element in the object into separate object-------------------->
    const splitprices = rs => {
        const amount = Object.keys(rs);
        const pres = [];
        for (let i = 0; i < amount.length; i++) {
            pres.push({
                'price': rs[amount[i]]
            });
        };
        return pres;
    };
    var productPrice = [];
    productPrice = splitprices(Price);
    
    //<---------------------------------------Getting Names of the Product------------------------------------------>


    var names = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-7-12 > div._4rR01T",
        (name) => {
            return name.map((x) => x.textContent);
        }
    );

        //<---------------------Converting names array into Name object------------------->
    var Name = (Object.assign({}, names));
    //<-------------------------Separating each element in the object into separate object--------------------->
    const splitnames = obj => {
        const keys = Object.keys(obj);
        const res = [];
        for (let i = 0; i < keys.length; i++) {
            res.push({
                'name': obj[keys[i]]
            });
        };
        return res;
    };
    var Product = [];
    Product = splitnames(Name);
    //<-----------------------------------Getting Ratings of the Products------------------------------------------>

   
    var reviews = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-7-12 > div.gUuXy- > span._2_R_DZ > span > span",
        (review) => {
            return review.map((x) => x.textContent);
        }
    );
        //<--------------------------Converting reviews array into Review object------------------>
    var Review = (Object.assign({}, reviews));
    //<----------------------------Separating each element in the object into separate object------------------------>
    const splitreviews = robj => {
        const rkeys = Object.keys(robj);
        const rres = [];
        for (let i = 0; i < rkeys.length; i++) {
            rres.push({
                'ratings': robj[rkeys[i]]
            });
        };
        return rres;
    };
    var ratings = [];
    ratings = splitreviews(Review);

    //<-------------------------------------Getting offers of the Products---------------------------------------->
    
    var offers = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-5-12.nlI3QM > div._3tbKJL > div > div._3Ay6Sb > span",
        (offer) => {
            return offer.map((x) => x.textContent);
        }
    );
    
        //<---------------------------Converting offers array into Offer object---------------------->
    var Offer = (Object.assign({}, offers));
    //<----------------------------Separating each element in the object into separate object------------------------>
    const splitoffers = sobj => {
        const skeys = Object.keys(sobj);
        const sres = [];
        for (let i = 0; i < skeys.length; i++) {
            sres.push({
                'offers': sobj[skeys[i]]
            });
        };
        return sres;
    };
    var discounts = [];
    discounts = splitoffers(Offer);

    //<--------------------------------------Getting srcs of the images of the products--------------------------------------->
     
    var srcs = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div.MIXNux > div._2QcLo- > div > div > img",
        (src) => {
            return src.map((x) => x.src);
        }
    );

        //<-----------------------Converting srcs array into imgUrl object------------------------>
    var imgUrl = (Object.assign({}, srcs));
    //<--------------------------Separating each element in the object into separate object----------------------->
    const splitsrcs = iobj => {
        const ikeys = Object.keys(iobj);
        const ires = [];
        for (let i = 0; i < ikeys.length; i++) {
            ires.push({
                'srcs': iobj[ikeys[i]]
            });
        };
        return ires;
    };
    var imgs = [];
    imgs = splitsrcs(imgUrl);
//<------------Tested for scraping webpage data using Xpath------------>
    // sample data
    // const [el] = await page.$x('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[1]/div[1]')
    // const txt = await el.getProperty('textContent')
    // const rawtxt = await txt.jsonValue();


    //<-----------------------Spreading the Data of all elements into a single array--------------------------------------------------------->


    const datas = [];
    for (let i = 0; i < Product.length; i++) {
        datas[i] = {
            ...Product[i],
            ...productPrice[i],
            ...ratings[i],
            ...imgs[i],
            ...discounts[i]
        }
    }
    for (let i = 0; i < datas.length; i++) {
        console.log(datas[i]);
    }

    //<--------------------------------------Amazon Data------------------------------------>
    await page.goto("https://www.amazon.in/s?k=iphones&dc&ref=a9_asc_1");
    //<--------------------Getting price------------>
    var prices = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small > div.a-row.a-size-base.a-color-base > a > span > span",
        (price) => {
            return price.map((x) => x.textContent);
        }
    );
    
        //<---------------Converting prices Array into Price object----------------->
    var Price = (Object.assign({}, prices));
    //<-------------------Separating each element in the object into separate object-------------------->
    const splitPrices = rs => {
        const amount = Object.keys(rs);
        const pres = [];
        for (let i = 0; i < amount.length; i++) {
            pres.push({
                'price': rs[amount[i]]
            });
        };
        return pres;
    };
    var productPrice = [];
    productPrice = splitPrices(Price);
    //<---------------------------------------Getting Names of the Product------------------------------------------>
    var names = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div > h2 > a > span",
        (name) => {
            return name.map((x) => x.textContent);
        }
    );
    
        //<---------------------Converting names array into Name object------------------->
    var Name = (Object.assign({}, names));
    //<-------------------------Separating each element in the object into separate object--------------------->
    const splitNames = obj => {
        const keys = Object.keys(obj);
        const res = [];
        for (let i = 0; i < keys.length; i++) {
            res.push({
                'name': obj[keys[i]]
            });
        };
        return res;
    };
    var Product = [];
    Product = splitNames(Name);
     //<-----------------------------------Getting Ratings of the Products------------------------------------------>
    var reviews = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div.a-section.a-spacing-none.a-spacing-top-micro > div > span > span > a > i.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom",
        (review) => {
            return review.map((x) => x.textContent);
        }
    );
    //<--------------------------Converting reviews array into Review object------------------>
    var Review = (Object.assign({}, reviews));
    //<----------------------------Separating each element in the object into separate object------------------------>
    const splitReviews = robj => {
        const rkeys = Object.keys(robj);
        const rres = [];
        for (let i = 0; i < rkeys.length; i++) {
            rres.push({
                'rating': robj[rkeys[i]]
            });
        };
        return rres;
    };
    var ratings = [];
    ratings = splitReviews(Review);
//<-------------------------------------Getting offers of the Products----------------------------------------> 
    var offers = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small > div.a-row.a-size-base.a-color-base > span",
        (offer) => {
            return offer.map((x) => x.textContent);
        }
    );
    for (let i = 0; i < offers.length; i++) {
        if (offers[i] == '') {
            offers[i] = 0;
        }
    }
    var n = -1;
    var offersx = [];
    for (let i = 0; i < offers.length; i++) {
        if (offers[i] != 0) {
            n++;
            offersx[n] = offers[i];
        }
    }
   
        //<---------------------------Converting offers array into Offer object---------------------->
    var Offer = (Object.assign({}, offersx));
    //<----------------------------Separating each element in the object into separate object------------------------>
    const splitOffers = sobj => {
        const skeys = Object.keys(sobj);
        const sres = [];
        for (let i = 0; i < skeys.length; i++) {
            sres.push({
                'offers': sobj[skeys[i]]
            });
        };
        return sres;
    };
    var discounts = [];
    discounts = splitOffers(Offer);
//<--------------------------------------Getting srcs of the images of the products---------------------------------------> 
    var srcs = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div > span > a > div > img",
        (src) => {
            return src.map((x) => x.src);
        }
    );
    //<-----------------------Converting srcs array into imgUrl object------------------------>
    var imgUrl = (Object.assign({}, srcs));
    //<--------------------------Separating each element in the object into separate object----------------------->
    const splitSrcs = iobj => {
        const ikeys = Object.keys(iobj);
        const ires = [];
        for (let i = 0; i < ikeys.length; i++) {
            ires.push({
                'srcs': iobj[ikeys[i]]
            });
        };
        return ires;
    };
    var imgs = [];
    imgs = splitSrcs(imgUrl);
//<-----------------------Spreading the Data of all elements into a single array--------------------------------------------------------->
    const AmazonData = [];
    for (let i = 0; i < Product.length; i++) {
        AmazonData[i] = {
            ...Product[i],
            ...productPrice[i],
            ...ratings[i],
            ...imgs[i],
            ...discounts[i]
        }
    }
    for (let i = 0; i < AmazonData.length; i++) {
        console.log(AmazonData[i]);
    }

    try {
        await client.connect()
        await clearingCollection(client)
        await clearingAmazon(client)
       await createFlikartData(client,[...datas])
       await createAmazonData(client,[...AmazonData])
    } catch (error) {
        console.log(error)
    } finally {
        client.close();
    }

    await browser.close();
}

main().catch(console.error)

//<--------------------Inserting Flipkart Data into Mongo Atlas------------------>
async function createFlikartData(client,datas){
 const result =  await client.db("demo").collection("products").insertMany(datas);
 console.log(`New product added with following ID:${result.insertedId}`);
}
//<--------------------Clearing the Collection of flipkart data before adding new data!------------------>
async function clearingCollection(client){
    const removedData = await client.db("demo").collection("products").remove({});
    console.log("Cleared Previously stored Data!")
}
//<--------------------Inserting Amazon Data into Mongo Atlas------------------>
async function createAmazonData (client,datas){
    const res = await client.db("demo").collection("amazonProducts").insertMany(datas)
    console.log(`Amazon Products Added successfully!`)
}

//<--------------------Clearing the Collection of Amazon data before adding new data!------------------>
async function clearingAmazon(client){
    const removedData = await client.db("demo").collection("amazonProducts").remove({});
    console.log("Cleared Previously stored Data!")
}

// <--------------------Displaying all the Flipkart products data when routed!------------------>
app.get("/flip",async function(req,res) {
    try {
        //<------Connecting the DB------->
        
        let Client = await MongoClient.connect(url);
        //<------Selecting the DB-------->
        let db = Client.db("demo");
        //<------Selecting the collection and performing the action-------->
        let flipkartData = await db.collection("products").find({}).toArray();
        //<------Close the connection----->
        await Client.close();
        res.json(flipkartData);
        
    } catch (error) {
        res.status(500).json({
            msg:"No Products available to display!"
        })
    }
})

// mongoose.connection.on('connected',()=>{
//     console.log("Mongoose Connected")
// })

// app.use("/amzn",amznRoute)

// //<--------------------Displaying all the Amazon products data when routed!------------------>

app.get("/amzn", async function (req,res) {
    try {
        //<------Connecting the DB------->
        
         let Client = await MongoClient.connect(url);

        //<------Selecting the DB-------->

        let db = Client.db("demo");

        //<------Selecting the collection and performing the action-------->

        let data = await db.collection("amazonProducts").find({}).toArray();

        //<------Close the connection----->

        await Client.close();

        res.json(data)
        
        
    } catch (error) {
        res.status(500).json({
            msg:"No Products available to display!"
        })
    }
})

app.listen(PORT, function() {
    console.log(`App is runnning Successfully in port ${PORT} ! `)
})
