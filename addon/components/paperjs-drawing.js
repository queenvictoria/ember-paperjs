import Component from '@ember/component';
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
    tool.minDistance = 10;
    tool.maxDistance = 100;

    this.set("canvas", canvas);
    this.set("paper", paper);
    this.set("tool", tool);

    tool.onMouseDown = () => {
      path = new paper.Path();
      path.strokeColor = '#cccccc';
    }

    tool.onMouseDrag = (event) => {
      if ( ! path ) return;
      path.add(event.point);
    }

    tool.onMouseUp = () => {
      if ( ! path ) return;

      const final = path.clone();
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
        final.simplify();
      }

      path.remove();
    }
  },

});
