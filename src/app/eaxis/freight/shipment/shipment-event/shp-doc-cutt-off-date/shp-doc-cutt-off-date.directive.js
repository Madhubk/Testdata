(function () {
    "use strict"
    angular
        .module("Application")
        .directive("dcdex", DocCuttOffDateEvent);

    function DocCuttOffDateEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-doc-cutt-off-date/shp-doc-cutt-off-date.html",
            link: Link,
            controller: "ShpDocCuttOffDateDirController",
            controllerAs: "ShpDocCuttOffDateDirCtrl",
            bindToController: true,
            scope: {
                eventObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();