(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackDamageGeneral", TrackDamageGeneral);

    TrackDamageGeneral.$inject = [];

    function TrackDamageGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/track-damaged-sku/track-damaged-sku-general/track-damaged-sku-general.html",
            link: Link,
            controller: "TrackDamageGeneralController",
            controllerAs: "TrackDamageGeneralCtrl",
            scope: {
                currentTrackDamage: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();