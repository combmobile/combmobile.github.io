var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Collections.MapCollection = Backbone.Collection.extend({
  model: Comb.Models.Map,
  url: '/maps'
});
