/**
 * Created by chinhong on 5/21/15.
 */
function LocatToLogin() {
    window.setTimeout(function() {
        var _location = location.pathname;
        _location = _location.replace("/","");
        _location += "/";
        location = "" + _location + "login";
    },1000);
}

function InitializeProductInfo(_id) {
    MainPage_Log.Show("InitializeProductInfo", _id);
    tab_events.SelectTab("Product Info");
    $('#FindProduct_Sidebar').addClass('active');
}

// Get the Value from a radio group.
// (header = radio -> name)
function GetRadioValue(header) {
    var selections = document.getElementsByName(header);
    var final_result = "";
    for (var i = 0; i < selections.length; i++) {
        if (selections[i].checked) {
            final_result = selections[i].value;
            break;
        }
    }
    return final_result;
}

Template.MainPage.rendered = function() {
    // Turn to Login Page if haven't login
    var _id = Meteor.userId();
    if(_id == null) {
        LocatToLogin();
    } else {
        var _cart_item = window.localStorage.getItem("CartItem");
        var _cart_select = window.localStorage.getItem("CartItem_selected");
        if(_cart_item == null) {
            window.localStorage.setItem('CartItem','');
        }if(_cart_select == null) {
            window.localStorage.setItem('CartItem_selected','');
        }
        window.setTimeout(function() {
            var _location = location.hash;
            _location = _location.replace("#","");
            if(_location == "CART" || _location == "STARTORDER") {
                if(_location == "CART") {
                    tab_events.SelectTab("Check Cart");
                } else {
                    tab_events.SelectTab("Start Order");
                }
            } else {
                var _count = Products.find({_id: _location}).count();
                if (_count > 0) {
                    InitializeProductInfo(_location);
                } else {
                    console.log('No This Product');
                }
            }
        }, 1000);
    }
}

var tab_events = {
    SelectTab: function(tab_name) {
        MainPage_Log.Show("SelectTab", tab_name);
        $('.container_item').hide();
        $('.profile_item').hide();
        $('.find_product_item').hide();
        $('.sidebar_subhead').hide();
        $('.sidebar_tab').removeClass("active");
        switch(tab_name) {
            case "Profile":
                $('#MainPage_Profile').show();
                $('#Profile_Overview').show();
                break;
            case "ResetPassword":
                $('#MainPage_Profile').show();
                $('#Profile_ResetPassword').show();
                break;
            case "SetAddress":
                $('#MainPage_Profile').show();
                $('#Profile_DefaultAddress').show();
                var _temp = Meteor.user().profile;
                $('#label_country').html(_temp.country);
                $('#label_city').html(_temp.city);
                $('#label_address').html(_temp.address);
                $('#label_phone').html(_temp.phone);
                $('#label_zipcode').html(_temp.zipcode);
                break;
            case "ChangeAddress":
                $('#MainPage_Profile').show();
                $('#Profile_ChangeAddress').show();
                var _temp = Meteor.user().profile;
                $('#input_country').val(_temp.country);
                $('#input_city').val(_temp.city);
                $('#input_address').val(_temp.address);
                $('#input_phone').val(_temp.phone);
                $('#input_zipcode').val(_temp.zipcode);
                break;
            case "Invitation":
                $('#MainPage_Profile').show();
                $('#Profile_SendInvite').show();
                break;
            case "Overview":
                $('#MainPage_Overview').show();
                break;
            case "Order Detail":
                $('#MainPage_OrderDetail').show();
                break;
            case "Find Products":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Tab').show();
                $('#FindProduct_MainPage').show();
                break;
            case "Product Info":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Tab').show();
                $('#FindProducts_ProductInfo').show();
                break;
            case "Start Order":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Order_Step1').show();

                // Fill Column
                var _ids = window.localStorage.getItem('CartItem_selected').split(',');
                var _count = 0;
                var _weight = 0;
                var _price = 0;
                for(var i=0; i< _ids.length; i++) {
                    if(_ids[i] != "") {
                        _weight += Helpers.Product.GetProductByID.Weight(_ids[i]);
                        _price += Helpers.Product.GetProductByID.Price(_ids[i]);
                        _count ++;
                    }
                }
                $('#step1_label_cart').html(_count);
                $('#step1_label_weight').html(_weight + " g");
                $('#step1_label_payment').html(_price + " HKD");
                break;
            case "Start Order Step2":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Order_Step2').show();
                var _temp = Meteor.user().profile;
                $('#step2_label_country').val(_temp.country);
                $('#step2_label_city').val(_temp.city);
                $('#step2_label_address').val(_temp.address);
                $('#step2_label_phone').val(_temp.phone);
                $('#step2_label_zipcode').val(_temp.zipcode);
                break;
            case "Start Order Step3":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Order_Step3').show();

                // Fill column
                $('#step3_label_payment').html($('#step1_label_payment').html());
                break;
            case "Start Order Step4":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Order_Step4').show();

                // Fill Payment Column
                var _products = Helpers.Product.GetProductListInCart();
                var _count = 0;
                for(var i=0; i<_products.length; i++) {
                    if(_products[i] != "" && _products[i] != null) {
                        _count++;
                    }
                }
                $('#step4_label_total').html($('#step3_label_payment').html());
                $('#step4_label_count').html(_count);
                $('#step4_label_weight').html($('#step1_label_weight').html());
                $('#step4_label_payment_method').html(GetRadioValue("payment"));
                $('#step4_label_shipping_method').html(GetRadioValue("shipping"));

                // Fill Address Column
                $('#step4_label_country').html($('#step2_label_country').val());
                $('#step4_label_city').html($('#step2_label_city').val());
                $('#step4_label_address').html($('#step2_label_address').val());
                $('#step4_label_phone').html($('#step2_label_phone').val());
                $('#step4_label_zipcode').html($('#step2_label_zipcode').val());

                break;
            case "Submit Order":
                $('#MainPage_Overview').show();
                alert("Order is sent");
                break;
            case "Check Cart":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Cart').show();
                break;
            default:
                MainPage_Log.Show("SelectTab", "Tab of '" + tab_name + "' have not set an events");
                break;
        }
    }
};

function AddProductToCart() {
    var _id = Helpers.Product.GetProductByHash.ProductID();
    var _tempString = window.localStorage.getItem('CartItem');
    var _newtemp = [_id];
    if(_tempString != null && _tempString != "") {
        var _temp = _tempString.split(',');
        for(var i=0; i<_temp.length; i++) {
            if(_temp[i] != _id) {
                _newtemp.push(_temp[i]);
            }
        }
    }
    window.localStorage.setItem('CartItem', _newtemp.toString());
}

Template.MainPage.events({
    // Click Logout Button
    'click .btn_logout': function() {
        Meteor.logout(function() {
            LocatToLogin();
        });
    },

    // Click Profile Button
    'click .btn_profile': function() {
        tab_events.SelectTab("Profile");
        $('#label_username').html(Helpers.User.Name());
        $('#label_useremail').html(Helpers.User.Email());
        $('#label_invitation').html(Helpers.User.Invitation());
        $('#label_invite_by').html(Helpers.User.InviteBy());
        $('#label_create').html(Helpers.User.CreateAt());
    },

    // Click Reset Button from Profile
    'click .btn_reset_password': function() {
        tab_events.SelectTab("ResetPassword");
    },

    // Click to Set Address
    'click .btn_address_set': function() {
        tab_events.SelectTab("SetAddress");
    },

    // Click 'Change' in Address
    'click .btn_address_change': function() {
        tab_events.SelectTab("ChangeAddress");
    },

    // Click 'Back' in Address
    'click .btn_address_back': function() {
        tab_events.SelectTab("Profile");
    },

    // Click 'Change' in Changing Address
    'click .btn_address_change_submit': function() {
        tab_events.SelectTab("SetAddress");
        var _country = $('#input_country').val();
        var _city = $('#input_city').val();
        var _address = $('#input_address').val();
        var _phone = $('#input_phone').val();
        var _zipcode = $('#input_zipcode').val();
        Users.update('QoGdZ46BzbRtKz4JA', {$set:{profile:{
            country: _country,
            city: _city,
            address: _address,
            phone: _phone,
            zipcode: _zipcode
        }}})
    },

    // Click 'Back' in Changing Address
    'click .btn_address_change_back': function() {
        tab_events.SelectTab("SetAddress");
    },

    // Click Invite Button from Profile
    'click .btn_invite': function() {
        var _count = parseInt($('#label_invitation').html());
        if(_count > 0) {
            tab_events.SelectTab("Invitation");
        } else {
            alert('You haven not enough invite letter.\n' +
                "You can buy something to increase it.");
        }
    },

    // Click Reset Button form Reset Password
    'click .btn_reset_password_submit': function() {
        var _pw_old = $('#input_reset_origin').val();
        var _pw_new = $('#input_reset_new').val();
        var _pw_con = $('#input_reset_confirm').val();
        if(_pw_new != _pw_con) {
            Helpers.ErrorMessage.ConfirmPW();
        } else {
            Accounts.changePassword(_pw_old,_pw_new,function(err){
                if (err) {
                    alert(err.reason);
                    return false;
                } else {
                    Meteor.logout(function() {
                        alert('Password have Reset');
                        location = "/login";
                    });
                }
            });
        }
    },

    // Click Back Button from Reset Password
    'click .btn_reset_password_back': function() {
        tab_events.SelectTab("Profile");
    },

    // Click Invite Button from Invitation
    'click .btn_invite_send': function() {
        var _to = $('#input_invitees_email').val();
        var _from = Helpers.User.Email();
        var _text = $('#input_invite_message').val();
        var _check = true;
        if(_to == "" || _to == null || _to.search('@') < 0 || _to.search('.') < 0) {
            _check = false;
        }

        var _invitation_left = parseInt(Meteor.user().invitation) - 1;
        var _invitation_use = parseInt(Meteor.user().invitation_use) + 1;
        if(_check) {
            Meteor.call(
                'invitation_use',
                Meteor.userId(), _invitation_left, _invitation_use
            )
            Meteor.call(
                'invitation_insert',
                _to, _from, _text
            );
            location.hash = "";
            location.reload();
        } else {
            alert("Send fail");
        }
    },

    // Click Sidebar Tab
    'click .sidebar_tab': function(e) {
        tab_events.SelectTab(e.target.innerText);
        $('.sidebar_tab').removeClass("active");
        e.target.classList.add("active");
    },

    // Click to see an order information
    'click .user-order-each': function() {
        tab_events.SelectTab("Order Detail");

        // Fill Column for Order Information

        $('#label_detail_orderid').html(this._id);
        $('#label_detail_username').html(Meteor.users.find({_id:this.user}).fetch()[0].username);
        $('#label_detail_status').html(this.status);
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

    // Click 'Back' in Order Detail
    'click .btn_order_detail_back': function() {
        tab_events.SelectTab("Overview");
    },

    // Click in a Product
    'click .product_info': function() {
        location = '/#' + this._id;
        //InitializeProductInfo(this._id);
        location.reload();
    },

    // Click 'Order' for a Product
    'click .btn-order': function() {
        AddProductToCart();
        window.localStorage.setItem('CartItem_selected', localStorage.getItem('CartItem'));
        //tab_events.SelectTab('Start Order');
        location.hash = '#STARTORDER';
        location.reload();
    },

    // Click 'Add to Cart' for a Product
    'click .btn-cart': function() {
        AddProductToCart();
        //tab_events.SelectTab('Check Cart');
        location.hash = '#CART';
        location.reload();
    },

    // Click a product in Cart
    'click .cart-item-each': function(e) {
        var _id = e.currentTarget.attributes.value.value;
        location.hash = '#' + _id;
        location.reload();
    },

    // Select or Unselect a product
    'click .btn-cart-checkbox': function(e) {
        var _id = this.toString();
        var _action = e.target.checked;
        var _select_o = window.localStorage.getItem('CartItem_selected').split(',');
        var _select_n = [];
        if(_action) {
            for(var i=0; i<_select_o.length; i++) {
                if(_select_o[i] != "") {
                    _select_n.push(_select_o[i]);
                }
            }
            _select_n.push(_id);
        } else {
            for(var i=0; i<_select_o.length; i++) {
                if(_select_o[i] != _id && _select_o[i] != "") {
                    _select_n.push(_select_o[i]);
                }
            }
        }
        window.localStorage.setItem('CartItem_selected', _select_n);

        // Fill column
        $('#step1_label_cart').html(_select_n.length);
        var _product_weight = Helpers.Product.GetProductByID.Weight(_id);
        var _product_price = Helpers.Product.GetProductByID.Price(_id);
        var _weight = parseInt($('#step1_label_weight').html());
        var _price = parseInt($('#step1_label_payment').html());
        var _weight_new;
        var _price_new;
        if(_action) {
            _weight_new = _weight + _product_weight;
            _price_new = _price + _product_price;
        } else {
            _weight_new = _weight - _product_weight;
            _price_new = _price - _product_price;
        }
        $('#step1_label_weight').html(_weight_new + " g");
        $('#step1_label_payment').html(_price_new + " HKD");
    },

    // Cancel a product in Cart
    'click .btn-cart-cancel': function() {
        var _id = this.toString();
        var _product_cart = window.localStorage.getItem("CartItem").split(",");
        var _product_select = window.localStorage.getItem("CartItem_selected").split(",");
        var _product_cart_new = [];
        var _product_select_new = [];
        for(var i=0; i< _product_cart.length; i++) {
            if(_product_cart[i] != _id && _product_cart[i] != "") {
                _product_cart_new.push(_product_cart[i]);
            }
        }
        for(var i=0; i< _product_select.length; i++) {
            if(_product_select[i] != _id && _product_select[i] != "") {
                _product_select_new.push(_product_select[i]);
            }
        }
        window.localStorage.setItem("CartItem", _product_cart_new);
        window.localStorage.setItem("CartItem_selected", _product_select_new);

        location.hash = '#STARTORDER';
        location.reload();
    },

    // Click 'Next Step' in Order
    'click .btn-step1-next': function() {
        if(window.localStorage.getItem('CartItem_selected') == "" || window.localStorage.getItem('CartItem_selected') == null) {
            Helpers.ErrorMessage.NoItemSelected();
        } else {
            tab_events.SelectTab('Start Order Step2');
        }
    },

    // Click 'Previous Step' in Step2
    'click .btn-step2-previous': function() {
        tab_events.SelectTab('Start Order');
    },

    // Click 'Next Step' in Step2
    'click .btn-step2-next': function() {
        var _temp1 = $('#step2_label_country').val();
        var _temp2 = $('#step2_label_city').val();
        var _temp3 = $('#step2_label_address').val();
        var _temp4 = $('#step2_label_phone').val();
        var _temp5 = $('#step2_label_zipcode').val();
        if(_temp1 == "" ||
            _temp2 == "" ||
            _temp3 == "" ||
            _temp4 == "" ||
            _temp5 == "") {
            Helpers.ErrorMessage.BlankColumn();
        } else {
            tab_events.SelectTab('Start Order Step3');
        }
    },

    // Click 'Previous Step' in Step3
    'click .btn-step3-previous': function() {
        tab_events.SelectTab('Start Order Step2');
    },

    // Click 'Next Step' in Step3
    'click .btn-step3-next': function() {
        tab_events.SelectTab('Start Order Step4');
    },

    // Click 'Previous Step' in Step4
    'click .btn-step4-previous': function() {
        tab_events.SelectTab('Start Order Step3');
    },

    // Click 'Create Order' in Step4
    'click .btn-step4-next': function() {
        var _userID =   Meteor.userId();
        var _products = window.localStorage.getItem('CartItem_selected').split(',');
        var _payment =  $('#step4_label_total').html();
        var _count =    $('#step4_label_count').html();
        var _weight =   $('#step4_label_weight').html();
        var _payment_method = $('#step4_label_payment_method').html();
        var _shipping_method = $('#step4_label_shipping_method').html();
        var _country =  $('#step4_label_country').html();
        var _city =     $('#step4_label_city').html();
        var _address =  $('#step4_label_address').html();
        var _phone =    $('#step4_label_phone').html();
        var _zipcode =  $('#step4_label_zipcode').html();

        var _status = "Waiting Confirm";
        var _date = new Date();

        Orders.insert({
            user:     _userID,
            products: _products,
            payment: {
                payment: _payment,
                count:   _count,
                weight:  _weight,
                payment_method:  _payment_method,
                shipping_method: _shipping_method
            },
            address: {
                country: _country,
                city:    _city,
                address: _address,
                phone:   _phone,
                zipcode: _zipcode
            },
            status:      _status,
            createAt:    _date
        }, function() {
            var _cart_product = window.localStorage.getItem("CartItem").split(',');
            var _cart_selected = window.localStorage.getItem("CartItem_selected").split(',');
            var _cart_rest = [];
            for(var i=0; i<_cart_product.length; i++) {
                var _buy = false;
                if (_cart_product[i] == "") {
                    _buy = true;
                } else {
                    for (var j = 0; j < _cart_selected.length; j++) {
                        if(_cart_product[i] == _cart_selected[j]) {
                            _buy = true;
                        }
                    }
                }
                if(!_buy) {
                    _cart_rest.push(_cart_product[i]);
                }
            }
            if(_cart_rest.length > 0) {
                window.localStorage.setItem('CartItem', _cart_rest.toString());
                window.localStorage.removeItem('CartItem_selected');
            } else {
                window.localStorage.removeItem('CartItem');
                window.localStorage.removeItem('CartItem_selected');
            }
            tab_events.SelectTab('Submit Order');
        });
    }
});

var MainPage_Log = {
    active: true,
    Show: function(header, message) {
        if(MainPage_Log.active) {
            console.log("[" + header + "]: " + message);
        }
    }
}