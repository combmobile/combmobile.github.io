var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.MapListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, "all", this.render)
  },
  render: function(){
    var self = this;
    self.$el.empty();
    _.each(this.collection.models, function(map){
    var mapItemView = new Comb.Views.MapView( {model: map} )
    self.$el.append( mapItemView.renderMapList().el );
    })
  }
})
