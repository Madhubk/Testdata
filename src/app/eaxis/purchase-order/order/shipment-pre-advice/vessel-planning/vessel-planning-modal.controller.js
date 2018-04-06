(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ordVesselModalController", OrdVesselModalController);

    OrdVesselModalController.$inject = ["APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$uibModalInstance", "param"];

    function OrdVesselModalController(APP_CONSTANT, authService, apiService, appConfig, helperService, $uibModalInstance , param) {
        var OrdVesselModalCtrl = this;

        function Init() {
            OrdVesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            
            InitVesselPlanning();
        }

        function InitVesselPlanning() {
            // DatePicker
            OrdVesselModalCtrl.ePage.Masters.DatePicker = {};
            OrdVesselModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdVesselModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdVesselModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrdVesselModalCtrl.ePage.Masters.VesselUpdate = VesselUpdate;
            OrdVesselModalCtrl.ePage.Masters.Cancel = Cancel;
            OrdVesselModalCtrl.ePage.Masters.DropDownMasterList = {};
            OrdVesselModalCtrl.ePage.Masters.IsModeDisable = true;
            
            if (param.Type == "New") {
                OrdVesselModalCtrl.ePage.Masters.SaveText = "Save";
                OrdVesselModalCtrl.ePage.Masters.Param = param;
                OrdVesselModalCtrl.ePage.Masters.Param.Input.PK = "";
                OrdVesselModalCtrl.ePage.Masters.Param.Input.TransportMode = param.Mode.UIPorOrderHeader.TransportMode;
                OrdVesselModalCtrl.ePage.Masters.OrderHeader = param.Mode.UIPorOrderHeader;
            } else {
                OrdVesselModalCtrl.ePage.Masters.SaveText = "Update";
                OrdVesselModalCtrl.ePage.Masters.Param = param;
                OrdVesselModalCtrl.ePage.Masters.OrderHeader = param.Input;
            }

            GetMastersDropDownList();
        }
        
        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdVesselModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["TRANSTYPE", "ROUTEMODE", "ROUTESTATUS", "ROUTETYPES"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        OrdVesselModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OrdVesselModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        
        function VesselFilterInput(_item, type) {
            var _filterInput = {
                "PK" : _item.PK,
                "TransportMode" : _item.TransportMode,
                "Vessel" : _item.Vessel,
                "VoyageFlight" : _item.VoyageFlight,
                "LoadPort" : _item.LoadPort,
                "DischargePort" : _item.DischargePort,
                "ETA" : _item.ETA,
                "ETD" : _item.ETD,
                "CarrierOrg_Code" : _item.CarrierOrg_Code,
                "CarrierOrg_FK" : _item.CarrierOrg_FK,
                "ATA" : _item.ATA,
                "ATD" : _item.ATD,
                "IsModified" : type,
                "EntityRefKey" : OrdVesselModalCtrl.ePage.Masters.OrderHeader.PK
            }
            return _filterInput;
        }
        
        function VesselUpdate(_item, type) {            
            if (type=="Save") {
                var _input = VesselFilterInput(_item, false)
                apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        $uibModalInstance.close(response.data.Response);
                    }
                });
            } else {
                var _input = VesselFilterInput(_item, true)
                apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.UpdateList.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        $uibModalInstance.close(response.data.Response);
                    }
                });
            }
        }

        Init();
    }
})();
