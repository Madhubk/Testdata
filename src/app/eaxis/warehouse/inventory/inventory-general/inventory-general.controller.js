(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryGeneralController", InventoryGeneralController);

    InventoryGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "inventoryConfig", "helperService", "toastr", "$uibModal"];

    function InventoryGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, inventoryConfig, helperService, toastr, $uibModal) {

        var InventoryGeneralCtrl = this;

        function Init() {

            var currentInventory = InventoryGeneralCtrl.currentInventory[InventoryGeneralCtrl.currentInventory.label].ePage.Entities;
            InventoryGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInventory,
            }

            InventoryGeneralCtrl.ePage.Masters.EnableForGeneral = true;
            InventoryGeneralCtrl.ePage.Masters.selectedRowForGeneral = -1;
            InventoryGeneralCtrl.ePage.Masters.emptyText = '-';
            InventoryGeneralCtrl.ePage.Masters.SearchTableForGeneral = '';

            InventoryGeneralCtrl.ePage.Masters.Enable = true;
            InventoryGeneralCtrl.ePage.Masters.selectedRow = -1;
            InventoryGeneralCtrl.ePage.Masters.SearchTable = '';

            InventoryGeneralCtrl.ePage.Masters.Config = inventoryConfig;

            InventoryGeneralCtrl.ePage.Masters.setSelectedRowForGeneral = setSelectedRowForGeneral;
            InventoryGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;

            InventoryGeneralCtrl.ePage.Masters.UpdateInventory = UpdateInventory;
            InventoryGeneralCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            InventoryGeneralCtrl.ePage.Masters.UpdateData = UpdateData;

            if (InventoryGeneralCtrl.ePage.Entities.Header.CheckPoints.DataEntryName == 'WarehouseInventory') {
                getPickSlipDetails();
            }
        }

        function UpdateInventory() {
            return InventoryGeneralCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/inventory/inventory-general/inventory-update.html"
            });
        }

        function UpdateData() {

            if (InventoryGeneralCtrl.ePage.Masters.AdjQty <= InventoryGeneralCtrl.ePage.Entities.Header.Data[0].InLocationQty && InventoryGeneralCtrl.ePage.Masters.AdjQty > 0) {
                var Status = '';
                CloseEditActivityModal();
                InventoryGeneralCtrl.ePage.Masters.Loading = true;

                if (InventoryGeneralCtrl.ePage.Entities.Header.Data[0].OriginalInventoryStatusDesc != "Held") {
                    Status = "Damaged";
                } else {
                    Status = "Good";
                }

                var _input = {
                    "InventoryLine": InventoryGeneralCtrl.ePage.Entities.Header.Data[0],
                    "AdjustedQty": parseFloat(InventoryGeneralCtrl.ePage.Masters.AdjQty),
                    "Status": Status,
                    "CreatedBy": authService.getUserInfo().UserEmail
                }
                apiService.post("eAxisAPI", InventoryGeneralCtrl.ePage.Entities.Header.API.WmsInventoryAdjustment.Url, _input).then(function (response) {
                    if (response.data.Status == 'Success') {
                        toastr.success('Updated Successfully ');
                        InventoryGeneralCtrl.ePage.Masters.Loading = false;
                        InventoryGeneralCtrl.ePage.Masters.Config.IsCloseTab = true;
                        if ($state.current.url == "/inventory") {
                            helperService.refreshGrid();
                        }
                    } else {
                        toastr.error("Update Failed");
                    }
                })
            } else {
                toastr.warning('Adjust quantity should be greater than 0 or equal to InLocation Qty');
            }
        }

        function CloseEditActivityModal() {
            InventoryGeneralCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function setSelectedRowForGeneral(index) {
            InventoryGeneralCtrl.ePage.Masters.selectedRowForGeneral = index;
        }

        function setSelectedRow(index) {
            InventoryGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function getPickSlipDetails() {
            var _filter = {
                "WOL_InventoryLine_FK": InventoryGeneralCtrl.ePage.Entities.Header.Data[0].PK,
                "LineStatus": "FIN"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InventoryGeneralCtrl.ePage.Entities.Header.API.PickSlip.FilterID
            };

            apiService.post("eAxisAPI", InventoryGeneralCtrl.ePage.Entities.Header.API.PickSlip.Url, _input).then(function (response) {
                InventoryGeneralCtrl.ePage.Masters.PickSlipDetails = response.data.Response;
            })
        }

        Init();
    }

})();