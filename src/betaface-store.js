/**
 * Created by cenkce on 1/18/16.
 */
define('BetafaceFaceStore', [], function () {
    'use strict';
    var _faces = [];

    var BetafaceFaceStore = function (faces) {
        _faces = angular.copy(faces);
    };

    BetafaceFaceStore.prototype.getFaces = function () {
    };

    return BetafaceFaceStore;
});