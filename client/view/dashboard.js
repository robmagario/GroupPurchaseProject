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
            case "Invitation Key List":
                $('#Dashboard_InvitationKeyList').show();
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

    // Create Product
    'click .btn_create_product': function() {
        Dashboard_Log.Show("Create Product", "Start");
        var _name = $('#input_name').val();
        var _image = $('#input_image').val();
        var _price = $('#input_price').val();
        var _weight = $('#input_weight').val();
        var _description = $('#input_description').val();
        var _empty = false;
        var _error = "";
        Dashboard_Log.Show("Name", _name);
        Dashboard_Log.Show("Image", _image);
        Dashboard_Log.Show("Price", "HKD " + _price);
        Dashboard_Log.Show("Weight", _weight + "g");
        Dashboard_Log.Show("Description", _description);
        if(_name == "" || _name == null) {
            _empty = true;
            _error += "Please fill the 'Product Name' column!\n";
        }
        if(_image == "" || _image == null) {
            _image = "No Image";
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
                weight:        _weight,
                image:          _image,
                publish:        true
            });
            Dashboard_Log.Show("Create Product", "Create Success!");
            alert("Process Success!");
        } else {
            Dashboard_Log.Show("Create Product", "Create Fail!");
            alert(_error);
        }
    }
})

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