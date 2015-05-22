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
       var _email = $('#input_email').val();
       var _password = $('#input_password').val();
       var _key = $('#input_key').val();
       var _empty = false;
       var _error = "";
       if(_email == "" || _email == null) {
           _empty = true;
           _error += "Please fill the 'Email' column!\n";
       }
       if(_password == "" || _password == null) {
           _empty = true;
           _error += "Please fill the 'Password' column!";
       }
       if(_key == "" || _key == null) {
           _empty = true;
           _error += "Please fill the 'Invite Key' column!";
       }
       if(!_empty) {
           var _searchKey = Invitations.find({_id: _key, verified:false}).fetch();
           if(_searchKey.count > 0) {
               //alert("Resigner Success");
               Accounts.createUser({
                   username: "Testing",
                   email: _email,
                   password : _password
                   //profile: { name: register_name},
                   //language: register_language
               }, function(err) {
                   if(err) {
                       alert(err.message);
                   } else {

                   }
               });
           } else {
               //alert("Resigner Failed");
               Accounts.createUser({
                   username: "Testing",
                   email: _email,
                   password : _password
                   //profile: { name: register_name},
                   //language: register_language
               }, function(err) {
                   if(err){
                       alert(err.message);
                   } else {

                   }
               });
           }

           Meteor.call(
               'resigner_account',
               _email, _password, _key
           );
       } else {
           alert(_error);
       }
   }
});