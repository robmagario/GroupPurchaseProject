/**
 * Created by chinhong on 5/21/15.
 */
var ColumnInCartValue = 5;

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
    var _cart_item = window.localStorage.getItem("CartItemValue");
    var _cart_select = window.localStorage.getItem("CartItemSelect");
    if(_cart_item == null) { window.localStorage.setItem('CartItemValue',''); }
    if(_cart_select == null) { window.localStorage.setItem('CartItemSelect',''); }
    window.setTimeout(function() {
        var _location = location.hash;
        if(_location == "") {
            tab_events.SelectTab("Find Products");
        } else {
            _location = _location.replace("#", "");
            var _count = Products.find({_id: _location}).count();
            if (_count > 0) {
                InitializeProductInfo(_location);
            } else {
                Helpers.Log.Show("Products", "No This Products by " + _location);
            }
        }
    }, 1000);
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
            case "Find Products":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Tab').show();
                $('#FindProduct_MainPage').show();
                break;
            case "Product Info":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Tab').show();
                $('#ProductInfo').show();
                break;
            case "Check Cart":
                $('#MainPage_FindProducts').show();
                $('#FindProducts_Cart').show();
                break;
            default:
                Helpers.Log.Show("SelectTab", "Tab of '" + tab_name + "' have not set an events");
                break;
        }
    }
};

function CheckOrderColumn() {
    var _result = true;

    var _size = $('#size').find('button');
    var _index_size = -1;
    for(var i=0; i<_size.length; i++) {
        var _style = _size.eq(i).attr('style');
        if(_style == "background: orange;") {
            _index_size = i;
            break;
        }
    }
    var _color = $('#color').find('div').find('div');
    var _index_color = -1;
    for(var i=0; i<_color.length; i++) {
        var _style = _color.eq(i).attr('style');
        if(_style == "display: block;") {
            _index_color = i;
            break;
        }
    }

    if(_index_size < 0) {
        _result = false;
    }
    if(_index_color < 0) {
        _result = false;
    }

    var _quantity = $('#quantity').val();
    if(_quantity == "" || _quantity == "0" || quantity == null) {
        _result = false;
    }

    var _remain = $('#remain').html();
    if(parseInt(_quantity) > parseInt(_remain)) {
        _result = false;
    }
    return _result;
}

function AddProductToCart(loc) {
    var _randomID = parseInt(Math.random() * 65536);
    var _id = Helpers.Product.GetProductByHash.ProductID();
    var _size = $('#size').find('button');
    var _index_size = -1;
    for(var i=0; i<_size.length; i++) {
        var _style = _size.eq(i).attr('style');
        if(_style == "background: orange;") {
            _index_size = i;
            break;
        }
    }
    var _color = $('#color').find('div').find('div');
    var _index_color = -1;
    for(var i=0; i<_color.length; i++) {
        var _style = _color.eq(i).attr('style');
        if(_style == "display: block;") {
            _index_color = i;
            break;
        }
    }
    var _quantity = $('#quantity').val();
    //var _tempString = window.localStorage.getItem('CartItem');
    //var _newtemp = [_randomID];
    var _tempString = window.localStorage.getItem('CartItemValue');
    var _newtemp = [_randomID, _id, _index_color, _index_size, _quantity];
    if(_tempString != null && _tempString != "") {
        var _temp = _tempString.split(',');
        //var _tempsub = _tempString.split(',');
        for(var i=0; i<_temp.length; i+=ColumnInCartValue) {
            //_newtemp.push(_temp[i]);
            for(var j=0; j<ColumnInCartValue; j++) {
                _newtemp.push(_temp[i + j]);
            }
        }
    }
    window.localStorage.setItem('CartItemSelect', _randomID.toString());
    window.localStorage.setItem('CartItemValue', _newtemp.toString());

    location = "/" + loc;
}

Template.MainPage.events({
    // Click in a Product
    'click .each-product': function() {
        Helpers.System.LocateTo('/home#' + this._id);
        location.reload();
    },

    // Select Country
    'click .select-show-country': function(e) {
        var _boxes = $('.select-show-country');
        var _items = $('.each-product').find('labela');
        for(var i=0; i< _items.length; i++) {
            var _item_values = _items[i].innerHTML.split(',');
            var _item_index;
            var _should_show = false;
            for(_item_index in _item_values) {
                for(var j=0; j<_boxes.length; j++) {
                    if(_boxes[j].checked) {
                        if(_boxes[j].value == _item_values[_item_index]) {
                            _should_show = true;
                            break;
                        }
                    }
                }
            }
            if(_should_show) {
                $('.each-product').eq(i).show();
            } else {
                $('.each-product').eq(i).hide();
            }
        }
    },

    // Click to select the color
    'click .btn-select-a-color': function(e) {
        if(e.currentTarget.parentElement.children[0].style.display == 'block') {
            $('#color').find('div').find('div').hide();
            $('#label_product_img_main').attr('src', e.currentTarget.currentSrc);
        } else {
            $('#color').find('div').find('div').hide();
            $('#label_product_img_main').attr('src', e.currentTarget.currentSrc);
            e.currentTarget.parentElement.children[0].style.display = 'block';
        }
        CheckRemaining();
    },

    // Click to change the image
    'click .sub-img, click .main-img, click .color-img': function(e) {
        $('#img_main').attr('src', e.currentTarget.currentSrc);
    },

    'click .btn': function(e) {
        var _action = e.target.value;
        Helpers.Log.Show("Button", _action + " in Product Info.");
        switch (_action) {
            case "SelectSize":
                if(e.currentTarget.style.background != 'orange') {
                    $('#size').find('button').css({"background":'transparent'});
                    e.currentTarget.style.background = 'orange';
                } else {
                    $('#size').find('button').css({"background":'transparent'});
                }
                CheckRemaining();
                break;
            default :
                Helpers.Log.Show("Button", _action + " is undefind in Product Info.");
                break;
        }
    },


    // Change the Quantity
    'change #label_product_quantity': function() {
        var _price = parseInt(Helpers.Product.GetProductByHash.Price());
        var _cashback = parseInt(Helpers.Product.GetProductByHash.CalculateDescount());
        var _quantity = parseInt($('#label_product_quantity').val());
        if(_quantity != 0 && _quantity != "") {
            var _remain = Helpers.User.CashBackStatus.UserTotalRemain();
            var _price_new = Helpers.Product.CalculatePriceByUseCashback((_price * _quantity), _remain);
            var _remain_new = Helpers.Product.CalculateRemainByUseCashback((_price * _quantity), _remain);
            $('#ProductPagePrice').html((_price * _quantity) + " HKD");
            $('#ProductPageCashback').html("<span>4%Cash Back</span> = " + (_cashback * _quantity) + " HKD");
            $('#ProductPagePriceNew').html((_price * _quantity) + " HKD => " + _price_new + " HKD");
            $('#ProductPageCashbackRemain').html(_remain + " HKD => " + _remain_new + " HKD");
        }
    },

    // Click 'Order' for a Product
    'click .btn-order': function() {
        if(CheckOrderColumn()) {
            AddProductToCart("createorder");
            //window.localStorage.setItem('CartItem_selected', localStorage.getItem('CartItem'));
            //tab_events.SelectTab('Start Order');
            //location.hash = '#STARTORDER';
            //location.reload();
        } else {
            Helpers.ErrorMessage.BlankColumn();
        }
    },

    // Click 'Add to Cart' for a Product
    'click .btn-cart': function() {
        if(CheckOrderColumn()) {
            AddProductToCart("cart");
            //tab_events.SelectTab('Check Cart');
            //location.hash = '#CART';
            //location.reload();
        } else {
            Helpers.ErrorMessage.BlankColumn();
        }
    },

    // Click to see the product
    'click .to-see-product': function(e) {
        location = '/#' + e.currentTarget.attributes.value.value;
        location.reload();
    },






    // Click to select the size
    'click .btn-select-a-size': function(e) {
        if(e.currentTarget.style.background != 'orange') {
            $('#size').find('button').css({"background":'transparent'});
            e.currentTarget.style.background = 'orange';
        } else {
            $('#size').find('button').css({"background":'transparent'});
        }
        CheckRemaining();
    },




    // Click a product in Cart
    'click .cart-item-each': function(e) {
        if(e.target.nodeName != 'BUTTON') {
            var _id = e.currentTarget.attributes.value.value;
            location.hash = '#' + _id;
            location.reload();
        }
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
        //$('#step1_label_cart').html(_select_n.length);
        var _product_weight = Helpers.Product.GetProductByCartID.Weight(_id);
        var _product_price = Helpers.Product.GetProductByCartID.Price(_id);
        var _product_cashback = parseInt(_product_price * 0.04);
        var _product_quantity = Helpers.Product.GetProductByCartID.Quantity(_id);
        var _weight = parseInt($('#step1_label_weight').html());
        var _price = parseInt($('#step1_label_payment').html());
        var _cashback = parseInt($('#step1_label_cashback').html());
        var _quantity = parseInt($('#step1_label_cart').html());
        var _weight_new;
        var _price_new;
        var _cashback_new;
        var _quantity_new;
        if(_action) {
            _weight_new = _weight + _product_weight;
            _price_new = _price + _product_price;
            _cashback_new = _cashback + _product_cashback;
            _quantity_new = _quantity + _product_quantity;
        } else {
            _weight_new = _weight - _product_weight;
            _price_new = _price - _product_price;
            _cashback_new = _cashback - _product_cashback;
            _quantity_new = _quantity - _product_quantity;
        }


        var _remain = Helpers.User.CashBackStatus.UserTotalRemain();
        var _cashback_use = Helpers.Product.CalculateCashbackByUseCashback(_price_new, _remain);
        var _price__new = Helpers.Product.CalculatePriceByUseCashback(_price_new, _remain);

        $('#step1_label_weight').html(_weight_new + " g");
        $('#step1_label_payment').html(_price__new + " HKD");
        $('#step1_label_cashback').html(_cashback_new + " HKD");
        $('#step1_label_cashback_use').html(_cashback_use + " HKD");
        $('#step1_label_cart').html(_quantity_new);

    },

    // Cancel a product in Cart
    'click .btn-cart-cancel': function() {
        var _id = this.toString();
        var _product_cart = window.localStorage.getItem("CartItem").split(",");
        var _product_cart_value = window.localStorage.getItem("CartItemValue").split(",");
        var _product_select = window.localStorage.getItem("CartItem_selected").split(",");
        var _product_cart_new = [];
        var _product_cart_value_new = [];
        var _product_select_new = [];
        for(var i=0; i< _product_cart.length; i++) {
            if(_product_cart[i] != _id && _product_cart[i] != "") {
                _product_cart_new.push(_product_cart[i]);
                for(var j=0; j<ColumnInCartValue; j++) {
                    _product_cart_value_new.push(_product_cart_value[i*ColumnInCartValue + j]);
                }
            }
        }
        for(var i=0; i< _product_select.length; i++) {
            if(_product_select[i] != _id && _product_select[i] != "") {
                _product_select_new.push(_product_select[i]);
            }
        }
        window.localStorage.setItem("CartItem", _product_cart_new);
        window.localStorage.setItem("CartItemValue", _product_cart_value_new);
        window.localStorage.setItem("CartItem_selected", _product_select_new);

        location.hash = '#STARTORDER';
        location.reload();
    }
});

function CheckRemaining() {
    $('.selection-unable').removeClass('selection-unable');

    var _size = $('#size').find('button');
    var _index_size = -1;
    for(var i=0; i<_size.length; i++) {
        var _style = _size.eq(i).attr('style');
        if(_style == "background: orange;") {
            _index_size = i;
            break;
        }
    }
    var _color = $('#color').find('div').find('div');
    var _index_color = -1;
    for(var i=0; i<_color.length; i++) {
        var _style = _color.eq(i).attr('style');
        if(_style == "display: block;") {
            _index_color = i;
            break;
        }
    }

    var _hash = location.hash;
    var _product_id = _hash.replace("#","");
    var _product = Products.findOne({_id:_product_id});
    var _index = _index_color * _size.length + _index_size;
    if(_index_color >= 0) {
        for(var i=0; i<_size.length; i++) {
            var _checking_index = _index_color * _size.length + i;
            if(_product.remain[_checking_index] <= 0) {
                $('#size').find('button').eq(i).addClass('selection-unable');
            }
        }
    }
    if(_index_size >= 0) {
        for (var i = 0; i < _color.length; i++) {
            var _checking_index = i * _size.length + _index_size;
            if (_product.remain[_checking_index] <= 0) {
                $('#color').find('div').eq(i * 2).addClass('selection-unable');
            }
        }
    }
    if(_index_color == -1 || _index_size == -1) {
        _index = 0;
    }
    var _value = _product.remain[_index];
    if(_index_color == -1 || _index_size == -1) { _index = -1; _value = 0; }
    $('#remain').html(_value);
    //$('#label_product_rest_edit').val(_value);
};

var MainPage_Log = {
    active: true,
    Show: function(header, message) {
        if(MainPage_Log.active) {
            console.log("[" + header + "]: " + message);
        }
    }
}

Template.FindProduct_MainPage.helpers({
    'ListPublished': function() {
        return Products.find({publish: true});
    },
    'ToShow': function(array) {
        var _show = [];
        var i;
        for(i in array) {
            if(array[i].show_on == "true") {
                _show.push(array[i].country);
            }
        }
        return _show;
    }
});

Template.ProductInfo.helpers({
    'HashProduct': function() {
        var _hash = location.hash;
        var _id = _hash.replace("#","");
        return Products.find({_id:_id});
    },
    'MainImage': function() {
        var _hash = location.hash;
        var _product_id = _hash.replace("#","");
        var _product = Products.findOne({_id:_product_id});
        var _imageid = "";
        if(_product != null) {
            _imageid = _product.image;
        }
        var _image = ProductImages.findOne({_id:_imageid});
        if(_image != null) {
            return _image.main;
        } else {
            return null;
        }
    },
    'SubImages': function() {
        var _hash = location.hash;
        var _product_id = _hash.replace("#","");
        var _product = Products.findOne({_id:_product_id});
        var _imageid = "";
        if(_product != null) {
            _imageid = _product.image;
        }
        var _image = ProductImages.findOne({_id:_imageid});
        if(_image != null && _image.sub != null) {
            return _image.sub;
        } else {
            return [];
        }
    },
    'Sizes': function() {
        var _hash = location.hash;
        var _product_id = _hash.replace("#","");
        var _product = Products.findOne({_id:_product_id});
        return _product.size;
    },
    'Colors': function() {
        var _hash = location.hash;
        var _product_id = _hash.replace("#","");
        var _product = Products.findOne({_id:_product_id});
        var _imageid = "";
        if(_product != null) {
            _imageid = _product.image;
        }
        var _image = ProductImages.findOne({_id:_imageid});
        if(_image != null && _image.color != null) {
            return _image.color;
        } else {
            return [];
        }
    },
    'Price': function() {
        var _hash = location.hash;
        var _product_id = _hash.replace("#","");
        var _product = Products.findOne({_id:_product_id});
        return _product.price;
    },
    'Cashback': function() {
        return Helpers.User.CashBack.Remain();
    },
    'CashbackGet': function() {
        var _rate = Helpers.CashbackRate();
        var _hash = location.hash;
        var _product_id = _hash.replace("#","");
        var _product = Products.findOne({_id:_product_id});
        var _price = _product.price;
        return _price * _rate[0];
    },
    'NewPrice': function(price, cashback) {
        var _result = price - cashback;
        if(_result < 0) {
            _result = 0;
        }
        return _result;
    },
    'CashbackRemain': function(price, cashback) {
        var _result = cashback - price;
        if(_result < 0) {
            _result = 0;
        }
        return _result;
    }
});