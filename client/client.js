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
        var _profile = Meteor.user().profile;
        if(_profile.invitation == "" || _profile.invitation == null) {
            return 0;
        } else {
            return _profile.invitation;
        }
    },
    InviteBy: function() {

    }
};

Helpers.ProductList = {
    All: function() {
        return Products.find();
    }
};

_.each(Helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper);
});