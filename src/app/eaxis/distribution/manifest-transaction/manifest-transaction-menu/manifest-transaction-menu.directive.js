(function(){
    "use strict";

    angular
         .module("Application")
         .directive("manifestTransMenu",ManifestTransMenu);

         ManifestTransMenu.$inject=[];

    function ManifestTransMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/distribution/manifest-transaction/manifest-transaction-menu/manifest-transaction-menu.html",
            link: Link,
            controller: "ManifestTransactionMenuController",
            controllerAs: "ManifestTransMenuCtrl",
            scope: {
                currentManifestTrans: "=",
                dataentryObject:'='
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();