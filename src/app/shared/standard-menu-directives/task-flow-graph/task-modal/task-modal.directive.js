(function () {
    "use strict";

    angular
        .module("Application")
        .directive("taskModal", TaskModal);

    TaskModal.$inject = ["$uibModal", "$templateCache"];

    function TaskModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="TaskModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Task</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <task input="input"></task>
        </div>`;
        $templateCache.put("TaskFlowModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    // backdrop: "static",
                    keyboard: true,
                    windowClass: "right task",
                    scope: scope,
                    templateUrl: "TaskFlowModal.html",
                    controller: 'TaskModalController as TaskModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    console.log(response);
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
