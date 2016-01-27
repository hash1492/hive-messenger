Template.chatMessages.helpers({
  messages: function() {
    Session.set("chat_box_id", Router.current().params.chat_box_id);
    var chat_box_id = Session.get("chat_box_id");
    var chat = Chats.findOne({_id: chat_box_id});
    if(chat){
      Session.set("current_chat",chat);
      console.log(chat);
      var messages = chat.messages;
      Session.set("messages", messages);
      return messages;
    }
    else{
      Router.go('/chats');
    }
  }
})

Template.chatMessages.events({
  "submit #sendMessage": function(event,template) {
    event.preventDefault();

    // Message object
    var message = {};
    message.text = event.target.message.value;
    message.created = new Date();
    message.user = {};
    message.user._id = Session.get("hive_user")._id;
    message.user.name = Session.get("hive_user").name;

    // Update messages session variable
    var chat = Session.get("current_chat");
    chat.messages.push(message);
    Session.set("current_chat",chat);

    // Update DB
    var chat = Chats.update({_id: Session.get("chat_box_id")}, Session.get("current_chat"));
    event.target.message.value = "";
  },
  // Logout the current user
  "click #logout": function(event, template) {
    console.log("logout called");
    Session.clear();
    Router.go('/login');
  }
})

Template.chatMessages.onCreated(function(){
  console.log("chatMessages called");
  if(!Session.get("hive_user")){
    Router.go("/login");
    return;
  }
})
