var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.MapListView = Backbone.View.extend({
  initialize: function(){

    this.listenTo(this.collection, "change", this.elFunction);
    this.listenTo(this.collection, "add", this.elFunction);
    this.listenTo(this.collection, "remove", this.elFunction);

  },
  elFunction: function(){
    this.el = $('.map_list_ul');
    this.render(this.el);
  },
  render: function(ul){
    this.$el.empty();
    var self = this;
    _.each(this.collection.models, function(map){
    var mapItemView = new Comb.Views.MapView( {model: map} )
    ul.prepend( mapItemView.renderMapList().el );
    })
  }
})
