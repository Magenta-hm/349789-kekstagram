'use strict';

(function pictureModule() {
  var ESC_KEYCODE = 27;
  var PICTURE_COUNT = 25;
  var MIN_COMMENT_COUNT_PER_PICTURE = 5;
  var MAX_COMMENT_COUNT_PER_PICTURE = 10;
  var MIN_LIKE_COUNT_PER_PICTURE = 15;
  var MAX_LIKE_COUNT_PER_PICTURE = 200;
  var COMMENT_LIMIT = 5;
  var HASH_TAGS_COUNT_LIMIT = 5;
  var HASH_TAG_LENGTH_LIMIT = 20;

  var COMMENT_TEMPLATES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var DESCRIPTION_TEMPLATES = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Отдыхаем...',
    'Вот это тачка!'
  ];

  var pictureTemplate = document.querySelector('#picture').content;
  var pictureListElement = document.querySelector('.pictures');
  var body = document.body;

  var getRandomInteger = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);

    rand = Math.floor(rand);

    return rand;
  };

  var getRandomItem = function (array) {
    return array[getRandomInteger(0, array.length - 1)];
  };

  var makeRandomComment = function (countOfSentences) {
    var tempComment = '';

    for (var i = 0; i < countOfSentences; i++) {
      tempComment = tempComment + (i > 0 ? ' ' : '') + getRandomItem(COMMENT_TEMPLATES);
    }

    return tempComment;
  };

  var getComments = function (commentsCount) {
    var tempComments = [];

    for (var i = 0; i < commentsCount; i++) {
      tempComments.push(makeRandomComment(getRandomInteger(1, 2)));
    }

    return tempComments;
  };

  var generatePictures = function (picturesCount) {
    var tempPictures = [];

    for (var i = 0; i < picturesCount; i++) {
      tempPictures.push({
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomInteger(MIN_LIKE_COUNT_PER_PICTURE, MAX_LIKE_COUNT_PER_PICTURE),
        comments: getComments(getRandomInteger(MIN_COMMENT_COUNT_PER_PICTURE, MAX_COMMENT_COUNT_PER_PICTURE)),
        description: getRandomItem(DESCRIPTION_TEMPLATES)
      });
    }

    return tempPictures;
  };

  var pictures = generatePictures(PICTURE_COUNT);

  var genetareDOMPicture = function (picture, picturesCount) {
    var pictureElement = pictureTemplate.cloneNode(true);

    var pictureElementImg = pictureElement.querySelector('.picture')
                                          .querySelector('img');
    pictureElementImg.setAttribute('src', picture.url);

    pictureElement.querySelector('.picture__likes')
                  .textContent = picture.likes;

    pictureElement.querySelector('.picture__comments')
                  .textContent = picture.comments.length;

    pictureElementImg.addEventListener('click', function () {
      showBigPicture(picturesCount);
    });

    return pictureElement;
  };

  var generateDOMPictures = function (domPictures) {
    var fragment = document.createDocumentFragment();

    domPictures.forEach(function (domPicture, index) {
      fragment.appendChild(genetareDOMPicture(domPicture, index));
    });

    return fragment;
  };

  pictureListElement.appendChild(generateDOMPictures(pictures));

  var showElement = function (selector) {
    var element = document.querySelector(selector);

    element.classList.remove('hidden');

    return element;
  };

  var fillElement = function (element, pictureNumber) {
    element.querySelector('.big-picture__img')
           .querySelector('img')
           .setAttribute('src', pictures[pictureNumber].url);

    element.querySelector('.likes-count')
           .textContent = pictures[pictureNumber].likes;

    element.querySelector('.comments-count')
           .textContent = pictures[pictureNumber].comments.length;

    element.querySelector('.social__caption')
           .textContent = pictures[pictureNumber].description;

    var commentTemplate = document.querySelector('.social__comment');
    var commentListElement = document.querySelector('.social__comments');

    while (commentListElement.firstChild) {
      commentListElement.removeChild(commentListElement.firstChild);
    }

    for (var i = 0; i < COMMENT_LIMIT; i++) {
      var commentElement = commentTemplate.cloneNode(true);

      commentElement.querySelector('.social__picture')
                    .setAttribute('src', 'img/avatar-' + getRandomInteger(1, 6) + '.svg');

      commentElement.querySelector('.social__text')
                    .textContent = pictures[pictureNumber].comments[i];

      commentListElement.appendChild(commentElement);
    }
  };

  var showBigPicture = function (pictureNumber) {
    var bigPicture = showElement('.big-picture');

    body.classList.add('modal-open');

    fillElement(bigPicture, pictureNumber);
  };

  var hideElement = function (selector) {
    var element = document.querySelector(selector);

    element.classList.add('visually-hidden');
  };

  hideElement('.social__comment-count');
  hideElement('.comments-loader');

  var cancelButton = document.querySelector('#picture-cancel');

  cancelButton.addEventListener('click', function () {
    document.querySelector('.big-picture').classList.add('hidden');
    body.classList.remove('modal-open');
  });

  var uploadFileInput = document.querySelector('#upload-file');
  var effectPanel = document.querySelector('.img-upload__overlay');
  var effectPanelCancel = document.querySelector('.img-upload__cancel');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectLine = document.querySelector('.effect-level__line');
  var effectLineDepth = document.querySelector('.effect-level__depth');
  var effectRadio = document.querySelectorAll('.effects__radio');
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
  var hashTagInput = document.querySelector('.text__hashtags');
  var imgUploadButton = document.querySelector('.img-upload__submit');

  uploadFileInput.addEventListener('change', function () {
    openEffectPopup();
  });

  var onEffectPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE && document.activeElement !== hashTagInput) {
      closeEffectPopup();
    }
  };

  var openEffectPopup = function () {
    imgUploadEffectLevel.classList.add('hidden');
    effectPanel.classList.remove('hidden');
    document.addEventListener('keydown', onEffectPopupEscPress);
  };

  var closeEffectPopup = function () {
    uploadFileInput.value = '';
    effectPanel.classList.add('hidden');
    document.removeEventListener('keydown', onEffectPopupEscPress);
  };

  effectPanelCancel.addEventListener('click', function () {
    closeEffectPopup();
  });

  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      startX = moveEvt.clientX;
      var effectLineWidth = effectLine.clientWidth;
      var pinOffset = effectPin.offsetLeft;
      var pinPosition = Math.round(pinOffset * 100 / effectLineWidth);
      setImgPreviewEffect(pinPosition);

      var totalShiftX = effectPin.offsetLeft - shiftX;

      if (totalShiftX >= 0 && totalShiftX <= effectLineWidth) {
        effectPin.style.left = totalShiftX + 'px';
        effectLineDepth.style.width = pinPosition + '%';
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var effectName = '';

  var setImgPreviewEffect = function (scaleValue) {
    switch (effectName) {
      case 'chrome':
        imgUploadPreview.style.filter = 'grayscale(' + scaleValue / 100 + ')';
        break;
      case 'sepia':
        imgUploadPreview.style.filter = 'sepia(' + scaleValue / 100 + ')';
        break;
      case 'marvin':
        imgUploadPreview.style.filter = 'invert(' + scaleValue + '%)';
        break;
      case 'phobos':
        imgUploadPreview.style.filter = 'blur(' + scaleValue * 3 / 100 + 'px)';
        break;
      case 'heat':
        var brightness = scaleValue * 2 / 100;
        brightness += 1;
        imgUploadPreview.style.filter = 'brightness(' + brightness + ')';
        break;
    }
  };

  effectRadio.forEach(function (radioButton) {
    radioButton.addEventListener('click', function () {
      effectName = radioButton.value;
      if (effectName === 'none') {
        imgUploadEffectLevel.classList.add('hidden');
      } else {
        imgUploadEffectLevel.classList.remove('hidden');
      }
      var effectLineWidth = effectLine.clientWidth;
      effectPin.style.left = effectLineWidth + 'px';
      effectLineDepth.style.width = '100%';

      imgUploadPreview.className = 'img-upload__preview';
      imgUploadPreview.style = '';
      imgUploadPreview.classList.add('effects__preview--' + effectName);
    });
  });

  var checkHashTagFirstSymbol = function (hashTags) {
    var result = false;
    if (hashTags.length === 1 && hashTags[0] === '') {
      return result;
    }
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].charAt(0) !== '#') {
        result = true;
        break;
      }
    }
    return result;
  };

  var checkHashTagIsEmpty = function (hashTags) {
    var result = false;
    if (hashTags.length === 1 && hashTags[0] === '') {
      return result;
    }
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].charAt(0) === '#' && hashTags[i].length === 1) {
        result = true;
        break;
      }
    }
    return result;
  };

  var checkHashTagDuplicates = function (hashTags) {
    var result = false;
    if (hashTags.length === 1 && hashTags[0] === '') {
      return result;
    }
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
  };

  var checkHashTagCount = function (hashTags) {
    var result = false;
    if (hashTags.length === 1 && hashTags[0] === '') {
      return result;
    }
    if (hashTags.length > HASH_TAGS_COUNT_LIMIT) {
      result = true;
    }
    return result;
  };

  var checkHashTagLength = function (hashTags) {
    var result = false;
    if (hashTags.length === 1 && hashTags[0] === '') {
      return result;
    }
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].length > HASH_TAG_LENGTH_LIMIT) {
        result = true;
        break;
      }
    }
    return result;
  };

  var checkFormValidation = function (hashTags) {
    var errorMessage = [];
    if (checkHashTagFirstSymbol(hashTags)) {
      errorMessage.push('Хэш-тег должен начинаться с символа # (решётка).');
    }
    if (checkHashTagIsEmpty(hashTags)) {
      errorMessage.push('Хеш-тег не может состоять только из одной решётки.');
    }
    if (checkHashTagDuplicates(hashTags)) {
      errorMessage.push('Один и тот же хэш-тег не может быть использован дважды.');
    }
    if (checkHashTagCount(hashTags)) {
      errorMessage.push('Нельзя указать больше пяти хэш-тегов.');
    }
    if (checkHashTagLength(hashTags)) {
      errorMessage.push('Максимальная длина одного хэш-тега 20 символов, включая решётку.');
    }
    return errorMessage.join('\r\n');
  };

  imgUploadButton.addEventListener('click', function () {
    var hashTags = hashTagInput.value.split(' ');
    var validationMessage = checkFormValidation(hashTags);
    hashTagInput.setCustomValidity(validationMessage);
  });

  hashTagInput.addEventListener('keydown', function () {
    hashTagInput.setCustomValidity('');
  });

})();
