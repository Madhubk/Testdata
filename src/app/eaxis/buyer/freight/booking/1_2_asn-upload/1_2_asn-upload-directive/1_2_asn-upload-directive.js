(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoAsnUploadDirective", oneTwoAsnUploadDirective);

    oneTwoAsnUploadDirective.$inject = [];

    function oneTwoAsnUploadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload-directive/1_2_asn-upload-directive.html",
            link: Link,
            controller: "oneTwoAsnUploadDirectiveController",
            controllerAs: "oneTwoAsnUploadDirectiveCtrl",
            scope: {
                currentAsn: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();