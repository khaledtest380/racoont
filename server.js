// Import Koa / Dotenv / Fetch modules
require("isomorphic-fetch");
const Koa = require("koa");
const koaStatic = require("koa-static");
const mount = require("koa-mount");
var bodyParser = require('koa-bodyparser');
const session = require("koa-session");
const cors = require('@koa/cors');
const dotenv = require("dotenv");
const axios = require('axios');
// Import Shopify/Koa modules to assist with authentication
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const https = require('https')
// Env Configuration
dotenv.config();
const port = process.env.PORT || 3000;
const SHOPIFY_API_KEY = '22468b83fc9ba9a48ff132ff56878311', SHOPIFY_API_SECRET_KEY = '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';

// Create server using Koa
const server = new Koa();
server.use(session(server));
server.keys = [SHOPIFY_API_SECRET_KEY];

// Import and use server-side routes
const { router } = require('./server/routes.js');
server.use(bodyParser({ enableTypes: ['json', 'text'] }));
// Enable CORS (required to let Shopify access this API)
server.use(cors());
server.use(router.routes());
server.use(router.allowedMethods());
// Use module 'koa-bodyparser'
var MongoClient = require('mongodb').MongoClient;
const gate = "k631575375T"
const url = `mongodb+srv://racoon:${gate}@racoonx.oviil.mongodb.net?retryWrites=true&w=majority`;

function storeData(shop,token){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("racoon");
        var myobj = { storeId: shop, token: token };
        var newvalues = {$set:{storeId: shop, token: token}}
        var query = {storeId: shop};
        dbo.collection("stores").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(Object.keys(result).length);
            if(Object.keys(result).length<1){
                dbo.collection("stores").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    console.log(result);
                    db.close();
                  });
            }else{
                dbo.collection("stores").updateOne(query, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    console.log(result);
                    db.close();
                  });
            }
            db.close();
          });
      });
    }

// Authenticate app with Shopify
server.use(
    createShopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: ["read_orders, write_orders,read_content, write_content,read_themes, write_themes,read_products, write_products,write_script_tags,read_script_tags,read_customers, write_customers"],
        afterAuth(ctx) {
            const { shop, accessToken } = ctx.session;
            storeData(shop,accessToken)
            console.log(ctx.cookies.get('_ssid'));
            ctx.cookies.set("accessToken", accessToken);
            ctx.cookies.set("shopOrigin", shop, { httpOnly: false });
            ctx.redirect("/");
            console.log('===========')
            console.log('shop:',shop)
            console.log('accessToken sent on scriptTag:',accessToken)
            // ScriptTag
            const scriptTagBody =  JSON.stringify({
	              script_tag: {
	                  event: 'onload',
	                  src: `https://cdn.jsdelivr.net/gh/khaledtest380/racoont@main/scriptTagVT1.3.4.js`
	              },
	          });

              const scriptTagHeaders = {
		 	 	'X-Shopify-Access-Token': accessToken,
		 	 	'Content-Type': 'application/json',
		 	 	'Accept': '*/*'
		 	 };
              const addScriptTagOptions = {
	          	method: 'POST',
	          	credentials: 'include',
	          	body: scriptTagBody,
	          	headers: scriptTagHeaders,
	          	json: true
	          };
            
              fetch(`https://${shop}/admin/script_tags.json`, addScriptTagOptions)
	           .then((response) => response.json())
	           .then((jsonData) => 
	           	console.log(jsonData),
	           );
        }
    })
);
server.use(verifyRequest());

// Mount app on root path using compiled Vue app in the dist folder
server.use(mount("/", koaStatic(__dirname + "/public")));


// Start-up the server
server.listen(port, () => {
    console.log(`> Ready on localhost ${port}`);
});
//shopyfyApiKey
//shopyfy
