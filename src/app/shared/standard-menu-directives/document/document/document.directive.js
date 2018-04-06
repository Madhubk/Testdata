(function () {
    "use strict";

    angular
        .module("Application")
        .directive("document", Document);

    Document.$inject = [];

    function Document() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/document/document/document.html",
            controller: 'DocumentController',
            controllerAs: 'DocumentCtrl',
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
