/**
 * Created by chinhong on 5/22/15.
 */

ProfilePosters = new Mongo.Collection("profile_posters");
ProfileIcons = new Mongo.Collection("profile_icons");
ProfileComments = new Mongo.Collection("profile_comments");

if (Meteor.isClient) {
    Template.body.helpers({
        profile_posters: function() {
            return ProfilePosters.find({});
        },
        profile_icons: function() {
            return ProfileIcons.find({});
        },
        profile_comments: function() {
            return ProfileComments.find({});
        }
    })
}

ProfilePosters.allow({
    'insert': function(userId, doc) {
        return true;
    },
    'update': function(userId, doc) {
        return true;
    },
    'remove': function(userId, doc) {
        return true;
    }
});

ProfileIcons.allow({
    'insert': function(userId, doc) {
        return true;
    },
    'update': function(userId, doc) {
        return true;
    },
    'remove': function(userId, doc) {
        return true;
    }
});

ProfileComments.allow({
    'insert': function(userId, doc) {
        return true;
    },
    'update': function(userId, doc) {
        return true;
    },
    'remove': function(userId, doc) {
        return true;
    }
});