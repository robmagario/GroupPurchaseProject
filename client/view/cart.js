/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    var _string = window.localStorage.getItem('CartItemValue');
    var _weight = 0;
    var _price = 0;
    if(_string != null && _string != "") {
        var _array = _string.split(',');
        var _items = [];
        var _column = 5;
        for(var i=0; i<_array.length; i+=_column) {
            if(_array[i] != "") {
                var _quantity = _array[i+4];
                var _product = Products.findOne({_id:_array[i+1]});
                if(_product != null) {
                    _weight += _quantity * _product.weight;
                    _price += _quantity * _product.price;
                    _items.push(_array[i]);
                }
            }
        }
        window.localStorage.setItem('CartItemSelect', _items.toString());
    } else {
        window.localStorage.setItem('CartItemSelect', "");
    }

    $('#purchase').find('label').eq(1).html(Helpers.User.CashBack.Remain() + " HKD");
    $('#purchase').find('label').eq(3).html(_price + " HKD");
    $('#purchase').find('label').eq(5).html(_weight + " g");
}

function CalculateSelectedItem() {
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

    $('#purchase').find('label').eq(3).html(_price + " HKD");
    $('#purchase').find('label').eq(5).html(_weight + " g");
}

Template.CartPage.rendered = function() {
    window.setTimeout(InitializeData, 1000);
}

Template.CartPage.events({
    'click .btn': function(e) {
        var _action = e.currentTarget.value;
        Helpers.Log.Show("Button", _action + " in cart.");
        switch(_action) {
            case "StartOrder":
                var _string = window.localStorage.getItem("CartItemSelect");
                if(_string != null && _string != "") {
                    Helpers.System.LocateTo("/createorder");
                } else {
                    alert('Please select at least an item');
                }
                break;
            case "RemoveProduct":
                console.log(this);
                var _id = this.id;
                var _CartItemSelects = window.localStorage.getItem("CartItemSelect");
                var _CartItemValues = window.localStorage.getItem("CartItemValue");
                var _array_select = _CartItemSelects.split(',');
                var _array_value = _CartItemValues.split(',');

                var _new_array_select = [];
                var _new_array_value = [];
                var i;
                for(i in _array_select) {
                    if(_array_select[i] != _id && _array_select[i] != "") {
                        _new_array_select.push(_array_select[i]);
                    }
                }
                var j;
                for(j in _array_value) {
                    if((j%5) == 0 && _array_value[j] != _id && _array_value[j] != "") {
                        _new_array_value.push(_array_value[j]);
                        _new_array_value.push(_array_value[j+1]);
                        _new_array_value.push(_array_value[j+2]);
                        _new_array_value.push(_array_value[j+3]);
                        _new_array_value.push(_array_value[j+4]);
                    }
                }
                window.localStorage.setItem("CartItemSelect", _new_array_select);
                window.localStorage.setItem("CartItemValue", _new_array_value);
                $('#'+_id).remove();
                break;
            default :
                Helpers.Log.Show("Button", _action + " is undefind in profile.");
                break;
        }
    },

    'click .select-item': function(e) {
        var _action = e.target.checked;
        var _array = document.getElementsByClassName('select-all');
        var i;
        for(i in _array) {
            _array[i].checked = false;
        }

        var _selected_string = window.localStorage.getItem('CartItemSelect');
        var _selected_array = _selected_string.split(',');
        if(_action) {
            var _selected_array_new = [];
            var j;
            for(j in _selected_array) {
                if(_selected_array[j] != "" && _selected_array[j] != null) {
                    var _product = Products.findOne({_id:_array[j+1]});
                    _selected_array_new.push(_selected_array[j]);
                }
            }
            _selected_array_new.push(e.target.value);
            window.localStorage.setItem('CartItemSelect', _selected_array_new.toString());
        } else {
            var _selected_array_new = [];
            var j;
            for(j in _selected_array) {
                if(_selected_array[j] != "" && _selected_array[j] != null && _selected_array[j] != e.target.value) {
                    _selected_array_new.push(_selected_array[j]);
                }
            }
            window.localStorage.setItem('CartItemSelect', _selected_array_new.toString());
        }

        CalculateSelectedItem();
    },

    'click .select-all': function(e) {
        var _action = e.target.checked;
        var _array = document.getElementsByClassName('select-item');
        var i;
        for(i in _array) {
            _array[i].checked = _action;
        }

        if(_action) {
            var _string = window.localStorage.getItem('CartItemValue');
            var _weight = 0;
            var _price = 0;
            if(_string != null && _string != "") {
                var _array = _string.split(',');
                var _items = [];
                var _column = 5;
                for(var i=0; i<_array.length; i+=_column) {
                    var _quantity = _array[i+4];
                    var _product = Products.findOne({_id:_array[i+1]});
                    if(_product != null) {
                        _weight += _quantity * _product.weight;
                        _price += _quantity * _product.price;
                        _items.push(_array[i]);
                    }
                }
                window.localStorage.setItem('CartItemSelect', _items.toString());
                $('#purchase').find('label').eq(3).html(_price + " HKD");
                $('#purchase').find('label').eq(5).html(_weight + " g");
            } else {
                window.localStorage.setItem('CartItemSelect', "");
            }
        } else {
            $('#purchase').find('label').eq(3).html(0 + " HKD");
            $('#purchase').find('label').eq(5).html(0 + " g");
            window.localStorage.setItem('CartItemSelect', "");
        }
    }
});

Template.CartPage.helpers({
    'CartItem': function() {
        var _string = window.localStorage.getItem("CartItemValue");
        if(_string != null && _string != "") {
            var _array = _string.split(',');
            var items = [];
            var _column = 5;
            for(var i=0; i<_array.length; i+=_column) {
                var _product = Products.findOne({_id:_array[i+1]});
                if(_product != null) {
                    var _images = ProductImages.findOne({_id:_product.image});
                    var _icon = "";
                    var _quantity = _array[i+4];
                    var _weight =   _quantity * _product.weight;
                    var _price =    _quantity * _product.price;
                    if(_images != null) {
                        _icon = _images.color[_array[i+2]];
                    }
                    items.push({
                        id:         _array[i],
                        icon:       _icon,
                        name:       _product.name,
                        quantity:   _quantity,
                        weight:     _weight,
                        price:      _price
                    })
                }
            }
            return items;
        } else {
            return [];
        }
    }
});