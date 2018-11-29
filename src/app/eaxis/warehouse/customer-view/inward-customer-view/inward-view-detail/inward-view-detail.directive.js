(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardViewDetail",inwardViewDetail);

    inwardViewDetail.$inject = [];

    function inwardViewDetail(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail/inward-view-detail.html",
            link: Link,
            controller: "InwardViewDetailController",
            controllerAs: "InwardViewDetailCtrl",
            scope: {
                currentInwardViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();


