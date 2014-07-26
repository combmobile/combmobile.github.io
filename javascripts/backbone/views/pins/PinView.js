var Comb = Comb || { Models: {}, Collections: {}, Views: {} };

Comb.Views.PinView = Backbone.View.extend({
    initialize: function(){

  },
  tagName: "li",
  template: _.template( $(".singlePinItemTemplate").html() ),
  events: {
    },
    renderPinList: function(){
      this.$el.html( this.template(this.model.attributes) );
      return this
    }

  });
