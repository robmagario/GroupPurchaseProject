/**
 * Created by chinhong on 5/21/15.
 */
this.InvitationController = RouteController.extend({
    template: "InvitationPage",

    yieldTemplates: {
        /*YIELD_TEMPLATES*/
    },

    onBeforeAction: function() {
        /*BEFORE_FUNCTION*/
        this.next();
    },

    action: function() {
        if(this.isReady()) { this.render(); } else { this.render("InvitationPage"); }
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
            params: this.params || {}
        };
        /*DATA_FUNCTION*/
    },

    onAfterAction: function() {
    }
});