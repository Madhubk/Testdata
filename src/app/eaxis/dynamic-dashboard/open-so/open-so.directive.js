(function () {
    "use strict";

    angular
        .module("Application")
        .directive("openSo", OpenSO);

    function OpenSO() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/open-so/open-so.html",
            link: Link,
            controller: "OpenSOController",
            controllerAs: "OpenSOCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();