(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tags", Tags);

    Tags.$inject = [];

    function Tags() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/tags/tags.html",
            link: Link,
            controller: "TagsController",
            controllerAs: "TagsCtrl",
            scope: {
                currentType: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();