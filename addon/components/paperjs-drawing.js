import Component from '@ember/component';
import $ from 'jquery';
import layout from '../templates/components/paperjs-drawing';


export default Component.extend({
  layout,
  tagName: "canvas",

  didRender() {
    this._super(...arguments);

    const canvas = this.get("element");

    paper.setup(canvas);
    let path = null;

    const tool = new paper.Tool();
    tool.minDistance = this.get("minDistance") || 10;
    tool.maxDistance = this.get("maxDistance") || 100;

    this.set("canvas", canvas);
    this.set("paper", paper);
    this.set("tool", tool);

    // @TODO Detect a drawing or dragging event.
    tool.onMouseDown = (event) => {
      path = new paper.Path();
      path.strokeColor = '#cccccc';

      // Callback or fire action
      this.sendAction('onMouseDown', event, path, this.get("paper"));
    }

    // @TODO Detect a drawing or dragging event.
    tool.onMouseDrag = (event) => {
      if ( ! path ) return;
      path.add(event.point);

      // Callback or fire action
      this.sendAction('onMouseDrag', event, path, this.get("paper"));
    }

    tool.onMouseUp = (event) => {
      // Callback or fire action
      this.sendAction('onMouseUp', event);

      if ( ! path ) return;

      let final = path.clone();
      if ( this.get("strokeColour") ) {
        final.strokeColor = this.get("strokeColour");
      }
      else if ( this.get("strokeColor") ) {
        final.strokeColor = this.get("strokeColor");
      }
      else {
        final.strokeColor = 'black';
      }

      if ( this.get("closed") ) {
        final.closed = true;
        if ( this.get("fillColour") ) {
          final.fillColor = this.get("fillColour");
        }
        else if ( this.get("fillColor") ) {
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
        let compoundPath = this.get("compoundPath")
        if ( ! compoundPath ) {
          compoundPath = new paper.CompoundPath({
            fillColor: this.get("fillColour") || 'rgba(128, 128, 128, 0.1)',
            strokeColor: this.get("strokeColour") || 'rgba(128, 128, 128, 0.5)',
          });
        }

        // Paper compound paths are not illustrator compound paths.
        // @TODO Iterate each existing path.
        const project = paper.project;
        if ( project ) {
          console.log(`Final is ${final.length} long.`)
          // Test every min length
          const steps = Math.floor(final.length / this.get("minDistance"));
          console.log(`Final has ${steps} steps.`)
          let solved = false;
          project.getItems({class: paper.Path}).forEach((item, index) => {
            if ( solved || item == final ) return;

            // Determine if this new path is entirely within a path.
            // Iterate final points
            let within = true;
            for ( var i = 0; i < steps; i++ ) {
              let point = final.getPointAt(i * this.get("minDistance"));
              if ( ! item.contains(point) ) {
                console.log(`Item ${index} does not contain point ${i}.`);
                within = false;
                break;
              }
              console.log(i)
            }
            // If they're all within this path then we are inside this path.
            if ( within ) {
              console.log(`Our final path is within path ${index}.`);
              // If it is do a boolean subtract.
              let result = item.subtract(final, {});
              item.remove();
              final.remove();
              final = result;
              // Don't test any further.
              solved = true;
            }
            // @FIX How to do three concentric paths? Just works.
          })
        }


        compoundPath.addChild(final);
        this.set("compoundPath", compoundPath);
      }

      // Callback or fire action
      this.sendAction('onClosed', final, this.get("paper"));
    }
  },

});
