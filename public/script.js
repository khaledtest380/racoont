function readCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

$(document).ready(() => {

  const $productDiv = $('#productstable');
  const $customersDiv = $('#customerstable');
  const $ordersDiv = $('#orderstable');


  $.get('/data/').then(response => {
    //products
    let products = `<tbody>`;

    $.each(response.products.edges, function (i, edge) {
      var id = edge.node.id.replace('gid://shopify/Product/', '');
      products += `<tr><td>` + id + `</td><td>${edge.node.title}</td></tr>`;
    });

    products += `</tbody>`;

    $productDiv.append(products);

    //customers
    let customers = `<tbody>`;

    $.each(response.customers.edges, function (i, edge) {
      var id = edge.node.id.replace('gid://shopify/Customer/', '');
      customers += `<tr><td>` + id + `</td><td>${edge.node.displayName}</td><td>${edge.node.phone}</td><td>${edge.node.email}</td></tr>`;
    });

    customers += `</tbody>`;

    $customersDiv.append(customers);

    //orders
    let orders = `<tbody>`;

    $.each(response.orders.edges, function (i, edge) {
      var id = edge.node.id.replace('gid://shopify/Order/', '');
      orders += `<tr><td>` + id + `</td><td>${edge.node.totalPriceSet.shopMoney.amount}</td><td>${edge.node.currencyCode}</td><td>${edge.node.requiresShipping}</td><td>${edge.node.processedAt}</td></tr>`;
    });

    orders += `</tbody>`;

    $ordersDiv.append(orders);

  });
});

// TODO: Make a call to an api on our server not hardcoded like this - refer to businessLogic.js
const baseUrl = "https://fd33b8ec3ba7.ngrok.io";
const MIDDLEWARE_API_URL = baseUrl
// apiKey = 'shopyfyApiKey', clientName = 'shopyfy'
const authenticateRaccoon = () => {

  const apiKey = $('#apiKey').val();
  const clientName = $('#clientName').val();

  // TODO: save apiKey & clientName in localstorage
  localStorage.setItem('apiKey', apiKey)
  localStorage.setItem('clientName', clientName)
  $.ajax({
    type: "POST",
    url: `${MIDDLEWARE_API_URL}/authenticate`,
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data:JSON.stringify({apiKey,clientName}),
    })
    .then((response) => {
      //reset success and error msgs
      document.getElementById('authSuccessMsg').style.display = "none"
      document.getElementById('authErrorMsg').style.display = "none"

      if (response?.res) {
        document.getElementById('authSuccessMsg').style.display = "block"
        document.getElementById('authSuccessMsg').innerText = response.res
      } else {
        document.getElementById('authErrorMsg').style.display = "block"
        document.getElementById('authErrorMsg').innerText = response.res
      }
    })
    .catch((error) => {
      console.error(error)
    })
}