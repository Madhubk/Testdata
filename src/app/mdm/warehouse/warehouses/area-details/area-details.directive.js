(function () {
    "use strict";

    angular
        .module("Application")
        .directive("areaDetails", AreaDetails)

    function AreaDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/warehouses/area-details/area-details.html",
            link: Link,
            controller: "AreaDetailsController",
            controllerAs: "AreaDetailsCtrl",
            scope: {
                currentWarehouse: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) { }
    }

})();
