const Router = require('koa-router');
const router = new Router();
// const parse = require('co-body');
const { getProducts, getCustomers, getOrders } = require('./queries.js');
const https = require('https')
const axios = require('axios')

const apiKeysStorage = {};
const prepareAuth = (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const shopOrigin = ctx.cookies.get("shopOrigin");
    ctx.cookies.set("accessToken", accessToken, { httpOnly: false });
    return {
        token: accessToken,
        shop: shopOrigin
    }
};

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://racoon:k631575375T@racoonx.oviil.mongodb.net?retryWrites=true&w=majority";

async function getdata(shop) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const database = client.db("racoon");
  const stores = database.collection("stores");
  const query = { storeId: shop };
  const result = await stores.findOne(query);
  return result
}

async function saveApiKey(apiKey,clientName,shop) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const database = client.db("racoon");
    const stores = database.collection("stores");
    const query = {storeId:shop}
    const newData = {$set:{apiKey: apiKey,clientName:clientName}};
    const result = await stores.updateOne(query,newData);
    console.log(result)
  }



// get required data from shopify
router.get('/data/', async (ctx) => {
    const auth = prepareAuth(ctx);
    await getProducts(auth).then(response => ctx.body = response.data.data);
});


// =================================
router.post('/authenticate', async(ctx)=>{
    console.log('Shopify credentials')
    const {apiKey,clientName} = ctx.request.body
    const {shop} = prepareAuth(ctx);
    const data = await saveApiKey(apiKey,clientName,shop)

    try {
        const res = await axios.get(`https://raccoonplatform.com:5000/admin/clients/reset/${apiKey}/${clientName}`,{
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log('auth success')
        ctx.response.body = res.data;
        ctx.response.status = 200;

    if(res?.data?.res) {
        apiKeysStorage[shop] = apiKey;
    }
        
    } catch (error) {
        console.log(error.message)
    }
  })

router.post('/ingest', async(ctx)=>{
    console.log('Shopify ingest event')
    const {sessionId,price,name,action,websiteId,id} = ctx.request.body
    console.log(id);
    ctx.response.status = 200;
    const data = await getdata(websiteId)
    const clientApiKey = await data.apiKey


    try {
        const res = await axios.post('https://raccoonplatform.com:5000/ingest/event',{
            "sessionId":sessionId.replaceAll('-',''),
            "clientApiKey":  clientApiKey || '',
            "category": "item",
            "action": action,
            "interactive": "true", 
            "label": ""+id+"",
            "amount": "1", 
            "eventData": {
                    "iname" : name,
                    "iprice" : price,
                    "istatus" : 1
                  },
           "epochSeconds": Date.now()
        },{
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log('Shopify ingest response from raccoon',res.data)
    } catch (error) {
        console.log('===========')
        console.log(error)
        console.log('===========')
    }
  })

  router.post('/ingest_session', async(ctx)=>{
    console.log('Shopify ingest_session')
    const data = ctx.request.body
    ctx.response.status = 200;
    const {sessionId,websiteId} = data
    const result = await getdata(websiteId)
    const clientApiKey = await result.apiKey
    try {
        const res = await axios.post('https://raccoonplatform.com:5000/recommend/ingest_session',{
            "sessionId":sessionId.replaceAll('-',''),
            "clientApiKey":  clientApiKey || '',
        },{
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log('Shopify ingest_session response from raccoon',res.data)
        
    } catch (error) {
        console.log('===========')
        console.log(error)
        console.log('===========')
    }
  })

  router.get('/relatedItems/:websiteId/:productId/', async(ctx)=>{

    const {productId,websiteId} = ctx.params
    const result = await getdata(websiteId)
    const clientApiKey = await result.apiKey

    try {
        const res = await axios.get(`https://raccoonplatform.com:5000/recommend/sbcf/${clientApiKey}/${productId}/4`,{
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log('Shopify relatedItems response from raccoon',res.data)
        
        ctx.response.body = res.data;
        ctx.response.status = 200;
    } catch (error) {
        console.log('===========')
        console.log(error)
        console.log('===========')
    }
  })

  router.get('/popularItems/:websiteId/:action/', async(ctx)=>{

    const {websiteId,action} = ctx.params
    const result = await getdata(websiteId)
    const clientApiKey = await result.apiKey

    try {
        const res = await axios.get(`https://raccoonplatform.com:5000/recommend/popular_items/${clientApiKey}/${action}/4`,{
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log('Shopify popularItems response from raccoon',res.data)
        
        ctx.response.body = res.data;
        ctx.response.status = 200;
    } catch (error) {
        console.log('===========')
        console.log(error)
        console.log('===========')
    }
  })

  router.get('/sessionRecommendation/:websiteId/:sessionId', async(ctx)=>{

    const {websiteId,sessionId} = ctx.params
    const result = await getdata(websiteId)
    const clientApiKey = await result.apiKey
    
    try {
        //sessionId = sessionId.replaceAll('-','')
        const res = await axios.get(`https://raccoonplatform.com:5000/recommend/sbcf/${clientApiKey}/${sessionId}/4`,{
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log('Shopify sessionRecommendation response from raccoon',res.data)
        
        ctx.response.body = res.data;
        ctx.response.status = 200;
    } catch (error) {
        console.log('===========')
        console.log(error)
        console.log('===========')
    }
  })

  router.get("/productById/:shop/:id", async (ctx) => {
    const { shop, id } = ctx.params;
    console.log(shop, id);
    const result = await getdata(shop)
    const token = await result.token
    console.log(token);
    let url = `https://${shop}/admin/api/2021-01/products/${id}.json`;
    headers = await {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(url, headers);
    const json = await res.json();
    console.log(token, shop);
    ctx.response.body = json;
    ctx.response.status = 200;
    return json;
  });


module.exports = {
    router
}
