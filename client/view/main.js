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

Template.MainPage.rendered = function() {
    // Turn to Login Page if haven't login
    var _id = Meteor.userId();
    if(_id == null) {
        LocatToLogin();
    } else {
        window.setTimeout(function() {
            var _location = location.hash;
            _location = _location.replace("#","");
            var _count = Products.find({_id: _location}).count();
            if (_count > 0) {
                InitializeProductInfo(_location);
            } else {
                console.log('No This Product');
            }
        }, 200);
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
                $('#FindProducts_Cart').show();
                $('#FindProducts_Order_Step1').show();
                break;
            case "Start Order Step2":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Order_Step2').show();
                var _temp = Meteor.user().profile;
                $('#step2_label_country').html(_temp.country);
                $('#step2_label_city').html(_temp.city);
                $('#step2_label_address').html(_temp.address);
                $('#step2_label_phone').html(_temp.phone);
                $('#step2_label_zipcode').html(_temp.zipcode);
                break;
            case "Start Order Step3":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Order_Step3').show();
                break;
            case "Start Order Step4":
                $('#MainPage_Overview').show();
                Orders.insert({

                });
                alert("Order Created");
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
    if(_tempString != null) {
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
        $('#label_invite_by').html(Helpers.User.Invitation());
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
        tab_events.SelectTab("Invitation");
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

        if(_check) {
            Meteor.call(
                'invitation_insert',
                _to, _from, _text
            );
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

    // Click in a Product
    'click .product_info': function() {
        location = '/#' + this._id;
        //InitializeProductInfo(this._id);
        location.reload();
    },

    // Click 'Order' for a Product
    'click .btn-order': function() {
        tab_events.SelectTab('Start Order');
        AddProductToCart();
    },

    // Click 'Add to Cart' for a Product
    'click .btn-cart': function() {
        tab_events.SelectTab('Check Cart');
        AddProductToCart();
    },

    // Click 'Next Step' in Order
    'click .btn-step1-next': function() {
        tab_events.SelectTab('Start Order Step2');
    },

    // Click 'Previous Step' in Step2
    'click .btn-step2-previous': function() {
        tab_events.SelectTab('Start Order');
    },

    // Click 'Next Step' in Step2
    'click .btn-step2-next': function() {
        tab_events.SelectTab('Start Order Step3');
    },

    // Click 'Previous Step' in Step3
    'click .btn-step3-previous': function() {
        tab_events.SelectTab('Start Order Step2');
    },

    // Click 'Next Step' in Step3
    'click .btn-step3-next': function() {
        tab_events.SelectTab('Start Order Step4');
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