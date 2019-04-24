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
                pageName: "=",
                controlId: "=",
                controlKey: "=",
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
                    var _index = -1;
                    for (var x in dynamicLookupConfig.Entities) {
                        (scope.controlKey) ? _index = x.indexOf(scope.controlKey) : _index = x.indexOf(scope.controlId);

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
                    windowClass: "dynamic-list-modal left",
                    scope: scope,
                    templateUrl: 'app/mdm/warehouse/locations/location-dashboard-modal/location-dashboard-modal.html',
                    controller: 'LocationDashboardModalController',
                    controllerAs: "LocationDashboardModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            if (scope.mode === 2) {
                                if (typeof scope.LookupConfig.setValues == "string") {
                                    scope.LookupConfig.setValues = JSON.parse(scope.LookupConfig.setValues);
                                }
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
