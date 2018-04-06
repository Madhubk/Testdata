(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SPAVesselModalController", SPAVesselModalController);

    SPAVesselModalController.$inject = ["$injector", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param"];

    function SPAVesselModalController($injector, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param) {
        var SPAVesselModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SPAVesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            // DatePicker
            SPAVesselModalCtrl.ePage.Masters.DatePicker = {};
            SPAVesselModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SPAVesselModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            SPAVesselModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            
            InitVesselPlanning();       
        }

        function InitVesselPlanning() {
            SPAVesselModalCtrl.ePage.Masters.Param = param;
            SPAVesselModalCtrl.ePage.Masters.DropDownMasterList = {};
            SPAVesselModalCtrl.ePage.Masters.SaveText = "Save";
            SPAVesselModalCtrl.ePage.Masters.BulkUpdate = BulkUpdate;
            SPAVesselModalCtrl.ePage.Masters.BulkReset = BulkReset;
            SPAVesselModalCtrl.ePage.Masters.Cancel = Cancel;
            SPAVesselModalCtrl.ePage.Masters.DetachVesselOrder = DetachVesselOrder;
            SPAVesselModalCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SPAVesselModalCtrl.ePage.Masters.IsTransport = true;

            if (SPAVesselModalCtrl.ePage.Masters.Param.Mode === "Edit") {
                SPAVesselModalCtrl.ePage.Masters.ResetText = false;
                SPAVesselModalCtrl.ePage.Masters.SaveText = "Update";
                SPAVesselModalCtrl.ePage.Masters.BulkInput = param.BulkInput[0];
            } else {
                SPAVesselModalCtrl.ePage.Masters.BulkInput = param.BulkInput[0];
                SPAVesselModalCtrl.ePage.Masters.BulkInput.Vessel_FK = "";
                SPAVesselModalCtrl.ePage.Masters.SaveText = "Save";
                SPAVesselModalCtrl.ePage.Masters.ResetText = true;
            }

            GetMastersDropDownList();
            GetDynamicLookupConfig();
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SPAVesselModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function BulkReset() {
            SPAVesselModalCtrl.ePage.Masters.BulkInput = {};
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
                        SPAVesselModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        SPAVesselModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function DetachVesselOrder(_data) {
            SPAVesselModalCtrl.ePage.Masters.PreAdviceOrderList.map(function (value, key) {
                if (value.PK === _data.PK) {
                    toastr.success("Successfully vessel detached");
                    SPAVesselModalCtrl.ePage.Masters.PreAdviceOrderList.splice(key, 1);
                }
            })
        }

        function FilterInput(_item, type) {
            var _filter = [];
            for ( i=0; i<SPAVesselModalCtrl.ePage.Masters.Param.BulkInput.length; i++) {
                var _filterInput = {
                    "PK" : _item.Vessel_FK,
                    "TransportMode" : _item.TransportMode,
                    "Vessel" : _item.Vessel,
                    "VoyageFlight" : _item.VoyageFlight,
                    "LoadPort" : _item.PortOfLoading,
                    "DischargePort" : _item.PortOfDischarge,
                    "ETA" : _item.PlannedETA,
                    "ETD" : _item.PlannedETD,
                    "CarrierOrg_Code" : _item.CarrierOrg_Code,
                    "CarrierOrg_FK" : _item.CarrierOrg_FK,
                    "ATA" : _item.CargoCutOffDate,
                    "ATD" : _item.BookingCutOffDate,
                    "IsModified" : type,
                    "EntityRefKey" : SPAVesselModalCtrl.ePage.Masters.Param.BulkInput[i].PK
                }
                _filter.push(_filterInput)
            }
            return _filter;
        }

        function BulkUpdate(_item, type) {
            if (EmptyOrNullCheck(_item.CarrierOrg_Code) || EmptyOrNullCheck(_item.Vessel)) {
                toastr.warning("Selected Order(s) has should be manotary for Carrier & Vessel")                
                return false;
            }
            if (EmptyOrNullCheck(_item.PortOfLoading) || EmptyOrNullCheck(_item.PortOfDischarge)) {
                toastr.warning("Selected Order(s) has should be manotary for POL & POD")
                return false;
            }
            if (EmptyOrNullCheck(_item.PlannedETA) || EmptyOrNullCheck(_item.PlannedETD)) {
                toastr.warning("Selected Order(s) has should be manotary for ETA & ETD")
                return false;
            }
            if (EmptyOrNullCheck(_item.BookingCutOffDate) || EmptyOrNullCheck(_item.CargoCutOffDate)) {
                toastr.warning("Selected Order(s) has should be manotary for CargoCutOffDate & BookingCutOffDate")
                return false;
            }
            if (EmptyOrNullCheck(_item.VoyageFlight)) {
                toastr.warning("Selected Order(s) has should be manotary for Voyage")
                return false;
            }
            if(type === "Save") {
                var _input = InputData(_item, false);
                apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.ListInsert.Url, _input).then(function (response) {
                    if (response.data) {
                        JobRoutes(response.data, _item);
                    } else {
                        toastr.error("Save failed...");
                    }
                });
            } else {

            }
        }
        function JobRoutes(data, _item) {
            var _jobRoutesInput = [];
            data.map(function (val, key) {
                var _input = {
                    "Vessel": _item.Vessel,
                    "VoyageFlight": _item.VoyageFlight,
                    "LoadPort": _item.PortOfLoading,
                    "DischargePort": _item.PortOfDischarge,
                    "ETD": _item.PlannedETD,
                    "ETA": _item.PlannedETA,
                    "JBS_FK": val.PK,
                    "CarrierOrg_FK": _item.CarrierOrg_FK,
                    "CarrierOrg_Code": _item.CarrierOrg_Code,
                    "EntitySource": "POH",
                    "EntityRefKey": val.SourceRefKey
                };
                _jobRoutesInput.push(_input);
            });
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Insert.Url, _jobRoutesInput).then(function (response) {
                if (response.data.Response) {
                    UpdateRecords(response.data.Response);
                } else {
                    toastr.error("Save failed...");
                }
            });
        }

        function UpdateRecords(list) {
            var _inputUpdateRecord = [];
            list.map(function (val, key) {
                var tempObj = _.filter(SPAVesselModalCtrl.ePage.Masters.Param.BulkInput, {
                    'POH_FK': val.EntityRefKey
                })[0];
                var _input = {
                    "EntityRefPK": tempObj.PK,
                    "Properties": [{
                        "PropertyName": "PPA_CRT_FK",
                        "PropertyNewValue": val.PK
                    }]
                };
                _inputUpdateRecord.push(_input);
            });
            apiService.post('eAxisAPI', appConfig.Entities.VesselPlanning.API.UpdateRecords.Url, _inputUpdateRecord).then(function (response) {
                if (response.data.Response) {
                    $uibModalInstance.close(response.data.Response);
                } else {
                    toastr.error("Save failed...");
                }
            });    
        }

        function InputData(_item, type) {
            var _input = [];
            for ( i=0; i < SPAVesselModalCtrl.ePage.Masters.Param.BulkInput.length; i++) {
                var _filterInput = {
                    "LCLCutOff": _item.LCLCutOff,
                    "LCLReceivalCommences": _item.CutOff,
                    "EntitySource": "POH",
                    "SourceRefKey": SPAVesselModalCtrl.ePage.Masters.Param.BulkInput[i].POH_FK
                }
                _input.push(_filterInput);
            }
            return _input;
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,MDM_CarrierList";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };
            
            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                
                res.map(function (value, key) {
                    SPAVesselModalCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function EmptyOrNullCheck(value) {
            if (value == "" || value == null)
                return true;
            else
                return false;
        }

        Init();
    }
})();
