var Comb = Comb || {  Models: {}, Collections: {}, Views: {} };

Comb.Collections.PinCollection = Backbone.Collection.extend({
  model: Comb.Models.Pin,
  url: '/pins'
});
