/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentChecklistApprovalVltController", ImportSeaShipmentChecklistApprovalVltController);

    ImportSeaShipmentChecklistApprovalVltController.$inject = ["$scope", "apiService", "helperService", "freightApiConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService","toastr"];

    function ImportSeaShipmentChecklistApprovalVltController($scope, apiService, helperService, freightApiConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService,toastr) {
        var ImportSeaShipmentChecklistApprovalVltCtrl = this;

        function Init() {
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.emptyText = "-";            
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ApproveBtnText = "Approve";
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.IsDisableRejectBtn = false;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.RejectBtnText = "Reject";
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.IsDisableApproveBtn = false;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.Approve=Approve;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.Reject=Reject;
            if (ImportSeaShipmentChecklistApprovalVltCtrl.taskObj) {
                ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentChecklistApprovalVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentChecklistApprovalVltCtrl.currentShipment = obj;
                // ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DropDownMasterList = {};
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function Approve()
        {
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsApproved=true;
            toastr.success("CheckList Approved");
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ApproveBtnText="Approved"
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.IsDisableApproveBtn = true;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.RejectBtnText = "Reject";
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.IsDisableRejectBtn = false;
        }
        
        function Reject()
        {
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsApproved=false;
            toastr.success("CheckList Rejected");
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.RejectBtnText = "Rejected";
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.IsDisableRejectBtn = true;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.IsDisableApproveBtn = false;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ApproveBtnText="Approve"
        }
        Init();
    }
})();