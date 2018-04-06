(function () {
    "use strict";

    angular
        .module("Application")
        .directive("locationDashboardModal", LocationDashboardModal);

    LocationDashboardModal.$inject = ["$rootScope", "$uibModal", "toastr", "dynamicLookupConfig"];

    function LocationDashboardModal($rootScope, $uibModal, toastr, dynamicLookupConfig) {
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
                    templateUrl: 'app/mdm/warehouse/locations/location-dashboard-modal/location-dashboard-modal.html',
                    controller: 'LocationDashboardModalController',
                    controllerAs: "LocationDashboardModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].setValues.map(function (value, key) {
                                dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].defaults[value.sField] = scope.obj[value.eField];
                            });

                            var exports = {
                                "fieldName": scope.fieldName
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        scope.selectedData({
                            $item: response
                        });

                        dynamicLookupConfig.Entities[scope.prefixData].LookupConfig[scope.fieldName].getValues.map(function (value, key) {
                            scope.obj[value.eField] = response[value.sField];
                        });
                    },
                    function () {
                        console.log("Cancelled");
                    }
                    );
            }
        }
    }
})();
