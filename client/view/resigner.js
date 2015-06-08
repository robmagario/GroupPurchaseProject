/**
 * Created by chinhong on 5/21/15.
 */
function LocatToMain() {
    var _location = location.pathname;
    _location = _location.replace("/resigner","");
    _location += "/";
    location =  _location;
}
Template.ResignerPage.rendered = function() {
    // Turn to Main Page if logged in
    var _id = Meteor.userId();
    if(_id != null) {
        //LocatToMain();
    }
}

Template.ResignerPage.events({
    // Click Login Button
   'click .btn_resigner': function() {
       var _name = $('#resign').find('input').eq(0).val();
       var _email = $('#resign').find('input').eq(1).val();
       var _password = $('#resign').find('input').eq(2).val();
       var _key = $('#resign').find('input').eq(3).val();
       var _empty = false;
       var _error = "";
       if(_name == "" || _name == null) {
           _empty = true;
           _error += "Please fill the 'Username' column!\n";
       }
       if(_email == "" || _email == null) {
           _empty = true;
           _error += "Please fill the 'Email' column!\n";
       }
       if(_password == "" || _password == null) {
           _empty = true;
           _error += "Please fill the 'Password' column!\n";
       }
       if(_key == "" || _key == null) {
           _empty = true;
           _error += "Please fill the 'Invite Key' column!";
       }
       if(!_empty) {
           var _searchKey = Invitations.find({_id: _key, verified:false}).fetch();
           var _date = new Date();
           if(_searchKey.length > 0) {
               //alert("Resigner Success");
               if(_searchKey[0].to == _email) {
                   Accounts.createUser({
                       username:  _name,
                       email:     _email,
                       password : _password,
                       invited_by: _searchKey.from,
                       create_at: _date,
                       invitation: 0,
                       invitation_use: 0

                       //profile: { name: register_name},
                       //language: register_language
                   }, function(err) {
                       if(err) {
                           alert(err.message);
                       } else {
                           Meteor.call(
                               'resigner_account',
                               _email, _password, _key
                           );
                           location = "/";
                       }
                   });
               } else {
                   alert("Valid Email for Invitation");
               }
           } else {
               alert("Incorrect Invitation Key");
           }
       } else {
           alert(_error);
       }
   }
});