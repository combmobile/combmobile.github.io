var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

// Haystack.initialize = function() {
//   var collection = new Haystack.Collections.MapCollection();

//   collection.fetch({success: function(){
//     console.log(collection.models[0].attributes.pins[0]);
//   }})

//   var listView = new Haystack.Views.MapListView({
//     collection: collection,
//     el: $('.map_list_ul')
//   });

// $(".new_map_form").on("submit", function(e){
//   e.preventDefault();
//   var map_name= $(".new_map_form").find('input').val();
//   console.log(map_name);
//   map_view = new Haystack.Views.MapView({
//       el: $('#map-canvas')[0],
//       new_map_name: map_name
//   });
//     map_view.renderCurrentLocation(map_name);
//     $(".new_map_form").find('input').val("");
//   });

// }



var Router = Backbone.Router.extend({
      routes:{
        '' : 'home',
        'sign_up' : 'sign_up',
        'main': 'main'
      }
    });

$(function() {

  $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.url = 'https://serene-dawn-6520.herokuapp.com' + options.url;
  });

  /// Login view ///

  var logInView = Backbone.View.extend({
    el: '.main',
    render: function(){
      this.$el.empty();
      var template = _.template($('#logInTemplate').html());
      this.$el.append(template);
    },
    events: {
      'submit .login-form': 'attemptLogin',
      'click .signup-link' : 'signUpPage'
    },
    attemptLogin: function(ev){
      var userCredentials = $(ev.currentTarget).serializeObject();
      console.log(userCredentials);
      $.ajax({
        url:'/sessions',
        type:'POST',
        dataType:"jsonp",
        data: userCredentials,
        success:function (data) {
          console.log(data);
          console.log("yay");
          router.navigate('main', {trigger: true});
        }
      });
      // console.log(userCredentials);
      return false;
    },
    signUpPage: function(ev){
      router.navigate('sign_up', {trigger: true});
    }
  });

  /// Sign Up View ///
  var signUpView = Backbone.View.extend({
    el: '.main',
    render: function(){
      this.$el.empty();
      var template = _.template($('#signUpTemplate').html());
      this.$el.append(template);
    },
    events: {
      'click .login-link' : 'logInPage'
    },
    logInPage: function(ev){
      router.navigate('home', {trigger: true});
    }
  })

  /// Main Page view ///

  var mainPageView = Backbone.View.extend({
    el: '.main',
    render: function(){
      this.$el.empty();
      // mapView = new Comb.Views.MapView({
      //   el: $('.map-canvas')[0]
      // });
      var template = _.template($('#mapTemplate').html());
      this.$el.append(template);
    },
    events: {
      'submit .login-form': 'attemptLogin',
      'click .signup-link' : 'signUpPage'
    },
    attemptLogin: function(ev){
      var userCredentials = $(ev.currentTarget).serializeObject();
      console.log(userCredentials);
      $.ajax({
        url:'/sessions',
        type:'POST',
        dataType:"jsonp",
        data: userCredentials,
        success:function (data) {
          console.log(data);
          console.log("yay");
          router.navigate('main', {trigger: true});
        }
      });
      // console.log(userCredentials);
      return false;
    },
    signUpPage: function(ev){
      router.navigate('sign_up', {trigger: true});
    }
  });


  /// Serialize Object ///

  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
  };

  /// Router ///
  var router = new Router();

  router.on('route:home', function() {
    console.log("you are home!");
    var logIn = new logInView();
    logIn.render();
  });

  router.on('route:sign_up', function() {
    console.log("you are at sign up!");
    var signUp = new signUpView();
    signUp.render();
  });

  router.on('route:main', function() {
    console.log("you are at the main page");
    var mainPage = new mainPageView();
    mainPage.render();
  });

  Backbone.history.start();
});
