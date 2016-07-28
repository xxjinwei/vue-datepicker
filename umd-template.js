;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(<%= amd %>, factory)
  } else if (typeof exports === 'object') {
    factory(<%= cjs %>)
  } else {
    factory(<%= global %>)
  }
}(this, function(<%= param %>) {
<%= contents %>
return <%= exports %>;
}))
