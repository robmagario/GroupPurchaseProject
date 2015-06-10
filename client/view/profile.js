/**
 * Created by chinhong on 6/2/15.
 */

Template.ProfilePage.rendered = function() {
};

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
                var _error = "";
                if(_to == "" || _to == null || _to.search('@') < 0 || _to.search('.') < 0) {
                    _check = false;
                    _error = "Please fill the email column";
                }

                var _users = Meteor.users.find().fetch();
                var uIndex;
                for(uIndex in _users) {
                    if(_users[uIndex].emails[0].address == _to) {
                        _check = false;
                        _error = "The invitees is already have an account."
                        break;
                    }
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
                    alert(_error);
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

Template.ProfilePage.helpers({
    'Username': function() {
        if(Meteor.user()) return Meteor.user().username;
    },
    'Email': function() {
        if(Meteor.user()) return Meteor.user().emails[0].address;
    },
    'CreateAt': function() {
        if(Meteor.user()) return Meteor.user().createdAt;
    },
    'Country': function() {
        if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.country;
    },
    'City': function() {
        if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.city;
    },
    'State': function() {
        if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.state;
    },
    'Address': function() {
        if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.address;
    },
    'Zipcode': function() {
        if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.zipcode;
    },
    'Phone': function() {
        if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.phone;
    },
    'Remain': function() {
        if(Meteor.user()) {
            var _temp = Meteor.user().invitation;
            if(_temp == "" || _temp == null) {
                return 0;
            } else {
                return _temp;
            }
        }
    },
    'InviteBy': function() {
        if(Meteor.user()) {
            var _temp = Invitations.findOne({to:Meteor.user().emails[0].address, verified:true});
            if(_temp == "" || _temp == null) {
                return "You are admin!";
            } else {
                return _temp.from;
            }
        }
    }
});