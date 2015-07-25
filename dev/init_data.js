Meteor.startup(function () {
    if (typeof Meteor.users.findOne({
            username: "robmagario"
        }) === 'undefined') {
        Accounts.createUser({
            username: "robmagario",
            email: "robson@magario.com",
            password: "Blah124@",
            profile: {
                //publicly visible fields like firstname goes here
            }
        });
        var userrob = Meteor.users.findOne({username: 'robmagario'});
        if (userrob != null) {
            Roles.addUsersToRoles(userrob._id, ['admin']);
        }
    }

    if (typeof Meteor.users.findOne({
            username: "abbeythorley"
        }) === 'undefined') {
        Accounts.createUser({
            username: "abbeythorley",
            email: "abbey.thorley@magario.com",
            password: "BKjk@96",
            profile: {
                //publicly visible fields like firstname goes here
            }
        });
        var userabbey = Meteor.users.findOne({username: 'abbeythorley'});
        if (userabbey != null) {
            Roles.addUsersToRoles(userabbey._id, ['admin']);
        }
    }

    if (typeof Meteor.users.findOne({
            username: "Dranithix"
        }) === 'undefined') {
        Accounts.createUser({
            username: "Dranithix",
            email: "dranithix@gmail.com",
            password: "asdfghjkl",
            profile: {
                //publicly visible fields like firstname goes here
            }
        });
        var user_kenta = Meteor.users.findOne({username: 'Dranithix'});
        if (user_kenta != null) {
            Roles.addUsersToRoles(user_kenta._id, ['admin']);
        }
    }

    if (typeof Meteor.users.findOne({
            username: "DaveNg"
        }) === 'undefined') {
        Accounts.createUser({
            username: "DaveNg",
            email: "chinho.ng@magario.com",
            password: "12345678",
            profile: {
                //publicly visible fields like firstname goes here
            }
        });
        var user_dave = Meteor.users.findOne({username: 'DaveNg'});
        if (user_dave != null) {
            Roles.addUsersToRoles(user_dave._id, ['admin']);
        }
    }

    if (typeof Meteor.users.findOne({
            username: "john"
        }) === 'undefined') {
        Accounts.createUser({
            username: "john",
            email: "chihung.siu@magario.com",
            password: "12345678",
            profile: {
                //publicly visible fields like firstname goes here
            }
        });
        var user_john = Meteor.users.findOne({username: 'john'});
        if (user_john != null) {
            Roles.addUsersToRoles(user_john._id, ['admin']);
        }
    }
});