var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.PinListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, "change" "destroy" "add", this.render)
    console.log("you've created a pinListView")
  },
  render: function(){
    var self = this;
    self.$el.empty();
    _.each(this.collection.models, function(pin){
    var pinView = new Comb.Views.PinView( {model: pin} )
    self.$el.prepend( pinView.render().el );
    })
   }
})


