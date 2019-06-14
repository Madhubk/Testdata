(function(){
    "use strict";

    angular
         .module("Application")
         .directive("myRequestReadOnly",MyRequestReadOnly);

    MyRequestReadOnly.$inject = [];

    function MyRequestReadOnly(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/my-request/my-request-read-only/my-request-read-only.html",
            link: Link,
            controller: "MyRequestReadOnlyController",
            controllerAs: "MyRequestReadOnlyCtrl",
            scope: {
                currentMyRequestReadOnly: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();