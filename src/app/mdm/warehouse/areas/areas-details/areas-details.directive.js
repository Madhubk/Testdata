(function(){
    "use strict";

    angular
         .module("Application")
         .directive("areasDetails",AreasDetails);

    AreasDetails.$inject=[];

    function AreasDetails(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/areas/areas-details/areas-details.html",
            link: Link,
            controller: "AreasDetailsController",
            controllerAs: "AreasDetailsCtrl",
            scope: {
                currentAreas: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) {}
    }
    
})();