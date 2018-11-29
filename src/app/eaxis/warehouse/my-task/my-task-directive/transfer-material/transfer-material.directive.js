(function () {
    "use strict"
    angular
        .module("Application")
        .directive("transfermaterial", TransferMaterialDirective)
        .directive("transferMaterialEdit", TransferMaterialEditDirective);

    function TransferMaterialDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/transfer-material/transfer-material-task-list.html",
            link: Link,
            controller: "TransferMaterialController",
            controllerAs: "TransferMaterialCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function TransferMaterialEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/transfer-material/transfer-material-activity.html",
            link: Link,
            controller: "TransferMaterialController",
            controllerAs: "TransferMaterialCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
