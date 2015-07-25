/**
 * Created by chinhong on 5/21/15.
 */
this.GroupPurchaseController = RouteController.extend({
    template: "MainPage",

    yieldTemplates: {
        /*YIELD_TEMPLATES*/
    },

    waitOn: function () {
        Meteor.subscribe('userPresent'); // users
    },

    onBeforeAction: function() {
        /*BEFORE_FUNCTION*/
        this.next();
    },

    action: function() {
        if(this.isReady()) { this.render(); } else { this.render("MainPage"); }
        /*ACTION_FUNCTION*/
    },

    isReady: function() {
        var subs = [
        ];
        var ready = true;
        _.each(subs, function(sub) {
            if(!sub.ready())
                ready = false;
        });
        return ready;
    },

    data: function() {
        return {
            params: this.params || {},
            userPresent: Meteor.users.find()
        };
        /*DATA_FUNCTION*/
    },

    onAfterAction: function() {
    }
});