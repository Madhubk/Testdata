(function () {
    "use strict";

    angular
        .module("Application")
        .directive("nwdaysGeneral", NwdaysGeneral);

    NwdaysGeneral.$inject = [];

    function NwdaysGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/non-working-days/general/general.html",
            link: Link,
            controller: "NwdaysGeneralController",
            controllerAs: "NwdaysGeneralCtrl",
            scope: {
                currentNWDays: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();