(function(){
    "use strict";

    angular
         .module("Application")
         .directive("itemConsignment",ItemConsignment);

    ItemConsignment.$inject = [];

    function ItemConsignment(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-item/item-consignment/item-consignment.html",
            link: Link,
            controller: "ItemConsignmentController",
            controllerAs: "ItemConsignCtrl",
            scope: {
                currentItem: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();