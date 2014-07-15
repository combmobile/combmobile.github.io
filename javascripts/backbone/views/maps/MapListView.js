var Haystack = Haystack || { Models: {}, Collections: {}, Views: {} };

Haystack.Views.MapListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, "all", this.render)
  },
  render: function(){
    var self = this;
    self.$el.empty();
    _.each(this.collection.models, function(message){
    var mapView = new Haystack.Views.MapView( {model: message} )
    self.$el.append( mapView.render().el );
    })
  }
})
