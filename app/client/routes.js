Router.configure({
  layoutTemplate: 'base'
});
Router.route('/login', function () {
  this.render('login');
});
Router.route('/register', function () {
  this.render('register');
});
// Router.route('/chats', function () {
//   this.render('chats');
// });
// Router.route('/chat-messages/:chat_box_id', function () {
//   this.render('chatMessages');
// });
// Router.route('/users', function () {
//   this.render('users');
// });
Router.route('/dashboard', function () {
  this.render('dashboard');
});
