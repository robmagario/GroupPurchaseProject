/**
 * Created by chinhong on 5/21/15.
 */
if (Meteor.isClient) {
    Router.route("dashboard", {path: "/dashboard", controller: "DashboardController"});

    Router.route("group_purchase_en", {path: "/", controller: "GroupPurchaseController"});
    Router.route("group_purchase_jp", {path: "/jp", controller: "GroupPurchaseController"});
    Router.route("group_purchase_cn", {path: "/cn", controller: "GroupPurchaseController"});
    Router.route("group_purchase_hk", {path: "/hk", controller: "GroupPurchaseController"});
    Router.route("group_purchase_br", {path: "/br", controller: "GroupPurchaseController"});

    Router.route("login_en", {path: "/login", controller: "LoginController"});
    Router.route("login_jp", {path: "/jp/login", controller: "LoginController"});
    Router.route("login_cn", {path: "/cn/login", controller: "LoginController"});
    Router.route("login_hk", {path: "/hk/login", controller: "LoginController"});
    Router.route("login_br", {path: "/br/login", controller: "LoginController"});

    Router.route("resigner_en", {path: "/resigner", controller: "ResignerController"});
    Router.route("resigner_jp", {path: "/jp/resigner", controller: "ResignerController"});
    Router.route("resigner_cn", {path: "/cn/resigner", controller: "ResignerController"});
    Router.route("resigner_hk", {path: "/hk/resigner", controller: "ResignerController"});
    Router.route("resigner_br", {path: "/br/resigner", controller: "ResignerController"});

    var _product = Products.find({publish: true}).fetch();
    for(var i=0; i<_product.length; i++) {
        Router.route("product_" + _product[i]._id, {path: "/product/" + _product[i]._id, controller: "ProductController"});
    }
}
