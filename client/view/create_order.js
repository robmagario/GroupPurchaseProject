/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    var _address = Helpers.User.Profile.Address();
    if(_address != null) {
        $('#ConfirmAddress').find('input').eq(0).val(_address.country);
        $('#ConfirmAddress').find('input').eq(1).val(_address.city);
        $('#ConfirmAddress').find('input').eq(2).val(_address.state);
        $('#ConfirmAddress').find('input').eq(3).val(_address.address);
        $('#ConfirmAddress').find('input').eq(4).val(_address.zipcode);
        $('#ConfirmAddress').find('input').eq(5).val(_address.phone);
    }
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

var Calculator = {
    Weight: function() {
        var _item_string = window.localStorage.getItem('CartItemValue');
        var _select_string = window.localStorage.getItem('CartItemSelect');
        var _weight = 0;
        if(_item_string != null && _item_string != "" && _select_string != null && _select_string != "") {
            var _item_array = _item_string.split(',');
            var _select_array = _select_string.split(',');
            var _column = 5;
            for(var i=0; i<_item_array.length; i+=_column) {
                var j;
                for(j in _select_array) {
                    if(_item_array[i] == _select_array[j]) {
                        var _quantity = _item_array[i+4];
                        var _product = Products.findOne({_id:_item_array[i+1]});
                        if(_product != null) {
                            _weight += _quantity * _product.weight;
                        }
                    }
                }
            }
        }
        return _weight;
    },
    Price: function() {
        var _item_string = window.localStorage.getItem('CartItemValue');
        var _select_string = window.localStorage.getItem('CartItemSelect');
        var _price = 0;
        if(_item_string != null && _item_string != "" && _select_string != null && _select_string != "") {
            var _item_array = _item_string.split(',');
            var _select_array = _select_string.split(',');
            var _column = 5;
            for(var i=0; i<_item_array.length; i+=_column) {
                var j;
                for(j in _select_array) {
                    if(_item_array[i] == _select_array[j]) {
                        var _quantity = _item_array[i+4];
                        var _product = Products.findOne({_id:_item_array[i+1]});
                        if(_product != null) {
                            _price += _quantity * _product.price;
                        }
                    }
                }
            }
        }
        return _price;
    },
    Quantity: function() {
        var _item_string = window.localStorage.getItem('CartItemValue');
        var _select_string = window.localStorage.getItem('CartItemSelect');
        var _quantity = 0;
        if(_item_string != null && _item_string != "" && _select_string != null && _select_string != "") {
            var _item_array = _item_string.split(',');
            var _select_array = _select_string.split(',');
            var _column = 5;
            for(var i=0; i<_item_array.length; i+=_column) {
                var j;
                for(j in _select_array) {
                    if(_item_array[i] == _select_array[j]) {
                        _quantity += parseInt(_item_array[i+4]);
                    }
                }
            }
        }
        return _quantity;
    },
    Products: function() {
        var _items = [];
        var _item_string = window.localStorage.getItem('CartItemValue');
        var _select_string = window.localStorage.getItem('CartItemSelect');
        if(_item_string != null && _item_string != "" && _select_string != null && _select_string != "") {
            var _item_array = _item_string.split(',');
            var _select_array = _select_string.split(',');
            var _column = 5;
            for(var i=0; i<_item_array.length; i+=_column) {
                var j;
                for(j in _select_array) {
                    if(_item_array[i] == _select_array[j]) {
                        var _quantity = _item_array[i+4];
                        var _product = Products.findOne({_id:_item_array[i+1]});
                        if(_product != null) {
                            _items.push({
                                id: _item_array[i+1],
                                size: _item_array[i+3],
                                color: _item_array[i+2],
                                quantity: _item_array[i+4]
                            });
                        }
                    }
                }
            }
        }
        return _items;
    }
}

function CalculatePayment() {
    var _item_string = window.localStorage.getItem('CartItemValue');
    var _select_string = window.localStorage.getItem('CartItemSelect');
    var _weight = 0;
    var _price = 0;
    if(_item_string != null && _item_string != "" && _select_string != null && _select_string != "") {
        var _item_array = _item_string.split(',');
        var _select_array = _select_string.split(',');
        var _column = 5;
        for(var i=0; i<_item_array.length; i+=_column) {
            var j;
            for(j in _select_array) {
                if(_item_array[i] == _select_array[j]) {
                    var _quantity = _item_array[i+4];
                    var _product = Products.findOne({_id:_item_array[i+1]});
                    if(_product != null) {
                        _weight += _quantity * _product.weight;
                        _price += _quantity * _product.price;
                    }
                }
            }
        }
    }
    $('#purchase').find('label').eq(3).html(_price + " USD ~ <span id='NewPricing'></span> (in reference)");
    $('#purchase').find('label').eq(5).html(_weight + " g");
    Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_price,"NewPricing");
}

Template.CreateOrderPage.rendered = function() {
    window.setTimeout(InitializeData, 1000);
}

Template.CreateOrderPage.events({
    'click .btn': function(e) {
        var _action = e.target.value;
        switch (_action) {
            case "ToOrderStep3":
                $('#ConfirmAddress').hide();
                $('#ConfirmShipping').show();
                $('#Process').find('li').eq(2).addClass('active');
                $('.progress-bar').css({width:"51.3%"});
                break;
            case "ToOrderStep4":
                $('#ConfirmShipping').hide();
                $('#ConfirmPayment').show();
                $('#Process').find('li').eq(3).addClass('active');
                $('.progress-bar').css({width:"67.5%"});
                break;
            case "ToOrderStep5":
                $('#ConfirmPayment').hide();
                $('#ConfirmOrder').show();
                $('#Process').find('li').eq(4).addClass('active');
                $('.progress-bar').css({width:"83.7%"});

                // Fill Data
                var _payment = Calculator.Price();
                $('#ConfirmOrder').find('label').eq(1).html(_payment + " USD ~ <span id='TranslatePayment'></span> (in reference)");
                Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_payment,"TranslatePayment");
                var _remain = Helpers.User.CashBack.Remain();
                $('#ConfirmOrder').find('label').eq(3).html(_remain + " USD ~ <span id='TranslateRemaining'></span> (in reference)");
                Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_remain,"TranslateRemaining");
                var _payment_final = _payment - _remain;
                if(_payment_final < 0) {
                    _payment_final = 0;
                }
                $('#ConfirmOrder').find('label').eq(5).html(_payment_final + " USD ~ <span id='FinalPayment'></span> (in reference)");
                Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_payment_final,"FinalPayment");
                var _cashback = (parseInt(_payment * 0.04 * 100))/100;
                $('#ConfirmOrder').find('label').eq(7).html(_cashback + " USD ~ <span id='CashbackCanGet'></span> (in reference)");
                Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_cashback,"CashbackCanGet");
                var _payment_method = GetRadioValue('method_payment');
                $('#ConfirmOrder').find('label').eq(9).html(_payment_method);
                var _shipping_method = GetRadioValue('method_shipping');
                $('#ConfirmOrder').find('label').eq(11).html(_shipping_method);
                var _quantity = Calculator.Quantity();
                $('#ConfirmOrder').find('label').eq(13).html(_quantity);
                var _weight = Calculator.Weight();
                $('#ConfirmOrder').find('label').eq(15).html(_weight + " g");
                //var _address = Helpers.User.Profile.Address();
                var _address = {
                    country: $('#ConfirmAddress').find('input').eq(0).val(),
                    city:    $('#ConfirmAddress').find('input').eq(1).val(),
                    state:   $('#ConfirmAddress').find('input').eq(2).val(),
                    address: $('#ConfirmAddress').find('input').eq(3).val(),
                    zipcode: $('#ConfirmAddress').find('input').eq(4).val(),
                    phone: $('#ConfirmAddress').find('input').eq(5).val()
                };
                $('#ConfirmOrder').find('label').eq(17).html(_address.country);
                $('#ConfirmOrder').find('label').eq(19).html(_address.city);
                $('#ConfirmOrder').find('label').eq(21).html(_address.state);
                $('#ConfirmOrder').find('label').eq(23).html(_address.address);
                $('#ConfirmOrder').find('label').eq(25).html(_address.zipcode);
                $('#ConfirmOrder').find('label').eq(27).html(_address.phone);
                break;
            case "cashback-using":
                var _payment = Calculator.Price();
                $('#ConfirmOrder').find('label').eq(5).html(_payment + " USD ~ <span id='FinalPayment'></span> (in reference)");
                Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_payment,"FinalPayment");
                var _remain = Helpers.User.CashBack.Remain();
                e.target.value = "cashback-unusing";
                e.target.innerText = TAPi18n.__("Btn_UseCashback");
                break;
            case "cashback-unusing":
                var _payment = Calculator.Price();
                var _remain = Helpers.User.CashBack.Remain();
                var _payment_final = _payment - _remain;
                if(_payment_final < 0) {
                    _payment_final = 0;
                }
                $('#ConfirmOrder').find('label').eq(5).html(_payment_final + " USD ~ <span id='FinalPayment'></span> (in reference)");
                Helpers.ExchangeMoney.GetExchangeMoney("USD","HKD",_payment_final,"FinalPayment");
                e.target.value = "cashback-using";
                e.target.innerText = TAPi18n.__("Btn_UnuseCashback");
                break;
            case "ToOrderStep6":
                $('#ConfirmOrder').hide();
                $('#FinishOrder').show();
                $('#Process').find('li').eq(5).addClass('active');
                $('.progress-bar').css({width:"100%"});

                // Insert Data
                var _userID =   Meteor.userId();
                var _cart_products = window.localStorage.getItem('CartItemSelect').split(',');
                var _products = Calculator.Products();
                //for(var i=0; i<_cart_products.length; i++) {
                //    _products.push(Helpers.Product.GetProductByCartID.ID(_cart_products[i]));
                //}

                var _payment_total =  $('#ConfirmOrder').find('label').eq(1).html().match(/.+USD/);
                var _payment_final =  $('#ConfirmOrder').find('label').eq(5).html().match(/.+USD/);
                var _cashback_get = $('#ConfirmOrder').find('label').eq(7).html().match(/.+USD/);
                var _cashback_use = (parseFloat(_payment_total) - parseFloat(_payment_final)).toString() + " USD";
                var _cashback_remain = Helpers.User.CashBack.Remain() - parseFloat(_cashback_use) + " USD";
                var _count =    $('#ConfirmOrder').find('label').eq(13).html();
                var _weight =   $('#ConfirmOrder').find('label').eq(15).html();
                var _payment_method =  $('#ConfirmOrder').find('label').eq(9).html();
                var _shipping_method = $('#ConfirmOrder').find('label').eq(11).html();
                var _country =  $('#ConfirmOrder').find('label').eq(17).html();
                var _city =     $('#ConfirmOrder').find('label').eq(19).html();
                var _state =    $('#ConfirmOrder').find('label').eq(21).html();
                var _address =  $('#ConfirmOrder').find('label').eq(23).html();
                var _zipcode =  $('#ConfirmOrder').find('label').eq(25).html();
                var _phone =    $('#ConfirmOrder').find('label').eq(27).html();

                var _status = "Waiting Confirm";
                var _date = new Date();

                var _orderID = Orders.insert({
                    user:     _userID,
                    products: _products,
                    payment: {
                        payment_total:  _payment_total,
                        payment_final:  _payment_final,
                        count:    _count,
                        weight:   _weight,
                        cashback_get: _cashback_get,
                        cashback_use: _cashback_use,
                        cashback_remain: _cashback_remain,
                        payment_method:  _payment_method,
                        shipping_method: _shipping_method
                    },
                    address: {
                        country: _country,
                        city:    _city,
                        state:   _state,
                        address: _address,
                        zipcode: _zipcode,
                        phone:   _phone
                    },
                    status:      _status,
                    createAt:    _date
                }, function() {
                    Meteor.call('cashback_handle',
                        _userID, _orderID, "buy", parseFloat(_payment_final), parseFloat(_cashback_use)
                    );

                    var _cart_product_value = window.localStorage.getItem("CartItemValue").split(',');
                    var _cart_selected = window.localStorage.getItem("CartItemSelect").split(',');
                    var _cart_rest = [];
                    var _cart_value_rest = [];
                    for(var i=0; i<_cart_selected.length; i++) {
                        var _buy = false;
                        if (_cart_selected[i] == "") {
                            _buy = true;
                        } else {
                            for (var j=0; j < _cart_selected.length; j+=5) {
                                if(_cart_selected[i] == _cart_product_value[j]) {
                                    _buy = true;
                                }
                            }
                        }
                        if(!_buy) {
                            for(var j=0; j<5; j++) {
                                _cart_value_rest.push(_cart_product_value[i*5+j]);
                            }
                        }
                    }

                    Meteor.call('submit_buy_product',
                        _products
                    );

                    if(_cart_rest.length > 0) {
                        window.localStorage.setItem('CartItemValue', _cart_value_rest.toString());
                        window.localStorage.setItem('CartItemSelect', "");
                    } else {
                        window.localStorage.setItem('CartItemSelect',"");
                        window.localStorage.setItem('CartItemValue', "");
                    }

                    window.setTimeout(function() {
                        Helpers.System.LocateTo('/home');
                    }, 5000);
                });

                break;
            default:
                break;
        }
    }
});

Template.CreateOrderPage.helpers({
    'IsNormal': function() {
        var _result = true;
        var _string = window.localStorage.getItem("CartItemValue");
        var _select_string = window.localStorage.getItem("CartItemSelect");
        if(_string != null && _string != "" && _select_string != null && _select_string != "") {
            var _array = _string.split(',');
            var _select_array = _select_string.split(',');
            var _result = true;
            var _column = 5;
            for(var i=0; i<_array.length; i+=_column) {
                var _selected = false;
                for(var j=0; j<_select_array.length; j++) {
                    if(_select_array[j] == _array[i]) {
                        _selected = true;
                        break;
                    }
                }
                if(_selected) {
                    var _product = Products.findOne({_id: _array[i + 1]});
                    if (_product != null) {
                        if(_product.type == "Special") {
                            _result = false;
                            break;
                        }
                    }
                }
            }
            return _result;
        } else {
            return true;
        }
    },
    'CartItem': function() {
        var _string = window.localStorage.getItem("CartItemValue");
        var _select_string = window.localStorage.getItem("CartItemSelect");
        if(_string != null && _string != "" && _select_string != null && _select_string != "") {
            var _array = _string.split(',');
            var _select_array = _select_string.split(',');
            var items = [];
            var _column = 5;
            for(var i=0; i<_array.length; i+=_column) {
                var _selected = false;
                for(var j=0; j<_select_array.length; j++) {
                    if(_select_array[j] == _array[i]) {
                        _selected = true;
                        break;
                    }
                }
                if(_selected) {
                    var _product = Products.findOne({_id: _array[i + 1]});
                    if (_product != null) {
                        var _images = ProductImages.findOne({_id: _product.image});
                        var _icon = "";
                        var _quantity = _array[i + 4];
                        var _weight = _quantity * _product.weight;
                        var _price = _quantity * _product.price;
                        if (_images != null) {
                            _icon = _images.color[_array[i + 2]];
                        }
                        items.push({
                            id: _array[i],
                            icon: _icon,
                            name: _product.name,
                            quantity: _quantity,
                            weight: _weight,
                            price: _price,
                            type: _product.type
                        })
                    }
                }
            }
            return items;
        } else {
            return [];
        }
    }
});