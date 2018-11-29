(function () {
    "use strict";

    angular
        .module("Application")
        .directive("keyword", Keyword);

    Keyword.$inject = [];

    function Keyword() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/keyword/keyword/keyword.html",
            controller: 'KeywordController',
            controllerAs: 'KeywordCtrl',
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
