Template.users.helpers({
  // List of hive messenger users
  users: function() {
    var users = Users.find().fetch();
    console.log(users);
    return users;
  },

  is_loggedin_user: function(user_id) {
    return Session.get("hive_user")._id !== user_id;
  }
});

Template.users.events({
  "click #hive_contact": function(event, template) {
    console.log(this);

    var chat_users = [];
    var user1 = {
      _id: this._id,
      name: this.name
    }
    chat_users.push(user1);

    var user2 = {
      _id: Session.get("hive_user")._id,
      name: Session.get("hive_user").name
    }
    chat_users.push(user2);

    // Create/ Open direct chat between you and the selected user
    var chat = Chats.findOne({type: 1, users: {$elemMatch: { _id: user1._id  && user2._id }}});

    console.log(chat);
    // If no direct chat exists with the selected user, create one
    if(!chat){
      console.log("new chat");
      var chat_obj = {
        type: 1,
        users: chat_users,
        messages: [],
        created: new Date(),
        created_by: Session.get("hive_user")._id
      }

      var chat_id = Chats.insert(chat_obj);
    }
    // Chat exists
    else{
      console.log("existing chat");
      var chat_id = chat._id;
    }
    // Go to chat box
    Router.go("/chat-messages/" + chat_id);
  }
});

Template.users.onCreated(function(){
  if(!Session.get("hive_user")){
    Router.go("/login");
    return;
  }
})
