(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackDamageMenu", TrackDamageMenu);

    TrackDamageMenu.$inject = [];

    function TrackDamageMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/track-damaged-sku/track-damaged-sku-menu/track-damaged-sku-menu.html",
            link: Link,
            controller: "TrackDamagedMenuController",
            controllerAs: "TrackDamagedMenuCtrl",
            scope: {
                currentTrackDamage: "=",
                dataentryObject: '='
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();