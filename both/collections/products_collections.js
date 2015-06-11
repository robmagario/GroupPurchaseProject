/**
 * Created by chinhong on 5/22/15.
 */

Products = new Mongo.Collection("products");
ProductImages = new Mongo.Collection("product_images");

if (Meteor.isClient) {
    Template.body.helpers({
        products: function() {
            return Products.find({});
        },
        product_images: function() {
            return ProductImages.find({});
        }
    })
}

Products.allow({
    'insert': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'update': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'remove': function(userId, doc) {
        return Users.isAdmin(userId);
    }
});

ProductImages.allow({
    'insert': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'update': function(userId, doc) {
        return Users.isAdmin(userId);
    },
    'remove': function(userId, doc) {
        return Users.isAdmin(userId);
    }
});