import Component from '@ember/component';
import layout from '../templates/components/paperjs-canvas';


export default Component.extend({
  layout,
  tagName: "canvas",

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.get("element");
    const scope = new paper.PaperScope();

    scope.setup(canvas);
    scope.activate();

    this.sendAction("onInit", scope);
  },

});
