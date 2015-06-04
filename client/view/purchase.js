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
        console.log(e.target.innerText);
    }
});