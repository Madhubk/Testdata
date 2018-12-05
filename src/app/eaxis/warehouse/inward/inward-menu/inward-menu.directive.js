(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardMenu",InwardMenu);

    InwardMenu.$inject=[];

    function InwardMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-menu/inward-menu.html",
            link: Link,
            controller: "InwardMenuController",
            controllerAs: "InwardMenuCtrl",
            scope: {
                currentInward: "=",
                dataentryObject:'=',
                isHideMenu:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();