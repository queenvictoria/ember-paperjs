import Component from '@ember/component';
import layout from '../templates/components/paperjs-drawing';


export default Component.extend({
  layout,
  tagName: "canvas",
  attributeBindings: ["resize"],
  resize: true,

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.get("element");
    this.sendAction("onBeforeInit", canvas);
    const scope = new paper.PaperScope();

    scope.setup(canvas);
    scope.activate();
    scope.project.currentStyle = {
      fillColor: this.get("fillColor") || "white",
      strokeColor: this.get("strokeColor") || "black",
    };

    let path = null;

    const tool = new scope.Tool();
    tool.minDistance = this.get("minDistance") || 10;
    tool.maxDistance = this.get("maxDistance") || 100;

    this.sendAction("onInit", scope);

    // @TODO Detect a drawing or dragging event.
    tool.onMouseDown = (event) => {
      scope.activate();

      path = new scope.Path();
      path.strokeColor = '#cccccc';

      // Callback or fire action
      this.sendAction('onMouseDown', event, path, scope);
    }

    // @TODO Detect a drawing or dragging event.
    tool.onMouseDrag = (event) => {
      if ( ! path ) return;
      path.add(event.point);

      // Callback or fire action
      this.sendAction('onMouseDrag', event, path, scope);
    }

    tool.onMouseUp = (event) => {
      // Callback or fire action
      this.sendAction('onMouseUp', event);

      if ( ! path ) return;

      let final = path.clone();
      if ( ! final || ! final.length ) return;

      if ( this.get("strokeColor") ) {
        final.strokeColor = this.get("strokeColor");
      }
      else {
        final.strokeColor = 'black';
      }

      if ( this.get("closed") ) {
        final.closed = true;
        if ( this.get("fillColor") ) {
          final.fillColor = this.get("fillColor");
        }
        else {
          final.fillColor = 'rgba(128, 128, 128, 0.1)';
        }
      }

      if ( this.get("smoothed") ) {
        final.smooth();
      }
      if ( this.get("simplified") ) {
        final.reduce();
        final.simplify();
      }

      path.remove();

      // Compound paths.
      if ( this.compoundPaths ) {
        // Paper compound paths are not illustrator compound paths.
        // Iterate existing paths.
        if ( scope.project ) {
          // Test every min length
          const steps = Math.floor(final.length / this.get("minDistance"));
          let solved = false;

          scope.project.getItems({class: paper.Path}).forEach((item) => {
            if ( solved || item == final ) return;

            // Determine if this new path is entirely within a path.
            // Iterate final points
            let within = true;
            for ( var i = 0; i < steps; i++ ) {
              let point = final.getPointAt(i * this.get("minDistance"));
              // It only takes one...
              if ( ! item.contains(point) ) {
                within = false;
                break;
              }
            }
            // If they're all within this path then we are inside this path.
            if ( item && within ) {
              // If it is do a boolean subtract.
              let result = item.subtract(final, {});
              item.remove();
              final.remove();
              final = result;
              // Don't test any further.
              solved = true;
            }
          })
        }
      }

      // Callback or fire action
      this.sendAction('onClosed', final, scope);
    }
  },

});
