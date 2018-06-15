import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/fn/set';
import 'core-js/es6/promise';
import 'core-js/fn/string/includes';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/array/find';
import 'core-js/fn/array/from';
import raf from 'raf';

import App from './App';

declare var window: any;
/* polyfills for react support */
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = raf;
}
window.React = React;

ReactDOM.render(<App />, document.getElementById('root'));
