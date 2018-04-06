(function () {
    "use strict";

    angular
        .module("Application")
        .controller("vesselModalController", VesselModalController);

    VesselModalController.$inject = ["APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param", "preAdviceConfig"];

    function VesselModalController( APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param, preAdviceConfig) {
        var VesselModalCtrl = this;

        function Init() {
            VesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": preAdviceConfig.Entities
            };

            // DatePicker
            VesselModalCtrl.ePage.Masters.DatePicker = {};
            VesselModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VesselModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            VesselModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            
            InitVesselPlanning();       
        }

        function InitVesselPlanning() {
            VesselModalCtrl.ePage.Masters.Param = param;
            VesselModalCtrl.ePage.Masters.DropDownMasterList = {};
            VesselModalCtrl.ePage.Masters.GridShow = false;
            VesselModalCtrl.ePage.Masters.SaveText = "Save";
            VesselModalCtrl.ePage.Masters.IsDisable = true;
            VesselModalCtrl.ePage.Masters.BulkUpdate = BulkUpdate;
            VesselModalCtrl.ePage.Masters.BulkReset = BulkReset;
            VesselModalCtrl.ePage.Masters.Cancel = Cancel;
            VesselModalCtrl.ePage.Masters.DetachVesselOrder = DetachVesselOrder;

            if (VesselModalCtrl.ePage.Masters.Param.Mode === "Edit") {
                VesselModalCtrl.ePage.Masters.ResetText = false;
                VesselModalCtrl.ePage.Masters.SaveText = "Update";
                VesselModalCtrl.ePage.Masters.GridShow = true;
                VesselModalCtrl.ePage.Masters.BulkInput = param.BulkInput[0];
                VesselRelatedOrder();
            } else {
                VesselModalCtrl.ePage.Masters.BulkInput = param.BulkInput[0];
                VesselModalCtrl.ePage.Masters.BulkInput.Vessel_FK = "";
                VesselModalCtrl.ePage.Masters.SaveText = "Save";
                VesselModalCtrl.ePage.Masters.ResetText = true;
            }

            GetMastersDropDownList();
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VesselModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function BulkReset() {
            VesselModalCtrl.ePage.Masters.BulkInput = {};
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
                        VesselModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        VesselModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function DetachVesselOrder(_data) {
            VesselModalCtrl.ePage.Masters.PreAdviceOrderList.map(function (value, key) {
                if (value.PK === _data.PK) {
                    toastr.success("Successfully vessel detached");
                    VesselModalCtrl.ePage.Masters.PreAdviceOrderList.splice(key, 1);
                }
            })
        }
        function VesselRelatedOrder() {
            VesselModalCtrl.ePage.Masters.spinner = true;
            var _filter = {
                "IsShpCreated" : false,
                "IsFollowUpIdCreated" : true,
                "IsPreAdviceIdCreated" : false
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VesselModalCtrl.ePage.Masters.spinner = false;
                    VesselModalCtrl.ePage.Masters.PreAdviceOrderList = response.data.Response;
                } else {
                    VesselModalCtrl.ePage.Masters.spinner = false;
                }
            });
        }

        function FilterInput(_item, type) {
            var _filter = [];
            for ( i=0; i<VesselModalCtrl.ePage.Masters.Param.BulkInput.length; i++) {
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
                    "EntityRefKey" : VesselModalCtrl.ePage.Masters.Param.BulkInput[i].PK
                }
                _filter.push(_filterInput);
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
            // if (type=="Save") {
            //     var _input = FilterInput(_item, false)
            //     apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Insert.Url, _input).then(function (response) {
            //         if (response.data.Response) {
            //             $uibModalInstance.close(response.data.Response[0]);
            //         }
            //     });
            // } else {
            //     var _input = FilterInput(_item, true)
            //     apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.UpdateList.Url, _input).then(function (response) {
            //         if (response.data.Response) {
            //             $uibModalInstance.close(response.data.Response);
            //         }
            //     });
            // }
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
                var tempObj = _.filter(VesselModalCtrl.ePage.Masters.Param.BulkInput, {
                    'PK': val.EntityRefKey
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
                } else {
                    toastr.error("Save failed...");
                }
            });    
        }

        function InputData(_item, type) {
            var _input = [];
            for ( i=0; i < VesselModalCtrl.ePage.Masters.Param.BulkInput.length; i++) {
                var _filterInput = {
                    "LCLCutOff": _item.LCLCutOff,
                    "LCLReceivalCommences": _item.CutOff,
                    "EntitySource": "POH",
                    "SourceRefKey": VesselModalCtrl.ePage.Masters.Param.BulkInput[i].PK
                }
                _input.push(_filterInput);
            }
            return _input;
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
