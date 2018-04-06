(function(){
    "use strict";

    angular
         .module("Application")
         .directive("asnrequestGeneral",AsnrequestGeneral);

    AsnrequestGeneral.$inject = [];

    function AsnrequestGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/asn-request/general/asnrequest-general.html",
            link: Link,
            controller: "AsnrequestGeneralController",
            controllerAs: "AsnrequestGeneralCtrl",
            scope: {
                currentAsnrequest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();