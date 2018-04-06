(function(){
    "use strict";

    angular
         .module("Application")
         .directive("receiveItems",ReceiveItems);

    ReceiveItems.$inject = [];

    function ReceiveItems(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/receive-items/receive-items.html",
            link: Link,
            controller: "ReceiveItemsController",
            controllerAs: "ReceiveItemsCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();