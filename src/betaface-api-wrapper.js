/**
 * Created by cenkce on 1/11/16.
 */

/**
 * Betaface json api angularjs wrapper.
 * @versin
 * @module BetafaceApiService
 */
(function (angular) {

    var _promise, $http;

    /**
     * @param $q
     * @param http
     * @constructor
     */
    function BetafaceApiService($q, http) {
        _promise = $q;
        $http = http;
    };

    BetafaceApiService.$inject = ['$q', '$http'];

    var apiModule = angular.module('betaface.wrapper', []);
    apiModue.service('betafaceApiService', BetafaceApiService);

    //--------------- Private Methods --------------------

    //creates request object with common poperties
    function createRequest(){
        return {
            api_key:'',
            api_secret:''
        };
    }

    /**
     * Sends given request to specified endpoint
     * @param method
     * @param request
     * @returns {*}
     */
    function send(method, request){
        var deferred = _promise.defer();

        $http({
            url: 'http://www.betafaceapi.com/service_json.svc/'+method,
            method: 'POST',
            data: request
        }).then(
            function (response) {
                if (response.data.int_response == 1) {
                    //queued
                    setTimeout(function () {
                        send(method, request).then(function (data) {
                            //console.log('retried : ', data);
                            deferred.resolve(data);
                        }, function (data) {
                            deferred.reject(data);
                        });

                    }, 250);
                    return;
                } else if (response.data.int_response != 0) {
                    //error
                    return deferred.reject(response.data);
                }
                deferred.resolve(response.data);
            },
            function (response) {
                //error
                deferred.reject(response.data);
            }
        );

        return deferred.promise;
    }

    //--------------- End of Private Methods --------------------

    /**
     * Uploads bulk images to betaface
     * @param requests
     * @returns {*}
     */
    BetafaceApiService.prototype.uploadImages = function(requests){
        var promises = [];
        for(var r in requests){
            promises.push(this.uploadImage(requests[r]));
        }

        return _promise.all(promises);
    };

    /**
     * Creates basic request object with upload properties.
     * @param original_filename
     * @param detection_flags
     * @param image_data
     * @param url
     * @returns {*}
     */
    BetafaceApiService.prototype.createUploadImageRequest = function(original_filename, detection_flags, image_data, url){
        var data = createRequest();
            data.original_filename = original_filename;
            data.detection_flags   = detection_flags;
            data.image_base64      = image_data;
            data.url               = url;

        return data;
    };

    /**
     * Uploads image data to betaface
     * @param request
     * @returns {*}
     */
    BetafaceApiService.prototype.uploadImage = function(request){
        return send('UploadImage', request);
    };

    /**
     * Compares similarity of faces
     * @param String face_id
     * @param Array targets
     * @returns {*}
     */
    BetafaceApiService.prototype.recognizeFaces = function(face_id, targets){
        var request = createRequest();

        request.faces_uids = face_id;
        request.targets    = targets.join();

        return send('RecognizeFaces', request);
    };

    /**
     * Gets faces matching data of specified faces by face_uid
     * @param recognize_uid
     * @returns {*}
     */
    BetafaceApiService.prototype.getRecognizeResult = function(recognize_uid){
        var request = createRequest();
        request.recognize_uid = recognize_uid;

        return send('GetRecognizeResult', request);
    };

    /**
     * Gets image file info with faces data
     * @param img_uid
     * @returns {*}
     */
    BetafaceApiService.prototype.getImageInfo = function(img_uid){
        var request = createRequest();
            request.img_uid = img_uid;

        return send('GetImageInfo', request);
    };

    /**
     * Gets specified face info with cropped Uint8Array data
     * @param face_uid
     * @returns {*}
     */
    BetafaceApiService.prototype.getFaceImage = function(face_uid){
        var request = createRequest();
            request.face_uid = face_uid;

        return send('GetFaceImage', request);
    };

})(window.angular);
