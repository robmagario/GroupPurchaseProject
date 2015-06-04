/**
 * Created by chinhong on 6/2/15.
 */
function InitializeData() {
    $('#profile').find('label').eq(1).html(Helpers.User.Profile.Name());
    $('#profile').find('label').eq(3).html(Helpers.User.Profile.Email());
    $('#profile').find('label').eq(6).html(Helpers.User.Profile.CreateAt());
    var _address = Helpers.User.Profile.Address();
    $('#address').find('label').eq(1).html(_address.country);
    $('#address').find('label').eq(3).html(_address.city);
    $('#address').find('label').eq(5).html(_address.state);
    $('#address').find('label').eq(7).html(_address.address);
    $('#address').find('label').eq(9).html(_address.zipcode);
    $('#address').find('label').eq(11).html(_address.phone);
    $('#invitation').find('label').eq(1).html(Helpers.User.Profile.Invite.Remain());
    $('#invitation').find('label').eq(3).html(Helpers.User.Profile.Invite.InviteBy());
}

Template.ProfilePage.rendered = function() {
    window.setTimeout(InitializeData, 1000);
}

Template.ProfilePage.events({
    'click .btn': function(e) {
        var _action = e.target.value;
        Helpers.Log.Show("Button", _action + " in profile.");
        switch(_action) {
            case "ResetPW":
                $('#Profile').hide();
                $('#ResetPassword').show();
                break;
            case "SetPW":
                var _pw_old = $('#ResetPassword').find('input').eq(0).val();
                var _pw_new = $('#ResetPassword').find('input').eq(1).val();
                var _pw_con = $('#ResetPassword').find('input').eq(2).val();
                if(_pw_new != _pw_con) {
                    Helpers.ErrorMessage.ConfirmPW();
                } else {
                    Accounts.changePassword(_pw_old,_pw_new,function(err){
                        if (err) {
                            alert(err.reason);
                            return false;
                        } else {
                            Meteor.logout(function() {
                                alert('Password have Reset');
                                location = "/login";
                            });
                        }
                    });
                }
                break;
            case "EditAddress":
                var _address = Helpers.User.Profile.Address();
                $('#EditAddress').find('input').eq(0).val(_address.country);
                $('#EditAddress').find('input').eq(1).val(_address.city);
                $('#EditAddress').find('input').eq(2).val(_address.state);
                $('#EditAddress').find('input').eq(3).val(_address.address);
                $('#EditAddress').find('input').eq(4).val(_address.zipcode);
                $('#EditAddress').find('input').eq(5).val(_address.phone);
                $('#Profile').hide();
                $('#EditAddress').show();
                break;
            case "SaveAddress":
                var _userid =   Meteor.userId();
                var _country =  $('#EditAddress').find('input').eq(0).val();
                var _city =     $('#EditAddress').find('input').eq(1).val();
                var _state =    $('#EditAddress').find('input').eq(2).val();
                var _address =  $('#EditAddress').find('input').eq(3).val();
                var _zipcode =  $('#EditAddress').find('input').eq(4).val();
                var _phone =    $('#EditAddress').find('input').eq(5).val();
                Users.update(_userid, {$set:{profile:{
                    country: _country,
                    city:    _city,
                    state:   _state,
                    address: _address,
                    zipcode: _zipcode,
                    phone:   _phone
                }}}, function() {
                    Helpers.Log.Show("UserUpdate","\n" +
                        "ID: " + _userid + "\n" +
                        "Country: "+ _country + "\n" +
                        "City:    "+ _city + "\n" +
                        "State:   "+ _state + "\n" +
                        "Address: "+ _address + "\n" +
                        "ZipCode: "+ _zipcode + "\n" +
                        "Phone:   "+ _phone);
                    $('#EditAddress').hide();
                    $('#Profile').show();
                    InitializeData();
                });
                break;
            case "WriteInvite":
                var _remain = Helpers.User.Profile.Invite.Remain();
                if(_remain > 0) {
                    $('#Profile').hide();
                    $('#Invite').show();
                } else {
                    alert("You have no invite letter to do this.");
                }
                break;
            case "SendInvite":
                var _to = $('#Invite').find('input').eq(0).val();
                var _from = Helpers.User.Profile.Email();
                var _fromid = Meteor.userId();
                var _text = $('#Invite').find('textarea').eq(0).val();
                var _check = true;
                if(_to == "" || _to == null || _to.search('@') < 0 || _to.search('.') < 0) {
                    _check = false;
                }

                if(_check) {
                    var _userid = Meteor.userId();
                    var _remain = Helpers.User.Profile.Invite.Remain() - 1;
                    var _use =    Helpers.User.Profile.Invite.Use() + 1;
                    Meteor.call(
                        'invitation_use',
                        _userid, _remain, _use
                    )
                    Meteor.call(
                        'invitation_insert',
                        _to, _from, _fromid, _text
                    );
                    location = "/";
                } else {
                    alert("Please fill the email column");
                }
                break;
            case "BackProfile":
                $('#ResetPassword').hide();
                $('#EditAddress').hide();
                $('#Invite').hide();
                $('#Profile').show();
                break;
            default :
                Helpers.Log.Show("Button", _action + " is undefind in profile.");
                break;
        }
    }
});