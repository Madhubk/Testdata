(function () {
    "use strict";

    angular
        .module("Application")
        .directive("serviceTypes", ServiceTypes);

    ServiceTypes.$inject = [];

    function ServiceTypes() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/service-type/service-type.html",
            link: Link,
            controller: "ServiceTypeController",
            controllerAs: "ServiceTypeCtrl",
            scope: {
                currentType: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();