'use strict';

(function pictureModule() {
  var PICTURE_COUNT = 25;
  var MIN_COMMENT_COUNT_PER_PICTURE = 5;
  var MAX_COMMENT_COUNT_PER_PICTURE = 10;
  var MIN_LIKE_COUNT_PER_PICTURE = 15;
  var MAX_LIKE_COUNT_PER_PICTURE = 200;

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
  var body = document.querySelector('body');

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

    pictureElementImg.onclick = function () {
      showBigPicture(picturesCount);
    };

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

    for (var i = 0; i < 5; i++) {
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

  cancelButton.onclick = function () {
    document.querySelector('.big-picture').classList.add('hidden');
    body.classList.remove('modal-open');
  };
})();
