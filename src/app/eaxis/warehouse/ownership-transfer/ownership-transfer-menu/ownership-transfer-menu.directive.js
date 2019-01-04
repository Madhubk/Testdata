(function(){
    "use strict";

    angular
         .module("Application")
         .directive("ownershipTransferMenu",OwnershipTransferMenu);

    OwnershipTransferMenu.$inject=[];

    function OwnershipTransferMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/ownership-transfer/ownership-transfer-menu/ownership-transfer-menu.html",
            link: Link,
            controller: "OwnershipTransferMenuController",
            controllerAs: "OwnershipTransferMenuCtrl",
            scope: {
                currentOwnerTransfer: "=",
                dataentryObject:'='
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();