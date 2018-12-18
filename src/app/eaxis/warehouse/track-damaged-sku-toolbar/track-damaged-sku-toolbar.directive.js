(function () {
    "use strict";

    angular
        .module("Application")
        .directive("damagedSkuToolbar", DamagedSkuToolbar);

    DamagedSkuToolbar.$inject = [];

    function DamagedSkuToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/track-damaged-sku-toolbar/track-damaged-sku-toolbar.html",
            link: Link,
            controller: "DamagedSkuToolbarController",
            controllerAs: "DamagedSkuToolbarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();