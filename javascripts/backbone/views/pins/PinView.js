var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.PinView = Backbone.View.extend({
    initialize: function(){
      console.log("You've created a pinView")
  },
  tagName: "li",
  template: _.template( $(".singlePinItemTemplate").html() ),
  events: {
    },
    render: function(){
      this.$el.html( this.template(this.model.attributes) );
      return this
    },
    close: function(){
      this.remove();
      this.unbind();
      this.model.unbind("change", this.modelChanged);
    }
  });
