var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.PinListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, "all", this.render)
  }
  // render: function(){
  //   var self = this;
  //   self.$el.empty();
  //   var pinView = new Haystack.Views.PinView()
  //   self.$el.append( mapView.render().el );
  // }
})
