class Cart{
    constructor() {
        this.productList = [];
    }
    // return true if item is new
    addNewItem(item){

        var index = this.productList.findIndex(product => {
            return product.item.id === item.id;
        });
        var isNewElement = index === -1;
        if(isNewElement){
            this.productList.push({item:item, quantity:1})
        }
        else {
            this.productList[index].quantity++;
        }
        return isNewElement;
    }
    getItems(){
        return this.productList;
    }
    removeAnItem(id){
        var cartIsEmpty;
        var index = this.productList.findIndex(product => {
            return product.item.id === id;
        });
        if (this.productList[index].quantity > 1){
            this.productList[index].quantity--;
        }else {
            this.productList.splice(index,1);
        }
        cartIsEmpty = this.productList.length === 0;
        return cartIsEmpty; //return true once the last element is removed
    }
    discardCart(){
        this.productList = [];
    }
}
const cart = new Cart();
let cartItems = [];
let currentPage = 1;
let myObj;
const pageSize = 3;
const htmlCartEmpty = `<div class="mt-4 mx-auto text-center" style="max-width:600px">
                            <i class="fa-solid fa-cart-shopping fa-5x"></i>
                            <div class="my-3">
                                <h4>Your cart is empty</h4>
                                <p>There is nothing in your cart</p>
                            </div>
                        </div>`;

var http_request = new XMLHttpRequest();
http_request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        myObj = JSON.parse(this.responseText);
        var result = bindDataToList(myObj);
    }
    $('#items').html(result);
};
http_request.open("GET", "https://fakestoreapi.com/products", true);
http_request.send();

$(document).ready(function() {
    $('#cart').html(htmlCartEmpty);
});
$(document).on('click','#nextBtn', function(){
    currentPage++;
    $('#items').html(bindDataToList(myObj));
});
$(document).on('click','#prevBtn', function(){
    currentPage--;
    $('#items').html(bindDataToList(myObj));
});
$(document).on('click','#clearCart', function(){
    cart.discardCart();
    cartItems.length = 0;
    $('#cart').html(htmlCartEmpty);
    updateItemsAmount();
});

function updateItemsAmount(){

    console.log(cartItems.length);
    if(cartItems.length===0){
        $('#cartBtn').html('');
    }
    else {
        $('#cartBtn').html(`<b class="badge bg-danger rounded-pill">${cartItems.length}</b>`);
    }
}

function removeItem(id) {
    cartItems.splice(cartItems.findIndex(item => {
        return item.id === id;
    }),1);
    if(cart.removeAnItem(id)){
        $('#cart').html(htmlCartEmpty);
    }else {
        $('#cart').html(getCartBody());
    }
    updateItemsAmount();
}

function addToCart(id){
    var index = myObj.findIndex(product => {
        return product.id === id;
    });
    var item = myObj[index];
    cart.addNewItem(item);
    cartItems.push(item);
    $('#cart').html(getCartBody());
    updateItemsAmount();
}

function getCartBody(){
    let items = cart.getItems();
    var htmlItems = '';
    var subtotalPrice = 0;
    for (var i =0;i<items.length;i++) {
        subtotalPrice += items[i].item.price*items[i].quantity;
        htmlItems += `<div class="itemside align-items-center mb-4">
            <div class="aside">
                <b class="badge bg-danger rounded-pill">${items[i].quantity}</b>
                <img src="${items[i].item.image}" class="img-sm rounded border" alt="${items[i].item.title}">
            </div>
            <div class="info w-100">
                <span class="text-muted float-end">$${(items[i].item.price*items[i].quantity).toFixed(2)}</span>
                <small class="title">${items[i].item.title}</small>
                <a href="#" class="btn-link text-danger" onclick="removeItem(${items[i].item.id})"><small>Remove</small></a>
            </div>
        </div>`;
    }
    htmlItems += `<hr>
                <dl class="dlist-align">
                    <dt>
                        <strong class="text-dark">Total:</strong>
                    </dt>
                    <dd class="text-end">
                        <strong class="text-dark">$${subtotalPrice.toFixed(2)}</strong>
                    </dd>
                </dl>
                <div class="d-flex gap-2 my-3">
                    <button class="btn w-100 btn-primary" type="button">
                        <i class="fa-solid fa-circle-check"></i> Checkout
                    </button>
                    <button id="clearCart" class="btn w-100 btn-outline-danger" type="button">
                        <i class="fa-solid fa-trash-can"></i> Clear Cart
                    </button>
                </div>`;
    return htmlItems;
}

// return displayed items
function bindDataToList (data) {
    var displayItemsFrom = currentPage*pageSize-pageSize;
    var displayItemsTo = currentPage*pageSize;
    var result='';
    var isNotTheLastPage = true;
    if (data != null && data) {
        if(displayItemsTo>data.length){
            isNotTheLastPage = false;
            displayItemsTo = data.length;
        }
        for (var i = displayItemsFrom; i < displayItemsTo; i++) {
                result += getItemCard(data[i]);
        }
    }

    var pageItemL = '';
    var pageItemR = '';

    if((currentPage-1>0)){
        pageItemL = `<li class="page-item"><button id="prevBtn" class="page-link">Prev</button></li>
                    <li class="page-item"><button id="prevBtn" class="page-link" href="#">${currentPage-1}</a></li>`;
    }
    if(isNotTheLastPage){
        pageItemR = `<li class="page-item"><button id="nextBtn" class="page-link">${currentPage+1}</button></li>
                    <li class="page-item"><button id="nextBtn" class="page-link">Next</button></li>`;
    }
    var pagination = `<hr>
                <footer class="d-flex mt-4">
                    <nav class="ms-3">
                        <ul class="pagination">
                            ${pageItemL}
                            <li class="page-item active" aria-current="page">
                                <span class="page-link">${currentPage}</span>
                            </li>
                            ${pageItemR}
                        </ul>
                    </nav>
                </footer>`

    return result+pagination;
}

function getItemCard(item){
    var ratingPercentage = item.rating.rate/5*100;
    return `<div class="card card-product-list">
                <div class="row g-0">
                    <div class="col-xl-3 col-md-4">
                        <div class="img-wrap"> <img src="${item.image}" alt="${item.title}"> </div>
                    </div> <!-- col.// -->
                    <div class="col-xl-6 col-md-5 col-sm-7">
                        <div class="card-body">
                            <a href="#" class="title h5"> ${item.title} </a>
                            
                            <div class="rating-wrap mb-2">
                                <ul class="rating-stars">
                                    <li class="stars-active" style="width: ${ratingPercentage}%;">
                                        <img src="images/stars-active.svg" alt="">
                                    </li>
                                    <li> <img src="images/starts-disable.svg" alt=""> </li>
                                </ul>
                                <span class="label-rating text-warning">${item.rating.rate}</span>
                                <i class="dot"></i>
                                <span class="label-rating text-muted">${item.rating.count} orders</span>
                            </div> <!-- rating-wrap.// -->
                            <p>${item.description}</p>
                        </div> <!-- card-body.// -->
                    </div> <!-- col.// -->
                    <div class="col-xl-3 col-md-3 col-sm-5">
                        <div class="info-aside">
                            <div class="price-wrap">
                                <span class="price h5"> $${item.price.toFixed(2)} </span>
                            </div> <!-- info-price-detail // -->
                            <br>
                            <div class="mb-3">
                                <button class="btn btn-primary" onclick="addToCart(${item.id})"> Add to cart </button>
                            </div>
                        </div> <!-- info-aside.// -->
                    </div> <!-- col.// -->
                </div> <!-- row.// -->
            </div>`;
}