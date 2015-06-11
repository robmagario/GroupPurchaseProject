/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    var _first = Invitations.find({fromid: Meteor.userId()}).fetch();
    var FirstHTML = "";
    var i;
    for(i in _first) {
        FirstHTML += "" +
            "<a class='list-group-item an-first-invite'>"+_first[i].to+"</a>";
    }
    $('#first-group').html(FirstHTML);
    //$('#profile').find('label').eq(1).html(Helpers.User.Profile.Name());
    //$('#profile').find('label').eq(3).html(Helpers.User.Profile.Email());
    //$('#profile').find('label').eq(6).html(Helpers.User.Profile.CreateAt());
    //$('#invitation').find('label').eq(1).html(Helpers.User.Profile.Invite.Remain());
    //$('#invitation').find('label').eq(3).html(Helpers.User.Profile.Invite.InviteBy());
    //var _address = Helpers.User.Profile.Address();
    //if(_address != null) {
    //    $('#address').find('label').eq(1).html(_address.country);
    //    $('#address').find('label').eq(3).html(_address.city);
    //    $('#address').find('label').eq(5).html(_address.state);
    //    $('#address').find('label').eq(7).html(_address.address);
    //    $('#address').find('label').eq(9).html(_address.zipcode);
    //    $('#address').find('label').eq(11).html(_address.phone);
    //}
}

Template.InvitationPage.rendered = function() {
    window.setTimeout(InitializeData, 1000);
}

Template.InvitationPage.events({
    'click .an-first-invite': function(e) {
        var _users = Meteor.users.find().fetch();
        var _active = e.currentTarget.innerText;
        var _activeId = "";
        var i;
        for(i in _users) {
            if(_users[i].emails[0].address == _active) {
                _activeId = _users[i]._id;
                break;
            }
        }
        var _second = Invitations.find({fromid: _activeId}).fetch();
        var SecondHTML = "";
        var i1;
        for(i1 in _second) {
            SecondHTML += "" +
                "<a class='list-group-item an-second-invite'>"+_second[i1].to+"</a>";
        }
        $('#second-group').html(SecondHTML);
        $('#second-label').html(TAPi18n.__("Invite_By", _active));
        $('#third-label').html(TAPi18n.__("Invite_By", " "));
        $('#third-group').html("");
    },
    'click .an-second-invite': function(e) {
        var _users = Meteor.users.find().fetch();
        var _active = e.currentTarget.innerText;
        var _activeId = "";
        var i;
        for(i in _users) {
            if(_users[i].emails[0].address == _active) {
                _activeId = _users[i]._id;
                break;
            }
        }
        var _thrid = Invitations.find({fromid: _activeId}).fetch();
        var ThirdHTML = "";
        var i1;
        for(i1 in _thrid) {
            ThirdHTML += "" +
                "<a class='list-group-item'>"+_thrid[i1].to+"</a>";
        }
        $('#third-label').html(TAPi18n.__("Invite_By", _active));
        $('#third-group').html(ThirdHTML);
    }
});