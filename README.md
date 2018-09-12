ember-paperjs
==============================================================================

Ember components for using the excellent canvas SVG drawing library: [PaperJS](http://paperjs.org/). A work in progress. Contributions welcomed.

Installation
------------------------------------------------------------------------------

```
ember install ember-paperjs
```


Usage
------------------------------------------------------------------------------

### Initialise a blank Paper canvas

```
{{ paperjs-canvas }}
```

#### Events

* `onInit=(action "onBeforeEvent")` provides the `canvas` element
* `onInit=(action "onInitEvent")` provides the `paper` scope object


### Create a Paper component that you can draw on

```
{{ paperjs-drawing }}
```

#### Options for `paperjs-drawing`

* `closed=true|false` // automatically close shapes
* `smoothed=true|false` // [smooth](http://paperjs.org/reference/path/#smooth) shapes when complete
* `simplified=true|false` //  [simplify ](http://paperjs.org/reference/path/#simplify) shapes when complete (should accept a tolerances but doesn't)
* `compoundPaths=true|false` // Create compound shapes (like Illustrator--not like PaperJS). Drawing inside another shape creates a boolean subtraction.
* `minDistance=5` // minimum drawing distance for each part of a path
* `maxDistance=100` // maximum drawing distance for each part of a path
* `strokeColor="black"`
* `fillColor="rgba(255, 255, 244, 0.4)"`

#### Events

* `onInit=(action "onBeforeEvent")` provides the `canvas` element
* `onInit=(action "onInitEvent")` provides the `paper` scope object
* `onClosed=(action "onClosedEvent")` provides the path and the scope


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-paperjs`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
