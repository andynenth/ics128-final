currentPage = 1;

$(document).ready(function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var myObj = JSON.parse(this.responseText);
            // PARSE JSON data (in myObj) and insert into variable "result"
            var result = bindDataToList(myObj);

        }
        // display the result in HTML
        //document.getElementById("items").innerHTML = result;
        $('#items').html(result);
    };
    xhttp.open("GET", "https://fakestoreapi.com/products", true);
    xhttp.send();
});


// return displayed items
function bindDataToList (data) {
    var pageSize = 4;
    var displayItemsFrom = currentPage*pageSize-pageSize;
    var displayItemsTo = currentPage*pageSize;
    var result='';
    var isNotTheLastPage = false;
    if (data != null && data) {
        if(displayItemsTo>data.length){
            isNotTheLastPage = true;
            displayItemsTo = data.length;
        }
        for (var i = displayItemsFrom; i < displayItemsTo; i++) {
                result += getItemCard(data[i]);
        }
    }

    var pageItemL = '';
    var pageItemR = '';
    console.log(currentPage-1);
    if(!(currentPage-1<1)){
        pageItemL = `<li class="page-item"><a class="page-link" href="#">${currentPage-1}</a></li>`
    }
    if(isNotTheLastPage){
        pageItemR = `<li class="page-item"><a class="page-link" href="#">${currentPage+1}</a></li>
                     <li class="page-item"><a class="page-link" href="#">Next</a> </li>`;
    }
    var pagination = `<hr>
                <footer class="d-flex mt-4">
                    <nav class="ms-3">
                        <ul class="pagination">
                            ${pageItemL}
                            <li class="page-item active" aria-current="page">
                                <span class="page-link">2</span>
                            </li>
                            
                        </ul>
                    </nav>
                </footer>`

    return result+pagination;
}

// convert row to html
function getItemCard(item){
    var ratingPercentage = item.rating.rate/5*100;
    return `<div class="card card-product-list">
                <div class="row g-0">
                    <div class="col-xl-3 col-md-4">
                        <div class="img-wrap"> <img src="${item.image}"> </div>
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
                                <span class="price h5"> $${item.price} </span>
                            </div> <!-- info-price-detail // -->
                            <p class="text-success">Free shipping</p>
                            <br>
                            <div class="mb-3">
                                <a href="#" class="btn btn-primary"> Buy this </a>
                            </div>
                        </div> <!-- info-aside.// -->
                    </div> <!-- col.// -->
                </div> <!-- row.// -->
            </div>`;
}