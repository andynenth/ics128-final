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
    $('#checkoutModal').modal('show');
    $('#yearPicker').html(function (){
        var list = `<option value="0">year</option>`;
        var date = new Date(); // date object
        var getYear =  date.getFullYear();
        for (let i = 0; i < 10; i++) {
            list += `<option value="${getYear + i}">${getYear + i}</option>`;
        }
        return list;
    });
    $('#cvv').attr('maxlength', 4);

    $('#sameAdrChk').on('click', function (){
        console.log('same '+ $('#sameAdrChk').val());
       if($('#sameAdrChk').val()==1){
           $('#fNameS').val($('#fName').val());
       }
    });

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
$(document).on('click','#checkout', function(){
    $('#offcanvasWithBothOptions').offcanvas("hide");
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
                    <button id="checkout" class="btn w-100 btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#checkoutModal">
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

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    modalHeader(n);
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtnCheckout").style.display = "none";
    } else {
        document.getElementById("prevBtnCheckout").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtnCheckout").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtnCheckout").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");

    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        document.getElementById("regForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, valid = true;
    x = document.getElementsByClassName("tab");

    var cardNumber = document.getElementById('cardNumber').value;
    var cvv = document.getElementById('cvv').value;

    if (currentTab===0){
        valid = (checkCardNumber(cardNumber) && checkMonth() && checkYear() && checkCVV(cvv));
    }
    if (currentTab===1){
        valid = (checkFName() && checkLName() && checkPhone() && checkEmail() && checkAddress1() && checkAddress2() && checkCity() && checkProvince() && checkCountry() && checkPostal() )
    }

    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    console.log(valid);
    return valid; // return the valid status
}

function checkEmail(){
    var regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(regEx.test(document.getElementById('email').value)){
        $('#email').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#email').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkPostal(){
    if(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(document.getElementById('postal').value)){
        $('#postal').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#postal').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkCountry(){
    if (document.getElementById('country').value!=''){
        $('#country').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#country').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkProvince(){
    if (document.getElementById('province').value!=''){
        $('#province').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#province').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkCity(){
    if (document.getElementById('city').value!=''){
        $('#city').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#city').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkAddress2(){
    if (document.getElementById('address2').value!=''){
        $('#address2').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#address2').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkAddress1(){
    if (document.getElementById('address1').value!=''){
        $('#address1').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#address1').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkPhone(){
    if(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/.test(document.getElementById('phone').value)){
        $('#phone').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#phone').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkLName(){
    if (document.getElementById('lName').value!=''){
        $('#lName').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#lName').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkFName(){
    if (document.getElementById('fName').value != 0){
        $('#fName').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#fName').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkCardNumber(cardNumber){
    var masterCardRegEx = /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/;
    var visaRegEx = /^3[47][0-9]{13}$/;
    var americanExpressRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/;
    if (masterCardRegEx.test(cardNumber)||visaRegEx.test(cardNumber)||americanExpressRegEx.test(cardNumber)){
        $('#cardNumber').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#cardNumber').removeClass("invalid").addClass("is-invalid");
        return false;
    }
}
function checkCVV(cvv){
    var cvvRegex = /^[0-9]{3,4}$/;
    if (cvvRegex.test(cvv)){
        $('#cvv').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $('#cvv').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkMonth(){
    if (document.getElementById('monthPicker').value == 0){
        $('#monthPicker').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    else {
        $('#monthPicker').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
}
function checkYear(){
    if (document.getElementById('yearPicker').value == 0){
        $('#yearPicker').removeClass("is-valid").addClass("is-invalid");
        return false;
    }
    else {
        $('#yearPicker').removeClass("is-invalid").addClass("is-valid");
        return true;
    }
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}

function modalHeader(page){
    console.log(page);
    switch (page){
        case 0:
            document.getElementById('checkoutModallLabel').innerHTML = 'Checkout'
            break;
        case 1:
            document.getElementById('checkoutModallLabel').innerHTML = 'Billing'
            break;
        case 2:
            document.getElementById('checkoutModallLabel').innerHTML = 'Shipment'
            break;
        case 3:
            document.getElementById('checkoutModallLabel').innerHTML = 'Confirm'
            break;
        default:
            document.getElementById('checkoutModallLabel').innerHTML = 'Checkout'
            break;
    }

}