(function () {
    "use strict";

    angular
        .module("Application")
        .factory("pageAccessService", PageAccessService);

    PageAccessService.$inject = ["$rootScope", "$location", "$timeout", "$q", "authService", "APP_CONSTANT", "toastr"];

    function PageAccessService($rootScope, $location, $timeout, $q, authService, APP_CONSTANT, toastr) {
        var exports = {
            CheckAuthToken: CheckAuthToken,
            CheckPageAccess: CheckPageAccess
        };
        return exports;

        function CheckAuthToken(url) {
            if (url) {
                if (url === "/login") {
                    if (!authService.getUserInfo().AuthToken && authService.getUserInfo().Version != APP_CONSTANT.Version) {
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
                if (authService.getUserInfo().AuthToken && authService.getUserInfo().Version === APP_CONSTANT.Version) {
                    return true;
                } else {
                    $location.path("/login").search({
                        continue: $rootScope.EnteredUrl
                    });

                    return false;
                }
            }
        }

        function CheckPageAccess(url) {
            var deferred = $q.defer();

            if (authService.getUserInfo().AuthToken && authService.getUserInfo().Version === APP_CONSTANT.Version) {
                CheckAuthAccess(url).then(function (response) {
                    deferred.resolve(response);
                });
            } else {
                authService.setUserInfo();
                $timeout(function () {
                    $location.path("/login").search({});
                });
            }

            return deferred.promise;
        }

        function CheckAuthAccess(url) {
            var deferred = $q.defer();

            if (authService.getUserInfo().IsLinkLogin == true && url == "/login") {
                authService.setUserInfo();
                $timeout(function () {
                    $location.path("/login").search({});
                });
            } else {
                CheckPageAccessMenu(url).then(function (response) {
                    if (response == true) {
                        deferred.resolve(true);
                    } else {
                        if (url == "/login") {
                            $location.path(authService.getUserInfo().InternalUrl).search({});
                        } else {
                            toastr.error("You do not have access to this page...!");

                            if (authService.getUserInfo().AuthToken && authService.getUserInfo().Version === APP_CONSTANT.Version) {
                                $location.path(authService.getUserInfo().InternalUrl).search({});
                            } else {
                                authService.setUserInfo();
                                $timeout(function () {
                                    $location.path("/login").search({});
                                });
                            }
                        }
                    }
                });
            }

            return deferred.promise;
        }

        function CheckPageAccessMenu(url) {
            var deferred = $q.defer();
            if (authService.getUserInfo().AccessMenus && authService.getUserInfo().AccessMenus.length > 0) {
                var _index = authService.getUserInfo().AccessMenus.map(function (value, key) {
                    return value.Link;
                }).indexOf(url);

                if (_index !== -1) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        }
    }
})();
