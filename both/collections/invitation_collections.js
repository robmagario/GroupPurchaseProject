/**
 * Created by chinhong on 5/22/15.
 */

Invitations = new Mongo.Collection("invitations");

if (Meteor.isClient) {
    Template.body.helpers({
        products: function() {
            return Invitations.find({});
        }
    })
}

Invitations.allow({
    'insert': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'update': function(userId, doc) {
        return Users.isAdmin(userId);
    }
});