/**
 * Created by chinhong on 5/21/15.
 */
Template.Dashboard.rendered = function() {
    var _height = window.innerHeight;
    $('#sidebar').css({height:_height-40});

    // Turn to Login Page if user is not admin
    window.setTimeout(function() {
        if(Roles.userIsInRole(Meteor.userId(), "admin")) {
            if(location.hash != "") {
                $('#overview').hide();
                $('#product_detail').show();
            }
        } else {
            location = "login";
        }
    },1000);
}

var sidebar_events = {
    //SelectTab: function(tab_name) {
    //    Helpers.Log.Show("SelectTab", tab_name);
    //    $('.container_item').hide();
    //    switch(tab_name) {
    //        case "Overview":
    //            $('#Dashboard_Overview').show();
    //            break;
    //        case "Create Product":
    //            $('#Dashboard_CreateProduct').show();
    //            break;
    //        case "Products List":
    //            $('#Dashboard_ProductList').show();
    //            break;
    //        case "Product Detail":
    //            $('#Dashboard_ProductDetail').show();
    //            break;
    //        case "Invitation Key List":
    //            $('#Dashboard_InvitationKeyList').show();
    //            break;
    //        case "Orders List":
    //            $('#Dashboard_OrderList').show();
    //            break;
    //        case "Order Detail":
    //            $('#Dashboard_OrderDetail').show();
    //            break;
    //        case "Invitation Key List":
    //            $('#invitation_key_list').show();
    //            break;
    //        default:
    //            Dashboard_Log.Show("SelectTab", "Tab of '" + tab_name + "' have not set an events");
    //            break;
    //    }
    //}
}

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
            }
        }
    }
    if(_index_size >= 0) {
        for (var i = 0; i < _color.length; i++) {
            var _checking_index = i * _size.length + _index_size;
            if (_product.remain[_checking_index] <= 0) {
            }
        }
    }
    if(_index_color == -1 || _index_size == -1) {
        _index = 0;
    }
    var _value = _product.remain[_index];
    if(_index_color == -1 || _index_size == -1) { _index = -1; _value = 0; }
    $('#remain').html(_value);
    $('#remain-set').val(_value);
    $('#remain-edit').value = _index;
};

Template.Dashboard.events({
    'click .list-group-item': function(e) {
        $('.list-group-item').removeClass('list-group-item-warning');
        e.target.classList.add('list-group-item-warning');
        $('.content_item').hide();
        $('#product_detail').hide();
        $('#order_detail').hide();
        location.hash = "";
        switch(e.currentTarget.innerText) {
            case "Overview":
                $('#overview').show();
                break;
            case "Create Product":
                $('#create_product').show();
                break;
            case "Product List":
                $('#product_list').show();
                break;
            case "Order List":
                $('#order_list').show();
                break;
            case "Invitation Key List":
                $('#invitation_key_list').show();
                break;
            case "Cashback List":
                $('#cashback_list').show();
                break;
            default :
                break;
        }
    },


    // Create Product Event
    'click .sub-image-add': function() {
        var CurrentHTML = $('#create_sub_image').html();
        var _randomID = parseInt(Math.random() * 65536);
        CurrentHTML += "" +
            "<div>" +
                "<div class='col-sm-11' style='padding-left:0'>" +
                    "<input class='form-control' type='file' onchange='Helpers.Image.ReadURL(this, &#x0027image_"+_randomID+"&#x0027);'>" +
                "</div>" +
                "<div class='col-sm-1'>" +
                    "<button class='btn btn-default sub-image-minus' value='image_"+_randomID+"'>-</button>" +
                "</div>" +
                "<img id='image_"+_randomID+"' style='max-width:100%;'>" +
            "</div>";
        $('#create_sub_image').html(CurrentHTML);
    },
    'click .sub-image-minus': function(e) {
        $('#'+e.currentTarget.value+'').parent().remove();
    },

    'click .size-add': function() {
        //var CurrentHTML = $('#create_size').html();
        //CurrentHTML += "" +
        //    "<div class='size-selection'>" +
        //    "<div class='col-sm-2' style='padding-left:0'>" +
        //    "<input class='form-control' type='text'>" +
        //    "</div>" +
        //    "<button class='btn btn-default size-minus'>x</button>" +
        //    "</div>";
        //$('#create_size').html(CurrentHTML);
        var _temp = $('#create_size').find('input');
        var _html = "";
        for(var i=0; i<_temp.length; i++) {
            var _value = $('#create_size').find('input').eq(i).val();
            _html += "" +
                "<div class='size-selection'>" +
                "<div class='col-sm-2' style='padding-left:0'>" +
                "<input class='form-control' type='text' value='"+_value+"'>" +
                "</div>" +
                "<button class='btn btn-default size-minus'>x</button>" +
                "</div>";
        }
        _html += "" +
            "<div class='size-selection'>" +
            "<div class='col-sm-2' style='padding-left:0'>" +
            "<input class='form-control' type='text'>" +
            "</div>" +
            "<button class='btn btn-default size-minus'>x</button>" +
            "</div>";
        $('#create_size').html(_html);
    },
    'click .size-minus': function(e) {
        e.currentTarget.parentElement.remove();
    },

    'click .color-add': function() {
        var CurrentHTML = $('#create_color').html();
        var _randomID = parseInt(Math.random() * 65536);
        CurrentHTML += "" +
            "<div class='color-selection'>" +
            "<div class='col-sm-11' style='padding-left:0'>" +
            "<input class='form-control' type='file' onchange='Helpers.Image.ReadURL(this, &#x0027lor_"+_randomID+"&#x0027);'>" +
            "</div>" +
            "<div class='col-sm-1'>" +
            "<button class='btn btn-default color-minus' value='lor_"+_randomID+"'>-</button>" +
            "</div>" +
            "<img id='lor_"+_randomID+"' style='width:64px; height:64px'>" +
            "</div>";
        $('#create_color').html(CurrentHTML);
    },
    'click .color-minus': function(e) {
        $('#'+e.currentTarget.value+'').parent().remove();
    },
    'click .create-product': function() {
        Helpers.Log.Show("Create Product", "Start");

        var _selection_size = [];
        var _selection_color = [];
        var _temp_size = $('.size-selection').find('input');
        for(var i=0; i<_temp_size.length; i++) {
            var _value = _temp_size[i].value;
            if(_value != null && _value != "")
                _selection_size.push(_value);
        }
        var _temp_color = $('.color-selection').find('img');
        for(var i=0; i<_temp_color.length; i++) {
            var _value = _temp_color[i].src;
            if(_value != null && _value != "")
                _selection_color.push(_value);
        }
        var _item_remain = [];
        for(var i=0; i<_selection_color.length; i++) {
            for(var j=0; j<_selection_size.length; j++) {
                _item_remain.push(0);
            }
        }

        var _img_icon = $('#img_icon').attr('src');
        var _img_main = $('#img_main').attr('src');
        var _img_sub = [];

        if(_img_icon == "" || _img_icon == null) { _img_icon = "No Image"; }
        if(_img_main == "" || _img_main == null) { _img_main = "No Image"; }
        var _count = $('#create_sub_image').find('img').length;
        for(var i=0; i<_count; i++) {
            var _img_temp = $('#create_sub_image').find('img').eq(i).attr('src');
            if(_img_temp != "" && _img_temp != null) {
                _img_sub.push(_img_temp);
            }
        }

        var _name = $('#product_name').val();
        var _price = $('#product_price').val();
        var _weight = $('#product_weight').val();
        var _description = $('#product_description').val();
        var _empty = false;
        var _error = "";
        Dashboard_Log.Show("Name", _name);
        Dashboard_Log.Show("Price", _price + " HKD");
        Dashboard_Log.Show("Weight", _weight + "g");
        Dashboard_Log.Show("Description", _description);
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
        var _date = new Date();

        var _img_id = ProductImages.insert({
            icon: _img_icon,
            main: _img_main,
            sub:  _img_sub,
            color: _selection_color
        });
        Dashboard_Log.Show("Image ID", _img_id);
        if(!_empty) {
            Products.insert({
                name:           _name,
                description:    _description,
                price:          _price,
                weight:         _weight,
                image:          _img_id,
                size:           _selection_size,
                remain:         _item_remain,
                publish:        false,
                createAt:       _date
            });
            Helpers.Log.Show("Create Product", "Create Success!");
            alert("Process Success!");
            location.reload();
        } else {
            Helpers.Log.Show("Create Product", "Create Fail!");
            alert(_error);
        }
    },

    // Product List Event
    'click .publish-item': function(e) {
        if(e.currentTarget.innerText == "true") {
            e.currentTarget.innerText = "false";
            Products.update(this._id, {$set:{publish:false}});
        } else {
            e.currentTarget.innerText = "true";
            Products.update(this._id, {$set:{publish:true}});
        }
    },
    'click .a-product': function () {
        location.hash = "#" + this._id;
        location.reload();
    },

    // Product Detail
    // Click to change the image
    'click .sub-img, click .main-img, click .color-img': function(e) {
        $('#detail_img_main').attr('src', e.currentTarget.currentSrc);
    },
    'click .btn-select-a-size': function(e) {
        if(e.currentTarget.style.background != 'orange') {
            $('.btn-select-a-size').css({"background":'transparent'});
            e.currentTarget.style.background = 'orange';
        } else {
            $('.btn-select-a-size').css({"background":'transparent'});
        }
        CheckRemaining();
    },
    'click .btn-select-a-color': function(e) {
        $('.color-cover').hide();
        $('#label_product_img_main').attr('src', e.currentTarget.currentSrc);
        e.currentTarget.parentElement.children[0].style.display = 'block';
        CheckRemaining();
    },
    'click .remain-edit': function() {
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
                }
            }
        }
        if(_index_size >= 0) {
            for (var i = 0; i < _color.length; i++) {
                var _checking_index = i * _size.length + _index_size;
                if (_product.remain[_checking_index] <= 0) {
                }
            }
        }
        if(_index_color == -1 || _index_size == -1) {
            _index = 0;
        }

        if(_index >= 0) {
            var _value = $('#remain-set').val();
            var _remain = _product.remain;
            _remain[_index] = parseInt(_value);
            Products.update(_product_id, {$set:{remain:_remain}});
        }
        $('#remain').html(_value);
    },

    // Order Detail
    'click .an-order': function() {
        console.log("Click An Order");
        $('#order_detail').find('label').eq(1).html(this._id);
        $('#order_detail').find('label').eq(3).html(this.createAt);
        $('#order_detail').find('label').eq(5).html(this.user);
        $('#order_detail').find('label').eq(7).html(this.status);
        $('#order_detail').find('label').eq(9).html(this.payment.payment_total);
        $('#order_detail').find('label').eq(11).html(this.payment.cashback_use);
        $('#order_detail').find('label').eq(13).html(this.payment.payment_final);
        $('#order_detail').find('label').eq(15).html(this.payment.cashback_get);
        $('#order_detail').find('label').eq(17).html(this.payment.payment_method);
        $('#order_detail').find('label').eq(19).html(this.payment.shipping_method);
        $('#order_detail').find('label').eq(21).html(this.payment.count);
        $('#order_detail').find('label').eq(23).html(this.payment.weight);

        $('#order_detail_address').find('label').eq(1).html(this.address.country);
        $('#order_detail_address').find('label').eq(3).html(this.address.city);
        $('#order_detail_address').find('label').eq(5).html(this.address.state);
        $('#order_detail_address').find('label').eq(7).html(this.address.address);
        $('#order_detail_address').find('label').eq(9).html(this.address.zipcode);
        $('#order_detail_address').find('label').eq(11).html(this.address.phone);

        var ProductListHTML = "";
        var i;
        for(i in this.products) {
            var _product = Products.findOne({_id:this.products[i].id});
            var _images = Helpers.Image.GetImageByID.Color(_product.image);
            ProductListHTML += "" +
                "<tr id='"+this.products[i].id+"' class='order-detail-a-product'>" +
                "<td><img src='"+_images[this.products[i].color]+"' width='64px' height='64px'></td>" +
                "<td><br>"+_product.name+"</td>" +
                "<td><br>"+this.products[i].size+"</td>" +
                "<td><br>"+this.products[i].color+"</td>" +
                "<td><br>"+this.products[i].quantity+"</td>" +
                "<td><br>"+(_product.weight * this.products[i].quantity)+" g</td>" +
                "<td><br>"+(_product.price * this.products[i].quantity)+" HKD</td>" +
                "</tr>";
        }
        $('#order_detail_product_list').html(ProductListHTML);

        $('#order_list').hide();
        $('#order_detail').show();
    },
    'click .btn-confirm-order': function() {

        var _orderID = $('#order_detail').find('label').eq(1).html();
        var _current_userid = $('#order_detail').find('label').eq(5).html();
        var _current_user = Meteor.users.findOne({_id:_current_userid});

        switch($('#order_detail').find('label').eq(7).html()) {
            case "Waiting Confirm":
                var Rates = Helpers.CashbackRate();
                var _date = new Date();
                var _method = "get";

                var _cashback_add = parseFloat($('#order_detail').find('label').eq(15).html());


                var _invitation_remain = _current_user.invitation;
                if(_invitation_remain == null || _invitation_remain == "" || _invitation_remain == NaN) {
                    _invitation_remain = 0;
                }
                var _payment_total =  parseFloat($('#order_detail').find('label').eq(9).html());
                var _invitation_add = parseInt($('#order_detail').find('label').eq(21).html());
                var _invitation_new = parseInt(_invitation_remain) + _invitation_add;

                Cashbacks.insert({
                    user: _current_userid,
                    order: _orderID,
                    method: _method,
                    payment: 0,
                    value: _cashback_add,
                    date: _date
                });

                Meteor.users.update(_current_userid, {$set: {
                    invitation: _invitation_new
                }});

                Orders.update(_orderID, {$set: {
                    status: "Confirmed"
                }});
                $('#order_detail').find('label').eq(7).html("Confirmed");

                var _count = 1;
                do {
                    var _user_invitation = Invitations.findOne({to:_current_user.emails[0].address, verified:true});
                    if(_user_invitation != null) {
                        var _user_invite_by = Meteor.users.findOne({_id:_user_invitation.fromid});
                        if(_user_invite_by != null) {
                            //var _user_invite_by_cashback = _user_invite_by.cashback;
                            //var _user_invite_by_cashback_new = parseInt(_user_invite_by_cashback) + (_cashback_add / 4 * _cashback_count);
                            //Meteor.users.update(_user_invite_by._id, {
                            //    $set: {
                            //        cashback: _user_invite_by_cashback_new
                            //    }
                            //});
                            var _targetuserID = _user_invite_by._id;
                            var _cashback_get = parseFloat(_payment_total * Rates[_count]);
                            Cashbacks.insert({
                                user: _targetuserID,
                                order: _orderID,
                                method: _method,
                                payment: 0,
                                value: _cashback_get,
                                date: _date
                            });
                            _current_user = _user_invite_by;
                        } else {
                            _count = Rates.length;
                            alert("An Error is found!");
                            break;
                        }
                    } else {
                        _count = Rates.length;
                        break;
                    }
                    _count ++;
                } while(_count < Rates.length);
                alert("Confirmed Order Process is success");
                break;
            case "Confirmed":
                alert("This Order is already Confirmed!");
                break;
            case "Cancel":
                break;
            default:
                break;
        }
    },
    'click .btn-cancel-order': function() {
        var _orderID = $('#order_detail').find('label').eq(1).html();
        Orders.update(_orderID, {$set: {
            status: "Cancel"
        }});
        alert("Order is Canceled!");
    },
    'click .order-detail-a-product': function(e) {
        var _host = location.host;
        var _url = "/#" + e.currentTarget.id;
        window.open(_url);
    },











    // Go To Main Page
    //'click .btn_mainpage': function() {
    //    location = "/";
    //},
    //
    //// Logout
    //'click .btn_logout': function() {
    //    Meteor.logout();
    //    location = "/login";
    //},

    // Select Tab on sidebar
    //'click .sidebar_tab': function(e) {
    //    $('.sidebar_tab').removeClass("active");
    //    e.target.classList.add("active");
    //    sidebar_events.SelectTab(e.target.innerText);
    //},

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
        $('#label_product_publish').attr('checked', this.publish);

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
    'click .btn-select-a-size2': function(e) {
        $('#SizeSelection').find('button').css({"background":'none'});
        e.currentTarget.style.background = 'orange';
        CheckRemaining();
    },

    // Click to select the color
    'click .btn-select-a-color2': function(e) {
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
        $('#label_product_rest').html(_value).show();
        $('.btn-remain-edit').show();
        $('#label_product_rest_edit').hide();
        $('.btn-remain-save').hide();
    },

    // Click to publish or not
    'click #label_product_publish': function(e) {
        var _id = $('#label_product_id').html();
        var _publich = e.target.checked;
        Products.update(_id, {$set:{publish:_publich}});
    },

    // Click 'Back' in Product Detail
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
        $('#label_detail_createdate').html(this.createAt);
        $('#label_detail_username').html(Meteor.users.find({_id:this.user}).fetch()[0].username);
        $('#label_detail_userid').html(this.user);
        $('#label_detail_payment').html(this.payment.payment);
        $('#label_detail_cashback').html(this.payment.cashback);
        $('#label_detail_cashback_use').html(this.payment.cashbackuse);
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
        var _orderID = $('#label_detail_orderid').html();
        var _user = Meteor.users.find({_id:_userID}).fetch()[0];
        var _invitation = _user.invitation;
        var _invitation_use = _user.invitation_use;
        var _cashback = _user.cashback;
        console.log(_cashback);
        var _cashback_add = parseInt($('#label_detail_cashback').html());
        var _cashback_use = parseInt($('#label_detail_cashback_use').html());
        if(_invitation == "" || _invitation == null) {
            _invitation = 0;
        }
        if(_invitation_use == "" || _invitation_use == null) {
            _invitation_use = 0;
        }
        if(_cashback == "" || _cashback == null || _cashback == "NaN") {
            _cashback = 0;
        }
        _invitation = parseInt(_invitation) + parseInt($('#label_detail_count').html());
        _invitation_use = parseInt(_invitation_use);
        _cashback = parseInt(_cashback) + parseInt(_cashback_add);
        Meteor.users.update(_userID, {$set:{
            invitation:_invitation,
            invitation_use: _invitation_use,
            cashback: _cashback
        }});

        var _date = new Date();
        Cashbacks.insert({
            user:       _userID,
            order:      _orderID,
            cash_get:   _cashback_add,
            cash_use:   _cashback_use,
            date:       _date
        });

        var INVITAITION_CASHBACK_COUNT = 3;
        var _cashback_count = INVITAITION_CASHBACK_COUNT;
        var _current_user = _user;
        do {
            var _user_invitation = Invitations.findOne({to:_current_user.emails[0].address, verified:true});
            console.log("User Invitation");
            console.log(_user_invitation);
            if(_user_invitation == "" || _user_invitation == null) {
                _cashback_count = 0;
                break;
            } else {
                var _user_invite_by = Meteor.users.findOne({_id:_user_invitation.fromid});
                if(_user_invite_by != null) {
                    var _user_invite_by_cashback = _user_invite_by.cashback;
                    var _user_invite_by_cashback_new = parseInt(_user_invite_by_cashback) + (_cashback_add / 4 * _cashback_count);
                    Meteor.users.update(_user_invite_by._id, {$set:{
                        cashback: _user_invite_by_cashback_new
                    }});
                    var _targetuserID = _user_invite_by._id;
                    var _cashback_get = parseInt(_cashback_add / 4 * _cashback_count);
                    Cashbacks.insert({
                        user:       _targetuserID,
                        order:      _orderID,
                        cash_get:   _cashback_get,
                        cash_use:   0,
                        date:       _date
                    });
                    _current_user = _user_invite_by;
                } else {
                    _cashback_count = 0;
                    break;
                }
            }
            console.log("Cashback Counting: " + _cashback_count);
            _cashback_count--;
        } while(_cashback_count > 0);

        // Update Order
        var _orderID = $('#label_detail_orderid').html()
        Orders.update(_orderID, {$set: {
            status: "Confirmed"
        }});

        // Change Column
        $('#label_detail_status').html("Confirmed");
    }
});

//function CheckRemaining() {
//    var _size = $('#SizeSelection').find('button');
//    var _index_size = -1;
//    for(var i=0; i<_size.length; i++) {
//        var _style = _size.eq(i).attr('style');
//        if(_style == "background: orange;") {
//            _index_size = i;
//            break;
//        }
//    }
//    var _color = $('#ColorSelection').find('div').find('div');
//    var _index_color = -1;
//    for(var i=0; i<_color.length; i++) {
//        var _style = _color.eq(i).attr('style');
//        if(_style == "display: block;") {
//            _index_color = i;
//            break;
//        }
//    }
//
//    var _hash = location.hash;
//    var _product_id = _hash.replace("#","");
//    var _product = Products.findOne({_id:_product_id});
//    var _index = _index_color * _size.length + _index_size;
//    if(_index_color == -1 || _index_size == -1) { _index = 0; }
//    var _value = _product.remain[_index];
//    if(_index_color == -1 || _index_size == -1) { _index = -1; _value = 0; }
//    $('#label_product_rest').html(_value);
//    $('#label_product_rest_edit').val(_value);
//    $('#label_product_rest').val(_index);
//};

Template.Dashboard.helpers({
    'ProductList': function() {
        return Products.find();
    },
    'Icon': function(imageid) {
        var _image = ProductImages.findOne({_id:imageid});
        if(_image != null && _image.icon != null) {
            return _image.icon;
        } else {
            return "";
        }

    },
    'Publishing': function(result) {
        return result.toString();
    },
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
        return _image.main;
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
    'OrderList': function() {
        return Orders.find({}, {sort: {createAt: -1}});
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
        var _orderID = $('#order_detail').find('label').eq(1).html();
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
    },
    'InvitationKeyList': function() {
        return Invitations.find({},{sort:{createAt: -1}});
    },
    'check_verified': function(verified) {
        if(verified) {
            return "success";
        } else {
            return "warning";
        }
    },
    'CashbackList': function() {
        return Cashbacks.find({},{sort:{date: -1}});
    },
    'check_cashbackmethod': function(method) {
        if(method == "get") {
            return "success";
        } else {
            return "warning";
        }
    },





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