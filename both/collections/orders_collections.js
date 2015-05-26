/**
 * Created by chinhong on 5/22/15.
 */

Orders = new Mongo.Collection("orders");

if (Meteor.isClient) {
    Template.body.helpers({
        orders: function() {
            return Orders.find({});
        }
    })
}

Orders.allow({
    'insert': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'update': function(userId, doc) {
        return Users.isAdmin(userId);
    }
});