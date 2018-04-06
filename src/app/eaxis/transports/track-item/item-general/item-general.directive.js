(function(){
    "use strict";

    angular
         .module("Application")
         .directive("itemGeneral",ItemGeneral);

    ItemGeneral.$inject = [];

    function ItemGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-item/item-general/item-general.html",
            link: Link,
            controller: "ItemGeneralController",
            controllerAs: "ItemGeneralCtrl",
            scope: {
                currentItem: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();