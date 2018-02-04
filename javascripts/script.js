//<button class="add"><i class="fas fa-plus"></i></button>
window.onload = (function() {

  let appState = {
    products: [],
    cart: [],
    cartCount: 0,
    productList: document.querySelector('#productItems'),
    shoppingCart: document.querySelector('#cartItems'),
    cartCounter: document.querySelector('.cartCount')
  };

  function getProductData() {
    return fetch('products.json')
      .then(res => res.json())
      .then(res => appState.products = res);
  }

  function buildProductList() {
    let output = [];
    getProductData()
    .then(() => {
      appState.products.map(product => {
        return output.push(`
          <li class="item" value=${product.id}>${product.title}: ${product.price}</li>
        `)
      })
      appState.productList.innerHTML = output.join('');
      let items = Array.from(document.querySelectorAll('.item'));
      items.forEach(item => {
        item.addEventListener('click', addToCart)
      });
    })
  }

  function buildCart() {
    let output = [];
    let {cart} = appState;
    let {shoppingCart} = appState;

    cart.forEach(item => {
      output.push(`<li class="cartItem" value=${item.id}>${item.title}: ${item.price} | ${item.quantity}</li>`)
    })

    shoppingCart.innerHTML = output.join('');
    let cartItems = Array.from(document.querySelectorAll('.cartItem'));

    cartItems.forEach(item => {
      item.addEventListener('click', removeFromCart)
    });
  }

  function cartAmount() {
    appState.cartCounter.innerHTML = appState.cartCount;
  }

  function addToCart(e) {
    let _id = e.target.value;
    let item = appState.products.find(isItem)

    function isItem(product) {
      return product.id === _id;
    }

    if(appState.cart.some(item => item.id === _id)) {
      appState.cart.map(item => {
        if(item.id === _id) {
          return {
            ...item,
            quantity: item.quantity += 1
          }
        }
      })
    } else {
      appState.cart.push({
        ...item,
        quantity: 1
      })
    }
    appState.cartCount++
    cartAmount();
    buildCart();
  }

  function removeFromCart(e) {
    let _id = e.target.value;
    let item = appState.cart.find(isItem)

    function isItem(product) {
      return product.id === _id;
    }

    for(let i = 0; i < appState.cart.length; i++) {
      if(appState.cart[i].id === _id){
        appState.cartCount = appState.cartCount - item.quantity;
        appState.cart.splice(i, 1)
        cartAmount();
        buildCart();
      }
    }
  }

  buildProductList();

}());


