(function(){
    "use strict";

    angular
         .module("Application")
         .directive("references",References);

    References.$inject=[];

    function References(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inw-out-common/reference/reference.html",
            link: Link,
            controller: "ReferenceController",
            controllerAs: "ReferenceCtrl",
            scope: {
                currentInward: "=",
                currentOutward: "=",
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();