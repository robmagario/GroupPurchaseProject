/**
 * Created by chinhong on 5/22/15.
 */
Meteor.startup(function() {
    // read environment variables from Meteor.settings
    if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
        for(var variableName in Meteor.settings.env) {
            process.env[variableName] = Meteor.settings.env[variableName];
        }
    }

    process.env.MAIL_URL = 'smtp://davengfortesting%40meteorize.gmail.com:u3aHyUuelGV6tthci9P0dQ@smtp.mandrillapp.com:587';
    // Link:	https://mandrillapp.com/
    // User:	davengfortesting@gmail.com
    // PW:		mytestforjob830)
});

Meteor.methods({
    "createUserAccount": function(options) {
        if(!Users.isAdmin(Meteor.userId())) {
            throw new Meteor.Error(403, "Access denied.");
        }

        var userOptions = {};
        if(options.username) userOptions.username = options.username;
        if(options.email) userOptions.email = options.email;
        if(options.password) userOptions.password = options.password;
        if(options.profile) userOptions.profile = options.profile;
        if(options.profile && options.profile.email) userOptions.email = options.profile.email;

        Accounts.createUser(userOptions);
    },
    "updateUserAccount": function(userId, options) {
        // only admin or users own profile
        if(!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
            throw new Meteor.Error(403, "Access denied.");
        }

        // non-admin user can change only profile
        if(!Users.isAdmin(Meteor.userId())) {
            var keys = Object.keys(options);
            if(keys.length !== 1 || !options.profile) {
                throw new Meteor.Error(403, "Access denied.");
            }
        }

        var userOptions = {};
        if(options.username) userOptions.username = options.username;
        if(options.email) userOptions.email = options.email;
        if(options.password) userOptions.password = options.password;
        if(options.profile) userOptions.profile = options.profile;

        if(options.profile && options.profile.email) userOptions.email = options.profile.email;
        if(options.roles) userOptions.roles = options.roles;

        if(userOptions.email) {
            var email = userOptions.email;
            delete userOptions.email;
            userOptions.emails = [{ address: email }];
        }

        var password = "";
        if(userOptions.password) {
            password = userOptions.password;
            delete userOptions.password;
        }

        if(userOptions) {
            Users.update(userId, { $set: userOptions });
        }

        if(password) {
            Accounts.setPassword(userId, password);
        }
    },

    // Insert invitation
    invitation_insert: function(to, from, fromid, text) {
        var _date = new Date();
        var _inviteID = Invitations.insert({
            to:         to,
            from:       from,
            fromid:     fromid,
            verified:   false,
            createAt:   _date
        });
        var trueID = _inviteID;
        var _message = "From: " + from + "\nTo: " + to +  "\nInvite Key: " + trueID + "\n\n" + text;
        var test = Meteor.call(
            'sendEmail',
            to,
            from,
            "Invitation From GroupPurchase",
            _message
        );
    },

    // Update Invitation Left
    invitation_use: function(_id, _left, _use) {
        console.log("Teting");
        console.log(_id);
        console.log(_left);
        console.log(_use);
        Meteor.users.update(_id, {$set:{
            invitation:     _left,
            invitation_use: _use
        }})
    },

    // Send Email by using mandrill api
    sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);
        this.unblock();
        console.log(text);
        Email.send({
            to: 	 to,
            from: 	 from,
            subject: subject,
            text: 	 text
        });
    },

    resigner_account: function(to, from, key) {
        var _searchKey = Invitations.find({_id: key, verified:false}).fetch();
        if(_searchKey.length > 0) {
            Invitations.update(key, {$set:{verified: true}});
        } else {
        }
    }
});

/*
Accounts.onCreateUser(function (options, user) {
    user.roles = [];

    if(options.profile) {
        user.profile = options.profile;
    }



    return user;
});

Accounts.validateLoginAttempt(function(info) {

    // reject users with role "blocked"
    if(info.user && Users.isInRole(info.user._id, "blocked")) {
        throw new Meteor.Error(403, "Your account is blocked.");
    }

    return true;
});


Users.before.insert(function(userId, doc) {
    if(doc.emails && doc.emails[0] && doc.emails[0].address) {
        doc.profile = doc.profile || {};
        doc.profile.email = doc.emails[0].address;
    }
});

Users.before.update(function(userId, doc, fieldNames, modifier, options) {
    if(modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {
        modifier.$set.profile.email = modifier.$set.emails[0].address;
    }
});*/