(function () {
    "use strict";

    angular
        .module("Application")
        .factory("pageAccessService", PageAccessService);

    PageAccessService.$inject = ["$rootScope", "$location", "$timeout", "$q", "authService", "toastr"];

    function PageAccessService($rootScope, $location, $timeout, $q, authService, toastr) {
        var _locationPath = $location.path();
        var _pageName = _locationPath.split('/')[1];
        var _locationQueryStr = $location.search();
        var exports = {
            CheckAccess: CheckAccess,
            CheckAuthToken: CheckAuthToken
        };
        return exports;

        function CheckAuthToken(pageName) {
            var _pageName = angular.copy(pageName);

            if (_pageName) {
                if (_pageName === "login") {
                    if (!authService.getUserInfo().AuthToken) {
                        return true;
                    } else {
                        $timeout(function () {
                            if ($rootScope.EnteredUrl !== "" && $rootScope.EnteredUrl !== " " && $rootScope.EnteredUrl !== undefined && $rootScope.EnteredUrl !== null && $rootScope.EnteredUrl != "/login") {
                                $location.path($rootScope.EnteredUrl).search({});
                            } else {
                                $location.path(authService.getUserInfo().InternalUrl).search({});
                            }
                        });

                        return false;
                    }
                }
            } else {
                if (authService.getUserInfo().AuthToken) {
                    return true;
                } else {
                    $location.path("/login").search({
                        continue: $rootScope.EnteredUrl
                    });

                    return false;
                }
            }
        }

        function CheckAccess(pageName) {
            var deferred = $q.defer();
            _locationPath = $location.path();
            _locationQueryStr = $location.search();
            _pageName = angular.copy(pageName);

            if (_pageName) {
                if (_pageName === "/login") {
                    if (authService.getUserInfo().AuthToken) {
                        CheckLoginAccess().then(function (response) {
                            deferred.resolve(response);
                        });
                    } else {
                        deferred.resolve(true);
                    }
                } else {
                    if (authService.getUserInfo().AuthToken) {
                        CheckAuthAccess().then(function (response) {
                            deferred.resolve(response);
                        });
                    } else {
                        var _queryString = {};
                        if (_locationPath != "/login") {
                            _queryString.continue = _locationPath;
                        }
                        $location.path("/login").search(_queryString);
                    }
                }
            } else {
                if (authService.getUserInfo().AuthToken) {
                    CheckAuthAccess().then(function (response) {
                        deferred.resolve(response);
                    });
                } else {
                    $location.path("/login").search({
                        continue: _locationPath
                    });
                }
            }
            return deferred.promise;
        }

        function CheckLoginAccess() {
            var deferred = $q.defer();

            if (_locationPath !== "" && _locationPath !== " " && _locationPath !== undefined && _locationPath !== null && _locationPath !== "/login") {
                CheckPageAccess()
                    .then(function (response) {
                        if (response == true) {
                            $location.path(_locationPath).search({});
                        } else {
                            $location.path(authService.getUserInfo().InternalUrl);
                        }
                    });
            } else {
                CheckPageAccess()
                    .then(function (response) {
                        if (response == true) {
                            if (_locationQueryStr.continue) {
                                $location.path(_locationQueryStr.continue).search({});
                            } else {
                                $location.path(authService.getUserInfo().InternalUrl).search({});
                            }
                        } else {
                            $location.path(authService.getUserInfo().InternalUrl).search({});
                        }
                    });
            }
            return deferred.promise;
        }

        function CheckAuthAccess() {
            var deferred = $q.defer();

            CheckPageAccess()
                .then(function (response) {
                    if (response == true) {
                        deferred.resolve(response);
                    } else {
                        toastr.error("You don't have access to this page...!");
                        $location.path(authService.getUserInfo().InternalUrl);
                    }
                });
            return deferred.promise;
        }

        function CheckPageAccess() {
            var deferred = $q.defer();
            var _listString = JSON.stringify(angular.copy(authService.getUserInfo().AccessMenuList)).toLowerCase();
            var _index = _listString.indexOf(_pageName.toLowerCase());

            if (_index !== -1) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        }
    }
})();
