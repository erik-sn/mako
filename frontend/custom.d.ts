/**
 * declaration file to appease compiler on modules that have
 * no declarations on npm/@types. Possible to further extend
 * these as necessary.
 *
 * Try to keep these in alphabetical order!
 */

declare module 'autoprefixer' {
  const _: any;
  export = _;
}

declare module 'extract-text-webpack-plugin' {
  const _: any;
  export = _;
}

declare module 'enzyme-adapter-react-16' {
  const _: any;
  export = _;
}

declare module 'raf' {
  const _: any;
  export = _;
}

declare module 'debounce' {
  const _: any;
  export = _;
}

declare module 'is-url' {
  const _: any;
  export = _;
}

declare module 'react-masonry-infinite' {
  const _: any;
  export = _;
}

declare module 'react-overdrive' {
  const _: any;
  export = _;
}

declare module 'redux-promise' {
  const _: any;
  export = _;
}

declare module 'redux-saga/effects' {
  export const all: any;
  export const call: any;
  export const put: any;
  export const take: any;
  export const takeLatest: any;
  export const fork: any;
}

interface Array<T> {
  find(predicate: (search: T) => boolean): T;
}

interface Socket extends WebSocket {
  post: any;
}
