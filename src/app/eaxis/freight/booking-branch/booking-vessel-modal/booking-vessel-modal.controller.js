(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingVesselModalController", ConvertBookingVesselModalController);

    ConvertBookingVesselModalController.$inject = ["$injector", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param", "errorWarningService"];

    function ConvertBookingVesselModalController($injector, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param, errorWarningService) {
        var ConvertBookingVesselModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ConvertBookingVesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": param.ParentObj.Masters,
                "Meta": param.ParentObj.Meta,
                "Entities": param.ParentObj.Entities
            };

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListSailing = errorWarningService.Modules.BookingBranch.Entity[ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing'].GlobalErrorWarningList;
            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjSailing = errorWarningService.Modules.BookingBranch.Entity[ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing'];

            InitVesselPlanning();
        }

        function InitVesselPlanning() {
            ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj = {}
            ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobSailing = {}
            ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes = {}
            ConvertBookingVesselModalCtrl.ePage.Masters.SaveText = "Save";
            ConvertBookingVesselModalCtrl.ePage.Masters.save = Save
            ConvertBookingVesselModalCtrl.ePage.Masters.Cancel = Cancel;
            ConvertBookingVesselModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            ConvertBookingVesselModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function Save() {
            sailingValidation()
            if (ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListSailing.length == 0) {
                var obj = {
                    "Vessel": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.Vessel,
                    "VoyageFlight": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.VoyageFlight,
                    "LoadPort": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfLoading,
                    "DischargePort": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfDischarge,
                    "ETD": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETD,
                    "ETA": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETA,
                    "CarrierOrg_FK": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierOrg_FK,
                    "CarrierOrg_Code": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierCode,
                    "DocumentCutOffDate": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.DocumentCutOffDate,
                    "CarrierReference": ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierReference
                };
                ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes = obj
                ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.IsDeleted = false;
                ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UISailingList.push(ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj)
                $uibModalInstance.close();
                errorWarningService.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, true, 'E0033', false, undefined);
            }
        }

        function sailingValidation() {

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.Vessel, 'E0022', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierCode, 'E0023', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.VoyageFlight, 'E0024', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETA, 'E0025', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETD, 'E0026', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfLoading, 'E0027', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfDischarge, 'E0028', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobSailing.LCLCutOff, 'E0029', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.DocumentCutOffDate, 'E0030', false);

            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', ConvertBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierReference, 'E0036', false);
        }

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            ConvertBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", ConvertBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Sailing', $item.data.entity[val], code, IsArray);
        }


        Init();
    }
})();