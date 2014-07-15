var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Models.Map = Backbone.Model.extend({
  urlRoot : '/maps',
  initialize: function(){
    console.log("You've created a new Map");
    // this.set('pins', new Comb.Collections.PinCollection());
  },
  defaults:{
    name:'',
    creator_id:'',
    user_id:'',
    map_lat:'',
    map_long:'',
    pins:''
  }

});
