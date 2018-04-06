(function(){
    "use strict";

    angular
         .module("Application")
         .directive("consignmentMenu",ConsignmentMenu);

    ConsignmentMenu.$inject=[];

    function ConsignmentMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/transports/track-consignment/consignment-menu/consignment-menu.html",
            link: Link,
            controller: "ConsignmentMenuController",
            controllerAs: "ConsignmentMenuCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();