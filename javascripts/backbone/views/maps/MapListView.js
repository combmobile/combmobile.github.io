var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.MapListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, "change", this.render);
    this.listenTo(this.collection, "all", this.render)
  },
    elFunction: function(){
    this.el = $('.map_list_ul');
    this.render(this.el);
    },
  render: function(ul){
    var self = this;
    _.each(this.collection.models, function(map){
    var mapItemView = new Comb.Views.MapView( {model: map} )
    ul.prepend( mapItemView.renderMapList().el );
    })
  }
})
