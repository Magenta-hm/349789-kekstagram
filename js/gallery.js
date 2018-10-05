'use strict';

(function galleryModule() {

  var pictureListElement = document.querySelector('.pictures');
  var bigPictureCancelButtonElement = document.querySelector('#picture-cancel');
  var filterPanelElement = document.querySelector('.img-filters');
  var filterButtonPopularElement = document.querySelector('#filter-popular');
  var filterButtonNewElement = document.querySelector('#filter-new');
  var filterButtonDiscussedElement = document.querySelector('#filter-discussed');
  var pictures = [];

  var onLoad = function (dataPictures) {
    pictures = window.data.parsePictures(dataPictures);

    showPictures('popular');

    filterPanelElement.classList.remove('img-filters--inactive');
  };

  var removeAllDOMPictures = function () {
    var pictureElements = document.getElementsByClassName('picture');

    while (pictureElements.length > 0) {
      pictureElements[0].parentNode.removeChild(pictureElements[0]);
    }
  };

  var showPictures = window.util.debounce(function (filterName) {
    removeAllDOMPictures();

    var fragment = '';
    var tempPictures = pictures.slice();

    switch (filterName) {
      case 'popular':
        fragment = window.picture.generateDOMPictures(pictures, window.preview.showBigPicture);
        break;

      case 'new':
        var newPictures = [];

        for (var i = 0; i < window.constants.FILTER_NEW_COUNT; i++) {
          var index = window.util.getRandomInteger(0, tempPictures.length - 1);
          newPictures.push(tempPictures[index]);
          tempPictures.splice(index, 1);
        }

        fragment = window.picture.generateDOMPictures(newPictures, window.preview.showBigPicture);
        break;

      case 'discussed':
        tempPictures.sort(function (first, second) {
          if (first.comments.length > second.comments.length) {
            return -1;
          } else if (first.comments.length < second.comments.length) {
            return 1;
          } else {
            return 0;
          }
        });

        fragment = window.picture.generateDOMPictures(tempPictures, window.preview.showBigPicture);
        break;
    }

    pictureListElement.appendChild(fragment);

  });

  window.backend.load('GET', 'https://js.dump.academy/kekstagram/data', onLoad);

  window.preview.hideElement('.social__comment-count');
  window.preview.hideElement('.comments-loader');


  bigPictureCancelButtonElement.addEventListener('click', function () {
    window.preview.hideBigPicture();
  });

  var setFilterButtonsNonActive = function () {
    filterButtonDiscussedElement.classList.remove('img-filters__button--active');
    filterButtonNewElement.classList.remove('img-filters__button--active');
    filterButtonPopularElement.classList.remove('img-filters__button--active');
  };

  filterButtonPopularElement.addEventListener('click', function () {
    setFilterButtonsNonActive();
    filterButtonPopularElement.classList.add('img-filters__button--active');
    showPictures('popular');
  });

  filterButtonNewElement.addEventListener('click', function () {
    setFilterButtonsNonActive();
    filterButtonNewElement.classList.add('img-filters__button--active');
    showPictures('new');
  });

  filterButtonDiscussedElement.addEventListener('click', function () {
    setFilterButtonsNonActive();
    filterButtonDiscussedElement.classList.add('img-filters__button--active');
    showPictures('discussed');
  });

})();
