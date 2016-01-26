Meteor.startup(function () {

    console.log("meteor startup");
    if (Chats.find({type: 2}).count() === 0) {
      console.log("global_chat missing");
      var global_chat = {
        type: 2,
        users: [],
        messages: [],
        created: new Date()
      }
      var chat = Chats.insert(global_chat);
      console.log(chat);
    }
});
