'use strict';

(function backendModule() {

  window.backend = {
    load: function (method, url, onLoad, onError, data) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';
      xhr.timeout = window.constants.XHR_TIMEOUT; // 10s

      xhr.addEventListener('load', function () {
        if (xhr.status === window.constants.XHR_SUCCESS_CODE) {
          onLoad(xhr.response);
        } else {
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open(method, url);
      xhr.send(data);
    }

  };

})();
