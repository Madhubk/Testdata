(function () {
    'use strict';

    angular
        .module("Application")
        .factory("apiService", ApiService);

    ApiService.$inject = ["$http", "$q", "$timeout", "$location", "APP_CONSTANT", "authService", "appConfig"];

    function ApiService($http, $q, $timeout, $location, APP_CONSTANT, authService, appConfig) {
        var exports = {
            get: Get,
            post: Post,
            logout: Logout
        };

        return exports;

        function Get(apiUrl, apiName, token) {
            var _queryString = $location.search();
            if(_queryString && _queryString.lpk){
                if(_queryString.lpk == authService.getUserInfo().LoginPK){

                }
            }

            var deferred = $q.defer();
            var _headers = {
                "Authorization": token ? token : authService.getUserInfo().AuthToken
            }

            $http({
                method: "GET",
                url: APP_CONSTANT.URL[apiUrl] + apiName,
                headers: _headers
            }).then(function SuccessCallback(response) {
                if (response.data) {
                    deferred.resolve(response);
                } else {
                    console.log("Invalid Response...!");
                }
            }, function ErrorCallback(response) {
                if (response.data) {
                    if (response.data.Messages) {
                        if (response.data.Messages.length > 0) {
                            response.data.Messages.map(function (value, key) {
                                if (value.MessageDesc === "Authorization has been denied for this request") {
                                    ClearLocalStorage();
                                }
                            });
                        }
                    }
                } else {
                    console.log("Invalid Response...!");
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function Post(apiUrl, apiName, input, token) {
            var deferred = $q.defer();
            var _headers = {
                "Authorization": token ? token : authService.getUserInfo().AuthToken
            }

            $http({
                method: "POST",
                url: APP_CONSTANT.URL[apiUrl] + apiName,
                data: input,
                headers: _headers
            }).then(function SuccessCallback(response) {
                if (response.data) {
                    deferred.resolve(response);
                } else {
                    console.log("Invalid Response...!");
                }
            }, function ErrorCallback(response) {
                if (response.data) {
                    if (response.data.Messages) {
                        if (response.data.Messages.length > 0) {
                            response.data.Messages.map(function (value, key) {
                                if (value.MessageDesc === "Authorization has been denied for this request") {
                                    ClearLocalStorage();
                                }
                            });
                        }
                    }
                } else {
                    console.log("Invalid Response...!");
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function Logout() {
            Get("authAPI", appConfig.Entities.Token.API.Logout.Url).then(function SuccessCallback(response) {
                if (response.data) {} else {
                    console.log("Logout Unsuccessful...!");
                }
            }, function ErrorCallback(response) {
                console.log(response);
            });

            $timeout(function () {
                ClearLocalStorage();
            });
        }

        function ClearLocalStorage() {
            authService.setUserInfo();

            $timeout(function () {
                $location.path("/login").search({});
            }, 200);
        }
    }
})();
