var Haystack = Haystack || { Models: {}, Collections: {}, Views: {} };

Haystack.Collections.MapCollection = Backbone.Collection.extend({
  model: Haystack.Models.Map,
  url: '/maps'
});
