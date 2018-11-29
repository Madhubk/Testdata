(function(){
    "use strict";

    angular
         .module("Application")
         .directive("itemMenu",ItemMenu);

    ItemMenu.$inject=[];

    function ItemMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/transports/track-item/item-menu/item-menu.html",
            link: Link,
            controller: "ItemMenuController",
            controllerAs: "ItemMenuCtrl",
            scope: {
                currentItem: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();