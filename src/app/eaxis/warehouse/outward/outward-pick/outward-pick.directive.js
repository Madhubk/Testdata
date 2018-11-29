(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardPick",OutwardPick);

    OutwardPick.$inject=[];

    function OutwardPick(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/outward/outward-pick/outward-pick.html",
            link: Link,
            controller: "OutwardPickController",
            controllerAs: "OutwardPickCtrl",
            scope: {
                pickDetails: "=",
                currentOutward : "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();