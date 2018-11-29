(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InventoryGeneralCustController", InventoryGeneralCustController);

    InventoryGeneralCustController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "inventoryConfig", "helperService", "toastr"];

    function InventoryGeneralCustController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, inventoryConfig, helperService, toastr) {

        var InventoryGeneralCustCtrl = this;

        function Init() {

            var currentInventory = InventoryGeneralCustCtrl.currentInventory[InventoryGeneralCustCtrl.currentInventory.label].ePage.Entities;
            InventoryGeneralCustCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInventory,
            }

            InventoryGeneralCustCtrl.ePage.Masters.EnableForGeneral = true;
            InventoryGeneralCustCtrl.ePage.Masters.selectedRowForGeneral = -1;
            InventoryGeneralCustCtrl.ePage.Masters.emptyText = '-';
            InventoryGeneralCustCtrl.ePage.Masters.SearchTableForGeneral = '';

            InventoryGeneralCustCtrl.ePage.Masters.Enable = true;
            InventoryGeneralCustCtrl.ePage.Masters.selectedRow = -1;
            InventoryGeneralCustCtrl.ePage.Masters.SearchTable = '';

            InventoryGeneralCustCtrl.ePage.Masters.setSelectedRowForGeneral = setSelectedRowForGeneral;
            InventoryGeneralCustCtrl.ePage.Masters.setSelectedRow= setSelectedRow;

            if(InventoryGeneralCustCtrl.ePage.Entities.Header.CheckPoints.DataEntryName =='CustomerWarehouseInventory'){
                getPickSlipDetails();
            }
        }

        function setSelectedRowForGeneral(index){
            InventoryGeneralCustCtrl.ePage.Masters.selectedRowForGeneral = index;
        }

        function setSelectedRow(index){
            InventoryGeneralCustCtrl.ePage.Masters.selectedRow = index;
        }

        function getPickSlipDetails(){
            var _filter = {
                "WOL_InventoryLine_FK": InventoryGeneralCustCtrl.ePage.Entities.Header.Data[0].PK,
                "LineStatus":"FIN"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InventoryGeneralCustCtrl.ePage.Entities.Header.API.PickSlip.FilterID
            };

            apiService.post("eAxisAPI", InventoryGeneralCustCtrl.ePage.Entities.Header.API.PickSlip.Url, _input).then(function(response){
                InventoryGeneralCustCtrl.ePage.Masters.PickSlipDetails =response.data.Response;
            })
        }

        Init();
    }

})();