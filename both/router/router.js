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
}
