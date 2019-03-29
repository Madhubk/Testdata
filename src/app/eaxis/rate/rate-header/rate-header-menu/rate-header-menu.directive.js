(function(){
    "use strict";

    angular
         .module("Application")
         .directive("rateHeaderMenu",RateHeaderMenu);

    RateHeaderMenu.$inject=[];

    function RateHeaderMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/rate/rate-header/rate-header-menu/rate-header-menu.html",
            link: Link,
            controller: "RateHeaderMenuController",
            controllerAs: "RateHeaderMenuCtrl",
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