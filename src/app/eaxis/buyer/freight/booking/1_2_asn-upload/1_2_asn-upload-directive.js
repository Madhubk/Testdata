(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoAsnUpload", oneTwoAsnUpload);

    oneTwoAsnUpload.$inject = [];

    function oneTwoAsnUpload() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload.html",
            link: Link,
            controller: "oneTwoAsnUploadController",
            controllerAs: "oneTwoAsnUploadCtrl",
            scope: {
                backDashboard: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();