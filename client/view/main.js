/**
 * Created by chinhong on 5/21/15.
 */
function LocatToLogin() {
    var _location = location.pathname;
    _location = _location.replace("/","");
    _location += "/";
    location = "" + _location + "login";
}

Template.MainPage.rendered = function() {
    // Turn to Login Page if haven't login
    var _id = Meteor.userId();
    if(_id == null) {
        LocatToLogin();
    }
}

Template.MainPage.events({
    // Click Logout Button
    'click .btn_logout': function() {
        Meteor.logout(function() {
            LocatToLogin();
        });
    }
});