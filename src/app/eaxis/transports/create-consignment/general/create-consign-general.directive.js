(function(){
    "use strict";

    angular
         .module("Application")
         .directive("createConsignGeneral",CreateConsignGeneral);

    CreateConsignGeneral.$inject = [];

    function CreateConsignGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/create-consignment/general/create-consign-general.html",
            link: Link,
            controller: "CreateConsignGeneralController",
            controllerAs: "CreateConGenCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();