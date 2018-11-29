(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shpSliUpload", ShpSLIUpload);

    ShpSLIUpload.$inject = [];

    function ShpSLIUpload() {
        var exports = {
            restrict: "EA",
            templateUrl: "/app/eaxis/freight/shipment/sli-upload/sli-upload.html",
            link: Link,
            controller: "ShpSLIUploadController",
            controllerAs: "ShpSLIUploadCtrl",
            scope: {
                backDashboard: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();