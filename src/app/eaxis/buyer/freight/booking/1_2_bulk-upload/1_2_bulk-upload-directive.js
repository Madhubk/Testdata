(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoBulkUpload", oneTwoBulkUpload);

    oneTwoBulkUpload.$inject = [];

    function oneTwoBulkUpload() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload.html",
            link: Link,
            controller: "oneTwoBulkUploadController",
            controllerAs: "oneTwoBulkUploadCtrl",
            scope: {            
                backDashboard: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();