'use strict';

(function dataModule() {

  window.data = {
    parsePictures: function (dataPictures) {
      var tempPictures = [];

      dataPictures.forEach(function (picture) {
        picture.description = window.util.getRandomItem(window.constants.DESCRIPTION_TEMPLATES);
        tempPictures.push(picture);
      });

      return tempPictures;
    }

  };

})();
