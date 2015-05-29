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
    },1000);
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
    // Go To Main Page
    'click .btn_mainpage': function() {
        location = "/";
    },

    // Logout
    'click .btn_logout': function() {
        Meteor.logout();
        location = "/login";
    },

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

    // Toggle Size Section
    'click .btn-toggle-size': function(e) {
        if(e.currentTarget.checked) {
            $('#CreateSize').show();
            $('#CreateSizeBR').show();
        } else {
            $('#CreateSize').hide();
            $('#CreateSizeBR').hide();
        }
    },

    // Toggle Color Section
    'click .btn-toggle-color': function(e) {
        if(e.currentTarget.checked) {
            $('#CreateColor').show();
            $('#CreateColorBR').show();
        } else {
            $('#CreateColor').hide();
            $('#CreateColorBR').hide();
        }
    },

    // Add Size Selection
    'click .btn-add-size': function(e) {
        var _temp = $('#CreatingSize').find('div');
        var _html = "";
        for(var i=0; i<_temp.length; i++) {
            var _value = _temp.eq(i).find('input').eq(0).val();
            _html += "<div class='size-selection'>" +
                    "<input type='text' value='" + _value + "'>" +
                    "<button class='btn-delete btn-delete-size'>x</button>" +
                "</div>";
        }
        var _selection = "<div class='size-selection'>" +
                            "<input type='text'>" +
                            "<button class='btn-delete btn-delete-size'>x</button>" +
                        "</div>";
        var _button = "<button class='btn-add-size'>+</button>";
        $('#CreatingSize').html(_html + _selection + _button);
    },

    // Delete Size Selection
    'click .btn-delete-size': function(e) {
        e.currentTarget.parentElement.remove();
    },

    // Add Color Selection
    'click .btn-add-color': function(e) {
        var _temp = $('#CreatingColor').find('div');
        var _html = "";
        for(var i=0; i<_temp.length; i++) {
            var _value = _temp.eq(i).find('img').eq(0).attr('src');
            if(_value == "" || _value == null || _value == 'undefind') {
                _value = "";
            }
            _html += "<div class='color-selection'>" +
                        "<input class='btn-choose-img' type='file'>" +
                        "<button class='btn-delete btn-delete-color'>x</button>" +
                        "<img src='" + _value + "'>" +
                    "</div>";
        }
        var _selection = "<div class='color-selection'>" +
                            "<input class='btn-choose-img' type='file'>" +
                            "<button class='btn-delete btn-delete-color'>x</button>" +
                            "<img src=''>" +
                        "</div>";
        var _button = "<button class='btn-add-color'>+</button>";
        $('#CreatingColor').html(_html + _selection + _button);
    },

    // Choose Color Image
    'change .btn-choose-img': function(e) {
        var _img_file = e.currentTarget.parentElement.children[0].files;
        var _img_loc = e;
        if (_img_file[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                _img_loc.currentTarget.parentElement.children[2].src = e.target.result;
            };
            reader.readAsDataURL(_img_file[0]);
        }
    },

    // Delete Color Selection
    'click .btn-delete-color': function(e) {
        e.currentTarget.parentElement.remove();
    },

    // Create Product
    'click .btn_create_product': function() {
        Dashboard_Log.Show("Create Product", "Start");

        var _section_count = 0;
        var _section_size = $('.btn-toggle-size')[0].checked;
        var _selection_size = [];
        var _section_color = $('.btn-toggle-color')[0].checked;
        var _selection_color = [];
        if(_section_size) {
            var _temp_size = $('.size-selection').find('input');
            for(var i=0; i<_temp_size.length; i++) {
                var _value = _temp_size[i].value;
                if(_value != null && _value != "")
                _selection_size.push(_value);
            }
            _section_count++;
        }
        if(_section_color) {
            var _temp_color = $('.color-selection').find('img');
            for(var i=0; i<_temp_color.length; i++) {
                var _value = _temp_color[i].src;
                if(_value != null && _value != "")
                    _selection_color.push(_value);
            }
            _section_count++;
        }
        var _item_remain = [];
        if(_section_color && _section_size) {
            for(var i=0; i<_selection_color.length; i++) {
                for(var j=0; j<_selection_size.length; j++) {
                    _item_remain.push(0);
                }
            }
        } else if(_section_size) {
            for(var i=0; i<_selection_size.length; i++) {
                _item_remain.push(0);
            }
        } else if(_section_color) {
            for(var i=0; i<_selection_color.length; i++) {
                _item_remain.push(0);
            }
        } else {
            _item_remain.push(0);
        }

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
            sub:  _img_sub,
            color: _selection_color
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
                size:           _selection_size,
                remain:         _item_remain,
                publish:        false
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
            //SubImageHTML += "<div class='column'>" +
            //                    "<div></div>" +
            //                    "<img src='"+_temp_sub[i]+"'>" +
            //                "</div>" +
            //                "<br>";
            SubImageHTML += "<img src='"+_temp_sub[i]+"' class='label_product_img_sub'>";
        }
        $('#ShowingSubImage').html(SubImageHTML);

        var SizeSelectionHTML = "";
        var _temp_size = this.size;
        if(_temp_size.length > 0) {
            for(var i=0; i< _temp_size.length; i++) {
                SizeSelectionHTML += "<button style='background-color:none;' class='btn-select-a-size'>"+_temp_size[i]+"</button>";
            }
            $('#SizeSelection').html(SizeSelectionHTML).show();
        } else {
            $('#SizeSelectionHeader').hide();
        }

        var ColorSelectionHTML = "";
        var _temp_color = Helpers.Image.GetImageByID.Color(this.image);
        if(_temp_color.length > 0) {
            for(var i=0; i< _temp_color.length; i++) {
                ColorSelectionHTML += "<div>" +
                                            "<div style='display:none;' class='btn-select-a-color-bg'></div>" +
                                            "<img src='"+_temp_color[i]+"' class='btn-select-a-color'>" +
                                        "</div>";
            }
            $('#ColorSelection').html(ColorSelectionHTML).show();
        } else {
            $('#ColorSelectionHeader').hide();
        }
    },

    // Click to change the image
    'click .label_product_img_sub': function(e) {
        $('#label_product_img_main').attr('src', e.currentTarget.currentSrc);
    },

    // Click to select the size
    'click .btn-select-a-size': function(e) {
        $('#SizeSelection').find('button').css({"background":'none'});
        e.currentTarget.style.background = 'orange';
        CheckRemaining();
    },

    // Click to select the color
    'click .btn-select-a-color': function(e) {
        $('#ColorSelection').find('div').find('div').hide();
        $('#label_product_img_main').attr('src', e.currentTarget.currentSrc);
        e.currentTarget.parentElement.children[0].style.display = 'block';
        CheckRemaining();
    },

    // Click 'Edit'
    'click .btn-remain-edit': function() {
        $('#label_product_rest').hide();
        $('.btn-remain-edit').hide();
        $('#label_product_rest_edit').show();
        $('.btn-remain-save').show();
    },

    // Click Save
    'click .btn-remain-save': function() {
        var _index = parseInt($('#label_product_rest').val());
        if(_index >= 0) {
            var _id = $('#label_product_id').html();
            var _product = Products.findOne({_id:_id});
            var _value = $('#label_product_rest_edit').val();
            var _remain = _product.remain;
            _remain[_index] = _value;
            console.log(_value);
            console.log(_remain);
            Products.update(_id, {$set:{remain:_remain}});
        }
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

function CheckRemaining() {
    var _size = $('#SizeSelection').find('button');
    var _index_size = -1;
    for(var i=0; i<_size.length; i++) {
        var _style = _size.eq(i).attr('style');
        if(_style == "background: orange;") {
            _index_size = i;
            break;
        }
    }
    var _color = $('#ColorSelection').find('div').find('div');
    var _index_color = -1;
    for(var i=0; i<_color.length; i++) {
        var _style = _color.eq(i).attr('style');
        if(_style == "display: block;") {
            _index_color = i;
            break;
        }
    }

    var _id = $('#label_product_id').html();
    var _product = Products.findOne({_id:_id});
    var _index = _index_color * _color.length + _index_size;
    if(_index_color == -1 || _index_size == -1) { _index = 0; }
    console.log(_index);
    var _value = _product.remain[_index];
    if(_index_color == -1 || _index_size == -1) { _index = -1; _value = 0; }
    console.log(_value);
    $('#label_product_rest').html(_value);
    $('#label_product_rest_edit').val(_value);
    $('#label_product_rest').val(_index);
    console.log($('#label_product_rest').val());
};

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