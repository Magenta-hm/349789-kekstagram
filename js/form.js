'use strict';

(function formModule() {
  var uploadFileInput = document.querySelector('#upload-file');
  var effectPanelCancel = document.querySelector('.img-upload__cancel');
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
  var imgUploadButton = document.querySelector('.img-upload__submit');
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
      var pinPosition = Math.round(pinOffset * window.const.MAX_EFFECT_VALUE / effectLineWidth);
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
      var pinPosition = Math.round(pinOffset * window.const.MAX_EFFECT_VALUE / effectLineWidth);
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
        imgUploadPreview.style = '';
      }
      imgUploadPreview.classList.add('effects__preview--' + effectName);
      effectLevelValue.value = window.const.MAX_EFFECT_VALUE;
    });
  });

  var onEffectPopupEscPress = function (evt) {
    if (evt.keyCode === window.const.ESC_KEYCODE && document.activeElement !== hashTagInput) {
      closeEffectPopup();
    }
  };

  var openEffectPopup = function () {
    effectRadioNone.checked = true;
    imgUploadPreview.style = '';
    imgUploadPreview.className = 'img-upload__preview';
    effectLevelValue.value = window.const.MAX_EFFECT_VALUE;
    imgUploadEffectLevel.classList.add('hidden');
    effectPanel.classList.remove('hidden');
    document.addEventListener('keydown', onEffectPopupEscPress);
  };

  var closeEffectPopup = function () {
    uploadFileInput.value = '';
    effectPanel.classList.add('hidden');
    document.removeEventListener('keydown', onEffectPopupEscPress);
  };

  var setImgPreviewEffect = function (scaleValue) {
    switch (effectName) {
      case 'chrome':
        imgUploadPreview.style.filter = 'grayscale(' + scaleValue / window.const.MAX_EFFECT_VALUE + ')';
        break;
      case 'sepia':
        imgUploadPreview.style.filter = 'sepia(' + scaleValue / window.const.MAX_EFFECT_VALUE + ')';
        break;
      case 'marvin':
        imgUploadPreview.style.filter = 'invert(' + scaleValue + '%)';
        break;
      case 'phobos':
        imgUploadPreview.style.filter = 'blur(' + scaleValue * window.const.MAX_BLUR_PX / window.const.MAX_EFFECT_VALUE + 'px)';
        break;
      case 'heat':
        var brightness = scaleValue * window.const.MAX_BRIGHTNESS / window.const.MAX_EFFECT_VALUE;
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
    var validationMessage = window.validation.checkFormValidation(hashTags);
    hashTagInput.setCustomValidity(validationMessage);
  });

  hashTagInput.addEventListener('input', function () {
    hashTagInput.setCustomValidity('');
  });

})();
