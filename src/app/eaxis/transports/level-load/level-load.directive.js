(function () {
    "use strict";

    angular
        .module("Application")
        .directive("levelLoad", LevelLoad);

    LevelLoad.$inject = [];

    function LevelLoad() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/level-load/level-load.html",
            link: Link,
            controller: "LevelLoadController",
            controllerAs: "LevelLoadCtrl",
            scope: {
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();