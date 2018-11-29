(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyBookingVesselModalController", VerifyBookingVesselModalController);

    VerifyBookingVesselModalController.$inject = ["$injector", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param", "errorWarningService"];

    function VerifyBookingVesselModalController($injector, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param, errorWarningService) {
        var VerifyBookingVesselModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            VerifyBookingVesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": param.ParentObj.Masters,
                "Meta": param.ParentObj.Meta,
                "Entities": param.ParentObj.Entities
            };

            InitVesselPlanning();
            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListSailing = errorWarningService.Modules.MyTask.Entity[VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing'].GlobalErrorWarningList;
            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjSailing = errorWarningService.Modules.MyTask.Entity[VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing'];
        }

        function InitVesselPlanning() {
            VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj = {}
            VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobSailing = {}
            VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes = {}
            VerifyBookingVesselModalCtrl.ePage.Masters.SaveText = "Save";
            VerifyBookingVesselModalCtrl.ePage.Masters.save = Save
            VerifyBookingVesselModalCtrl.ePage.Masters.Cancel = Cancel;
            VerifyBookingVesselModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect
            VerifyBookingVesselModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData

        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function Save() {
            sailingValidation()
            if (VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListSailing.length == 0) {
                var _filterInput = {
                    "LCLCutOff": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobSailing.LCLCutOff,
                    "EntitySource": "SHP",
                    "SourceRefKey": VerifyBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode.PK
                }

                apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.ListInsert.Url, [_filterInput]).then(function (response) {
                    if (response.data.Response) {
                        JobRoutes(response.data.Response[0]);
                    } else {
                        toastr.error("Save failed...");
                    }
                });

            }
        }

        function JobRoutes(val) {
            var obj = {
                "Vessel": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.Vessel,
                "VoyageFlight": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.VoyageFlight,
                "LoadPort": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfLoading,
                "DischargePort": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfDischarge,
                "ETD": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETD,
                "ETA": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETA,
                "CarrierOrg_FK": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierOrg_FK,
                "CarrierOrg_Code": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierCode,
                "EntitySource": "SHP",
                "JBS_FK": val.PK,
                "EntityRefKey": VerifyBookingVesselModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
                "DocumentCutOffDate": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.DocumentCutOffDate,
                "CarrierReference": VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierReference
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Insert.Url, [obj]).then(function (response) {
                if (response.data.Response) {
                    $uibModalInstance.close();
                    VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo, true, 'E0033', false, undefined);
                } else {
                    toastr.error("Save failed...");
                }
            });
        }

        function sailingValidation() {

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.Vessel, 'E0022', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierCode, 'E0023', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.VoyageFlight, 'E0024', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETA, 'E0025', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PlannedETD, 'E0026', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfLoading, 'E0027', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.PortOfDischarge, 'E0028', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobSailing.LCLCutOff, 'E0029', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.DocumentCutOffDate, 'E0030', false);

            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', VerifyBookingVesselModalCtrl.ePage.Masters.SailingObj.UIJobRoutes.CarrierReference, 'E0036', false);
        }

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            VerifyBookingVesselModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", VerifyBookingVesselModalCtrl.ePage.Masters.MyTask.PSI_InstanceNo + 'Sailing', $item.data.entity[val], code, IsArray);
        }


        Init();
    }
})();