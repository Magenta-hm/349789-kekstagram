'use strict';

(function formModule() {
  var uploadFileInput = document.querySelector('#upload-file');
  var effectPanelCancel = document.querySelector('#upload-cancel');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectLine = document.querySelector('.effect-level__line');
  var effectLineDepth = document.querySelector('.effect-level__depth');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectRadio = document.querySelectorAll('.effects__radio');
  var effectRadioNone = document.querySelector('#effect-none');
  var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var effectPanel = document.querySelector('.img-upload__overlay');
  var hashTagInput = document.querySelector('.text__hashtags');
  var commentInput = document.querySelector('.text__description');
  var imgUploadButton = document.querySelector('.img-upload__submit');
  var form = document.querySelector('.img-upload__form');
  var main = document.querySelector('main');
  var scaleButtonMinus = document.querySelector('.scale__control--smaller');
  var scaleButtonPlus = document.querySelector('.scale__control--bigger');
  var scaleInput = document.querySelector('.scale__control--value');
  var effectName = '';

  uploadFileInput.addEventListener('change', function () {
    openEffectPopup();
  });

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
      var pinPosition = Math.round(pinOffset * window.constants.MAX_EFFECT_VALUE / effectLineWidth);
      setImgPreviewEffect(pinPosition);

      var totalShiftX = effectPin.offsetLeft - shiftX;

      if (totalShiftX >= 0 && totalShiftX <= effectLineWidth) {
        effectPin.style.left = totalShiftX + 'px';
        effectLineDepth.style.width = pinPosition + '%';
      }

      effectLevelValue.value = pinPosition;

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      var shiftX = startX - upEvt.clientX;
      startX = upEvt.clientX;
      var effectLineWidth = effectLine.clientWidth;
      var pinOffset = effectPin.offsetLeft;
      var pinPosition = Math.round(pinOffset * window.constants.MAX_EFFECT_VALUE / effectLineWidth);
      setImgPreviewEffect(pinPosition);

      var totalShiftX = effectPin.offsetLeft - shiftX;

      if (totalShiftX >= 0 && totalShiftX <= effectLineWidth) {
        effectPin.style.left = totalShiftX + 'px';
        effectLineDepth.style.width = pinPosition + '%';
      }

      effectLevelValue.value = pinPosition;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

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
      if (effectName === 'phobos') {
        imgUploadPreview.style.filter = 'blur(3px)';
      } else {
        imgUploadPreview.style.filter = '';
      }
      imgUploadPreview.classList.add('effects__preview--' + effectName);
      effectLevelValue.value = window.constants.MAX_EFFECT_VALUE;
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
    window.backend.load('POST', 'https://js.dump.academy/kekstagram',
        onSuccess, onError, new FormData(form));
    evt.preventDefault();
  };

  var onEffectPopupEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE &&
        document.activeElement !== hashTagInput &&
        document.activeElement !== commentInput) {
      closeEffectPopup();
    }
  };

  var openEffectPopup = function () {
    effectRadioNone.checked = true;
    scaleInput.value = 100 + '%';
    imgUploadPreview.style = '';
    imgUploadPreview.style.transform = 'scale(1.0)';
    imgUploadPreview.className = 'img-upload__preview';
    effectLevelValue.value = window.constants.MAX_EFFECT_VALUE;
    imgUploadEffectLevel.classList.add('hidden');
    effectPanel.classList.remove('hidden');
    document.addEventListener('keydown', onEffectPopupEscPress);
    form.addEventListener('submit', onSubmit);
  };

  var closeEffectPopup = function () {
    uploadFileInput.value = '';
    effectPanel.classList.add('hidden');
    document.removeEventListener('keydown', onEffectPopupEscPress);
    form.removeEventListener('submit', onSubmit);
    form.reset();
  };

  var setImgPreviewEffect = function (scaleValue) {
    switch (effectName) {
      case 'chrome':
        imgUploadPreview.style.filter = 'grayscale(' + scaleValue / window.constants.MAX_EFFECT_VALUE + ')';
        break;
      case 'sepia':
        imgUploadPreview.style.filter = 'sepia(' + scaleValue / window.constants.MAX_EFFECT_VALUE + ')';
        break;
      case 'marvin':
        imgUploadPreview.style.filter = 'invert(' + scaleValue + '%)';
        break;
      case 'phobos':
        imgUploadPreview.style.filter = 'blur(' + scaleValue * window.constants.MAX_BLUR_PX / window.constants.MAX_EFFECT_VALUE + 'px)';
        break;
      case 'heat':
        var brightness = scaleValue * window.constants.MAX_BRIGHTNESS / window.constants.MAX_EFFECT_VALUE;
        brightness += 1;
        imgUploadPreview.style.filter = 'brightness(' + brightness + ')';
        break;
    }
  };

  imgUploadButton.addEventListener('click', function () {
    var hashTags = hashTagInput.value.split(' ');
    // очистим массив от пустых элементов
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i] === '') {
        hashTags.splice(i, 1);
        i--;
      }
    }
    var validationHashTagsMessage = window.validation.checkHashTagsValidation(hashTags);
    hashTagInput.setCustomValidity(validationHashTagsMessage);

    var validationCommentMessage = window.validation.checkCommentValidation(commentInput.value);
    commentInput.setCustomValidity(validationCommentMessage);
  });

  hashTagInput.addEventListener('input', function () {
    hashTagInput.setCustomValidity('');
  });

  commentInput.addEventListener('input', function () {
    commentInput.setCustomValidity('');
  });

  var changePictureSize = function (plus) {
    var scaleValue = scaleInput.value;
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
    imgUploadPreview.style.transform = 'scale(' + scaleValue + ')';
    scaleInput.value = scaleValue * 100 + '%';
  };

  scaleButtonMinus.addEventListener('click', function () {
    changePictureSize(false);
  });

  scaleButtonPlus.addEventListener('click', function () {
    changePictureSize(true);
  });

})();
