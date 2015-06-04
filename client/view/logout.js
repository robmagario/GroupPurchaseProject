/**
 * Created by chinhong on 6/2/15.
 */
Template.LogoutPage.rendered = function() {
    Meteor.logout(function() {
        location = "/login";
    });
};