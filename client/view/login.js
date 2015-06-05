/**
 * Created by chinhong on 5/21/15.
 */
function LocatToMain() {
    var _location = location.pathname;
    _location = _location.replace("/login","");
    _location += "/";
    location =  _location;
}
Template.LoginPage.rendered = function() {
    // Turn to Main Page if logged in
    var _id = Meteor.userId();
    if(_id != null) {
        LocatToMain();
    }
}

Template.LoginPage.events({
    // Click Login Button
    'click .btn': function() {
        var _email = $('#login').find('input').eq(0).val();
        var _password = $('#login').find('input').eq(1).val();
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
        if(!_empty) {
            Meteor.loginWithPassword(_email, _password, function(err) {
                if (err) {
                    alert(err.reason);
                    return false;
                } else {
                    LocatToMain();
                }
            })
        } else {
            alert(_error);
        }
    }
    //'click .btn_log': function() {
    //   var _email = $('#input_email').val();
    //   var _password = $('#input_password').val();
    //   var _empty = false;
    //   var _error = "";
    //   if(_email == "" || _email == null) {
    //       _empty = true;
    //       _error += "Please fill the 'Email' column!\n";
    //   }
    //   if(_password == "" || _password == null) {
    //       _empty = true;
    //       _error += "Please fill the 'Password' column!";
    //   }
    //   if(!_empty) {
    //       Meteor.loginWithPassword(_email, _password, function(err) {
    //           if (err) {
    //               alert(err.reason);
    //               return false;
    //           } else {
    //               LocatToMain();
    //           }
    //       })
    //   } else {
    //       alert(_error);
    //   }
    //}
});