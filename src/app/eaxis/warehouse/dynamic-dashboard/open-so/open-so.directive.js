(function () {
    "use strict";

    angular
        .module("Application")
        .directive("openSo", OpenSO);

    function OpenSO() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/open-so/open-so.html",
            link: Link,
            controller: "OpenSOController",
            controllerAs: "OpenSOCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();