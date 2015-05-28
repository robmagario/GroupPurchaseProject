/**
 * Created by chinhong on 5/21/15.
 */
Template.Dashboard.rendered = function() {
    // Turn to Login Page if user is not admin
    window.setTimeout(function() {
        if(Roles.userIsInRole(Meteor.userId(), "admin")) {
        } else {
            location = "login";
        }
    },1000)
}

var sidebar_events = {
    SelectTab: function(tab_name) {
        Dashboard_Log.Show("SelectTab", tab_name);
        $('.container_item').hide();
        switch(tab_name) {
            case "Overview":
                $('#Dashboard_Overview').show();
                break;
            case "Create Product":
                $('#Dashboard_CreateProduct').show();
                break;
            case "Products List":
                $('#Dashboard_ProductList').show();
                break;
            case "Product Detail":
                $('#Dashboard_ProductDetail').show();
                break;
            case "Invitation Key List":
                $('#Dashboard_InvitationKeyList').show();
                break;
            case "Orders List":
                $('#Dashboard_OrderList').show();
                break;
            case "Order Detail":
                $('#Dashboard_OrderDetail').show();
                break;
            default:
                Dashboard_Log.Show("SelectTab", "Tab of '" + tab_name + "' have not set an events");
                break;
        }
    }
}

Template.Dashboard.events({
    // Select Tab on sidebar
    'click .sidebar_tab': function(e) {
        $('.sidebar_tab').removeClass("active");
        e.target.classList.add("active");
        sidebar_events.SelectTab(e.target.innerText);
    },

    // Check data is collect
    'change #input_price': function() {
        Dashboard_Log.Show("Check Price", "Start");
    },

    // Add a sub-image
    'click .btn-add-image': function() {
        var _html = $('#CreateSubImage').html();
        var _count = $('#CreateSubImage').find('divh');
        var _randomID = parseInt(Math.random() * 10000);
        if(_count > 0) {
            _html += "<br>";
        }
        _html += "<divh id='file_"+_randomID+"' class='column'>" +
                    "<div></div>" +
                    "<input type='file' onchange='Helpers.Image.ReadURL(this, &#x0027image_"+_randomID+"&#x0027);'>" +
                    "<button class='btn-minus-image' value='"+_randomID+"'>-</button>" +
                "</divh>" +
                "<divi id='img_"+_randomID+"' class='column'>" +
                    "<div></div>" +
                    "<img id='image_"+_randomID+"'>" +
                "</divi>";
        $('#CreateSubImage').html(_html);
    },

    // Delete a sub-image
    'click .btn-minus-image': function(e) {
        $('#file_'+e.target.value+'').remove();
        $('#img_'+e.target.value+'').remove();
    },

    // Create Product
    'click .btn_create_product': function() {
        Dashboard_Log.Show("Create Product", "Start");
        var _img_icon = $('#img_icon').attr('src');
        var _img_main = $('#img_main').attr('src');
        var _img_sub = [];

        if(_img_icon == "" || _img_icon == null) { _img_icon = "No Image"; }
        if(_img_main == "" || _img_main == null) { _img_main = "No Image"; }
        var _count = $('#CreateSubImage').find('img').length;
        for(var i=0; i<_count; i++) {
            var _img_temp = $('#CreateSubImage').find('img').eq(i).attr('src');
            if(_img_temp != "" && _img_temp != null) {
                _img_sub.push(_img_temp);
            }
        }

        var _img_id = ProductImages.insert({
            icon: _img_icon,
            main: _img_main,
            sub:  _img_sub
        });

        var _name = $('#input_name').val();
        var _price = $('#input_price').val();
        var _weight = $('#input_weight').val();
        var _description = $('#input_description').val();
        var _empty = false;
        var _error = "";
        Dashboard_Log.Show("Name", _name);
        Dashboard_Log.Show("Price", "HKD " + _price);
        Dashboard_Log.Show("Weight", _weight + "g");
        Dashboard_Log.Show("Description", _description);
        Dashboard_Log.Show("Image ID", _img_id);
        if(_name == "" || _name == null) {
            _empty = true;
            _error += "Please fill the 'Product Name' column!\n";
        }
        if(_price == "" || _price == null) {
            _empty = true;
            _error += "Please fill the 'Price' column!\n";
        }
        if(_weight == "" || _weight == null) {
            _empty = true;
            _error += "Please fill the 'Weight' column!\n";
        }
        if(_description == "" || _description == null) {
            _description = "No Description";
        }
        if(!_empty) {
            Products.insert({
                name:           _name,
                description:    _description,
                price:          _price,
                weight:         _weight,
                image:          _img_id,
                publish:        true
            });
            Dashboard_Log.Show("Create Product", "Create Success!");
            alert("Process Success!");
        } else {
            Dashboard_Log.Show("Create Product", "Create Fail!");
            alert(_error);
        }
    },

    // Click to see a product
    'click .product-each': function() {
        sidebar_events.SelectTab('Product Detail');

        // Fill Column for a product
        $('#label_product_id').html(this._id);
        $('#label_product_name').html(this.name);
        $('#label_product_description').html(this.description);
        $('#label_product_price').html(this.price + " HKD");
        $('#label_product_weight').html(this.weight + " g");
        $('#label_product_img_icon').attr('src', Helpers.Image.GetImageByID.Icon(this.image));
        $('#label_product_img_main').attr('src', Helpers.Image.GetImageByID.Main(this.image));

        var SubImageHTML = "";
        var _temp_sub = Helpers.Image.GetImageByID.Sub(this.image);
        for(var i=0; i<_temp_sub.length; i++) {
            SubImageHTML += "<div class='column'>" +
                                "<div></div>" +
                                "<img src='"+_temp_sub[i]+"'>" +
                            "</div>" +
                            "<br>";
        }
        $('#ShowingSubImage').html(SubImageHTML);
    },

    // Clcik 'Back' in Product Detail
    'click .btn_product_detail_back': function() {
        sidebar_events.SelectTab('Products List');
    },

    // Click to see an order
    'click .order-each': function() {
        sidebar_events.SelectTab('Order Detail');

        // Fill Column for Order Information
        var _status = this.status;
        var StatusHTML = "";
        if(_status == "" || _status == "Waiting Confirm" || _status == null) {
            StatusHTML = "Waiting Confirm    <button class='btn_order_detail_confirm'>Confirm</button>";
        } else {
            StatusHTML = "Confirmed";
        }
        $('#label_detail_status').html(StatusHTML);

        $('#label_detail_orderid').html(this._id);
        $('#label_detail_username').html(Meteor.users.find({_id:this.user}).fetch()[0].username);
        $('#label_detail_userid').html(this.user);
        $('#label_detail_payment').html(this.payment.payment);
        $('#label_detail_count').html(this.payment.count);
        $('#label_detail_weight').html(this.payment.weight);
        $('#label_detail_payment_method').html(this.payment.payment_method);
        $('#label_detail_shipping_method').html(this.payment.shipping_method);
        $('#label_detail_country').html(this.address.country);
        $('#label_detail_city').html(this.address.city);
        $('#label_detail_address').html(this.address.address);
        $('#label_detail_phone').html(this.address.phone);
        $('#label_detail_zipcode').html(this.address.zipcode);

        var ProductListHTML = "";
        var _productIDs = this.products;
        for(var i=0; i<_productIDs.length; i++) {
            var _product_name = Helpers.Product.GetProductByID.Name(_productIDs[i]);
            var _product_price = Helpers.Product.GetProductByID.Price(_productIDs[i]);
            var _product_weight = Helpers.Product.GetProductByID.Weight(_productIDs[i]);

            ProductListHTML +=
                "<div class='product-col'>" +
                    "<img width='64px' src='"+Helpers.Product.GetProductByID.Image(_productIDs[i])+"'>" +
                    "<div class='product-col-detail'>" +
                        "<div class='product-col-header'>" + _product_name + "</div>" +
                        "<div class='product-col-info'>" +
                            "<div class='product-col-info-price'>" + _product_price + " HKD</div>" +
                            "<div class='product-col-info-weight'>" + _product_weight + " g</div>" +
                        "</div>" +
                    "</div>" +
                    "<br>" +
                "</div>";
        }

        $('#Order_detail_ProductList').html(ProductListHTML);
    },

    // Click 'Confirm' for an order
    'click .btn_order_detail_confirm': function() {
        // Update User
        var _userID = $('#label_detail_userid').html();
        var _user = Meteor.users.find({_id:_userID}).fetch()[0];
        var _invitation = _user.invitation;
        var _invitation_use = _user.invitation_use;
        if(_invitation == "" || _invitation == null) {
            _invitation = 0;
        }
        if(_invitation_use == "" || _invitation_use == null) {
            _invitation_use = 0;
        }
        _invitation = parseInt(_invitation) + parseInt($('#label_detail_count').html());
        _invitation_use = parseInt(_invitation_use);
        Meteor.users.update(_userID, {$set:{
            invitation:_invitation,
            invitation_use: _invitation_use
        }});

        // Update Order
        var _orderID = $('#label_detail_orderid').html()
        Orders.update(_orderID, {$set: {
            status: "Confirmed"
        }});

        // Change Column
        $('#label_detail_status').html("Confirmed");
    }
});

Template.Dashboard.helpers({
    'GetProductList': function() {
        return Products.find();
    }
});

var Dashboard_Log = {
    active: true,
    Show: function(header, message) {
        if(Dashboard_Log.active) {
            console.log("[" + header + "]: " + message);
        }
    }
}