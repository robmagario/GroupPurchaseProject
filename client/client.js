/**
 * Created by chinhong on 5/21/15.
 */
this.App = {};
this.Helpers = {};

Meteor.startup(function() {

});

Helpers.User = {
    Name: function() {
        return Meteor.user().username;
    },
    Email: function() {
        return Meteor.user().emails[0].address;
    },
    Invitation: function() {
        return Invitations.find({from:this.Email(), verified:true}).count();

        /*var _profile = Meteor.user().profile;
        if(_profile.invitation == "" || _profile.invitation == null) {
            return 0;
        } else {
            return _profile.invitation;
        }*/
    },
    InviteBy: function() {
        return Meteor.user().profile.invitedBy;
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
                return (_product.price * 0.04);
            } else {
                return "Unknown";
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
                return _product.price;
            } else {
                return "Unknown";
            }
        },
        Weight: function(_id) {
            var _product = Products.findOne({_id:_id, publish: true});
            if(_product != null) {
                return _product.weight;
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
        }
    },
    GetProductListInCart: function() {
        var _temp = window.localStorage.getItem('CartItem');
        if(_temp != null) {
            return _temp.split(',');
        } else {
            return "";
        }
    }
};

Helpers.InvitationKey = {
    ListAll: function() {
        return Invitations.find();
    }
}

_.each(Helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper);
});