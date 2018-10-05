'use strict';

(function utilModule() {

  window.util = {
    getRandomInteger: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);

      rand = Math.floor(rand);

      return rand;
    },

    getRandomItem: function (array) {
      return array[this.getRandomInteger(0, array.length - 1)];
    },

    debounce: function (action) {
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          action.apply(null, args);
        }, window.constants.DEBOUNCE_INTERVAL);
      };

    }

  };

})();
