/* eslint-env node */
'use strict';
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var path = require('path');

module.exports = {
  name: 'ember-paperjs',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('node_modules/paper/dist/paper-core.min.js');
    // app.import('node_modules/paper/dist/paper-full.min.js');
  },


  treeForVendor: function(vendorTree){
    var paperPath = path.dirname(require.resolve('paper'));

    var trees = [];
    if(vendorTree){
      trees.push(vendorTree);
    }

    var paperTree = new Funnel(paperPath, {
      srcDir: '/',
      destDir: 'paper',
    });

    trees.push(paperTree);

    return new MergeTrees(trees, { overwrite: true });
  },

  isDevelopingAddon() {
    return true;
  }

};
