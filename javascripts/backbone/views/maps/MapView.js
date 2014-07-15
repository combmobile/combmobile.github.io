// var Haystack = Haystack || { Models: {}, Collections: {}, Views: {} };

// Haystack.Views.MapView = Backbone.View.extend({
//   initialize: function(){
//     // this.listenTo( this.model, "change", this.render );
//     // this.listenTo( this.model, "destroy", this.remove );
//     console.log(this.model.attributes.pins[0].pin_lat);
//   },


//     tagName: "li",
//     template: _.template( $("#map_list_template").html() ),
//     displayTemplate: _.template( $(".map_list_display_template").html() ),
//     editMapNameTemplate: _.template( $(".edit_map_template").html() ),
//     render: function(){
//       this.$el.empty();
//       this.$el.html( this.template(this.model.attributes) );
//       return this
//     },

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


