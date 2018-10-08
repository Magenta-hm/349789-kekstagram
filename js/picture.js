'use strict';

(function pictureModule() {

  var pictureTemplateElement = document.querySelector('#picture').content;

  window.picture = {
    generateDOMPicture: function (picture, action) {
      var pictureElement = pictureTemplateElement.cloneNode(true);

      var pictureImgElement = pictureElement.querySelector('.picture')
                                            .querySelector('img');
      pictureImgElement.setAttribute('src', picture.url);

      pictureElement.querySelector('.picture__likes')
                    .textContent = picture.likes;

      pictureElement.querySelector('.picture__comments')
                    .textContent = picture.comments.length;

      pictureImgElement.addEventListener('click', function () {
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
