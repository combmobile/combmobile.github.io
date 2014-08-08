var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Models.Pin = Backbone.Model.extend({
  urlRoot : '/pins',
  initialize: function(){
  },
  defaults:{
    name:'',
    description:'',
    photo_url:'',
    pin_lat:'',
    pin_long:'',
    map_id: ''
  }

});
