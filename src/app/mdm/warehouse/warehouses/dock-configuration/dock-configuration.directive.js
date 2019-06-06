(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockConfig", DockConfig)

    function DockConfig() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/warehouses/dock-configuration/dock-configuration.html",
            link: Link,
            controller: "DockConfigController",
            controllerAs: "DockConfigCtrl",
            scope: {
                currentWarehouse: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) { }
    }

})();
