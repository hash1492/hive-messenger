Template.chats.helpers({
  chats: function() {
    var chats = Chats.find({users: {$elemMatch: { _id: Session.get("hive_user")._id }}}).fetch();
    console.log(chats);
    return chats;
  },

  chat_box_name: function(chat) {
    console.log(chat);
    // If direct chat, show other user's name
    if(chat.type == 1){
      chat.users.forEach(function(user) {
        if(user._id !== Session.get("hive_user")._id){
          console.log(user.name);
          chat_box_name = user.name
        }
      })
    }
    if(chat.type == 2){
      chat_box_name = "Hive Global Room"
    }
    return chat_box_name;
  },

  show_chat: function(chat) {
    if(chat.type == 2){
      return true;
    }
    if(chat.messages.length > 0){
      return true;
    }
    else{
      false;
    }
  }
});

Template.chats.events({
  "click .row": function(event, template) {
    console.log(this);
    Router.go('/chat-messages/' + this._id);
  },

  "keyup #search": function(event, template) {
    console.log(event.target.value);
    var search_input = event.target.value;
    if(event.target.value){

    }
  },


  "click #create_chat": function(event, template) {
    console.log("create_chat clicked");
  }
});

Template.chats.onCreated(function(){
  if(!Session.get("hive_user")){
    Router.go("/login");
    return;
  }
})
