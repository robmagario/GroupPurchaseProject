/**
 * Created by chinhong on 5/21/15.
 */
this.App = {};
this.Helpers = {};

Meteor.startup(function() {

});

Helpers.User = {
    IsAdmin: function() {
        return Users.isAdmin(Meteor.userId());
    },
    Name: function() {
        return Meteor.user().username;
    },
    Email: function() {
        return Meteor.user().emails[0].address;
    },
    Invitation: function() {
        var _temp = Meteor.user().invitation;
        if(_temp == "" || _temp == null) {
            return 0;
        } else {
            return _temp;
        }
    },
    InviteBy: function() {
        var _temp = Invitations.findOne({to:Meteor.user().emails[0].address, verified:true});
        console.log(Meteor.user().emails[0].address);
        console.log(_temp);
        if(_temp == "" || _temp == null) {
            return "You are admin!";
        } else {
            return _temp.from;
        }
    },
    CreateAt: function() {
        return Meteor.user().createdAt;
    },
    CashBackStatus: {
        ListUsers: function() {
            return Cashbacks.find({user:Meteor.userId()}, {sort: {createdAt: -1}});
        },
        UserTotalUse: function() {
            var _cashbackdb = Cashbacks.find({user:Meteor.userId()}, {sort: {createdAt: -1}});
            if(_cashbackdb != null) {
                var _cashbackuse = _cashbackdb.fetch();
                var _use = 0;
                for(var i=0; i<_cashbackuse.length; i++) {
                    _use += _cashbackuse[i].cash_use;
                }
                return _use;
            } else {
                return 0
            }
        },
        UserTotalGet: function() {
            var _cashbackdb = Cashbacks.find({user:Meteor.userId()}, {sort: {createdAt: -1}});
            if(_cashbackdb != null) {
                var _cashbackget = _cashbackdb.fetch();
                var _get = 0;
                for(var i=0; i<_cashbackget.length; i++) {
                    _get += _cashbackget[i].cash_get;
                }
                return _get;
            } else {
                return 0;
            }
        },
        UserTotalRemain: function() {
            var _cashbackdb = Cashbacks.find({user:Meteor.userId()}, {sort: {createdAt: -1}});
            if(_cashbackdb != null) {
                var _cashbackremin = _cashbackdb.fetch();
                var _remain
                var _use = 0;
                var _get = 0;
                for(var i=0; i<_cashbackremin.length; i++) {
                    _use += _cashbackremin[i].cash_use;
                    _get += _cashbackremin[i].cash_get;
                }
                _remain = _get - _use;
                return _remain;
            } else {
                return 0;
            }
        }
    },
    CashBack: function() {
        if(Meteor.user() != null) {
            var _cashback = Meteor.user().cashback;
            if(_cashback == "" || _cashback == null) {
                _cashback = 0;
            }
            return _cashback;
        } else {
            return false;
        }
    }
};


Helpers.Product = {
    ListAll: function() {
        return Products.find();
    },
    ListPublished: function() {
        return Products.find({publish: true});
    },
    GetProductByHash: {
        ProductID: function() {
            var _id = location.hash;
            _id = _id.replace("#","");
            return _id;
        },
        Name: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.name;
            } else {
                return "Unknown";
            }
        },
        Price: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.price;
            } else {
                return "Unknown";
            }
        },
        Weight: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.weight;
            } else {
                return "Unknown";
            }
        },
        Description: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.description;
            } else {
                return "Unknown";
            }
        },
        CalculateDescount: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return parseInt(_product.price * 0.04);
            } else {
                return "Unknown";
            }
        },
        Image: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.image;
            } else {
                return "No Image";
            }
        },
        Size: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.size;
            } else {
                return false;
            }
        },
        Color: function() {
            var _id = this.ProductID();
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                var _image_id = _product.image;
                var _images =  ProductImages.findOne({_id: _image_id});
                if(_images != null) {
                    return _images.color;
                } else {
                    return false;
                }
                return _images;
            } else {
                return false;
            }
        }
    },
    GetProductByID: {
        Name: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.name;
            } else {
                return "Unknown";
            }
        },
        Price: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return parseInt(_product.price);
            } else {
                return "Unknown";
            }
        },
        Weight: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return parseInt(_product.weight);
            } else {
                return "Unknown";
            }
        },
        Description: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.description;
            } else {
                return "Unknown";
            }
        },
        CalculateDescount: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return (_product.price * 0.04);
            } else {
                return "Unknown";
            }
        },
        Image: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return Helpers.Image.GetImageByID.Icon(_product.image);
            } else {
                return "No Image";
            }
        }
    },
    GetProductListInCart: function() {
        var _temp = window.localStorage.getItem('CartItem');
        if(_temp != null) {
            var _tempArray = _temp.split(',');
            if(_tempArray[0] == "") {
                return false;
            } else {
                return _tempArray;
            }
        } else {
            return false;
        }
    },
    GetProductByCartID: {
        ID: function(_id) {
            var _temp_value = window.localStorage.getItem('CartItemValue').split(',');
            var _productID = _temp_value[_temp_value.indexOf(_id)+1];
            return _productID;
        },
        Image: function(_id) {
            var _temp_value = window.localStorage.getItem('CartItemValue').split(',');
            var _productID = _temp_value[_temp_value.indexOf(_id)+1];
            return Helpers.Product.GetProductByID.Image(_productID);
        },
        Name: function(_id) {
            var _temp_value = window.localStorage.getItem('CartItemValue').split(',');
            var _productID = _temp_value[_temp_value.indexOf(_id)+1];
            return Helpers.Product.GetProductByID.Name(_productID);
        },
        Price: function(_id) {
            var _temp_value = window.localStorage.getItem('CartItemValue').split(',');
            var _productID = _temp_value[_temp_value.indexOf(_id)+1];
            var _price =  Helpers.Product.GetProductByID.Price(_productID);
            var _quantity = _temp_value[_temp_value.indexOf(_id)+4];
            return (parseInt(_price) * parseInt(_quantity));
        },
        Weight: function(_id) {
            var _temp_value = window.localStorage.getItem('CartItemValue').split(',');
            var _productID = _temp_value[_temp_value.indexOf(_id)+1];
            var _price =  Helpers.Product.GetProductByID.Weight(_productID);
            var _quantity = _temp_value[_temp_value.indexOf(_id)+4];
            return (parseInt(_price) * parseInt(_quantity));
        },
        Quantity: function(_id) {
            var _temp_item = window.localStorage.getItem('CartItem').split(',');
            var _temp_value = window.localStorage.getItem('CartItemValue').split(',');
            var _index = -1;
            for(var i=0; i<_temp_item.length; i++) {
                if(_id == _temp_item[i]) {
                    _index = i;
                    break;
                }
            }
            if(_index >= 0) {
                return parseInt(_temp_value[_index*5 + 4]);
            } else {
                return false;
            }
        }
    },
    GetProductListSelected: {

    },
    GetProductListInSelected: function() {
        var _temp = window.localStorage.getItem('CartItem_selected');
        if(_temp != null) {
            var _tempArray = _temp.split(',');
            if(_tempArray[0] == "") {
                return false;
            } else {
                return _tempArray;
            }
        } else {
            return false;
        }
    },
    GetProductIsSelected: function(_id) {
        var _checked = false;
        var _cart_item = window.localStorage.getItem("CartItem");
        var _cart_select = window.localStorage.getItem("CartItem_selected");
        if(_cart_item == null) {
            window.localStorage.setItem('CartItem','');
        }if(_cart_select == null) {
            window.localStorage.setItem('CartItem_selected','');
        }
        var _ids = window.localStorage.getItem("CartItem_selected").split(',');
        for(var i=0; i<_ids.length; i++) {
            if(_ids[i] == _id) {
                _checked = true;
                break;
            }
        }
        return _checked;
    },
    CalculatePriceByUseCashback: function(_price, _remain) {
        var _result = _price - _remain;
        if(_result < 0) {
            _result = 0;
        }
        return _result;
    },
    CalculateRemainByUseCashback: function(_price, _remain) {
        var _result = _remain - _price;
        if(_result < 0) {
            _result = 0;
        }
        return _result;
    },
    CalculateCashbackByUseCashback: function(_price, _remain) {
        var _result = _remain - _price;
        if(_result < 0) {
            _result = _remain;
        } else {
            _result = _price;
        }
        return _result;
    }
};

Helpers.InvitationKey = {
    ListAll: function() {
        return Invitations.find();
    }
};

Helpers.Order = {
    ListAll: function() {
        if(Users.isAdmin(Meteor.userId())) {
            return Orders.find();
        } else {
            return null;
        }
    },
    ListUserOrder: function() {
        return Orders.find({user:Meteor.userId()});
    }
};

Helpers.Image = {
    ReadURL: function(_img, _loc) {
        if(Users.isAdmin(Meteor.userId())) {
            if (_img.files && _img.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#'+_loc+'')
                        .attr('src', e.target.result);
                };
                reader.readAsDataURL(_img.files[0]);
                return null;
            }
        } else {
            Helpers.ErrorMessage.NoPermission();
            return null;
        }
    },
    GetImageByID: {
        Icon: function(_id) {
            if(_id != null && _id != "" && _id != "No Image") {
                var _temp = ProductImages.findOne({_id: _id});
                if (_temp != null) {
                    return _temp.icon;
                }
            }
        },
        Main: function(_id) {
            if(_id != null && _id != "" && _id != "No Image") {
                var _temp = ProductImages.findOne({_id:_id});
                if(_temp != null) {
                    return _temp.main;
                }
            }
        },
        Sub: function(_id) {
            if(_id != null && _id != "" && _id != "No Image") {
                var _temp = ProductImages.findOne({_id: _id});
                if (_temp != null) {
                    return _temp.sub;
                }
            }
        },
        Color: function(_id) {
            if(_id != null && _id != "" && _id != "No Image") {
                var _temp = ProductImages.findOne({_id: _id});
                if (_temp != null) {
                    return _temp.color;
                }
            }
        }
    }
};

Helpers.ErrorMessage = {
    NoPermission: function() {
        alert('You have no permission to do that!!!');
    },
    NoItemSelected: function() {
        alert('No Item have selected!\n' +
            'Please select at least an item!');
    },
    BlankColumn: function() {
        alert('Please fill all the column that is required!');
    },
    ConfirmPW: function() {
        alert('Please confirm your password');
    }
};

_.each(Helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper);
});