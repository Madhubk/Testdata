(function () {
    "use strict"
    angular
        .module("Application")
        .directive("containerGrid", ContainerGrid)

    function ContainerGrid() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/container-editable-grid/container/container-grid.html",
            link: Link,
            controller: "ContainerController",
            controllerAs: "ContainerDirCtrl",
            bindToController: true,
            scope: {
                currentObject: "=",
                apiHeaderName: "=",
                apiHeaderFieldName: "=",
                apiHeaderValueName: "=",
                btnVisible: "=",
                readOnly: "=",
                tableProperties: "=",
                keyObjectName: "=",
                obj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {
            scope.conEdit = conEdit;

            function conEdit(_$item) {
                scope.conEdit({
                    $item: _$item
                });
            }
        }
    }
})();
