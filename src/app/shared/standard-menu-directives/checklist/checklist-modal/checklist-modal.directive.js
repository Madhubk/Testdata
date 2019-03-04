(function () {
    "use strict";

    angular
        .module("Application")
        .directive("checklistModal", ChecklistModal);

    ChecklistModal.$inject = ["$uibModal", "$templateCache"];

    function ChecklistModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="ChecklistModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Checklist</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <checklist input="input"></checklist>
        </div>`;
        $templateCache.put("CheckListModal.html", _template);

        let exports = {
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
                $uibModal.open({
                    animation: true,
                    keyboard: true,
                    windowClass: "right checklist",
                    scope: scope,
                    templateUrl: "CheckListModal.html",
                    controller: 'ChecklistModalController as ChecklistModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(response => {}, () => {});
            }
        }
    }

    angular
        .module("Application")
        .controller("ChecklistModalController", ChecklistModalController);

    ChecklistModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function ChecklistModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let ChecklistModalCtrl = this;

        function Init() {
            ChecklistModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ChecklistModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            ChecklistModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
