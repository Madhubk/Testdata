(function () {
    "use strict"
    angular
        .module("Application")
        .directive("buyerActivityTemplate1", ActivityTemplate1Directive);

    function ActivityTemplate1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/buyer-activity-template1/buyer-activity-template1.html",
            link: Link,
            controller: "BuyerActivityTemplate1Controller",
            controllerAs: "BuyerActivityTemplate1Ctrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
