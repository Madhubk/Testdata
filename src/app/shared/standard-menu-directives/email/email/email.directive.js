(function () {
    "use strict";

    angular
        .module("Application")
        .directive("email", Email);

    Email.$inject = [];

    function Email() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/email/email/email.html",
            controller: 'EmailController',
            controllerAs: 'EmailCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&",
                onComplete: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
