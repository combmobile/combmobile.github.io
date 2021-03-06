var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.MapView = Backbone.View.extend({
    initialize: function(){

  },
  tagName: "li",
  template: _.template( $("#singleMapItemTemplate").html() ),
  singleMapTemplate: _.template( $("#singleMapTemplate").html() ),
  singlePinTemplate: _.template( $(".singlePinItemTemplate").html() ),
    events: {
      "click .map_name" : "displayMapView",
      // "click .edit_map_name" : "editMapName",
      "click [data-action='destroy']": "removeMap"
    },
  removeMap: function(e){
      console.log("dis works");
      $('.map_list_ul').empty();
      e.preventDefault();

      currentCollection = this.model.collection;
      currentCollection.remove(this.model.id);
      this.model.destroy({ silent: true });
      return this
  },
  renderMapList: function(){
      this.$el.html( this.template(this.model.attributes) );
      return this
    },
  renderPinList: function(){
    $.each(this.model.attributes.pins, function(i, pin){
      var el = $(".pin-list-ul");
      el.append( pin.name );
    });
  },
  mapStyles: function(){
    var mapStyles = [
        {
          "featureType": "landscape.man_made",
          "stylers": [
            { "color": "#FAEBD1" },
            { "visibility": "on" }
          ]
        },{
          "featureType": "landscape.natural.landcover",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#BEB087" },
            { "weight": 0.1 },
            { "visibility": "on" }
          ]
        },{
          "featureType": "water",
          "stylers": [
            { "color": "#76BBCA" }
          ]
        },{
          "featureType": "road.highway",
          "stylers": [
            { "color": "#ff8080" }
          ]
        },{
          "featureType": "road.arterial",
          "stylers": [
            { "color": "#E9BA80" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "labels.icon",
          "stylers": [
            { "color": "#803535" }
          ]
        },{
          "featureType": "transit.line",
          "stylers": [
            { "color": "#EEECE0" }
          ]
        },{
          "featureType": "transit.station.airport",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#B13235" }
          ]
        },{
          "featureType": "administrative.neighborhood",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#B13235" }
          ]
        },{
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#726049" }
          ]
        },{
          "featureType": "road.highway.controlled_access",
          "stylers": [
            { "color": "#C3B39E" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "labels.icon",
          "stylers": [
            { "color": "#DCCCB7" }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#BA3B35" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            { "color": "#BA3B35" }
          ]
        },{
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#A4B69F" }
          ]
        },{
          "featureType": "poi.attraction",
          "stylers": [
            { "color": "#A4B69F" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            { "color": "#808080" }
          ]
        },{
          "featureType": "poi.attraction",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "color": "#6D8C8D" },
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "hue": "#00ff09" },
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "poi.business",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ];
      return mapStyles
  },
  displayMapView: function(){
    var self = this;
    $('.main').empty();
    var canvas = $(".main");
    canvas.html( this.singleMapTemplate( this.model.attributes ) );
    var lat = parseFloat(this.model.attributes.map_lat);
    var lng = parseFloat(this.model.attributes.map_long);
    var latlng = new google.maps.LatLng(lat, lng);
    var pins = this.model.attributes.pins;
    var model = this.model;

    $(".map-pin-list-button").on("click", function(){
      var el = $(".pin-list-ul");
      el.empty();
      _.each(pins, function(pin){
        var pinLat = pin.pin_lat;
        var pinLong = pin.pin_long;
        var pinPoint = new google.maps.LatLng(pinLat, pinLong);

        // The following establishes the distance between the pins and the centerpoint of the current map, with the unit set as miles (the 3963 float is the earth's equatorial radius).
        var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, pinPoint, 3963.1905919);
        var rounded = +distance.toFixed(2);
        el.append( "<h3>"+pin.name+"</h3>"+"<h4>"+pin.description+"</h4>"+"<p>Distance from current location: "+" "+rounded+" miles</p>");
      });
        $(".map-pin-list").css("display", "block");
    });

    $(".map-pin-list-close").on("click", function(){
      $(".map-pin-list").css("display", "none");
    });

    var mapOptions = {
      zoom: 10,
      center: latlng,
      styles: this.mapStyles(),
      mapTypeControl: false,
      panControl: true,
      panControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_CENTER
      }
    };

    var map = new google.maps.Map($(".map_display_canvas")[0], mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {
      //Edit form to be displayed with new marker
      var EditForm = '<p><div class="marker-edit">'+
      '<form action="submit" method="POST" name="SaveMarker" id="SaveMarker">'+
      '<label for="pName"><span>Place Name :</span><input type="text" name="pName" class="save-name" placeholder="Enter Title" maxlength="40" /></label>'+
      '<label for="pDesc"><span>Description :</span><textarea name="pDesc" class="save-desc" placeholder="Enter Address" maxlength="150"></textarea></label>'+
      '</form>'+
      '</p><button name="save-marker" class="save-marker">Save Marker Details</button>'+
        '</span><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>'+
      '</div>';

      create_marker(event.latLng, 'New Marker', EditForm, true, true, true, model);
      map.panTo(event.latLng);
    });

  //*** Remove Marker Function ***
  function remove_marker(Marker, ib) {

      /* determine whether marker is draggable
      new markers are draggable and saved markers are fixed */

          // Marker.destroy();
          Marker.setMap(null); //just remove new marker
          window.setTimeout(infoBoxClose, 1);
          function infoBoxClose() {ib.close();}

      // }
      // else
      // {
      // //     //Remove saved marker from DB and map using jQuery Ajax
      // //     var mLatLang = Marker.getPosition().toUrlValue(); //get marker position
      // //     console.log("removew marker else called (Pin.destroy)");
      // //     // The below backbone code will ultimately remove the pin from the database
      // //     Marker.destroy();
      // //     // Pin.destroy();
      // //     // var myData = {del : 'true', latlang : mLatLang}; //post variables
      // //     // $.ajax({
      // //     //   type: "POST",
      // //     //   url: "map_process",
      // //     //   data: myData,
      // //     //   success:function(data){
      // //     //         Marker.setMap(null);
      // //     //         alert(data);
      // //     //     },
      // //     //     error:function (xhr, ajaxOptions, thrownError){
      // //     //         alert(thrownError); //throw any errors
      // //     //     }
      // //     // });
      // }
  }

  // Save Marker Function
  function save_marker(Marker, mName, mAddress, mReplace, model, ib) {
      var ib = ib;
      var mLatLang = Marker.getPosition().toUrlValue(); //get marker position
      var lat = Marker.position.lat();
      var lng = Marker.position.lng();
      var myData = {name : mName, description : mAddress, photo_url : '', pin_lat : lat, pin_long : lng, map_id : model.id}; //post variables
      var pinModel = new Comb.Models.Pin();
      var pinData;
      pinModel.save({
            name : mName, description : mAddress, photo_url : '', pin_lat : lat, pin_long : lng, map_id : model.id},
         {
          success: function(data) {

            console.log("pinmodel create data", data)
            pinData = data;
            var newContentString = $(
            '<h2 class="marker-heading">'+pinData.attributes.name+'</h2>'+
            '<p class="marker-description">'+pinData.attributes.description+'</p></div>'+
            '<button data-id='+pinData.attributes.id+'name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>'
            );
            mReplace.html(newContentString);
            var otherRemoveBtn = $('button.remove-marker')[0];
            google.maps.event.addDomListener(otherRemoveBtn, "click", function(event) {
            remove_marker(marker, ib);
            // this.model.attributes.pins[0].push([data]);

            });
          }
          });
      Marker.setDraggable(false);//set marker to fixed)

  }

function drop_marker(MapPos, MapTitle, MapDesc, InfoOpenDefault, DragAble, Removable, model) {
    //new marker
    marker = new google.maps.Marker({
        position: MapPos,
        map: map,
        draggable:DragAble,
        animation: google.maps.Animation.DROP,
        title: MapTitle,
        icon: new google.maps.MarkerImage('images/teal_icon.svg',
        null, null, null, new google.maps.Size(64,64))
    });

    //Content structure of info Window for the Markers
    var contentString = $('<div class="marker-info-win">'+
    '<div class="marker-inner-win"><span class="info-content">'+
    '<h2 class="marker-heading">'+MapTitle+'</h2>'+
    MapDesc+'</div></div><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>');

    // The following controls the css for the contentString. Investigate integrating this into styles.css
    // boxText.style.cssText = "width: 300px; height: 200px; border: 5px solid RGBA(30, 187, 166, .5); border-radius: 20px; margin-top: 8px; background: RGBA(255, 255, 255, 1); color: RGBA(30, 187, 166, 1); font-family: 'apercuregular'; padding: 0;";
  var myOptions = {
    disableAutoPan: false
    ,maxWidth: 0
    ,pixelOffset: new google.maps.Size(-140, 0)
    ,zIndex: null
    ,boxStyle: {
      background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat"
      // The following opacity setting controls the background box opacity
      ,opacity: 1
      ,width: "290px"
     }
    ,closeBoxMargin: "10px 2px 2px 2px"
    ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
    ,infoBoxClearance: new google.maps.Size(1, 1)
    ,isHidden: false
    ,pane: "floatPane"
    ,enableEventPropagation: false
  };

    //add click listner to save marker button
    google.maps.event.addListener(marker, 'click', function() {
     self = this;
     var ib = new InfoBox(myOptions);
     ib.setContent(contentString[0]);
     ib.open(map, this);
     map.panTo(this.getPosition());
    });

  }


      //Create Marker Function
function create_marker(MapPos, MapTitle, MapDesc, InfoOpenDefault, DragAble, Removable, model) {
    //new marker
    var marker = new google.maps.Marker({
        position: MapPos,
        map: map,
        draggable:DragAble,
        animation: google.maps.Animation.DROP,
        title: MapTitle,
        icon: new google.maps.MarkerImage('images/teal_icon.svg',
        null, null, null, new google.maps.Size(64,64))
    });

    //Content structure of info Window for the Markers
    var contentString = $('<div class="marker-info-win">'+
    '<div class="marker-inner-win"><span class="info-content">'+
    '<h2 class="marker-heading">'+MapTitle+'</h2>'+
    MapDesc+'</div></div>');

    // var boxText = document.createElement('div');
    // The following controls the css for the contentString. Investigate integrating this into styles.css
    // boxText.style.cssText = "width: 300px; height: 200px; border: 5px solid RGBA(30, 187, 166, .5); border-radius: 20px; margin-top: 8px; background: RGBA(255, 255, 255, 1); color: RGBA(30, 187, 166, 1); font-family: 'apercuregular'; padding: 0;";
    // boxText.innerHTML = contentString;
    var myOptions = {
      disableAutoPan: false
      ,maxWidth: 0
      ,pixelOffset: new google.maps.Size(-140, 0)
      ,zIndex: null
      ,boxStyle: {
        background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat"
        // The following opacity setting controls the background box opacity
        ,opacity: 1
        ,width: "290px"
       }
      ,closeBoxMargin: "10px 2px 2px 2px"
      ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
      ,infoBoxClearance: new google.maps.Size(1, 1)
      ,isHidden: false
      ,pane: "floatPane"
      ,enableEventPropagation: false
    };

    var ib = new InfoBox(myOptions);
    // ib.open(map, marker);

    ib.setContent(contentString[0]);

   //add click listner to save marker button
    google.maps.event.addListener(marker, 'click', function() {
             ib.open(map, marker);
             // Uncomment below to make the infowindow work again:
            // infowindow.open(map,marker); // click on marker opens info window
            map.panTo(marker.getPosition());
    });

    if(InfoOpenDefault) //whether info window should be open by default
    {
        ib.open(map, marker);
             // Uncomment below to make the infowindow work again:
      // infowindow.open(map,marker);
    }

    //Find remove button in infoBox
    var removeBtn = contentString.find('button.remove-marker')[0];

    //Find save button in infoBox
    var saveBtn = contentString.find('button.save-marker')[0];

    // add click listner to remove marker button
    google.maps.event.addDomListener(removeBtn, "click", function(event) {
        //call remove_marker function to remove the marker from the map\
        // ib.close();
        remove_marker(marker, ib);
        // Will toggle the visibility of the infobox, but it'll still be on the page. Still working on getting the thing to close with Google's in-built .close(); function.
        // marker.ib.setMap(null);
        // $(".marker-info-win").css({"display":"none"});
    });

    if(typeof saveBtn !== 'undefined') //continue only when save button is present
    {
        //add click listner to save marker button
        google.maps.event.addDomListener(saveBtn, "click", function(event) {
          console.log("save button working");
            var mReplace = contentString.find('span.info-content'); //html to be replaced after success
            var mName = contentString.find('input.save-name')[0].value; //name input field value
            var mDesc  = contentString.find('textarea.save-desc')[0].value; //description input field value


            if(mName =='' || mDesc =='')
            {
                alert("Please enter Name and Description!");
            }else{
                //call save_marker function and save the marker details
                save_marker(marker, mName, mDesc, mReplace, model, ib);
            }
            });
        }
    }
    for (var i = 0; i < pins.length; i++) {
      var name = pins[i].name;
      var address = '<p>'+ pins[i].description +'</p>';
      var pinLat = parseFloat(pins[i].pin_lat);
      var pinLong = parseFloat(pins[i].pin_long);
      var point = new google.maps.LatLng(pinLat, pinLong);
      drop_marker(point, name, address, false, false, false, model);
    };

  },

  renderCurrentLocation: function() {
    var self = this;

    var mapOptions = {
    zoom: 10,
    styles: this.mapStyles(),
    disableDefaultUI: true
    };

    var map = new google.maps.Map(this.el, mapOptions);

  // Try HTML5 geolocation
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
    });


    return this;

  },

  createMap: function(currentCollection) {
    var self = this;

    var mapDetails = { name: this.model.attributes.name, creator_id: this.model.attributes.user_id, user_id: this.model.attributes.user_id, map_lat: '', map_long: '' };

  // Try HTML5 geolocation

    navigator.geolocation.getCurrentPosition(function(position) {

      mapDetails['map_lat'] = position.coords.latitude;
      mapDetails['map_long'] = position.coords.longitude;
      $.ajax({
        url:'/maps',
        type:'POST',
        dataType:"jsonp",
        data: {"map": mapDetails}
      });

    });

    return this;

  }

});

