Template.login.events({
  // Login user
  "submit #login-form": function(event, template) {
    event.preventDefault();
    // toastr.info("Logging In...");
    var user_credentials = {};
    user_credentials.email = event.target.email.value;
    user_credentials.password = event.target.password.value;
    console.log(user_credentials);

    // Check if this user exists
    var user = Users.findOne({email: user_credentials.email});
    toastr.clear();
    console.log(user);
    if(!user){
      toastr.error("The user doesn't exist");
    }
    else{
      if(user.password ===  user_credentials.password){
        toastr.success("Welcome " + user.name + "!");
        Session.setPersistent('hive_user', user);
        console.log(Session.get('hive_user'));
        Router.go('/chats');
      }
      else{
        toastr.error("The password is incorrect");
      }
    }

  }
})

Template.login.onCreated(function(){
  if(Session.get("hive_user")){
    Router.go("/chats");
    return;
  }
})