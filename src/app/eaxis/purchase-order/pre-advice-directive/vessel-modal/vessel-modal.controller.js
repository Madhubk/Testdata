(function () {
    "use strict";

    angular
        .module("Application")
        .controller("vesselModalController", VesselModalController);

    VesselModalController.$inject = ["$injector", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param", "preAdviceConfig", "errorWarningService"];

    function VesselModalController($injector, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModalInstance, param, preAdviceConfig, errorWarningService) {
        var VesselModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            VesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            // DatePicker
            VesselModalCtrl.ePage.Masters.DatePicker = {};
            VesselModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VesselModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            VesselModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            VesselModalCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitVesselPlanning();
            InitValidation();
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
            VesselModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            VesselModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            VesselModalCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // error warning modal
            VesselModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            if (VesselModalCtrl.ePage.Masters.Param.Mode === "Edit") {
                VesselModalCtrl.ePage.Masters.ResetText = false;
                VesselModalCtrl.ePage.Masters.SaveText = "Update";
                VesselModalCtrl.ePage.Masters.GridShow = true;
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = param.BulkInput[0];
                VesselModalCtrl.ePage.Masters.TransportMode = param.BulkInput[0].TransportMode;
            } else {
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = {};
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.PlannedCarrier = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.BookingCutOffDate = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.CargoCutOffDate = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.DischargePort = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.PlannedETA = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.PlannedETD = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.LoadPort = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.PlannedVessel = "";
                VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.PlannedVoyage = "";
                VesselModalCtrl.ePage.Masters.TransportMode = param.BulkInput[0].TransportMode;
                VesselModalCtrl.ePage.Masters.SaveText = "Save";
                VesselModalCtrl.ePage.Masters.ResetText = true;
            }

            GetMastersDropDownList();
            GetRelatedLookupList();
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

        function Cancel() {
            (VesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length == 0) ? $uibModalInstance.dismiss('cancel'): false;
        }

        function OnChangeDatePicker(type, check) {
            switch (type) {
                case "PlannedETD":
                    DateCheck(type, check, 'Greater than');
                    break;
                case "PlannedETA":
                    DateCheck(type, check, 'Less than');
                    break;
                case "CargoCutOffDate":
                    DateCheck(type, check, 'Greater than');
                    break;
                case "BookingCutOffDate":
                    DateCheck(type, check, 'Less than');
                    break;
                default:
                    break;
            }
        }

        function DateCheck(type, check, condition) {
            if (condition == 'Greater than') {
                if (VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[type] && VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[check]) {
                    var checkDate1 = new Date(VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[type]);
                    var checkDate2 = new Date(VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[check]);
                    if (Date.parse(checkDate1) <= Date.parse(checkDate2)) {} else {
                        VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[type] = undefined;
                        toastr.warning(type + ' is not ' + condition + ' ' + check);
                    }
                }
            } else {
                if (VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[type] && VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[check]) {
                    var checkDate1 = new Date(VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[type]);
                    var checkDate2 = new Date(VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[check]);
                    if (Date.parse(checkDate1) >= Date.parse(checkDate2)) {} else {
                        VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails[type] = undefined;
                        toastr.warning(type + ' is not ' + condition + ' ' + check);
                    }
                }
            }
        }

        function InitValidation() {
            if (param.BulkInput) {
                var _obj = {
                    ModuleName: ["PreAdvice"],
                    Code: [param.BulkInput[0].OrderCumSplitNo],
                    API: "Validation",
                    FilterInput: {
                        ModuleCode: "ORD",
                        SubModuleCode: "PRE"
                    },
                    // GroupCode: "TC_Test",
                    //     RelatedBasicDetails: [{
                    //         "UIField": "TEST",
                    //         "DbField": "TEST",
                    //         "Value": "TEST"
                    //     }],
                    ErrorCode: [],
                    EntityObject: VesselModalCtrl.ePage.Entities.Header.Data
                };

                errorWarningService.GetErrorCodeList(_obj);
                // error warning modal
                VesselModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                VesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.PreAdvice.Entity[VesselModalCtrl.ePage.Masters.Param.BulkInput[0].OrderCumSplitNo].GlobalErrorWarningList;
                VesselModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.PreAdvice.Entity[VesselModalCtrl.ePage.Masters.Param.BulkInput[0].OrderCumSplitNo];
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VesselModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function BulkReset() {
            VesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = {};
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdCarrierPlanning_2834,OrdVesselPlanning_3187,VesselPOL_3309,VesselPOD_3310",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
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

        function BulkUpdate(_item, type) {
            CommonErrorObjInput();
            // validation check
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.PreAdvice.Entity[VesselModalCtrl.ePage.Masters.Param.BulkInput[0].OrderCumSplitNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    // insert call for vessel
                    var _input = InputData(_item, false);
                    apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.ListInsert.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            JobRoutes(response.data.Response, _item);
                        } else {
                            toastr.error("Save failed...");
                        }
                    });
                } else {
                    ShowErrorWarningModal(VesselModalCtrl.ePage.Masters.Param.BulkInput[0].OrderCumSplitNo);
                }
            });
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["PreAdvice"],
                Code: [VesselModalCtrl.ePage.Masters.Param.BulkInput[0].OrderCumSplitNo],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "PRE",
                },
                // GroupCode: "TC_Test",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: VesselModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function JobRoutes(data, _item) {
            var _jobRoutesInput = [];
            data.map(function (val, key) {
                var _input = {
                    "Vessel": _item.PlannedVessel,
                    "VoyageFlight": _item.PlannedVoyage,
                    "LoadPort": _item.LoadPort,
                    "DischargePort": _item.DischargePort,
                    "ETD": _item.PlannedETD,
                    "ETA": _item.PlannedETA,
                    "JBS_FK": val.PK,
                    "CarrierOrg_FK": _item.CarrierOrg_FK,
                    "CarrierOrg_Code": _item.PlannedCarrier,
                    "EntitySource": "POH",
                    "EntityRefKey": val.SourceRefKey
                };
                _jobRoutesInput.push(_input);
            });
            apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Insert.Url, _jobRoutesInput).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (val, key) {
                        val.BookingCutOffDate = data[0].LCLReceivalCommences;
                        val.CargoCutOffDate = data[0].LCLCutOff;
                    });
                    UpdateRecords(response.data.Response[0]);
                    // $uibModalInstance.close(response.data.Response[0]);
                } else {
                    toastr.error("Save failed...");
                }
            });
        }

        function UpdateRecords(list) {
            var _inputUpdateRecord = [];
            param.BulkInput.map(function (val, key) {
                var _input = {
                    "EntityRefPK": val.PK,
                    "Properties": [{
                        "PropertyName": "POH_CRT_FK",
                        "PropertyNewValue": list.PK
                    }]
                };
                _inputUpdateRecord.push(_input);
            });
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _inputUpdateRecord).then(function (response) {
                if (response.data.Response) {
                    $uibModalInstance.close(list);
                } else {
                    toastr.error("Save failed...");
                }
            });
        }

        function InputData(_item, type) {
            var _input = [];
            for (i = 0; i < VesselModalCtrl.ePage.Masters.Param.BulkInput.length; i++) {
                var _filterInput = {
                    "LCLCutOff": _item.CargoCutOffDate,
                    "LCLReceivalCommences": _item.BookingCutOffDate,
                    "EntitySource": "POH",
                    "SourceRefKey": VesselModalCtrl.ePage.Masters.Param.BulkInput[i].PK
                }
                _input.push(_filterInput);
            }
            return _input;
        }

        function AutoCompleteOnSelect($item, code) {
            $timeout(function () {
                CommonErrorObjInput(code);
            });
        }

        function SelectedLookupData($item, code) {
            $timeout(function () {
                CommonErrorObjInput(code);
            });
        }

        function OnFieldValueChange(code) {
            CommonErrorObjInput(code);
        }

        Init();
    }
})();