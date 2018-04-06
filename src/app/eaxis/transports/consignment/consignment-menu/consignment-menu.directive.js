(function(){
    "use strict";

    angular
         .module("Application")
         .directive("adminconsignmentMenu",ConsignmentMenu);

    ConsignmentMenu.$inject=[];

    function ConsignmentMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/transports/consignment/consignment-menu/consignment-menu.html",
            link: Link,
            controller: "AdminConsignmentMenuController",
            controllerAs: "AdminConsignmentMenuCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();