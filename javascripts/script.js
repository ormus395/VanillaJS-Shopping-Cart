//<button class="add"><i class="fas fa-plus"></i></button>
window.onload = (function() {

  let appState = {
    products: [],
    cart: [],
    cartCount: 0,
    cartPrice: 0,
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
          <li class="item" value=${product.id}>
            <img src=${product.img} />
            ${product.title}: ${product.price}
            <button class="add">+</button>
          </li>
        `)
      })
      appState.productList.innerHTML = output.join('');
      let items = Array.from(document.querySelectorAll('.add'));
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
      output.push(`<li class="cartItem" value=${item.id}>
        <img src=${item.img} />
        ${item.title}: ${item.price} | ${item.quantity}
        <button class="delete"> - </button>
      </li>`)
    })

    shoppingCart.innerHTML = output.join('');
    let cartItems = Array.from(document.querySelectorAll('.delete'));

    cartItems.forEach(item => {
      item.addEventListener('click', removeFromCart)
    });
  }

  function cartAmount() {
    appState.cartCounter.innerHTML = appState.cartCount;
  }

  function addToCart(e) {
    let _id = e.target.parentNode.value;
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
    let _id = e.target.parentNode.value;
    let item = appState.cart.find(isItem)

    function isItem(product) {
      return product.id === _id;
    }

    for(let i = 0; i < appState.cart.length; i++) {
      if(appState.cart[i].id === _id){
        if(appState.cart[i].quantity > 1) {
          appState.cart[i].quantity--
          appState.cartCount--
          cartAmount();
          buildCart();
        } else {
          appState.cartCount = appState.cartCount - item.quantity;
          appState.cart.splice(i, 1)
          cartAmount();
          buildCart();
        }
      }
    }
  }

  buildProductList();

}());


