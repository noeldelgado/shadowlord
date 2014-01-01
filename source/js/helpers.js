window.UI = {};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


// var helpers = {
//     addEvent: function (obj, type, fn) {
//         if (obj.addEventListener) {
//             obj.addEventListener(type, fn, false);
//         } else if (obj.attachEvent) {
//             obj['e' + type + fn] = fn;
//             obj[type + fn] = function() {
//                 obj['e' + type + fn](window.event);
//             };
//             obj.attachEvent("on" + type, obj[type + fn]);
//         }
//     },
//     triggerEvent: function (el, type) {
//         if ((el[type] || false) && typeof el[type] == 'function') {
//             el[type](el);
//         }
//     }
// };
