(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoIcmUpload", oneTwoIcmUpload);

    oneTwoIcmUpload.$inject = [];

    function oneTwoIcmUpload() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/1_2_icm-upload/1_2_icm-upload.html",
            link: Link,
            controller: "oneTwoIcmUploadController",
            controllerAs: "oneTwoIcmUploadCtrl",
            scope: {            
                backDashboard: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();