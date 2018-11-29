(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardDispatch",OutwardDispatch);

    OutwardDispatch.$inject=[];

    function OutwardDispatch(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/outward/outward-dispatch/outward-dispatch.html",
            link: Link,
            controller: "OutwardDispatchController",
            controllerAs: "OutwardDispatchCtrl",
            scope: {
                manifestDetails: "=",
                currentOutward : "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();