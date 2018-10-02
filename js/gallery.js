'use strict';

(function galleryModule() {
  var pictureListElement = document.querySelector('.pictures');
  var bigPictureCancelButton = document.querySelector('#picture-cancel');

  var onLoad = function (dataPictures) {
    var pictures = window.data.parsePictures(dataPictures);
    var fragment = window.picture.generateDOMPictures(pictures, window.preview.showBigPicture);
    pictureListElement.appendChild(fragment);
  };

  window.backend.load('GET', 'https://js.dump.academy/kekstagram/data', onLoad);

  window.preview.hideElement('.social__comment-count');
  window.preview.hideElement('.comments-loader');


  bigPictureCancelButton.addEventListener('click', function () {
    window.preview.hideBigPicture();
  });

})();
