class Cart{
    constructor() {
        this.productList = [];
    }
    // return true if item doesn't exist in cart
    addNewItem(item){
        // find an item in the cart. it's nothing new if index is -1
        var index = this.productList.findIndex(product => {
            return product.item.id === item.id;
        });
        var isNewElement = index === -1;
        // add a new item
        if(isNewElement){
            this.productList.push({item:item, quantity:1})
        }
        else {
            this.productList[index].quantity++;// +1 if it's already there
        }
        return isNewElement;
    }
    // return items as array
    getItems(){
        return this.productList;
    }
    // Yes, this one remove an item from the cart
    removeAnItem(id){
        var cartIsEmpty;
        // find an item in the cart. it's nothing new if index is -1
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
let _totalAmount;
let currency = "cad";
const htmlCartEmpty = `<div class="mt-4 mx-auto text-center" style="max-width:600px">
                            <i class="fa-solid fa-cart-shopping fa-5x"></i>
                            <div class="my-3">
                                <h4>Your cart is empty</h4>
                                <p>There is nothing in your cart</p>
                            </div>
                        </div>`;
const sucessMessege = `<div class="mt-4 mx-auto text-center" style="max-width:600px">
                            <svg width="96px" height="96px" viewBox="0 0 96 96" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="round-check"> <circle id="Oval" fill="#D3FFD9" cx="48" cy="48" r="48"></circle>
                                        <circle id="Oval-Copy" fill="#87FF96" cx="48" cy="48" r="36"></circle>
                                        <polyline id="Line" stroke="#04B800" stroke-width="4" stroke-linecap="round" points="34.188562 49.6867496 44 59.3734993 63.1968462 40.3594229"></polyline>
                                    </g>
                                </g>
                            </svg>
                            <div class="my-3">
                                <h4>Thank you for order</h4>
                                <p>Thank you so much for shopping with us. We hope that you love your purchase.</p>
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
    // show modal
    //$('#checkoutModal').modal('show');
    //$('#successModal').ready(function (){ $('#successModalBody').html(sucessMessege); }).modal('show');

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
       if($(this).prop("checked")){
           $('#fNameS').val($('#fName').val()).prop( "disabled", true );
           $('#lNameS').val($('#lName').val()).prop( "disabled", true );
           $('#phoneS').val($('#phone').val()).prop( "disabled", true );
           $('#emailS').val($('#email').val()).prop( "disabled", true );
           $('#address1S').val($('#address1').val()).prop( "disabled", true );
           $('#address2S').val($('#address2').val()).prop( "disabled", true );
           $('#cityS').val($('#city').val()).prop( "disabled", true );
           $('#countryS').val($('#country').val()).prop( "disabled", true );
           $('#provinceS').val($('#province').val()).prop( "disabled", true );
           $('#postalS').val($('#postal').val()).prop( "disabled", true );
       }
       else {
           $('#fNameS').val('').prop( "disabled", false );
           $('#lNameS').val('').prop( "disabled", false );
           $('#phoneS').val('').prop( "disabled", false );
           $('#emailS').val('').prop( "disabled", false );
           $('#address1S').val('').prop( "disabled", false );
           $('#address2S').val('').prop( "disabled", false );
           $('#cityS').val('').prop( "disabled", false );
           $('#countryS').val('').prop( "disabled", false );
           $('#provinceS').val('').prop( "disabled", false );
           $('#postalS').val('').prop( "disabled", false );
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
// on click clear card
$(document).on('click','#clearCart', function(){
    // remove all item from cart
    cart.discardCart();
    // remove all item from list
    cartItems.length = 0;
    // display empty cart
    $('#cart').html(htmlCartEmpty);
    // update indicator
    updateItemsAmount();
});
$(document).on('click','#checkout', function(){
    $('#offcanvasWithBothOptions').offcanvas("hide");
    $('#confirmBody').html(getConfirmBody());

});

function getConfirmBody(){
    var htmlItems = '';
    const items = cart.getItems();
    const taxRate = 0.12;
    const deliveryCharge = 0.10;
    var subtotalPrice = 0;
    var totalAmount;
    for (let i = 0; i < items.length; i++) {
        subtotalPrice += items[i].item.price*items[i].quantity;
        htmlItems += `<div class="col-md-6">
                            <div class="itemside mb-2">
                                <div class="aside">
                                    <img src="${items[i].item.image}" class="border img-sm rounded">
                                </div>
                                <div class="info">
                                    <p><small> ${items[i].item.title} </small></p>
                                    <span class="text-muted"><small>${items[i].quantity} x $${items[i].item.price} </small></span> <br>
                                    <strong class="price"><small> $${(items[i].item.price*items[i].quantity).toFixed(2)} </small></strong>
                                </div>
                            </div>
                        </div>`;
    }
    totalAmount = subtotalPrice*(1+deliveryCharge)*(1+taxRate);
    _totalAmount = totalAmount;
    htmlItems += `<article class="border-top my-2">
                        <table class="table table-sm">
                            <tbody>
                            <tr>
                                <td><small> Subtotal (${cartItems.length} items): </small></td>
                                <td><small> $${subtotalPrice.toFixed(2)} </small></td>
                            </tr>
                            <tr>
                                <td><small> Delivery charge: </small></td>
                                <td><small> $${(subtotalPrice*deliveryCharge).toFixed(2)} </small></td>
                            </tr>
                            <tr>
                                <td><small> Tax: </small></td>
                                <td><small> $${(subtotalPrice*taxRate).toFixed(2)} </small></td>
                            </tr>
                            <tr>
                                <td><b><small> Total: </small></b></td>
                                <td><b><small> $${totalAmount.toFixed(2)}</small></b></td>
                            </tr>
                            </tbody>
                        </table>
                    </article> <!-- card-body.// -->`;
    return htmlItems;
}

// Update item indicator
function updateItemsAmount(){
    // remove indicator if none item left
    if(cartItems.length===0){
        $('#cartBtn').html('');
    }
    // update item amount
    else {
        $('#cartBtn').html(`<b class="badge bg-danger rounded-pill">${cartItems.length}</b>`);
    }
}
// remove 1 item by item id
function removeItem(id) {
    // remove an item from the list
    cartItems.splice(cartItems.findIndex(item => {
        return item.id === id;
    }),1);
    // reduce 1 item from cart. if item amount is zero, remove item
    if(cart.removeAnItem(id)){
        $('#cart').html(htmlCartEmpty);
    }else {
        $('#cart').html(getCartBody());
    }
    // update indicator
    updateItemsAmount();
}

// add an item
function addToCart(id){
    // find if an item is already exist
    var index = myObj.findIndex(product => {
        return product.id === id;
    });
    var item = myObj[index];
    // add an item to the cart
    cart.addNewItem(item);
    // add an item to the list
    cartItems.push(item);
    // update cart
    $('#cart').html(getCartBody());
    // update indicator
    updateItemsAmount();
}

function getCartBody(){
    const items = cart.getItems();
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

// return offcanvas's body
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
        $("#checkoutModal").modal('hide');
        // sub mit to server
        submit();
        // remove all item from cart
        cart.discardCart();
        // remove all item from list
        cartItems.length = 0;
        // display empty cart
        $('#cart').html(htmlCartEmpty);
        // update indicator
        updateItemsAmount();
        currentTab=0;
        showTab(currentTab);
        return false;
    }
    // Otherwise, display the correct tab:
    else {
        showTab(currentTab);
    }
}

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

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}

function submit() {
    let jsonString = `{ 
        "card_number": "${document.getElementById("cardNumber").value}",
        "expiry_month": "${document.getElementById("monthPicker").value}",
        "expiry_year": "${document.getElementById("yearPicker").value}",
        "security_code": "${document.getElementById("cvv").value}",
        "amount": "${_totalAmount}",
        "currency": "${currency}",
        "billing": {
            "first_name": "${document.getElementById("fName").value}",
            "last_name": "${document.getElementById("lName").value}",
            "address_1": "${document.getElementById("address1").value}",
            "address_2": "${document.getElementById("address2").value}",
            "city": "${document.getElementById("city").value}",
            "province": "${document.getElementById("province").value}",
            "country": "${document.getElementById("country").value}",
            "postal": "${document.getElementById("postal").value}",
            "phone": "${document.getElementById("phone").value}",
            "email": "${document.getElementById("email").value}"
        },
        "shipping": {
            "first_name": "${document.getElementById("fNameS").value}",
            "last_name": "${document.getElementById("lName").value}",
            "address_1": "${document.getElementById("address1").value}",
            "address_2": "${document.getElementById("address2").value}",
            "city": "${document.getElementById("city").value}",
            "province": "${document.getElementById("province").value}",
            "country": "${document.getElementById("country").value}",
            "postal": "${document.getElementById("postal").value}"
        }
    }`;
    const obj = JSON.parse(jsonString);
    var http = new XMLHttpRequest();
    let form_data = new FormData();
    form_data.append('submission', JSON.stringify(obj));
    fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/',
        { method: "POST",
            cache: 'no-cache',
            body: form_data
        }).then(response => response.json())
        .then(data => {
            $('#successModal').ready(function (){
                $('#successModalBody').html(sucessMessege);
            }).modal('show');
        })
        .catch((error) => {
            $('#successModal').ready(function (){
                $('#successModalBody').html(JSON.stringify(error));
            }).modal('show');
        });
}



//submittest();
function submittest() {
    let jsonString = `{
   "card_number":"4111111111111111",
   "expiry_month":"03",
   "expiry_year":"2022",
   "security_code":"123",
   "amount":"270.91",
   "currency":"cad",
   "billing":{
      "first_name":"andy",
      "last_name":"Nenthong",
      "address_1":"3189 quadrastreet",
      "address_2":"",
      "city":"Vancouver",
      "province":"BC",
      "country":"CA",
      "postal":"v8x1e9",
      "phone":"2368854807",
      "email":"andy.nenth@gmail.com"
   },
   "shipping":{
      "first_name":"andy",
      "last_name":"Nenthong",
      "address_1":"3189 quadrastreet",
      "address_2":"",
      "city":"Vancouver",
      "province":"BC",
      "country":"CA",
      "postal":"v8x1e9"
   }
}`;
    const obj = JSON.parse(jsonString);
    var http = new XMLHttpRequest();
    var url = 'https://deepblue.camosun.bc.ca/~c0180354/ics128/final/';
    http.open('POST', url, true);


    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
        else {

        }
    }
    http.send(JSON.stringify(obj));

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
        valid = (isNotEmpty('fName') && isNotEmpty('lName') && checkPhone('phone') && checkEmail('email') && isNotEmpty('address1') && isNotEmpty('city') && isNotEmpty('province') && isNotEmpty('country') && checkPostal('postal'));
    }
    if (currentTab===2){
        valid = (isNotEmpty('fNameS') && isNotEmpty('lNameS') && checkPhone('phoneS') && checkEmail('emailS') && isNotEmpty('address1S') && isNotEmpty('cityS') && isNotEmpty('provinceS') && isNotEmpty('countryS') && checkPostal('postalS'));
    }

    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function checkEmail(id){
    var regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(regEx.test($(`#${id}`).val())){
        $(`#${id}`).removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $(`#${id}`).removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function checkPostal(id){
    if(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test($(`#${id}`).val())){
        $(`#${id}`).removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $(`#${id}`).removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}


function checkPhone(id){
    if(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/.test($(`#${id}`).val())){
        $(`#${id}`).removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $(`#${id}`).removeClass("is-valid").addClass("is-invalid");
        return false;
    }
}

function isNotEmpty(id){
    if ($(`#${id}`).val()){
        $(`#${id}`).removeClass("is-invalid").addClass("is-valid");
        return true;
    }
    else{
        $(`#${id}`).removeClass("is-valid").addClass("is-invalid");
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



function modalHeader(page){
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

var autocomplete=new autocomplete({
    input:document.getElementById("geo"),
    key:'419257374837327735557x102166',
    itemtemplate:`<a onClick="jsfunction('{{geocodeaddr}}')" href="javascript:void(0);" class="list-group-item list-group-item-action flex-column align-items-start"> \
			<img width="24px" src="img/geocodelogo.svg"/> {{geocodeaddr}} <span class="float-right badge badge-warning"> > </span> </a>`

});
function jsfunction(data){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            // PARSE JSON data (in myObj) and insert into variable "result"

        }
        // display the result in HTML
        var text = `<h2>Looks like I don't have enough time to complete this part.</h2>
                    <p>${JSON.stringify(obj)}</p>`;
        $('#notiModal').ready(function (){
            $('#notiModalBody').text(text);
        }).modal('show');
    };
    xhttp.open("GET", `https://geocoder.ca/?locate=${data}&json=1` , true);
    xhttp.send();
}

