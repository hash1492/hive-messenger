Template.register.events({
  // Register user
  "submit #registration-form": function(event, template) {
    event.preventDefault();

    // User object
    var user = {};
    user.name = event.target.name.value;
    user.email = event.target.email.value;
    user.password = event.target.password.value;
    user.confirm_password = event.target.confirm_password.value;

    // Validations
    if(user.name.length === 0){
      toastr.error("Name is required");
      return;
    }
    if(user.email.length === 0){
      toastr.error("Email is required");
      return;
    }
    if(user.password.length < 6){
      toastr.error("Password must be 6 minimum characters");
      return;
    }
    if(user.password !== user.confirm_password){
      toastr.clear();
      toastr.error("Passwords don't match");
      return;
    }
    delete user.confirm_password;

    // Check if user already exists
    var temp_user = Users.findOne({email: user.email})
    if(temp_user){
      toastr.error("User with this email already exists");
      return;
    }

    // Create User
    var created_user = Users.insert(user);

    // Add the user to global chat
    var global_chat = Chats.findOne({type: 2});
    global_chat.users.push({_id: created_user, name: user.name});
    Chats.update({_id: global_chat._id},global_chat)

    toastr.clear();
    toastr.success("Registered successfully");

    Router.go('/login');
  }
})


Template.register.onCreated(function(){
  if(Session.get("hive_user")){
    Router.go("/dashboard");
    return;
  }
})
