(function(){
    "use strict";

    angular
         .module("Application")
         .directive("dmsconsignmentMenu",DMSConsignmentMenu);

    DMSConsignmentMenu.$inject=[];

    function DMSConsignmentMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/distribution/consignment/consignment-menu/consignment-menu.html",
            link: Link,
            controller: "DMSConsignmentMenuController",
            controllerAs: "DMSConsignmentMenuCtrl",
            scope: {
                currentConsignment: "=",
                dataentryObject:'='
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();