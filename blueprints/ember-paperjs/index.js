// blueprints/ember-paperjs/index.js
module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addPackageToProject('paper');
  }
};
