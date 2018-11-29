(function(){
    "use strict";

    angular
         .module("Application")
         .directive("generateBarcode",GenerateBarcode);

    GenerateBarcode.$inject = [];

    function GenerateBarcode(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/reports/pending-dispatch/pending-dispatch.html",
            link: Link,
            controller: "GenerateBarcodeController",
            controllerAs: "GenerateBarcodeCtrl",
            scope: {
                currentReport: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();