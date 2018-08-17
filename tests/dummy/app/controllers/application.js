import Controller from '@ember/controller';

export default Controller.extend({

  // @FIX Load an SVG file as a demo.

  actions: {
    onMouseEvent: function(event) {
      console.log(event.type);
    },

    // Triggered on the onClosed action.
    closedCallback: function(path) {
      const opts = {
        bounds: 'view',
        matrix: 'view',
        asString: false,
        precision: 5,
        matchShapes: false,
        embedImages: false, // default true
      };

      console.log(path.exportSVG())
    }
  }
});
