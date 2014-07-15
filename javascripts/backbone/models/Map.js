var Haystack = Haystack || { Models: {}, Collections: {}, Views: {} };

Haystack.Models.Map = Backbone.Model.extend({
  urlRoot : '/maps',
  initialize: function(){
    console.log("You've created a new Map");
    // this.set('pins', new Haystack.Collections.PinCollection());
  },
  defaults:{
    name:'',
    creator_id:'',
    owner_id:'',
    map_lat:'',
    map_long:'',
    pins:''
  }

});
