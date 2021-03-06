'use strict';

(function previewModule() {

  var body = document.body;

  window.preview = {
    fillElement: function (element, picture) {

      element.querySelector('.big-picture__img')
             .querySelector('img')
             .setAttribute('src', picture.url);

      element.querySelector('.likes-count')
             .textContent = picture.likes;

      element.querySelector('.comments-count')
             .textContent = picture.comments.length;

      element.querySelector('.social__caption')
             .textContent = picture.description;

      var commentTemplateElement = document.querySelector('.social__comment');
      var commentListElement = document.querySelector('.social__comments');

      while (commentListElement.firstChild) {
        commentListElement.removeChild(commentListElement.firstChild);
      }

      var maxCommentsQuantity = picture.comments.length >= window.constants.COMMENT_LIMIT
        ? window.constants.COMMENT_LIMIT
        : picture.comments.length;

      for (var i = 0; i < maxCommentsQuantity; i++) {
        var commentElement = commentTemplateElement.cloneNode(true);

        commentElement.querySelector('.social__picture')
                      .setAttribute('src', 'img/avatar-' + window.util.getRandomInteger(1, 6) + '.svg');

        commentElement.querySelector('.social__text')
                      .textContent = picture.comments[i];

        commentListElement.appendChild(commentElement);
      }
    },

    onBigPicturePopupEscPress: function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        window.preview.hideBigPicture();
      }
    },

    hideBigPicture: function () {
      document.querySelector('.big-picture').classList.add('hidden');
      body.classList.remove('modal-open');
      document.removeEventListener('keydown', window.preview.onBigPicturePopupEscPress);
    },

    showBigPicture: function (picture) {
      var bigPictureElement = document.querySelector('.big-picture');

      bigPictureElement.classList.remove('hidden');
      body.classList.add('modal-open');

      window.preview.fillElement(bigPictureElement, picture);
      document.addEventListener('keydown', window.preview.onBigPicturePopupEscPress);
    },

    hideElement: function (selector) {
      var element = document.querySelector(selector);

      element.classList.add('visually-hidden');
    }

  };

})();
