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