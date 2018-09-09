'use strict';

(function pictureModule() {
  var PICTURE_NUMBER = 25;
  var COMMENT_TEMPLATES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var DESCRIPTION_TEMPLATES = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Отдыхаем...', 'Вот это тачка!'];

  var pictureTemplate = document.querySelector('#picture').content;
  var pictureListElement = document.querySelector('.pictures');

  var getRandomInteger = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);

    rand = Math.floor(rand);

    return rand;
  };

  var getRandomItem = function (array) {
    return array[getRandomInteger(0, array.length - 1)];
  };

  var getSingleComment = function (count) {
    var tempComment = '';

    for (var i = 0; i < count; i++) {
      tempComment = tempComment + (i > 0 ? ' ' : '') + getRandomItem(COMMENT_TEMPLATES);
    }

    return tempComment;
  };

  var getComments = function (commentsCount) {
    var tempComments = [];

    for (var i = 0; i < commentsCount; i++) {
      tempComments[i] = getSingleComment(getRandomInteger(1, 2));
    }

    return tempComments;
  };

  var generatePictures = function (picturesCount) {
    var tempPictures = [];

    for (var i = 0; i < picturesCount; i++) {
      tempPictures[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomInteger(15, 200),
        comments: getComments(getRandomInteger(5, 10)),
        description: getRandomItem(DESCRIPTION_TEMPLATES)
      };
    }

    return tempPictures;
  };

  var pictures = generatePictures(PICTURE_NUMBER);

  var genetareDOMPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture')
                  .querySelector('img')
                  .setAttribute('src', picture.url);
    pictureElement.querySelector('.picture__likes')
                  .textContent = picture.likes;
    pictureElement.querySelector('.picture__comments')
                  .textContent = picture.eyesColor;

    return pictureElement;
  };

  var generateDOMPictures = function (arr) {
    var fragment = document.createDocumentFragment();

    arr.forEach(function (item) {
      fragment.appendChild(genetareDOMPicture(item));
    });

    return fragment;
  };

  pictureListElement.appendChild(generateDOMPictures(pictures));

  var showAndFillElement = function (elementName) {
    var element = document.querySelector(elementName);

    element.classList.remove('hidden');
    element.querySelector('.big-picture__img')
           .querySelector('img')
           .setAttribute('src', pictures[0].url);
    element.querySelector('.likes-count')
           .textContent = pictures[0].likes;
    element.querySelector('.comments-count')
           .textContent = pictures[0].comments.length;
    element.querySelector('.social__caption')
           .textContent = pictures[0].description;

    var commentTemplate = document.querySelector('.social__comment');
    var commentListElement = document.querySelector('.social__comments');

    while (commentListElement.firstChild) {
      commentListElement.removeChild(commentListElement.firstChild);
    }

    pictures[0].comments.forEach(function (comment) {
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture')
                    .setAttribute('src', 'img/avatar-' + getRandomInteger(1, 6) + '.svg');
      commentElement.querySelector('.social__text')
                    .textContent = comment;
      commentListElement.appendChild(commentElement);
    });

  };

  showAndFillElement('.big-picture');

  var hideElement = function (elementName) {
    var element = document.querySelector(elementName);
    element.classList.add('visually-hidden');
  };

  hideElement('.social__comment-count');
  hideElement('.comments-loader');

})();
