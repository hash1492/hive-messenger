Template.body.events({
  // Logout the current user
  "click #logout": function(event, template) {
    console.log("logout called");
    Session.clear();
    Router.go('/login');
  }
})

// // Global hive_user object
// Template.body.helpers({
//   "hive_user": function() {
//     return Session.get("hive_user");
//   }
// })

Handlebars.registerHelper('hive_user', function (){
    return Session.get("hive_user");
});
