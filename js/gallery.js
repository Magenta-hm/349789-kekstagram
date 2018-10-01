'use strict';

(function galleryModule() {
  var pictureListElement = document.querySelector('.pictures');
  var bigPictureCancelButton = document.querySelector('#picture-cancel');

  var pictures = window.data.generatePictures(window.const.PICTURE_COUNT);

  pictureListElement.appendChild(window.picture.generateDOMPictures(pictures, window.preview.showBigPicture));

  window.preview.hideElement('.social__comment-count');
  window.preview.hideElement('.comments-loader');


  bigPictureCancelButton.addEventListener('click', function () {
    window.preview.hideBigPicture();
  });

})();
