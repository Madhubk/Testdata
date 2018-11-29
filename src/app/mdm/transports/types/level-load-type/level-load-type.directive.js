(function () {
    "use strict";

    angular
        .module("Application")
        .directive("levelloadType", LevelLoadType);

    LevelLoadType.$inject = [];

    function LevelLoadType() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/level-load-type/level-load-type.html",
            link: Link,
            controller: "LevelLoadController",
            controllerAs: "LevelLoadTypeCtrl",
            scope: {
                currentType: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();