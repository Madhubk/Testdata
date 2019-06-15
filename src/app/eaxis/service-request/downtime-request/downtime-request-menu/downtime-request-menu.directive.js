(function () {
    "use strict";

    angular
        .module("Application")
        .directive("downtimeRequestMenu", DowntimeRequestMenu);

    DowntimeRequestMenu.$inject = [];

    function DowntimeRequestMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.html",
            link: Link,
            controller: "DowntimeRequestMenuController",
            controllerAs: "DowntimeRequestMenuCtrl",
            scope: {
                currentDowntimeRequest: "=",
                dataentryObject: '='
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();