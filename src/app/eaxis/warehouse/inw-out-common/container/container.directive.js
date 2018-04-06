(function(){
    "use strict";

    angular
         .module("Application")
         .directive("container",Container);

    Container.$inject = [];

    function Container(){
        var exports = {
            restrict : "EA",
            templateUrl : "app/eaxis/warehouse/inw-out-common/container/container.html",
            link : Link,
            controller : "ContainerController",
            controllerAs : "ContainerCtrl",
            scope : {
                currentInward : "=",
                currentOutward: "="
            },
            bindToController : true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();