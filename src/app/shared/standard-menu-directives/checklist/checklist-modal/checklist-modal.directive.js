(function () {
    "use strict";

    angular
        .module("Application")
        .directive("checklistModal", ChecklistModal);

    ChecklistModal.$inject = ["$uibModal", "$templateCache"];

    function ChecklistModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="ChecklistModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Checklist</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <checklist input="input"></checklist>
        </div>`;
        $templateCache.put("CheckListModal.html", _template);

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
                    windowClass: "right checklist",
                    scope: scope,
                    templateUrl: "CheckListModal.html",
                    controller: 'ChecklistModalController as ChecklistModalCtrl',
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
