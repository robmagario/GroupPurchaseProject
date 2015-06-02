/**
 * Created by chinhong on 5/22/15.
 */

Cashbacks = new Mongo.Collection("cashbacks");

if (Meteor.isClient) {
    Template.body.helpers({
        orders: function() {
            return Cashbacks.find({});
        }
    })
}

Cashbacks.allow({
    'insert': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'update': function(userId, doc) {
        return Users.isAdmin(userId);
    }
});