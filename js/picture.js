'use strict';

window.picture = (function () {
  var pictureTemplate = document.querySelector('#picture').content;

  return {

    generateDOMPicture: function (picture, action) {
      var pictureElement = pictureTemplate.cloneNode(true);

      var pictureElementImg = pictureElement.querySelector('.picture')
                                            .querySelector('img');
      pictureElementImg.setAttribute('src', picture.url);

      pictureElement.querySelector('.picture__likes')
                    .textContent = picture.likes;

      pictureElement.querySelector('.picture__comments')
                    .textContent = picture.comments.length;

      pictureElementImg.addEventListener('click', function () {
        action(picture);
      });

      return pictureElement;
    },

    generateDOMPictures: function (pictures, action) {
      var fragment = document.createDocumentFragment();

      pictures.forEach(function (picture) {
        fragment.appendChild(window.picture.generateDOMPicture(picture, action));
      });

      return fragment;
    }

  };

})();
