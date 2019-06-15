(function(){
    "use strict";

    angular
         .module("Application")
         .directive("downtimeRequestGeneral",DowntimeRequestGeneral);

    DowntimeRequestGeneral.$inject = [];

    function DowntimeRequestGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.html",
            link: Link,
            controller: "DowntimeRequestGeneralController",
            controllerAs: "DowntimeRequestGeneralCtrl",
            scope: {
                currentDowntimeRequest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();