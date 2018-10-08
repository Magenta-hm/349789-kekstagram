'use strict';

(function formModule() {

  var uploadFileInputElement = document.querySelector('#upload-file');
  var effectPanelCancelElement = document.querySelector('#upload-cancel');
  var effectPinElement = document.querySelector('.effect-level__pin');
  var effectLineElement = document.querySelector('.effect-level__line');
  var effectLineDepthElement = document.querySelector('.effect-level__depth');
  var effectLevelValueElement = document.querySelector('.effect-level__value');
  var effectRadioElement = document.querySelectorAll('.effects__radio');
  var effectRadioNoneElement = document.querySelector('#effect-none');
  var imgUploadEffectLevelElement = document.querySelector('.img-upload__effect-level');
  var imgUploadPreviewElement = document.querySelector('.img-upload__preview');
  var effectPanelElement = document.querySelector('.img-upload__overlay');
  var hashTagInputElement = document.querySelector('.text__hashtags');
  var commentInputElement = document.querySelector('.text__description');
  var imgUploadButtonElement = document.querySelector('.img-upload__submit');
  var form = document.querySelector('.img-upload__form');
  var main = document.querySelector('main');
  var scaleButtonMinusElement = document.querySelector('.scale__control--smaller');
  var scaleButtonPlusElement = document.querySelector('.scale__control--bigger');
  var scaleInputElement = document.querySelector('.scale__control--value');
  var effectName = '';

  uploadFileInputElement.addEventListener('change', function () {
    openEffectPopup();
  });

  effectPanelCancelElement.addEventListener('click', function () {
    closeEffectPopup();
  });

  effectPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      startX = moveEvt.clientX;
      var effectLineWidth = effectLineElement.clientWidth;
      var pinOffset = effectPinElement.offsetLeft;
      var pinPosition = Math.round(pinOffset * window.constants.MAX_EFFECT_VALUE / effectLineWidth);
      var totalShiftX = effectPinElement.offsetLeft - shiftX;

      setImgPreviewEffect(pinPosition);

      if (totalShiftX >= 0 && totalShiftX <= effectLineWidth) {
        effectPinElement.style.left = totalShiftX + 'px';
        effectLineDepthElement.style.width = pinPosition + '%';
      }

      effectLevelValueElement.value = pinPosition;

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      var shiftX = startX - upEvt.clientX;
      startX = upEvt.clientX;
      var effectLineWidth = effectLineElement.clientWidth;
      var pinOffset = effectPinElement.offsetLeft;
      var pinPosition = Math.round(pinOffset * window.constants.MAX_EFFECT_VALUE / effectLineWidth);
      var totalShiftX = effectPinElement.offsetLeft - shiftX;

      setImgPreviewEffect(pinPosition);

      if (totalShiftX >= 0 && totalShiftX <= effectLineWidth) {
        effectPinElement.style.left = totalShiftX + 'px';
        effectLineDepthElement.style.width = pinPosition + '%';
      }

      effectLevelValueElement.value = pinPosition;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  effectRadioElement.forEach(function (radioButton) {
    radioButton.addEventListener('click', function () {
      effectName = radioButton.value;

      if (effectName === 'none') {
        imgUploadEffectLevelElement.classList.add('hidden');
      } else {
        imgUploadEffectLevelElement.classList.remove('hidden');
      }

      var effectLineWidth = effectLineElement.clientWidth;

      effectPinElement.style.left = effectLineWidth + 'px';
      effectLineDepthElement.style.width = '100%';

      imgUploadPreviewElement.className = 'img-upload__preview';

      if (effectName === 'phobos') {
        imgUploadPreviewElement.style.filter = 'blur(3px)';
      } else {
        imgUploadPreviewElement.style.filter = '';
      }

      imgUploadPreviewElement.classList.add('effects__preview--' + effectName);
      effectLevelValueElement.value = window.constants.MAX_EFFECT_VALUE;

    });

  });

  var showMessage = function (success) {
    var template = document.querySelector(success ? '#success' : '#error')
                           .content
                           .querySelector('section');
    var element = template.cloneNode(true);
    var buttons = element.querySelectorAll(success ? '.success__button' : '.error__button');

    var hideMessageEscPress = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        hideMessage();
      }
    };

    var hideMessage = function () {
      main.removeChild(element);

      document.removeEventListener('keydown', hideMessageEscPress);
      document.removeEventListener('click', hideMessage);
    };

    main.insertAdjacentElement('afterbegin', element);
    buttons.forEach(function (button) {
      button.addEventListener('click', hideMessage);
    });

    document.addEventListener('keydown', hideMessageEscPress);
    document.addEventListener('click', hideMessage);

  };

  var onSuccess = function () {
    closeEffectPopup();
    showMessage(true);
  };

  var onError = function () {
    closeEffectPopup();
    showMessage(false);
  };

  var onSubmit = function (evt) {
    evt.preventDefault();

    window.backend.load('POST', 'https://js.dump.academy/kekstagram',
        onSuccess, onError, new FormData(form));
  };

  var onEffectPopupEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE &&
        document.activeElement !== hashTagInputElement &&
        document.activeElement !== commentInputElement) {
      closeEffectPopup();
    }
  };

  var openEffectPopup = function () {
    effectRadioNoneElement.checked = true;
    scaleInputElement.value = 100 + '%';
    imgUploadPreviewElement.style = '';
    imgUploadPreviewElement.style.transform = 'scale(1.0)';
    imgUploadPreviewElement.className = 'img-upload__preview';
    effectLevelValueElement.value = window.constants.MAX_EFFECT_VALUE;
    imgUploadEffectLevelElement.classList.add('hidden');
    effectPanelElement.classList.remove('hidden');

    document.addEventListener('keydown', onEffectPopupEscPress);
    form.addEventListener('submit', onSubmit);
  };

  var closeEffectPopup = function () {
    uploadFileInputElement.value = '';
    effectPanelElement.classList.add('hidden');

    document.removeEventListener('keydown', onEffectPopupEscPress);
    form.removeEventListener('submit', onSubmit);
    form.reset();
  };

  var setImgPreviewEffect = function (scaleValue) {
    switch (effectName) {
      case 'chrome':
        imgUploadPreviewElement.style.filter = 'grayscale(' + scaleValue / window.constants.MAX_EFFECT_VALUE + ')';
        break;

      case 'sepia':
        imgUploadPreviewElement.style.filter = 'sepia(' + scaleValue / window.constants.MAX_EFFECT_VALUE + ')';
        break;

      case 'marvin':
        imgUploadPreviewElement.style.filter = 'invert(' + scaleValue + '%)';
        break;

      case 'phobos':
        imgUploadPreviewElement.style.filter = 'blur(' + scaleValue * window.constants.MAX_BLUR_PX / window.constants.MAX_EFFECT_VALUE + 'px)';
        break;

      case 'heat':
        var brightness = scaleValue * window.constants.MAX_BRIGHTNESS / window.constants.MAX_EFFECT_VALUE;
        brightness += 1;
        imgUploadPreviewElement.style.filter = 'brightness(' + brightness + ')';
        break;
    }
  };

  imgUploadButtonElement.addEventListener('click', function () {
    var hashTags = hashTagInputElement.value.split(' ');

    // очистим массив от пустых элементов
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i] === '') {
        hashTags.splice(i, 1);
        i--;
      }
    }

    var validationHashTagsMessage = window.validation.checkHashTagsValidation(hashTags);
    hashTagInputElement.setCustomValidity(validationHashTagsMessage);

    var validationCommentMessage = window.validation.checkCommentValidation(commentInputElement.value);
    commentInputElement.setCustomValidity(validationCommentMessage);

  });

  hashTagInputElement.addEventListener('input', function () {
    hashTagInputElement.setCustomValidity('');
  });

  commentInputElement.addEventListener('input', function () {
    commentInputElement.setCustomValidity('');
  });

  var changePictureSize = function (plus) {
    var scaleValue = scaleInputElement.value;

    scaleValue = parseFloat(scaleValue) / 100;

    if (plus) {
      if (scaleValue + window.constants.SCALE_STEP <= 1) {
        scaleValue = scaleValue + window.constants.SCALE_STEP;
      }
    } else {
      if (scaleValue - window.constants.SCALE_STEP >= 0.25) {
        scaleValue = scaleValue - window.constants.SCALE_STEP;
      }
    }

    imgUploadPreviewElement.style.transform = 'scale(' + scaleValue + ')';
    scaleInputElement.value = scaleValue * 100 + '%';

  };

  scaleButtonMinusElement.addEventListener('click', function () {
    changePictureSize(false);
  });

  scaleButtonPlusElement.addEventListener('click', function () {
    changePictureSize(true);
  });

})();
