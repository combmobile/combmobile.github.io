var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.initialize = function(userId) {

  var mapCollection = new Comb.Collections.MapCollection();

  mapCollection.fetch({ data: { id: userId }, dataType: "jsonp", success: function(){
    _.each(mapCollection.models, function(model){
    })

  }});

    var mapListView = new Comb.Views.MapListView({
      collection: mapCollection,
      el: $('.map_list_ul')
      // el: this.elFunction();
      // el: elFunction();
    });

  var pinCollection = new Comb.Collections.PinCollection();

  pinCollection.fetch({dataType: "jsonp", success: function(){
  }});

  pinListView = new Comb.Views.PinListView({
    collection: pinCollection,
    el: $('.main-pin-list-ul')
  });

  return {
    mapCollection: mapCollection,
    mapListView: mapListView,
    pinCollection : pinCollection,
    pinListView : pinListView
  }

}

  var Router = Backbone.Router.extend({
    routes:{
      '' : 'home',
      'sign_up' : 'sign_up',
      'main': 'main',
      'maps': 'maps',
      'create_map': 'create_map'
    }
  });



  function AppController(){
    this.showView = function (view){
      if (this.currentView){
        this.currentView.close();
      }
      this.currentView = view;
      if(this.currentView.elFunction){
        $('.map_list_ul').html(this.currentView.el);
        this.currentView.elFunction();
      } else {
        $('.main').html(this.currentView.el);
        this.currentView.render();
      }
    }
  }


// var combInitializedData;

$(function() {
  // This will make the initialize available as a variable within the document ready. You can then access all of the initialized attributes.
  var combInitializedData;
  var responseUserId;
  var currentPosition;


  appController = new AppController();



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
      $.ajax({
        url:'/sessions',
        type:'POST',
        dataType:"jsonp",
        data: userCredentials,
        success:function (data) {
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
      $.ajax({
        url:'/users',
        type:'POST',
        dataType:"jsonp",
        data: {"user": newUserCredentials},
        success:function (data) {
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
      'submit .map_create_form' : 'newMap'
    },
    newMap: function(ev){
      var mapInput = $(ev.currentTarget).serializeObject();
      $(ev.currentTarget).val('');
      var mapName = mapInput.map_name;
      var Map = new Comb.Models.Map({
      // var Map = ({
        name: mapName,
        creator_id: responseUserId,
        user_id: responseUserId,
        map_lat:'',
        map_long:'',
        pins:''
      });

      mapCreateView = new Comb.Views.MapView({
        el: $('#map-canvas')[0],
        model: Map
      });

      navigator.geolocation.getCurrentPosition(function(position) {

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        combInitializedData.mapCollection.create( {name: mapName, creator_id: responseUserId, user_id: responseUserId, map_lat: latitude, map_long: longitude, id: undefined});

      });

      router.navigate('maps', {trigger: true});
      $('.map_list_ul').empty();
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
    var logIn = new logInView();
    logIn.render();
    $(".bottom-nav").hide();
  });

  router.on('route:sign_up', function() {
    var signUp = new signUpView();
    signUp.render();
    $(".bottom-nav").hide();
  });

  router.on('route:main', function() {
    var mainPage = new mainPageView();
    mainPage.render();
    $(".bottom-nav").show();
  });

  router.on('route:maps', function() {
    $('.map_list_ul').empty();
    $('body').css("background","white");
    $(".main").empty();
    $(".main").html("<ul class='map_list_ul welcome-block'></ul>");
    $(".bottom-nav").show();
    $( ".logo" ).hide();
    $( ".back" ).show();
    //appController.showView(combInitializedData.mapListView);
    combInitializedData.mapListView.elFunction();
  });


  router.on('route:create_map', function() {
    $('body').css("background","#bdc3c7");
    var createMap = new createMapView();
    createMap.render();
    $(".bottom-nav").show();
  });

  // Click Listeners //

  $(".back").on( "click", function() {
      $( ".back" ).hide();
      $( ".logo" ).show();
      $(".map-pin-list-button").off();
      $(".map-pin-list-button").addClass("pin-list-button")
      $(".pin-list-button").removeClass( "map-pin-list-button" );
      $(".pin-list-button").on( "click", function() {
        combInitializedData.pinListView.render();
        $(".main-pin-list").css("display", "block");
        $(".main-pin-list-close-button").on("click", function(){
        $(".main-pin-list").css("display", "none");
        });
      });
    });
    $(".create-map").on( "click", function() {
      $( ".back" ).hide();
      $( ".logo" ).show();
    });
    $(".map-list").on( "click", function() {
      $('.welcome-block').css("background","#FFF");
      $( ".back" ).show();
      $( ".logo" ).hide();
      $(".main").empty();
      $(".main").html("<ul class='map_list_ul welcome-block'></ul>");
      combInitializedData.mapListView.elFunction();
      $(".bottom-nav").show();
      $(".pin-list-button").off();
      $(".pin-list-button").addClass( "map-pin-list-button" );
      $(".map-pin-list-button").removeClass("pin-list-button")
      $(".map-pin-list-button").on( "click", function() {
       });
    });
    $(".pin-list-button").on( "click", function() {
      combInitializedData.pinListView.render();
      $(".main-pin-list").css("display", "block");
        $(".main-pin-list-close-button").on("click", function(){
        $(".main-pin-list").css("display", "none");
        });
    });

  Backbone.history.start();
});

