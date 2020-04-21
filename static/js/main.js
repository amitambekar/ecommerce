var web_call = function( url, method,body, callback_func ,fail_cb ,headers) {
    $.ajax({
        url : url,
        data:body,
        type:method,
        processData: false,
        headers : headers || {"Content-Type":"application/json"},
        success: function(data){
            if(callback_func){
                callback_func(data);
            }
        },
        error : function( data ){
            if(fail_cb){
                fail_cb(data);
            }
        }
    });
}

var addProductToCard = function(product_id){
    var cart_products = JSON.parse(localStorage.getItem("my_cart")) || [];
    
    filterd_products = cart_products.filter(function(row){ if(row['product_id'] == product_id){ return true; }  });
    if(filterd_products.length == 0){
        cart_products.push({"product_id" : product_id, "quantity" : 1});    
    }else{
        cart_products = cart_products.map(function(row) {
            if(row['product_id'] == product_id){
                row['quantity'] = row['quantity'] + 1;
            }
            return row;
        });
    }
    localStorage.setItem("my_cart", JSON.stringify(cart_products));
    fetch_product_quantity();
}

var fetch_product_quantity = function(){
    var grand_total = 0;
    var products = window.products_list;
    var cart_products = JSON.parse(localStorage.getItem("my_cart")) || [];
    
    $.each(products, function (key, val) {
        var product_id = val['product_id'];
        var quantity =  0;
        cart_products.filter(function(row){if(row['product_id'] == product_id){ return true; }}).map(function(row){ quantity = quantity + row['quantity']; });

        var price = $($('[product-id="'+product_id+'"]').children()[3]).html();
        var $td = $('[product-id="'+product_id+'"]').children()[5];
        $span = $($td).find('span');
        $span.html(quantity);
        var $total_td = $('[product-id="'+product_id+'"]').children()[4];
        var total = price * quantity;
        grand_total = grand_total + total;
        $($total_td).html( total );
        $("#grand_total").html(grand_total);
    });

    if(cart_products.length == 0){
        $("#checkout").hide();
    }else{
        $("#checkout").show();
    }
}

var removeProductToCart = function(product_id,flush){
    var cart_products = JSON.parse(localStorage.getItem("my_cart")) || [];

    if(product_id != '' && flush == true){
        cart_products = cart_products.filter(function(row){ if(row['product_id'] != product_id){ return true; }  });
        localStorage.setItem("my_cart", JSON.stringify(cart_products));
    }else if(product_id != ''){
        cart_products = cart_products.map(function(row) {
            if(row['product_id'] == product_id){
                row['quantity'] = (row['quantity'] - 1 < 0) ? 0 : row['quantity'] - 1;
            }
            return row;
        });
        cart_products = cart_products.filter(function(row){ if(row['quantity'] > 0){ return true; }  });
        localStorage.setItem("my_cart", JSON.stringify(cart_products));
    }else if(flush){
        localStorage.removeItem("my_cart");
    }
    fetch_product_quantity();
}
fetch_product_quantity();

var place_order = function(){
    var address = $("#address").val() || null;
    if(address == ''){
        alert("Please enter address.");
        return false;
    }
    var products = JSON.parse(localStorage.getItem("my_cart")) || [];
    console.log(products)
    var callback_func = function(data){
        console.log(data);
        localStorage.removeItem("my_cart");
        window.location.href = "/";
    }
    var body = {};
    body["address"] = address;
    body["products"] = products;
    web_call( '/place_order', 'POST',JSON.stringify(body), callback_func);
}

$(document).ready(function(){
    
})