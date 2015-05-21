/**
 * Created by chinhong on 5/21/15.
 */
this.App = {};
this.Helpers = {};

Meteor.startup(function() {

});

_.each(Helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper);
});