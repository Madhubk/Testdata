(function () {
    "use strict";

    angular
        .module("Application")
        .directive("changePassword", ChangePassword);

    ChangePassword.$inject = ["$rootScope", "$uibModal"];

    function ChangePassword($rootScope, $uibModal) {
        var exports = {
            restrict: "EA",
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on('click', function ($event) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "change-password",
                    scope: scope,
                    templateUrl: "app/shared/change-password/change-password.html",
                    controller: "ChangePasswordController",
                    controllerAs: "ChangePasswordCtrl",
                    bindToController: true
                }).result.then(
                    function (response) {
                        console.log(response);
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            });
        }
    }
})();
