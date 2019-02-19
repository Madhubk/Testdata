(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerDeliveryDetailsDirective", containerDeliveryDetails);

        containerDeliveryDetails.$inject = [];

    function containerDeliveryDetails() {
        
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/1_2_container-deliverydetails/1_2_container-deliverydetails.html",
            link: Link,
            controller: "containerDeliveryDetailsController",
            controllerAs: "containerDeliveryDetailsCtrl",
            scope: {
                currentContainer: "=",
                currentConsol:"=",
                refCode: "@",
                disContainer:'='
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();