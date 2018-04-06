(function(){
    "use strict";

    angular
         .module("Application")
         .directive("itemReadOnly",ItemReadOnly);

    ItemReadOnly.$inject = [];

    function ItemReadOnly(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-item/item-read-only/item-read-only.html",
            link: Link,
            controller: "ItemReadOnlyController",
            controllerAs: "ItemReadOnlyCtrl",
            scope: {
                currentItem: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();