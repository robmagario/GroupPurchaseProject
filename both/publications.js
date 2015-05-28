/**
 * Created by chinhong on 5/21/15.
 */

if (Meteor.isClient) {
    Meteor.subscribe("user_data");
    Meteor.subscribe("product_data");
    Meteor.subscribe("product_image_data");
    Meteor.subscribe("order_data");
    Meteor.subscribe("invitation_data");
}

if (Meteor.isServer) {
    Meteor.publish("user_data", function () {
        return Meteor.users.find({});
    });
    Meteor.publish("product_data", function () {
        return Products.find();
    });
    Meteor.publish("product_image_data", function () {
        return ProductImages.find();
    });
    Meteor.publish("order_data", function () {
        return Orders.find();
    });
    Meteor.publish("invitation_data", function () {
        return Invitations.find();
    });
}