(function () {
    "use strict";

    angular
        .module("Application")
        .directive("serviceType", ServiceType);

    ServiceType.$inject = [];

    function ServiceType() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/service-type/service-type.html",
            link: Link,
            controller: "ServiceTypeController",
            controllerAs: "ServiceTypeCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();