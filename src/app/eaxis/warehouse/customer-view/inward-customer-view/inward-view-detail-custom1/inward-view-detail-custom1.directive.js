(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardViewDetailCustom1",inwardViewDetailCustom1);

    inwardViewDetailCustom1.$inject = [];

    function inwardViewDetailCustom1(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/inward-customer-view/inward-view-detail-custom1/inward-view-detail-custom1.html",
            link: Link,
            controller: "InwardViewDetailCustom1Controller",
            controllerAs: "InwardViewDetailCustom1Ctrl",
            scope: {
                currentInwardViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();


