(function () {
    "use strict";

    angular
        .module("Application")
        .directive("uploadleasingcontractvnm", UploadLeasingContractVnmDirective);

    function UploadLeasingContractVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/upload-leasing-contract-vnm/upload-leasing-contract-vnm.html",
            link: Link,
            controller: "UploadLeasingContractVnmDirectiveController",
            controllerAs: "UploadLeasingContractVnmDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();