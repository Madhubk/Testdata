(function () {
    'use strict';

    angular
        .module("Application")
        .factory("apiService", ApiService);

    ApiService.$inject = ["$rootScope", "$http", "$q", "$localStorage", "$state", "$timeout", "$location", "APP_CONSTANT", "authService", "toastr", "appConfig"];

    function ApiService($rootScope, $http, $q, $localStorage, $state, $timeout, $location, APP_CONSTANT, authService, toastr, appConfig) {
        var exports = {
            get: Get,
            post: Post,
            logout: Logout,
            clearLocalStorageAndLogout: ClearLocalStorageAndLogout
        };

        return exports;

        function Get(apiUrl, apiName, token) {
            var deferred = $q.defer();
            var _token;
            if (token) {
                _token = token;
            } else {
                _token = authService.getUserInfo().AuthToken;
            }
            $http({
                method: "GET",
                url: APP_CONSTANT.URL[apiUrl] + apiName,
                headers: {
                    'Authorization': _token,
                }
            }).then(function SuccessCallback(response) {
                if (response.data) {
                    deferred.resolve(response);
                } else {
                    // toastr.error("Invalid Response...!");
                }
            }, function ErrorCallback(response) {
                if (response.data) {
                    response.data.Messages.map(function (value, key) {
                        if (value.MessageDesc === "Authorization has been denied for this request") {
                            ClearLocalStorageAndLogout();
                            // Logout();p
                            // toastr.error(value.MessageDesc, "Invalid Token!");
                        }
                    });
                } else {
                    // toastr.error("Invalid Response...!");
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function Post(apiUrl, apiName, input, token) {
            var deferred = $q.defer();
            var _token;
            if (token) {
                _token = token;
            } else {
                _token = authService.getUserInfo().AuthToken;
            }
            $http({
                method: "POST",
                url: APP_CONSTANT.URL[apiUrl] + apiName,
                data: input,
                headers: {
                    'Authorization': _token,
                }
            }).then(function SuccessCallback(response) {
                if (response.data) {
                    deferred.resolve(response);
                } else {
                    // toastr.error("Invalid Response...!");
                }
            }, function ErrorCallback(response) {
                if (response.data) {
                    if (response.data.Messages) {
                        if (response.data.Messages.length > 0) {
                            response.data.Messages.map(function (value, key) {
                                if (value.MessageDesc === "Authorization has been denied for this request") {
                                    ClearLocalStorageAndLogout();
                                    // Logout();
                                    // toastr.error(value.MessageDesc, "Invalid Token!");
                                }
                            });
                        }
                    }
                } else {
                    // toastr.error("Invalid Response...!");
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function Logout() {
            $rootScope.EnteredUrl = $location.path();

            exports.get("authAPI", appConfig.Entities.Token.API.Logout.Url).then(function SuccessCallback(response) {
                if (response.data) {
                    if (response.data.Response === "Logout Successfull") {
                        // toastr.success("Logged out successfully...!");
                    } else if (response.data.Response === "Logout Not Successfull") {
                        // toastr.warning("Could not logout...!");
                    }
                } else {
                    // toastr.error("Invalid Response...!");
                }
            }, function ErrorCallback(response) {
                console.log(response);
            });

            ClearLocalStorageAndLogout();
        }

        function ClearLocalStorageAndLogout() {
            var _isAppTC = $location.host().indexOf("trustcenter");

            appConfig.Entities.Menu.List = [];
            authService.setUserInfo();

            $timeout(function () {
                if (_isAppTC === -1) {
                    $location.path("/login").search({
                        continue: $rootScope.EnteredUrl
                    });
                } else {
                    $location.path("/login").search({});
                }
            }, 200);
        }
    }
})();
