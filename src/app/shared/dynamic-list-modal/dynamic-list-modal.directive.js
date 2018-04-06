(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicListModal", DynamicListModal);

    DynamicListModal.$inject = ["$rootScope", "$uibModal", "dynamicListModalConfig", "toastr", "dynamicLookupConfig"];

    function DynamicListModal($rootScope, $uibModal, dynamicListModalConfig, toastr, dynamicLookupConfig) {
        var exports = {
            restrict: "EA",
            scope: {
                obj: "=",
                fieldName: "=",
                prefixData: "=",
                isFullObj: "=",
                mode: "=",
                gridRefreshFunName: "@",
                gridRefreshFun: "&",
                selectedData: "&",
                filter: "=",
                isDisabled: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", function () {
                if (!scope.isDisabled) {
                    OpenModal();
                }
            });

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "dynamic-list-modal left",
                    scope: scope,
                    templateUrl: 'app/shared/dynamic-list-modal/dynamic-list-modal.html',
                    controller: 'DynamicListModalController',
                    controllerAs: "DynamicListModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            if (scope.mode === 2 || scope.mode === 3) {
                                dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].setValues.map(function (value, key) {
                                    dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].defaults[value.sField] = scope.obj[value.eField];
                                });
                            }

                            var exports = {
                                "fieldName": scope.fieldName
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].selectedRow = response;
                        scope.selectedData({
                            $item: response
                        });

                        if (scope.mode === 2) {
                            dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].getValues.map(function (value, key) {
                                scope.obj[value.eField] = response.entity[value.sField];
                            });
                        } else if (scope.mode === 3) {
                            // var _isExist = scope.obj.some(function (value) {
                            //     return value.PK === response.entity.PK;
                            // });
                            // if (!_isExist) {
                            //     var _fetchConfiguredColums = {};
                            //     if (!scope.isFullObj) {
                            //         dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].getValues.map(function (value, key) {
                            //             _fetchConfiguredColums[value.eField] = response.entity[value.sField];
                            //         });
                            //     } else {
                            //         _fetchConfiguredColums = response.entity;
                            //     }

                            //     var _obj = {
                            //         functionName: scope.gridRefreshFunName,
                            //         data: _fetchConfiguredColums
                            //     }
                            //     scope.gridRefreshFun({
                            //         $item: _obj
                            //     });
                            // } else {
                            //     toastr.warning("Record already exist...!");
                            // }
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
