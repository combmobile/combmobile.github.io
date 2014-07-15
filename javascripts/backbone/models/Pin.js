var Haystack = Haystack || { Models: {}, Collections: {}, Views: {} };

Haystack.Models.Pin = Backbone.Model.extend({
  urlRoot : '/pins',
  initialize: function(){
    console.log("You've created a new Pin");
  },
  defaults:{
    name:'',
    pin_lat:'',
    pin_long:'',
    map_id: ''
  }

});
