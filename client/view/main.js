/**
 * Created by chinhong on 5/21/15.
 */
function LocatToLogin() {
    window.setTimeout(function() {
        var _location = location.pathname;
        _location = _location.replace("/","");
        _location += "/";
        location = "" + _location + "login";
    },1000);
}

Template.MainPage.rendered = function() {
    // Turn to Login Page if haven't login
    var _id = Meteor.userId();
    if(_id == null) {
        LocatToLogin();
    }
}

var tab_events = {
    SelectTab: function(tab_name) {
        MainPage_Log.Show("SelectTab", tab_name);
        $('.container_item').hide();
        $('.profile_item').hide();
        switch(tab_name) {
            case "Profile":
                $('#MainPage_Profile').show();
                $('#Profile_Overview').show();
                break;
            case "ResetPassword":
                $('#MainPage_Profile').show();
                $('#Profile_ResetPassword').show();
                break;
            case "Invitation":
                $('#MainPage_Profile').show();
                $('#Profile_SendInvite').show();
                break;
            default:
                MainPage_Log.Show("SelectTab", "Tab of '" + tab_name + "' have not set an events");
                break;
        }
    }
}

Template.MainPage.events({
    // Click Logout Button
    'click .btn_logout': function() {
        Meteor.logout(function() {
            LocatToLogin();
        });
    },

    // Click Profile Button
    'click .btn_profile': function() {
        tab_events.SelectTab("Profile");
        $('#label_username').html(Helpers.User.Name());
        $('#label_useremail').html(Helpers.User.Email());
        $('#label_invitation').html(Helpers.User.Invitation());
    },

    // Click Reset Button from Profile
    'click .btn_reset_password': function() {
        tab_events.SelectTab("ResetPassword");
    },

    // Click Invite Button from Profile
    'click .btn_invite': function() {
        tab_events.SelectTab("Invitation");
    },

    // Click Back Button from Reset Password
    'click .btn_reset_password_back': function() {
        tab_events.SelectTab("Profile");
    },

    // Click Invite Button from Invitation
    'click .btn_invite_send': function() {
        var _to = $('#input_invitees_email').val();
        var _from = Helpers.User.Email();
        var _text = $('#input_invite_message').val();
        var _check = true;
        if(_to == "" || _to == null || _to.search('@') < 0 || _to.search('.') < 0) {
            _check = false;
        }

        if(_check) {
            Meteor.call(
                'invitation_insert',
                _to, _from, _text
            );
        } else {
            alert("Send fail");
        }
    }
});

var MainPage_Log = {
    active: true,
    Show: function(header, message) {
        if(MainPage_Log.active) {
            console.log("[" + header + "]: " + message);
        }
    }
}