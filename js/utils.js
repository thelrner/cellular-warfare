(function() {

  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils = {};

  Utils.plus = function(array1, array2) {
    if (array1.length !== array2.length) {
      throw "can't add different size arrays";
    };

    var sumArray = [];
    for (var i = 0; i < array1.length; i++) {
      sumArray[i] = array1[i] + array2[i];
    };

    return sumArray;      //could also have modified array1 in-place
  };

  Utils.equals = function(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    };

    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      };
    };

    return true;
  };

  Utils.isOppositeDeltas = function(array1, array2) {
    if (array1.length !== array2.length) {
      throw "can't add different size arrays";
    };

    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== (-1 * array2[i])) {
        return false;
      };
    };

    return true;
  };

  Utils.includes = function(bigArray, smallArray) {
    for (var i = 0; i < bigArray.length; i++) {
      if (Utils.equals(bigArray[i], smallArray)) {
        return true;
      };
    };

    return false;
  };

})();
