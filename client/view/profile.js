Template.ProfilePage.events({
    'click .btn': function(e) {
        var _action = e.target.value;
        Helpers.Log.Show("Button", _action + " in profile.");
        switch (_action) {
            case "UpdateIcon":
                var _icon_new = $('#img_user_icon').attr('src');
                var _icon_old = ProfileIcons.findOne({user:Meteor.userId()});
                if(_icon_old != null) {
                    ProfileIcons.update({
                        _id: _icon_old._id
                    }, {$set:{
                        icon: _icon_new
                    }});
                } else {
                    var _user = Meteor.userId();
                    ProfileIcons.insert({
                        user: _user,
                        icon: _icon_new
                    });
                }
                break;
            case "UpdatePoster":
                var _poster_new = $('#img_user_poster').attr('src');
                var _poster_old = ProfilePosters.findOne({user:Meteor.userId()});
                if(_poster_old != null) {
                    ProfilePosters.update({
                        _id: _poster_old._id
                    }, {$set:{
                        poster: _poster_new
                    }});
                } else {
                    var _user = Meteor.userId();
                    ProfilePosters.insert({
                        user: _user,
                        poster: _poster_new
                    });
                }
                break;
            case "PostComment":
                var _userid = Meteor.userId();
                var _comment = $('#CommentPanel').find('textarea').val();
                var _date = new Date().toLocaleString();
                ProfileComments.insert({
                    user:     _userid,
                    comment:  _comment,
                    createAt: _date
                }, function() {
                    $('#CommentPanel').find('textarea').val("");
                });
                break;
            case "DeleteComment":
                ProfileComments.remove({_id: this._id});
                break;
            case "ResetPW":
                $('#SetPoster').hide();
                $('#ResetPassword').show();
                break;
            case "SetPW":
                var _pw_old = $('#ResetPWModel').find('input').eq(0).val();
                var _pw_new = $('#ResetPWModel').find('input').eq(1).val();
                var _pw_con = $('#ResetPWModel').find('input').eq(2).val();
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
                                Helpers.System.LocateTo("");
                            });
                        }
                    });
                }
                break;
            case "SendInvite":
                var _check = Meteor.user().invitation;
                if(_check != null && _check != "" && parseInt(_check) > 0) {
                    var _to = $('#InviteModel').find('input').eq(0).val();
                    var _from = Meteor.user().emails[0].address;
                    var _fromid = Meteor.userId();
                    var _text = $('#InviteModel').find('textarea').eq(0).val();
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
                            _error = "The invitees is already have an account.";
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
                        Helpers.System.LocateTo("/profile");
                    } else {
                        alert(_error);
                    }
                } else {

                }
                break;
            case "SaveAddress":
                var _userid =   Meteor.userId();
                var _country =  $('#AddressModel').find('input').eq(0).val();
                var _city =     $('#AddressModel').find('input').eq(1).val();
                var _state =    $('#AddressModel').find('input').eq(2).val();
                var _address =  $('#AddressModel').find('input').eq(3).val();
                var _phone =    $('#AddressModel').find('input').eq(4).val();
                var _zipcode =  $('#AddressModel').find('input').eq(5).val();
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
                });
                break;
                break;
            default:
                break;
        }
    },
    'click .profile-tabs': function(e) {
        var _tab = e.currentTarget.id;
        switch(_tab) {
            case 'ToComment':
                $('#BasicPage').show();
                $('#NetworkPage').hide();
                $('#SettingPage').hide();
                break;
            case 'ToNetwork':
                $('#BasicPage').hide();
                $('#NetworkPage').show();
                $('#SettingPage').hide();
                break;
            case 'ToSetting':
                $('#BasicPage').hide();
                $('#NetworkPage').hide();
                $('#SettingPage').show();
                break;
            default :
                console.log(_tab);
                break;
        }
        $('.profile-tabs').removeClass('active');
        e.currentTarget.classList.add('active');
    },
    'click .an-first-invite': function() {
        var _users = Meteor.users.find().fetch();
        var _userId;
        var i;
        for(i in _users) {
            if(_users[i].emails[0].address == this.to) {
                _userId = _users[i]._id;
                break;
            }
        }
        var InviteHTML = "";
        var _invitees = Invitations.find({fromid: _userId}).fetch();
        var j;
        for(j in _invitees) {
            var _icon = GetIconByEmail(_invitees[j].to);
            InviteHTML += "" +
                " <a class='list-group-item an-second-invite'>" +
                "<img src='"+_icon+"' width='32px' height='32px'>" +
                _invitees[j].to + "</a>";
        }
        $('#second-group').html(InviteHTML);
        $('#second-label').html(TAPi18n.__("Invite_By", this.to));
        $('#third-group').html("");
        $('#third-label').html(TAPi18n.__("Invite_By", " "));
    },
    'click .an-second-invite': function(e) {
        var _users = Meteor.users.find().fetch();
        var _userId;
        var i;
        for(i in _users) {
            if(_users[i].emails[0].address == e.currentTarget.innerText) {
                _userId = _users[i]._id;
                break;
            }
        }
        var InviteHTML = "";
        var _invitees = Invitations.find({fromid: _userId}).fetch();
        var j;
        for(j in _invitees) {
            var _icon = GetIconByEmail(_invitees[j].to);
            InviteHTML += "" +
                " <a class='list-group-item'>" +
                "<img src='"+_icon+"' width='32px' height='32px'>" +
                _invitees[j].to + "</a>";
        }
        $('#third-group').html(InviteHTML);
        $('#third-label').html(TAPi18n.__("Invite_By", e.currentTarget.innerText));
    },

    'click #IconModel': function() {
        $('#img_user_icon').attr('src',$('#UserIcon').attr('src'));
    }
});

Template.ProfilePage.helpers({
    'UserPoster': function() {
        var _temp =  ProfilePosters.findOne({user:Meteor.userId()});
        if(_temp != null) {
            return _temp.poster;
        } else {
            return null;
        }
    },
    'UserIcon': function() {
        var _temp =  ProfileIcons.findOne({user:Meteor.userId()});
        if(_temp != null) {
            return _temp.icon;
        } else {
            return null;
        }
    },
    'Username': function() {
        if (Meteor.user())  return Meteor.user().username;
    },
    'Email': function() {
        if (Meteor.user())  return Meteor.user().emails[0].address;
    },
    'Country': function() {
        if (Meteor.user())  return Meteor.user().profile.country;
    },
    'City': function() {
        if (Meteor.user())  return Meteor.user().profile.city;
    },
    'State': function() {
        if (Meteor.user())  return Meteor.user().profile.state;
    },
    'Address': function() {
        if (Meteor.user())  return Meteor.user().profile.address;
    },
    'Phone': function() {
        if (Meteor.user())  return Meteor.user().profile.phone;
    },
    'Zipcode': function() {
        if (Meteor.user())  return Meteor.user().profile.zipcode;
    },
    'Comments': function() {
        return ProfileComments.find({user: Meteor.userId()}, {sort: {createAt: -1}});
    },
    'InviteLetter': function() {
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
    },
    'MyInvitation': function() {
        return Invitations.find({fromid: Meteor.userId()});
    },
    'InviteesIcon': function(email) {
        return GetIconByEmail(email);
    },

    // Upload Event
    'UploadProfileIcon': function() {
        return {
            finished: function(index, fileInfo, context) {
                var _oldurl = $('#img_user_icon').attr('src');

                var _url;
                if(location.host.indexOf("localhost") < 0) {
                    _url = location.origin + "/upload" + fileInfo.path;
                } else {
                    _url = fileInfo.url;
                }
                $('#img_user_icon').attr('src', _url);

                if(_oldurl == null || _oldurl == "") {
                    return null;
                }
                var _oldpath = _oldurl.replace(location.origin + "/upload","");

                var _icon_new = $('#img_user_icon').attr('src');
                var _icon_old = ProfileIcons.findOne({user:Meteor.userId()});
                if(_icon_old != null) {
                    ProfileIcons.update({
                        _id: _icon_old._id
                    }, {$set:{
                        icon: _icon_new
                    }});
                } else {
                    var _user = Meteor.userId();
                    ProfileIcons.insert({
                        user: _user,
                        icon: _icon_new
                    });
                }

                Meteor.call('deleteFile', _oldpath);

                location.reload();
            }
        }
    }
});
function GetIconByEmail(email) {
    var _users = Meteor.users.find().fetch();
    var _userId;
    var i;
    for(i in _users) {
        if(_users[i].emails[0].address == email) {
            _userId = _users[i]._id;
            break;
        }
    }
    var _icon = ProfileIcons.findOne({user:_userId});
    if(_icon != null) {
        return _icon.icon;
    } else {
        return "";
    }
};