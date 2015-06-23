/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    $('#purchase').find('label').eq(1).html("US$ " + Helpers.User.CashBack.Remain() + " <span id='MyCRemain' class='PriceHK'></span>");
    Helpers.ExchangeMoney.GetExchangeMoney('USD', 'HKD', Helpers.User.CashBack.Remain(), 'MyCRemain');
}

Template.PurchasePage.rendered = function() {
    //window.setTimeout(InitializeData, 1000);
};

Template.PurchasePage.events({
    'click .btn': function(e) {
    }

});

Template.PurchasePage.helpers({
    'cashback_remain': function() {
        return Helpers.User.CashBack.Remain();
    },
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