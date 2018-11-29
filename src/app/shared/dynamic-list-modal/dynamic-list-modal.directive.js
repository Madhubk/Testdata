(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicListModal", DynamicListModal);

    DynamicListModal.$inject = ["$uibModal", "$templateCache", "dynamicLookupConfig"];

    function DynamicListModal($uibModal, $templateCache, dynamicLookupConfig) {
        var _template = `<div class="modal-header">
        <button type="button" class="close" ng-click="DynamicListModalCtrl.ePage.Masters.Cancel()">&times;</button>
        <h5 class="modal-title" id="modal-title">
            <strong>{{DynamicListModalCtrl.ePage.Masters.DataEntry.Title || DynamicListModalCtrl.controlId || 'Title'}}</strong>
        </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <dynamic-list mode="DynamicListModalCtrl.mode" dataentry-name="DynamicListModalCtrl.pageName" default-filter="DynamicListModalCtrl.ePage.Masters.defaultFilter"
                selected-grid-row="DynamicListModalCtrl.ePage.Masters.SelectedGridRow($item)" lookup-config-control-key="DynamicListModalCtrl.controlKey"
                dataentry-object="DynamicListModalCtrl.ePage.Masters.DataEntry"></dynamic-list>
        </div>`;
        $templateCache.put("DynamicListModal.html", _template);

        var exports = {
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
                isDisabled: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", function () {
                if (!scope.isDisabled) {
                    var _index = -1;
                    for (var x in dynamicLookupConfig.Entities) {
                        (scope.controlKey) ? _index = x.indexOf(scope.controlKey): _index = x.indexOf(scope.controlId);

                        if (_index !== -1) {
                            scope.LookupConfig = dynamicLookupConfig.Entities[x];
                        }
                    }

                    OpenModal();
                }
            });

            function OpenModal() {
                var modalInstance = $uibModal.open({
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
                                scope.LookupConfig.setValues.map(function (value, key) {
                                    scope.LookupConfig.defaults[value.sField] = scope.obj[value.eField];
                                });
                            }

                            var exports = {};
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        scope.selectedData({
                            $item: response
                        });

                        if (scope.mode === 2) {
                            scope.LookupConfig.selectedRow = response;
                            scope.LookupConfig.getValues.map(function (value, key) {
                                scope.obj[value.eField] = response.data.entity[value.sField];
                            });
                        }
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            }
        }
    }
})();
