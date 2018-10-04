'use strict';

(function utilModule() {

  window.util = (function () {
    return {

      getRandomInteger: function (min, max) {
        var rand = min + Math.random() * (max + 1 - min);

        rand = Math.floor(rand);

        return rand;
      },

      getRandomItem: function (array) {
        return array[this.getRandomInteger(0, array.length - 1)];
      }

    };

  })();

})();
