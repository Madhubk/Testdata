(function(){
    "use strict";

    angular
         .module("Application")
         .directive("adjustmentViewDetail",adjustmentViewDetail);

    adjustmentViewDetail.$inject = [];

    function adjustmentViewDetail(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view-detail/adjustment-view-detail.html",
            link: Link,
            controller: "AdjustmentViewDetailController",
            controllerAs: "AdjustmentViewDetailCtrl",
            scope: {
                currentAdjustmentViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();


