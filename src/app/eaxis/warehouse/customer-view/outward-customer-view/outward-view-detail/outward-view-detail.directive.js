(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardViewDetail",outwardViewDetail);

    outwardViewDetail.$inject = [];

    function outwardViewDetail(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail/outward-view-detail.html",
            link: Link,
            controller: "OutwardViewDetailController",
            controllerAs: "OutwardViewDetailCtrl",
            scope: {
                currentOutwardViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();


