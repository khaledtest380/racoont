const { graphQLClient } = require("./apiClient.js");

module.exports = {
  // Returns a list of products
  getProducts(auth) {
    const query = `{
                products(first: 50) {
                    edges {
                        node {
                           title
                           id
                        }
                    }
                }
                orders(first: 50) {
                  edges {
                    node {
                        id
                      processedAt
                      totalPriceSet {
                        shopMoney {
                          amount
                        }
                      }
                      totalTaxSet {
                        shopMoney {
                          amount
                        }
                      }
                      currencyCode
                      requiresShipping
                      shippingAddress {
                        name
                        address1
                        address2
                        city
                        province
                        country
                        zip
                      }
                    }
                  }
                }
                shop {
                  id
                  name
                  email
                }
                customers(first:10) {
                  edges {
                    node {
                      id
                      displayName
                      phone
                      email
                    }
                  }
                }
              }`;

    return graphQLClient(query, auth);
  },  
};
