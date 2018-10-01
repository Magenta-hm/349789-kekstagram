'use strict';

window.data = (function () {
  return {

    makeRandomComment: function (countOfSentences) {
      var tempComment = '';

      for (var i = 0; i < countOfSentences; i++) {
        tempComment = tempComment + (i > 0 ? ' ' : '') + window.util.getRandomItem(window.const.COMMENT_TEMPLATES);
      }

      return tempComment;
    },

    getComments: function (commentsCount) {
      var tempComments = [];

      for (var i = 0; i < commentsCount; i++) {
        tempComments.push(this.makeRandomComment(window.util.getRandomInteger(1, 2)));
      }

      return tempComments;
    },

    generatePictures: function (picturesCount) {
      var tempPictures = [];

      for (var i = 0; i < picturesCount; i++) {
        tempPictures.push({
          url: 'photos/' + (i + 1) + '.jpg',
          likes: window.util.getRandomInteger(window.const.MIN_LIKE_COUNT_PER_PICTURE, window.const.MAX_LIKE_COUNT_PER_PICTURE),
          comments: this.getComments(window.util.getRandomInteger(window.const.MIN_COMMENT_COUNT_PER_PICTURE, window.const.MAX_COMMENT_COUNT_PER_PICTURE)),
          description: window.util.getRandomItem(window.const.DESCRIPTION_TEMPLATES)
        });
      }

      return tempPictures;
    }

  };

})();
