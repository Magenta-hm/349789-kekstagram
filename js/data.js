'use strict';

window.data = (function () {
  return {

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
