Meteor.startup(function () {
    if (typeof Meteor.users.findOne({
            username: "robmagario"
        }) === 'undefined') {
        Accounts.createUser({
            username: "robmagario",
            email: "robson@magario.com",
            password: "Blah124@",
            profile: {
            }
        });
    }
    var userrob = Meteor.users.findOne({username: 'robmagario'});
    if(userrob != null) {
        Roles.addUsersToRoles(userrob._id, ['admin']);
    }

    if (typeof Meteor.users.findOne({
            username: "DaveNg"
        }) === 'undefined') {
        Accounts.createUser({
            username: "DaveNg",
            email: "chinho.ng@magario.com",
            password: "12345678",
            profile: {
            }
        });
    }
    var user_dave = Meteor.users.findOne({username: 'DaveNg'});
    if(user_dave != null) {
        Roles.addUsersToRoles(user_dave._id, ['admin']);
    }
});