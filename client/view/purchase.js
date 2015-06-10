/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    $('#purchase').find('label').eq(1).html(Helpers.User.CashBack.Remain() + " HKD");
}

Template.PurchasePage.rendered = function() {
    window.setTimeout(InitializeData, 1000);
}

Template.PurchasePage.events({
    'click .btn': function(e) {
    }

});

Template.PurchasePage.helpers({
    'check_method': function (method) {
        switch (method) {
            case "buy":
                return "warning";
            case "get":
                return "success";
            default:
                return "default";
                break;
        }
    }
});