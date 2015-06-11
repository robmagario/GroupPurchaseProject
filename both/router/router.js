/**
 * Created by chinhong on 5/21/15.
 */
if (Meteor.isClient) {
    // Dashboard Page
    Router.route("dashboard_en", {path: "/dashboard", controller: "DashboardController"});
    Router.route("dashboard_jp", {path: "/jp/dashboard", controller: "DashboardController"});
    Router.route("dashboard_cn", {path: "/cn/dashboard", controller: "DashboardController"});
    Router.route("dashboard_hk", {path: "/hk/dashboard", controller: "DashboardController"});
    Router.route("dashboard_br", {path: "/br/dashboard", controller: "DashboardController"});

    // Resigner Page
    Router.route("registration_en", {path: "/registration", controller: "ResignerController"});
    Router.route("registration_jp", {path: "/jp/registration", controller: "ResignerController"});
    Router.route("registration_cn", {path: "/cn/registration", controller: "ResignerController"});
    Router.route("registration_hk", {path: "/hk/registration", controller: "ResignerController"});
    Router.route("registration_br", {path: "/br/registration", controller: "ResignerController"});

    // Page Before Login
    Router.route("login_en", {path: "/", controller: "LoginController"});
    Router.route("login_jp", {path: "/jp", controller: "LoginController"});
    Router.route("login_cn", {path: "/cn", controller: "LoginController"});
    Router.route("login_hk", {path: "/hk", controller: "LoginController"});
    Router.route("login_br", {path: "/br", controller: "LoginController"});

    // Main Page After Login
    Router.route("group_purchase_en", {path: "/home", controller: "GroupPurchaseController"});
    Router.route("group_purchase_jp", {path: "/jp/home", controller: "GroupPurchaseController"});
    Router.route("group_purchase_cn", {path: "/cn/home", controller: "GroupPurchaseController"});
    Router.route("group_purchase_hk", {path: "/hk/home", controller: "GroupPurchaseController"});
    Router.route("group_purchase_br", {path: "/br/home", controller: "GroupPurchaseController"});

    // Profile Page
    Router.route("profile_en", {path: "/profile", controller: "ProfileController"});
    Router.route("profile_jp", {path: "/jp/profile", controller: "ProfileController"});
    Router.route("profile_cn", {path: "/cn/profile", controller: "ProfileController"});
    Router.route("profile_hk", {path: "/hk/profile", controller: "ProfileController"});
    Router.route("profile_br", {path: "/br/profile", controller: "ProfileController"});

    // Cart
    Router.route("cart_en", {path: "/cart", controller: "CartController"});
    Router.route("cart_jp", {path: "/jp/cart", controller: "CartController"});
    Router.route("cart_cn", {path: "/cn/cart", controller: "CartController"});
    Router.route("cart_hk", {path: "/hk/cart", controller: "CartController"});
    Router.route("cart_br", {path: "/br/cart", controller: "CartController"});

    // Create Order
    Router.route("create_order_en", {path: "/createorder", controller: "CreateOrderController"});
    Router.route("create_order_jp", {path: "/jp/createorder", controller: "CreateOrderController"});
    Router.route("create_order_cn", {path: "/cn/createorder", controller: "CreateOrderController"});
    Router.route("create_order_hk", {path: "/hk/createorder", controller: "CreateOrderController"});
    Router.route("create_order_br", {path: "/br/createorder", controller: "CreateOrderController"});

    // Order List
    Router.route("order_en", {path: "/order", controller: "OrderController"});
    Router.route("order_jp", {path: "/jp/order", controller: "OrderController"});
    Router.route("order_cn", {path: "/cn/order", controller: "OrderController"});
    Router.route("order_hk", {path: "/hk/order", controller: "OrderController"});
    Router.route("order_br", {path: "/br/order", controller: "OrderController"});

    // Purchase List
    Router.route("purchase_en", {path: "/purchase", controller: "PurchaseController"});
    Router.route("purchase_jp", {path: "/jp/purchase", controller: "PurchaseController"});
    Router.route("purchase_cn", {path: "/cn/purchase", controller: "PurchaseController"});
    Router.route("purchase_hk", {path: "/hk/purchase", controller: "PurchaseController"});
    Router.route("purchase_br", {path: "/br/purchase", controller: "PurchaseController"});

    // Logout
    Router.route("logout_en", {path: "/logout", controller: "LogoutController"});
    Router.route("logout_jp", {path: "/jp/logout", controller: "LogoutController"});
    Router.route("logout_cn", {path: "/cn/logout", controller: "LogoutController"});
    Router.route("logout_hk", {path: "/hk/logout", controller: "LogoutController"});
    Router.route("logout_br", {path: "/br/logout", controller: "LogoutController"});

    // Invitation
    Router.route("invitation_en", {path: "/invitation", controller: "InvitationController"});
    Router.route("invitation_jp", {path: "/jp/invitation", controller: "InvitationController"});
    Router.route("invitation_cn", {path: "/cn/invitation", controller: "InvitationController"});
    Router.route("invitation_hk", {path: "/hk/invitation", controller: "InvitationController"});
    Router.route("invitation_br", {path: "/br/invitation", controller: "InvitationController"});


    var _product = Products.find({publish: true}).fetch();
    for(var i=0; i<_product.length; i++) {
        Router.route("product_" + _product[i]._id, {path: "/product/" + _product[i]._id, controller: "ProductController"});
    }
}
