var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.MapView = Backbone.View.extend({
    initialize: function(){

  },
  tagName: "li",
  template: _.template( $("#singleMapItemTemplate").html() ),
  singleMapTemplate: _.template( $("#singleMapTemplate").html() ),
    events: {
      "click .map_name" : "displayMapView",
      // "click .edit_map_name" : "editMapName",
      "click [data-action='destroy']": "removeMap"
    },
  removeMap: function(e){
      console.log("dis works");
      e.preventDefault();
      this.model.destroy();
      return this
  },
  renderMapList: function(){
      this.$el.html( this.template(this.model.attributes) );
      return this
    },
  displayMapView: function(){
    var self = this;
    $('.main').empty();
    var canvas = $(".main");
    canvas.html( this.singleMapTemplate( this.model.attributes ) );
    var lat = parseFloat(this.model.attributes.map_lat);
    var lng = parseFloat(this.model.attributes.map_long);
    var latlng = new google.maps.LatLng(lat, lng);
     console.log("these are the coordinates", latlng);

//     var mapStyles = [
//     {
//         "featureType": "landscape.natural",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#05B2D2"
//             }
//         ]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#05B2D2"
//             }
//         ]
//     },
//     {
//         "featureType": "landscape.man_made",
//         "elementType": "geometry.fill"
//     },
//     {
//         "featureType": "road",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "lightness": 100
//             },
//             {
//                 "visibility": "simplified"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "labels",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "water",
//         "stylers": [
//             {
//                 "color": "#7ABDCC"
//             }
//         ]
//     },
//     {
//         "featureType": "transit.line",
//         "elementType": "geometry",
//         "stylers": [
//                      {
//                 "color": "#958378"
//             },
//             {
//                 "hue": "#eeff00"
//             },
//             {
//                 "lightness": 100
//             },
//             {
//                 "weight": 1.5
//             }
//         ]
//     }
// ];
    var mapOptions = {
      zoom: 10,
      center: latlng,
      disableDefaultUI: true
    };
    var map = new google.maps.Map($(".map_display_canvas")[0], mapOptions);


      google.maps.event.addListener(map, 'click', function(event) {
    /// DROP ZONE ///

            //Edit form to be displayed with new marker

            var EditForm = '<p><div class="marker-edit">'+
            '<form action="ajax-save.php" method="POST" name="SaveMarker" id="SaveMarker">'+
            '<label for="pName"><span>Place Name :</span><input type="text" name="pName" class="save-name" placeholder="Enter Title" maxlength="40" /></label>'+
            '<label for="pDesc"><span>Description :</span><textarea name="pDesc" class="save-desc" placeholder="Enter Address" maxlength="150"></textarea></label>'+
            '</form>'+
            '</div></p><button name="save-marker" class="save-marker">Save Marker Details</button>';

            //call create_marker() function
            create_marker(event.latLng, 'New Marker', EditForm, true, true, true);
        });

//############### Remove Marker Function ##############
function remove_marker(Marker)
{

    /* determine whether marker is draggable
    new markers are draggable and saved markers are fixed */
    if(Marker.getDraggable())
    {
        // Marker.destroy();
        Marker.setMap(null); //just remove new marker
        console.log(Marker);

    }
    else
    {
        //Remove saved marker from DB and map using jQuery Ajax
        var mLatLang = Marker.getPosition().toUrlValue(); //get marker position
        console.log("removew marker else called");
        Marker.destroy();
        // var myData = {del : 'true', latlang : mLatLang}; //post variables
        // $.ajax({
        //   type: "POST",
        //   url: "map_process.php",
        //   data: myData,
        //   success:function(data){
        //         Marker.setMap(null);
        //         alert(data);
        //     },
        //     error:function (xhr, ajaxOptions, thrownError){
        //         alert(thrownError); //throw any errors
        //     }
        // });
    }
}

//############### Save Marker Function ##############
function save_marker(Marker, mName, mAddress, mReplace)
{
    //Save new marker using jQuery Ajax
    var mLatLang = Marker.getPosition().toUrlValue(); //get marker position
    // var myData = {name : mName, latlang : mLatLang, type : mType }; //post variables
    console.log(Marker.position.lat());
    console.log(mReplace);
    var lat = Marker.position.lat();
    var lng = Marker.position.lng();
    var mapId = map;
    console.log("this is the map", this.model.attributes.id);
    var myData = {name : mName, address : mAddress, pin_lat : lat, pin_long : lng, map_id : mapId}; //post variables
    console.log("this is myData in save_marker", myData);
    var pinModel = new Haystack.Models.Pin();
    pinModel.save(myData)
    newContentString = $(
      '<h1>'+myData.name+'</h1>'
      );
    mReplace.html(newContentString); //replace info window with new html
      // Marker.setDraggable(false) );//set marker to fixed)
    // $.ajax({
    //   type: "POST",
    //   url: "map_process.php",
    //   data: myData,
    //   success:function(data){
    //         replaceWin.html(data); //replace info window with new html
    //         Marker.setDraggable(false); //set marker to fixed
    //         // Marker.setIcon('http://PATH-TO-YOUR-WEBSITE-ICON/icons/pin_blue.png'); //replace icon
    //     },
    //     error:function (xhr, ajaxOptions, thrownError){
    //         alert(thrownError); //throw any errors
    //     }
    // });
}

      //############### Create Marker Function ##############
function create_marker(MapPos, MapTitle, MapDesc, InfoOpenDefault, DragAble, Removable)
{
    //new marker
    var marker = new google.maps.Marker({
        position: MapPos,
        map: map,
        draggable:DragAble,
        animation: google.maps.Animation.DROP,
        title:"Hello World!",
        icon: new google.maps.MarkerImage('images/teal_icon.svg',
        null, null, null, new google.maps.Size(64,64))
    });


    //Content structure of info Window for the Markers
    var contentString = $('<div class="marker-info-win">'+
    '<div class="marker-inner-win"><span class="info-content">'+
    '<h1 class="marker-heading">'+MapTitle+'</h1>'+
    MapDesc+
    '</span><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>'+
    '</div></div>');


    //Create an infoWindow
    var infowindow = new google.maps.InfoWindow();
    //set the content of infoWindow
    infowindow.setContent(contentString[0]);

    //Find remove button in infoWindow
    var removeBtn = contentString.find('button.remove-marker')[0];
    console.log(removeBtn);

   //Find save button in infoWindow
    var saveBtn = contentString.find('button.save-marker')[0];

    // add click listner to remove marker button
    google.maps.event.addDomListener(removeBtn, "click", function(event) {
        //call remove_marker function to remove the marker from the map\
        console.log("working");
        console.log("remove button click marker, this", this);
        remove_marker(marker);
    });

    if(typeof saveBtn !== 'undefined') //continue only when save button is present
    {
        //add click listner to save marker button
        google.maps.event.addDomListener(saveBtn, "click", function(event) {
            var mReplace = contentString.find('span.info-content'); //html to be replaced after success
            var mName = contentString.find('input.save-name')[0].value; //name input field value
            var mDesc  = contentString.find('textarea.save-desc')[0].value; //description input field value

            if(mName =='' || mDesc =='')
            {
                alert("Please enter Name and Description!");
            }else{
                //call save_marker function and save the marker details
                save_marker(marker, mName, mDesc, mReplace);
            }
        });
    }

    //add click listner to save marker button
    google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker); // click on marker opens info window
    });

    if(InfoOpenDefault) //whether info window should be open by default
    {
      infowindow.open(map,marker);
    }
}


    /// DROP ZONE

  },
   renderCurrentLocation: function(){
    var self = this;

    var mapOptions = {
    zoom: 10,
    disableDefaultUI: true
    };


    var map = new google.maps.Map(this.el, mapOptions);


  // console.log(map);
  // var mapModel = new Comb.Models.Map();

      // Try HTML5 geolocation
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);
          map.setCenter(pos);
        });


    return this;

    },

    createMap: function(currentCollection){
    var self = this;
    console.log(this.model);
    console.log("this is the createMap","name:", this.model.attributes.name, "creator_id:", this.model.attributes.user_id, "user_id:", this.model.attributes.user_id);

    var mapOptions = {
    zoom: 10,
    disableDefaultUI: true
    };

    var mapDetails = { name: this.model.attributes.name, creator_id: this.model.attributes.user_id, user_id: this.model.attributes.user_id, map_lat: '', map_long: '' };

    var map = new google.maps.Map(this.el, mapOptions);



  // Try HTML5 geolocation

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);

      // mapModel.save( { name: "New York", creator_id: 1, owner_id: 1, map_lat: pos.lat(), map_long: pos.lng() } )
      console.log("mapcreate geolocate latitude:", pos.lat() );

      mapDetails['map_lat'] = pos.lat();
      mapDetails['map_long'] = pos.lng();
      $.ajax({
        url:'/maps',
        type:'POST',
        dataType:"jsonp",
        data: {"map": mapDetails},
        success:function (data) {
          currentCollection.create(data);
        }
      });

      // function createMarker(location) {
      //   var marker = new google.maps.Marker({
      //   position: location,
      //   map: map
      // });

      // google.maps.event.addListener(map, 'click', function(event) {
      //   createMarker(event.latLng);
      // });



    });




  //  UNCOMMENT FROM HERE ON UP FOR THE FUNCTION TO WORK

    //  var image = new google.maps.MarkerImage('images/pin_teal.png',
    //     // This marker is 129 pixels wide by 42 pixels tall.
    //     new google.maps.Size(129, 42),
    //     // The origin for this image is 0,0.
    //     new google.maps.Point(0,0),
    //     // The anchor for this image is the base of the flagpole at 18,42.
    //     new google.maps.Point(18, 42)
    // );


    // function createMarker(location) {
    //   var marker = new google.maps.Marker({
    //   position: location,
    //   map: map
    // });
    //   console.log(marker);
    //   console.log(location.lat());
    //   // var pinModel = new Comb.Models.Pin();
    //   // pinModel.save({ name: "pin", pin_lat: location.lat(), pin_long: location.lng(), map_id: 1 })
    // }

    // google.maps.event.addListener(map, 'click', function(event) {
    //   createMarker(event.latLng);
    // });

    return this;

    }
});


    // tagName: "li",
    // template: _.template( $("#map_list_template").html() ),
    // displayTemplate: _.template( $(".map_list_display_template").html() ),
    // editMapNameTemplate: _.template( $(".edit_map_template").html() ),

//     events: {
//       "click .map_name" : "displayListMap",
//       "click .edit_map_name" : "editMapName",
//       'click [data-action="destroy"]': 'removeMap'
//     },

//     displayListMap: function(){
//       var self = this;
//       var marker = "";
//       console.log(self.$el.children().find(".map_display_canvas"));
//       this.$el.html( this.displayTemplate( this.model.attributes ) );
//       this.$el.siblings().children().find( '.map_display_canvas' ).hide();
//       // self.$el.siblings().children().find('.map_display_canvas').hide();
//       // self.$el.children().show();
//       var lat = this.model.attributes.map_lat;
//       var lng = this.model.attributes.map_long;
//       var latlng = new google.maps.LatLng(lat, lng);
//        console.log(latlng);
//       var mapOptions = {
//         zoom: 10,
//         center: latlng
//       };
//       var map = new google.maps.Map($("#map_display_canvas")[0], mapOptions);
//       function createMarker(location) {
//         var marker = new google.maps.Marker({
//         position: location,
//         map: map
//       });
//         console.log(marker);
//         console.log(location.lat());
//         var pinModel = new Haystack.Models.Pin();
//         pinModel.save({ name: "pin", pin_lat: location.lat(), pin_long: location.lng(), map_id: 1 })
//       }

//         google.maps.event.addListener(map, 'click', function(event) {
//           createMarker(event.latLng);
//         });

//        var mapPins = self.model.attributes.pins;
//        console.log(mapPins);
//       // $.each(mapPins, function(key, mapPin) {
//       //    var latLng = new google.maps.LatLng(mapPin.lat, mapPin.lng);
//       //    console.log(latLng);
//       //   // Creating a marker and putting it on the map
//       //   var marker = new google.maps.Marker({
//       //     position: latLng,
//       //     map: map,
//       //     title: mapPin.name
//       //   });
//       // })

//       var contentString = $('<div class="marker-info-win">'+
//     '<div class="marker-inner-win"><span class="info-content">'+
//     '<h1 class="marker-heading">'+self.model.attributes.name+'</h1>'+
//     '<h5 class="marker-heading">'+self.model.attributes.pins[0].name+'</h5>'+
//     '</span><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>'+
//     '</div></div>');

//       var infowindow = new google.maps.InfoWindow({
//         content: contentString[0]
//       });
//           //Find remove button in infoWindow
//     var removeBtn = contentString.find('button.remove-marker')[0];
//     // google.maps.event.addDomListener(removeBtn, "click", function(event) {
//     //     //call remove_marker function to remove the marker from the map
//     //     marker.setMap(null);
//     // });


//     _.each(mapPins, function(mapPin){
//       console.log("this is the parseFloat lat", parseFloat(mapPin.pin_lat));
//       console.log("this is the parseFloat long", parseFloat(mapPin.pin_long));
//       var lat = parseFloat(mapPin.pin_lat);
//       var lng = parseFloat(mapPin.pin_long);
//       var latLng = new google.maps.LatLng(lat, lng);
//       console.log(latLng);
//         // Creating a marker and putting it on the map
//       var marker = new google.maps.Marker({
//         position: latLng,
//         map: map,
//         title: mapPin.name
//       });
//       marker.setMap(map);
//           google.maps.event.addListener(marker, "click", function (point) {
//         console.log(marker);
//         console.log("this is removew button",removeBtn);
//         infowindow.open(map,marker);
//         // var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
//         // var marker = markers[markerId]; // find marker
//         // removeMarker(marker, markerId); // remove it
//     });
//     })

//         google.maps.event.addDomListener(removeBtn, "click", function(marker) {
//         //call remove_marker function to remove the marker from the map
//         marker.setMap(null);
//         console.log(marker);
//     });

//       },

//     editMapName: function(){
//       var self = this;
//       this.$el.html( this.editMapNameTemplate( this.model.attributes ) );
//       this.$el.find('form').on('submit', function(e){
//           e.preventDefault();
//           var editField = self.$el.find('input');
//           var MapNameEdit = editField.val();
//           self.model.save({ name: MapNameEdit })
//         })

//       this.$el.find('button').on('click', function(e){
//         e.preventDefault();
//         self.displayListMap();
//       })
//       return this
//     },

//     removeMap: function(e){
//       e.preventDefault();
//       this.model.destroy();
//       return this
//     },

//     renderCurrentLocation: function(map_name){
//       var self = this;

//       var mapOptions = {
//         zoom: 10
//       };

//       var map = new google.maps.Map(this.el,
//           mapOptions);
//       console.log(map);
//       var mapModel = new Haystack.Models.Map();

//       // Try HTML5 geolocation
//         navigator.geolocation.getCurrentPosition(function(position) {
//           var pos = new google.maps.LatLng(position.coords.latitude,
//                                            position.coords.longitude);
//           map.setCenter(pos);

//           mapModel.save( { name: map_name, creator_id: 1, owner_id: 1, map_lat: pos.lat(), map_long: pos.lng() } )

//           console.log(pos.lng());
//           console.log(mapModel);
//         });

//         function createMarker(location) {
//           var marker = new google.maps.Marker({
//           position: location,
//           map: map
//           });
//           console.log(marker);
//           console.log(location.lat());
//           var pinModel = new Haystack.Models.Pin();
//           pinModel.save({ name: "pin", pin_lat: location.lat(), pin_long: location.lng(), map_id: 1 })
//         }

//         google.maps.event.addListener(map, 'click', function(event) {
//           createMarker(event.latLng);
//         });




//         // var mapPins = this.model.attributes.pins;
//         //  this.model.attributes.pins[0].pin_lat
//         // // var mapPins[0].pin_lat;
//         // var mapPinCoords = [];
//         // var markers = [];
//         // var iterator = 0;
//         // var iterator_2 = 0;



//         // function createMarkerArray() {
//         //   for (var i = 0; i < mapPins.length; i++) {
//         //     var data = mapPins[i],
//         //     latLng = new google.maps.LatLng(data.lat, data.lng);
//         //   }
//         // }


//         // function drop() {
//         //   for (var i = 0; i < markers.length; i++) {
//         //     setTimeout(function() {
//         //       addMarker();
//         //     }, i * 200);
//         //   }
//         // }

//         // function addMarker() {
//         //    createMarkerArray();
//         //   markers.push(new google.maps.Marker({
//         //     position: mapPinCoords[iterator],
//         //     map: map,
//         //     draggable: false,
//         //     animation: google.maps.Animation.DROP
//         //   }));
//         //   iterator++;
//         // }


//       return this;

//     }

// });


