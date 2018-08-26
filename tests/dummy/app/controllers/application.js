/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
import Controller from '@ember/controller';

export default Controller.extend({
  paperScope: null,
  data: "<initialising/>",

  // The data in our textarea should update when paper has shapes added to it.
  // @FIX Load an SVG file as a demo.
  actions: {
    import: function() {
      console.log('Import button pressed.');

      // Get the paper object.
      if ( ! this.paperScope || ! this.data ) {
        console.error("No reference to the Paper scope.");
        return;
      }
      const project = this.get("paperScope").project;

      // Get the svg string.
      const data = this.get("data");

      // Call import.
      project.importSVG(data, {expandShapes: true});
    },

    export: function() {
      console.log('Export button pressed.');
      this._updateData();
    },

    clear: function() {
      if ( this.paperScope ) {
        this.get("paperScope").project.clear();
        this._updateData();
      }
    },

    onInitEvent: function(paperScope) {
      this.set("paperScope", paperScope);
    },

    onMouseEvent: function(event, path, paper) {
      console.info(event.type);
    },

    // Triggered on the onClosed action.
    closedCallback: function(path, paper) {
      const opts = {
        bounds: 'view',
        matrix: 'view',
        asString: false,
        precision: 5,
        matchShapes: false,
        embedImages: false, // default true
      };

      console.info(path.exportSVG(opts));
      this._updateData();
    },
  },

  _updateData() {
    // Get the paper object.
    if ( ! this.paperScope ) {
      console.error("No reference to the Paper scope.");
      return;
    }
    const project = this.get("paperScope").project;

    // @FIX this should be a copy
    const exportable = project;
    // Alter the colours of all the paths first.
    exportable.getItems({class: paper.Path}).forEach(item => {
      item.fillColor = "rgba(255,255,255,0.5)";
      item.strokeColor = "rgba(0,0,0,0.5)";
    })
    // Call export.
    const data = exportable.exportSVG({asString: true, embedImages: false,});
    // @FIX Remove copies.
    // exportable.remove();

    // Put the result into the textarea.
    this.set("data", data);
  },


});
