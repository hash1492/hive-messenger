Template.dashboard.helpers({
  // Is users tab active
  users_tab_active: function() {
    if(Session.get("users_tab_active") === true){
      return true;
    }
  },
  // Is chats tab active
  chats_tab_active: function() {
    if(Session.get("chats_tab_active") === true){
      return true;
    }
  },
  // List of chats
  chats: function() {
    var chats = Chats.find({users: {$elemMatch: { _id: Session.get("hive_user")._id }}}).fetch();
    return chats;
  },
  // Name to show for each chatbox
  chat_box_name: function(chat) {
    // If direct chat, show other user's name
    if(chat.type == 1){
      chat.users.forEach(function(user) {
        if(user._id !== Session.get("hive_user")._id){
          chat_box_name = user.name
        }
      })
    }
    if(chat.type == 2){
      chat_box_name = "Hive Global Room"
    }
    return chat_box_name;
  },
  // Whether to show the chat in the chats list or not
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
  },
  // Messages of currently selected chatbox
  messages: function() {
    Session.set("chat_box_id", Session.get("active_chat_box")._id);
    var chat_box_id = Session.get("chat_box_id");
    var chat = Chats.findOne({_id: chat_box_id});
    if(chat){
      Session.set("current_chat",chat);
      console.log(chat);
      var messages = chat.messages;
      Session.set("messages", messages);
      return messages;
    }
  },
  // Check if the message is of currently loggedin user
  is_my_message: function(message) {
    console.log(message);
    if(message.user._id === Session.get("hive_user")._id){
      return true;
    }
  },
  // Check if the message is of the other user
  is_others_message: function(message) {
    console.log(message);
    if(message.user._id !== Session.get("hive_user")._id){
      return true;
    }
  },
  // last message chat to display as preview
  last_message: function(chat) {
    return chat.messages[chat.messages.length - 1].text;
  },
  // whether to show the messages section or not
  show_messages: function() {
    if(Session.get("active_chat_box")){
      return true;
    }
    else{
      return false;
    }
  },
  show_select_chat_message: function() {
    if(Session.get("active_chat_box")){
      return false;
    }
    else{
      return true;
    }
  },
  is_loggedin_user: function(user_id) {
    return Session.get("hive_user")._id !== user_id;
  },
  // List of hive messenger users
  users: function() {
    var users = Users.find().fetch();
    return users;
  },
});

Template.dashboard.events({
  // Logout the current user
  "click #logout": function(event, template) {
    Session.clear();
    Router.go('/login');
  },
  // Change active tab to chats
  "click #chats_tab": function(event, template) {
    Session.set("chats_tab_active", true);
    Session.set("users_tab_active", false);
  },
  // Change active tab to users
  "click #users_tab": function(event, template) {
    Session.set("users_tab_active", true);
    Session.set("chats_tab_active", false);
  },
  // Select a chatbox to show
  "click #chat_box": function(event, template) {
    Session.set("active_chat_box", this);
    $("#messages-area").scrollTop($("#messages-area")[0].scrollHeight);
  },
  "click #hive_contact": function(event, template) {
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

    // If no direct chat exists with the selected user, create one
    if(!chat){
      var chat_obj = {
        type: 1,
        users: chat_users,
        messages: [],
        created: new Date(),
        created_by: Session.get("hive_user")._id
      }

      var chat_id = Chats.insert(chat_obj);

      var active_chat_obj = Chats.findOne({_id: chat_id})
    }
    // Chat exists
    else{
      var active_chat_obj = chat;
    }
    // Set active chat box
    Session.set("active_chat_box", active_chat_obj);
    $("#messages-area").scrollTop($("#messages-area")[0].scrollHeight);
  },
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
    $("#messages-area").scrollTop($("#messages-area")[0].scrollHeight);
  },
});

Template.dashboard.onCreated(function(){
  Session.set("chats_tab_active", true);
  Session.set("users_tab_active", false);

  if(!Session.get("hive_user")){
    Router.go("/login");
    return;
  }
})
