(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicListModal", DynamicListModal);

    DynamicListModal.$inject = ["$uibModal", "$templateCache", "dynamicLookupConfig"];

    function DynamicListModal($uibModal, $templateCache, dynamicLookupConfig) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" data-ng-click="DynamicListModalCtrl.ePage.Masters.Cancel()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>{{DynamicListModalCtrl.ePage.Masters.DataEntry.Title || DynamicListModalCtrl.controlId || 'Title'}}</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <dynamic-list mode="DynamicListModalCtrl.mode" dataentry-name="DynamicListModalCtrl.pageName" default-filter="DynamicListModalCtrl.ePage.Masters.defaultFilter" base-filter="DynamicListModalCtrl.ePage.Masters.baseFilter" selected-grid-row="DynamicListModalCtrl.ePage.Masters.SelectedGridRow($item)" lookup-config-control-key="DynamicListModalCtrl.controlKey" dataentry-object="DynamicListModalCtrl.ePage.Masters.DataEntry"></dynamic-list>
        </div>`;
        $templateCache.put("DynamicListModal.html", _template);

        let exports = {
            restrict: "EA",
            scope: {
                obj: "=",
                pageName: "=",
                controlId: "=",
                controlKey: "=",
                isFullObj: "=",
                mode: "=",
                gridRefreshFunName: "@",
                gridRefreshFun: "&",
                selectedData: "&",
                defaultFilter: "=",
                baseFilter: "=",
                isDisabled: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", () => PrepareLookupConfig());

            function PrepareLookupConfig() {
                if (!scope.isDisabled) {
                    let _index = -1;
                    for (let x in dynamicLookupConfig.Entities) {
                        _index = scope.controlKey ? x.indexOf(scope.controlKey) : x.indexOf(scope.controlId);
                        if (_index !== -1) {
                            scope.LookupConfig = dynamicLookupConfig.Entities[x];
                            if (scope.LookupConfig.setValues && typeof scope.LookupConfig.setValues == "string") {
                                scope.LookupConfig.setValues = JSON.parse(scope.LookupConfig.setValues);
                            }
                            if (scope.LookupConfig.getValues && typeof scope.LookupConfig.getValues == "string") {
                                scope.LookupConfig.getValues = JSON.parse(scope.LookupConfig.getValues);
                            }
                            if (scope.LookupConfig.defaults && typeof scope.LookupConfig.defaults == "string") {
                                scope.LookupConfig.defaults = JSON.parse(scope.LookupConfig.defaults);
                            }
                        }
                    }

                    OpenModal();
                }
            }

            function OpenModal() {
                $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "dynamic-list-modal right",
                    scope: scope,
                    templateUrl: 'DynamicListModal.html',
                    controller: 'DynamicListModalController',
                    controllerAs: "DynamicListModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            if (scope.mode === 2) {
                                scope.LookupConfig.setValues.map(value => scope.LookupConfig.defaults[value.sField] = scope.obj[value.eField]);
                            }

                            let exports = {};
                            return exports;
                        }
                    }
                }).result.then(response => {
                    scope.selectedData({
                        $item: response
                    });

                    if (scope.mode === 2) {
                        scope.LookupConfig.selectedRow = response;
                        scope.LookupConfig.getValues.map(value => scope.obj[value.eField] = response.data.entity[value.sField]);
                    }
                }, () => {
                    console.log("Cancelled");
                });
            }
        }
    }

    angular
        .module("Application")
        .controller("DynamicListModalController", DynamicListModalController);

    DynamicListModalController.$inject = ["$uibModalInstance", "helperService", "dynamicLookupConfig"];

    function DynamicListModalController($uibModalInstance, helperService, dynamicLookupConfig) {
        /* jshint validthis: true */
        let DynamicListModalCtrl = this;

        function Init() {
            DynamicListModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_List_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicListModalCtrl.ePage.Masters.defaultFilter = {};
            DynamicListModalCtrl.ePage.Masters.baseFilter = {};
            DynamicListModalCtrl.ePage.Masters.selectedItem = {};
            DynamicListModalCtrl.ePage.Masters.taskName = DynamicListModalCtrl.pageName;

            DynamicListModalCtrl.ePage.Masters.Ok = Ok;
            DynamicListModalCtrl.ePage.Masters.Cancel = Cancel;
            DynamicListModalCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (DynamicListModalCtrl.controlKey || DynamicListModalCtrl.controlId) {
                let _index = -1;
                for (let x in dynamicLookupConfig.Entities) {
                    _index = DynamicListModalCtrl.controlKey ? x.indexOf(DynamicListModalCtrl.controlKey) : x.indexOf(DynamicListModalCtrl.controlId);
                    if (_index !== -1) {
                        DynamicListModalCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                    }
                }
                DynamicListModalCtrl.ePage.Masters.defaultFilter = DynamicListModalCtrl.ePage.Masters.LookupConfig.defaults;
            }

            // Add custom filter objects
            var _isEmptyDefault = angular.equals({}, DynamicListModalCtrl.defaultFilter);

            if (!_isEmptyDefault) {
                for (let x in DynamicListModalCtrl.defaultFilter) {
                    DynamicListModalCtrl.ePage.Masters.defaultFilter[x] = DynamicListModalCtrl.defaultFilter[x];
                }
            }

            // Add custom filter objects
            let _isEmptyBase = angular.equals({}, DynamicListModalCtrl.baseFilter);
            if (!_isEmptyBase) {
                for (let x in DynamicListModalCtrl.baseFilter) {
                    DynamicListModalCtrl.ePage.Masters.baseFilter[x] = DynamicListModalCtrl.baseFilter[x];
                }
            }
        }

        function Ok() {
            $uibModalInstance.close(DynamicListModalCtrl.ePage.Masters.selectedItem);
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function SelectedGridRow($item) {
            if (DynamicListModalCtrl.mode == 2) {
                DynamicListModalCtrl.ePage.Masters.selectedItem = $item;
            } else if (DynamicListModalCtrl.mode == 3) {
                if ($item.action === "multiSelect") {
                    DynamicListModalCtrl.ePage.Masters.selectedItem = $item.items;
                } else if ($item.action === "link" || $item.action === "dblClick") {
                    DynamicListModalCtrl.ePage.Masters.selectedItem = $item.data;
                }
            }

            Ok();
        }

        Init();
    }
})();
