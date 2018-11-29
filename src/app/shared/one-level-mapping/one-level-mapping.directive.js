(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneLevelMapping", OneLevelMapping);

    OneLevelMapping.$inject = [];

    function OneLevelMapping() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/one-level-mapping/one-level-mapping.html",
            controller: "OneLevelMappingController",
            controllerAs: "OneLevelMappingCtrl",
            bindToController: true,
            scope: {
                input: "=",
                object: "=",
                icon: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
