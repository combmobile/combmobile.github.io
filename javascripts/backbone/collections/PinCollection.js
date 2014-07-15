var Haystack = Haystack || {  Models: {}, Collections: {}, Views: {} };

Haystack.Collections.PinCollection = Backbone.Collection.extend({
  model: Haystack.Models.Pin,
  url: '/pins'
});
