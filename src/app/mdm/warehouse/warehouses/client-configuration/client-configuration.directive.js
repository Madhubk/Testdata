(function () {
    "use strict";

    angular
        .module("Application")
        .directive("clientConfig", ClientConfig)

    function ClientConfig() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/warehouses/client-configuration/client-configuration.html",
            link: Link,
            controller: "ClientConfigController",
            controllerAs: "ClientConfigCtrl",
            scope: {
                currentWarehouse: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) { }
    }

})();
