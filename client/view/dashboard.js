/**
 * Created by chinhong on 5/21/15.
 */
Template.Dashboard.rendered = function() {
    // Turn to Login Page if user is not admin
    if(Roles.userIsInRole(Meteor.userId(), "admin")) {
    } else {
        location = "login";
    }
}