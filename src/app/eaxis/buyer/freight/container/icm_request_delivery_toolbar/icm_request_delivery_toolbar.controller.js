(function () {
    "use strict";

    angular
        .module("Application")
        .controller("icmRequestDeliveryToolbarController", icmRequestDeliveryToolbarController);

    icmRequestDeliveryToolbarController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function icmRequestDeliveryToolbarController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var icmRequestDeliveryToolbarCtrl = this;

        function Init() {

            icmRequestDeliveryToolbarCtrl.ePage = {
                "Title": "",
                "Prefix": "ICM_RequestDelivery_Toolbar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            icmRequestDeliveryToolbarCtrl.ePage.Masters.RequestDelivery = RequestDelivery;

        }

        function RequestDelivery() {
            // var arr = [];
            // icmRequestDeliveryToolbarCtrl.input.map(function (val, key) {
            //     if (val.ETA) {
            //         if (!val.Delivered) {
            //             if (!val.RequestedDelivery) {
                            requestDeliveryMethod();
            //             } else {
            //                 // arr.push(val.ContainerNo);
            //                 toastr.warning("Delivery Request already raised for this Container " + val.ContainerNo);
            //             }
            //         } else {
            //             // arr.push(val.ContainerNo);
            //             toastr.warning(val.ContainerNo + " Container(s) already Delivered");
            //         }
            //     } else {
            //         // arr.push(val.ContainerNo);
            //         toastr.warning("ETA Required for this Container " + val.ContainerNo);
            //     }

            // });

        }

        function requestDeliveryMethod() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "RequestDelivery right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar_modal/icm_request_delivery_toolbar_modal.html",
                controller: 'icmRequestDeliveryToolbarModalController',
                controllerAs: "icmRequestDeliveryToolbarModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {};
                        exports.input = icmRequestDeliveryToolbarCtrl.input;
                        return exports;
                    }
                }
            }).result.then(
                function (response) {}
            );
        }


        Init();
    }
})();