(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exception", Exception);

    Exception.$inject = [];

    function Exception() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/exception/exception/exception.html",
            controller: 'ExceptionController',
            controllerAs: 'ExceptionCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
