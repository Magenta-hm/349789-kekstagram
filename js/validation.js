'use strict';

window.validation = (function () {
  return {

    assertHashTagSplitsWithSpaces: function (hashTags) {
      var result = false;
      for (var i = 0; i < hashTags.length; i++) {
        if ((hashTags[i].match(/#/g) || []).length > 1) {
          result = true;
          break;
        }
      }
      return result;
    },

    assertHashTagStartsFromHash: function (hashTags) {
      var result = false;
      for (var i = 0; i < hashTags.length; i++) {
        if (hashTags[i].charAt(0) !== '#') {
          result = true;
          break;
        }
      }
      return result;
    },

    assertHashTagIsNotEmpty: function (hashTags) {
      var result = false;
      for (var i = 0; i < hashTags.length; i++) {
        if (hashTags[i].charAt(0) === '#' && hashTags[i].length === 1) {
          result = true;
          break;
        }
      }
      return result;
    },

    assertHashTagNotDuplicate: function (hashTags) {
      var result = false;
      for (var i = 0; i < hashTags.length; i++) {
        var currentHashTag = hashTags[i].toLowerCase();
        for (var j = 0; j < hashTags.length; j++) {
          if (currentHashTag === hashTags[j].toLowerCase() && j !== i) {
            result = true;
            break;
          }
        }
      }
      return result;
    },

    assertHashTagCountLessFive: function (hashTags) {
      var result = false;
      if (hashTags.length > window.constants.HASH_TAGS_COUNT_LIMIT) {
        result = true;
      }
      return result;
    },

    assertHashTagLengthLessTwenty: function (hashTags) {
      var result = false;
      for (var i = 0; i < hashTags.length; i++) {
        if (hashTags[i].length > window.constants.HASH_TAG_LENGTH_LIMIT) {
          result = true;
          break;
        }
      }
      return result;
    },

    checkHashTagsValidation: function (hashTags) {
      var errorMessage = [];
      if (this.assertHashTagSplitsWithSpaces(hashTags)) {
        errorMessage.push('Хэш-теги должны разделяться пробелами.');
      }
      if (this.assertHashTagStartsFromHash(hashTags)) {
        errorMessage.push('Хэш-тег должен начинаться с символа # (решётка).');
      }
      if (this.assertHashTagIsNotEmpty(hashTags)) {
        errorMessage.push('Хеш-тег не может состоять только из одной решётки.');
      }
      if (this.assertHashTagNotDuplicate(hashTags)) {
        errorMessage.push('Один и тот же хэш-тег не может быть использован дважды.');
      }
      if (this.assertHashTagCountLessFive(hashTags)) {
        errorMessage.push('Нельзя указать больше пяти хэш-тегов.');
      }
      if (this.assertHashTagLengthLessTwenty(hashTags)) {
        errorMessage.push('Максимальная длина одного хэш-тега 20 символов, включая решётку.');
      }
      return errorMessage.join(' ');
    },

    checkCommentValidation: function (comment) {
      if (comment.length > window.constants.COMMENT_LENGTH_LIMIT) {
        return 'Максимальная длина комментария 140 символов.';
      }
      return '';
    }

  };

})();
