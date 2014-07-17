var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.initialize = function(userId) {

  // var self = this;
  var mapCollection = new Comb.Collections.MapCollection();

  mapCollection.fetch({ data: { id: userId }, dataType: "jsonp", success: function(){
    console.log("map collection.fetch models", mapCollection.models);
  }});

    var mapListView = new Comb.Views.MapListView({
      collection: mapCollection,
      el: $('.map_list_ul')
      // el: this.elFunction();
      // el: elFunction();
    });

    // mapListView.render();
    return {
      mapCollection: mapCollection,
      mapListView: mapListView
    }
    // return {
    //   mapCollection: mapCollection
    // }

//   var listView = new Comb.Views.MapListView({
//     collection: collection,
//     el: $('.map_list_ul')
//   });

// // $(".new_map_form").on("submit", function(e){
// //   e.preventDefault();
// //   var map_name= $(".new_map_form").find('input').val();
// //   console.log(map_name);

}

// Comb.collectionInitialize = function(userId){


// }

/* SANDBOX DEFAULT CODE */
// var map;
// function initialize() {
//   var mapOptions = {
//     zoom: 8,
//     center: new google.maps.LatLng(-34.397, 150.644)
//   };
//   map = new google.maps.Map(document.getElementById('map-canvas'),
//       mapOptions);
// }



var Router = Backbone.Router.extend({
      routes:{
        '' : 'home',
        'sign_up' : 'sign_up',
        'main': 'main',
        'maps': 'maps',
        'create_map': 'create_map'
      }
    });



// var combInitializedData;

$(function() {
  // This will make the initialize available as a variable within the document ready. You can then access all of the initialized attributes.
  var combInitializedData;
  var responseUserId;
  var currentPosition;

  // function getCoordinates() {

  //   var promise = new core.event.Promise();

  //   navigator.geolocation.getCurrentPosition(function(position) {
  //           currentPosition = position.coords;
  //           console.log("this is position",position.coords);
  //           promise.fulfill(currentPosition);
  //   });

  //   return promise;

  // };


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
          responseUserId = data["user_id"];
          router.navigate('main', {trigger: true});
          combInitializedData = Comb.initialize(responseUserId);
        }
      });
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
      'click .login-link' : 'logInPage',
      'submit .signup-form': 'attemptSignUp',
    },
    logInPage: function(ev){
      router.navigate('home', {trigger: true});
    },
    attemptSignUp: function(ev){
      var newUserCredentials = $(ev.currentTarget).serializeObject();
      console.log(newUserCredentials);
      $.ajax({
        url:'/users',
        type:'POST',
        dataType:"jsonp",
        data: {"user": newUserCredentials},
        success:function (data) {
          console.log(data);
          responseUserId = data["id"];
          router.navigate('main', {trigger: true});
        }
      });
      return false;
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
      mapView = new Comb.Views.MapView({
        el: $('#map-canvas')[0]
      });
      // ATTEMPT TO INTRODUCE PROMISE STATEMENT
      // getCoordinates().then(mapView.renderCurrentLocation(currentPosition));
       mapView.renderCurrentLocation();
      }
  });

  /// Create Map view ///

  var createMapView = Backbone.View.extend({
    el: '.main',
    render: function(){
      this.$el.empty();
      var template = _.template($('#map_create_template').html());
      this.$el.append(template);
      },
    events: {
      'submit .map_create_form' : 'createMap'
    },
    createMap: function(ev){
      var mapInput = $(ev.currentTarget).serializeObject();
      var mapName = mapInput.map_name;
      console.log("createMap name:", mapName);
      var Map = new Comb.Models.Map({
      // var Map = ({
        name: mapName,
        creator_id: responseUserId,
        user_id: responseUserId,
        map_lat:'',
        map_long:'',
        pins:''
      });
      console.log("map data", Map);

      mapCreateView = new Comb.Views.MapView({
        el: $('#map-canvas')[0],
        model: Map
        // user_id: combInitializedData.mapCollection.models[0].attributes.user_id,
        // map_name: mapName
      });

      mapCreateView.createMap(combInitializedData.mapCollection);
      return false;
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
    $(".bottom-nav").hide();
  });

  router.on('route:sign_up', function() {
    console.log("you are at sign up!");
    var signUp = new signUpView();
    signUp.render();
    $(".bottom-nav").hide();
  });

  router.on('route:main', function() {
    console.log("you are at the main page");
    var mainPage = new mainPageView();
    mainPage.render();
    console.log('fucking work');
    $(".bottom-nav").show();
  });

  router.on('route:maps', function() {
    console.log("you are on maps");
    $(".main").empty();
    $(".main").html("<ul class='map_list_ul welcome-block'></ul>");
    combInitializedData.mapListView.elFunction();
    $(".bottom-nav").show();
    $( ".logo" ).hide();
    $( ".back" ).show();
  });

  router.on('route:create_map', function() {
    console.log("you are on maps create");
    var createMap = new createMapView();
    createMap.render();
    $(".bottom-nav").show();
  });

  // Click Listeners //

  $(".back").on( "click", function() {
      $( ".back" ).hide();
      $( ".logo" ).show();
    });
    $(".create-map").on( "click", function() {
      $( ".back" ).hide();
      $( ".logo" ).show();
    });
    $(".map-list").on( "click", function() {
      $( ".back" ).show();
      $( ".logo" ).hide();
    });

  Backbone.history.start();
});

