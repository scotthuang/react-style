'use strict';

var ReactElement  = require('react/lib/ReactElement');
var assign        = require("object-assign");
var applyStyles   = require('./applyStyles');
var isArray       = Array.isArray;

var helperObj = {};

function buildProps(props) {
  var builtProps = {
    className: props.className || null,
    style: props.style ? assign({}, props.style) : null
  };
  applyStyles(builtProps, props.styles, 0, null, helperObj.maxOverridesLength);
  return builtProps;
}

var originalCreateElement = ReactElement.createElement;
ReactElement.createElement = function(type, props) {
  var args = arguments;
  if (props &&
      props.styles &&
      !props.__cachedStyles &&
      typeof type === 'string') {
    props.__cachedStyles = isArray(props.styles) ? props.styles : [props.styles];
    assign(props, buildProps(props));
  }

  //remove "styles" and "__cachedStyles" unknown-props @https://facebook.github.io/react/warnings/unknown-prop.html
  props && props.styles && delete props.styles;
  props && props.__cachedStyles && delete props.__cachedStyles;

  return originalCreateElement.apply(this, [type, props].concat(Array.prototype.slice.call(args, 2)));
};

module.exports = helperObj;
