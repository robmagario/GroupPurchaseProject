/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    $('#profile').find('label').eq(1).html(Helpers.User.Profile.Name());
    $('#profile').find('label').eq(3).html(Helpers.User.Profile.Email());
    $('#profile').find('label').eq(6).html(Helpers.User.Profile.CreateAt());
    var _address = Helpers.User.Profile.Address();
    $('#address').find('label').eq(1).html(_address.country);
    $('#address').find('label').eq(3).html(_address.city);
    $('#address').find('label').eq(5).html(_address.state);
    $('#address').find('label').eq(7).html(_address.address);
    $('#address').find('label').eq(9).html(_address.zipcode);
    $('#address').find('label').eq(11).html(_address.phone);
    $('#invitation').find('label').eq(1).html(Helpers.User.Profile.Invite.Remain());
    $('#invitation').find('label').eq(3).html(Helpers.User.Profile.Invite.InviteBy());
}

Template.OrderPage.rendered = function() {
    window.setTimeout(InitializeData, 1000);
}

Template.OrderPage.events({
    'click .btn': function(e) {
        var _action = e.target.value;
        Helpers.Log.Show("Button", _action + " in order.");
        switch(_action) {
            default :
                Helpers.Log.Show("Button", _action + " is undefind in profile.");
                break;
        }
    },
    'click .order': function() {
        //$('#OrderList').hide()
        $('#OrderDetail').show();
        $('#OrderDetail').find('label').eq(1).html(this._id);
        $('#OrderDetail').find('label').eq(3).html(this.createAt);

        var ProductListHTML = "";
        var x;
        for(x in this.products) {
            var _product = Products.findOne({_id:this.products[x].id});
            var _images = ProductImages.findOne({_id:_product.image});
            var _icon = _images.sub[this.products[x].color];
            var _quantity = this.products[x].quantity;
            var _weight =   _quantity * _product.weight;
            var _price =    _quantity * _product.price;


            ProductListHTML += "<tr>" +
                "<td><img src='"+_icon+"' width='64px' height='64px'></td>" +
                "<td><br>"+_product.name+"</td>" +
                "<td><br>"+_quantity+"</td>" +
                "<td><br>"+_weight+" g</td>" +
                "<td><br>"+_price+" HKD</td>" +
                "</tr>";
        }
        $('#OrderDetail').find('tbody').html(ProductListHTML);
    }
});

Template.OrderPage.helpers({
    'OrderList': function() {
        return Orders.find({user:Meteor.userId()}, {sort: {createAt: -1}});;
    },
    'check_status': function(status) {
        switch(status) {
            case "Waiting Confirm":
                return "info";
            case "Confirmed":
                return "success";
            case "Canceled":
                return "danger";
            default:
                return "";
                break;
        }
    },
    'OrderItem': function() {
        var _items = [];
        var _orderID = $('#OrderDetail').find('label').eq(1).html();
        var _order = Orders.findOne({_id:_orderID});
        if(_order != null) {
            var i;
            for(i in _order.products) {
                console.log(_order.products[i]);
                var _product = Products.findOne({_id:_order.products[i].id});
                var _images = ProductImages.findOne({_id:_product.image});
                var _icon = "";
                var _quantity = _order.products[i].quantity;
                var _weight =   _quantity * _product.weight;
                var _price =    _quantity * _product.price;
                if(_images != null) {
                    _icon = _images.sub[_order.products[i].color];
                }
                _items.push({
                    id:         _order.products[i].id,
                    icon:       _icon,
                    name:       _product.name,
                    quantity:   _quantity,
                    weight:     _weight,
                    price:      _price
                })
            }
        }
        return _items;
    }
});

