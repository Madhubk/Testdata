(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SPAVesselModalController", SPAVesselModalController);

    SPAVesselModalController.$inject = ["$uibModalInstance", "$injector", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "param", "errorWarningService"];

    function SPAVesselModalController($uibModalInstance, $injector, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, param, errorWarningService) {
        var SPAVesselModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SPAVesselModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": param.ParentObj.Masters,
                "Meta": param.ParentObj.Meta,
                "Entities": param.ParentObj.Entities
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
            SPAVesselModalCtrl.ePage.Masters.IsTransport = true;
            SPAVesselModalCtrl.ePage.Masters.SaveText = "Save";
            SPAVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = param.BulkInput[0];
            SPAVesselModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            SPAVesselModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            SPAVesselModalCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            GetRelatedLookupList();
            GetMastersDropDownList();
            InitValidation();
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "SPACarrier_2831,SPAVessel_3184,PortOfLoading_3086,POD_3308",
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

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Cancel() {
            (SPAVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length == 0) ? $uibModalInstance.dismiss('cancel'): false;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SPAVesselModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitValidation() {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [SPAVesselModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
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
                EntityObject: SPAVesselModalCtrl.ePage.Entities.Header.Data
            };

            errorWarningService.GetErrorCodeList(_obj);

            SPAVesselModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            SPAVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[SPAVesselModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
            SPAVesselModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[SPAVesselModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            // error warning modal
            SPAVesselModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
        }

        function BulkReset() {
            SPAVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = {};
        }

        function DetachVesselOrder(_data) {
            SPAVesselModalCtrl.ePage.Masters.PreAdviceOrderList.map(function (value, key) {
                if (value.PK === _data.PK) {
                    toastr.success("Successfully vessel detached");
                    SPAVesselModalCtrl.ePage.Masters.PreAdviceOrderList.splice(key, 1);
                }
            })
        }

        function BulkUpdate(_item) {
            CommonErrorObjInput();
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[SPAVesselModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
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
                    ShowErrorWarningModal(SPAVesselModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo);
                }
            });
        }

        function JobRoutes(data, _item) {
            var _jobRoutesInput = [];
            data.map(function (val, key) {
                var _input = {
                    "Vessel": _item.PlannedVessel,
                    "VoyageFlight": _item.PlannedVoyage,
                    "LoadPort": _item.PortOfLoading,
                    "DischargePort": _item.PortOfDischarge,
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
                    (response.data.Response.length > 0) ? PorOrderUpdates(response.data.Response): false;
                } else {
                    toastr.error("Save failed...");
                }
            });
        }

        function PorOrderUpdates(list) {
            var _updateRecord = [];
            list.map(function (val, key) {
                var _input = {
                    "EntityRefPK": val.POH_FK,
                    "Properties": [{
                        "PropertyName": "POH_CRT_FK",
                        "PropertyNewValue": val.PPA_CRT_FK
                    }]
                };
                _updateRecord.push(_input);
            });
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateRecord).then(function (response) {
                if (response.data.Response) {
                    $uibModalInstance.close(response.data.Response);
                } else {
                    toastr.error("Save failed...");
                }
            });
        }

        function InputData(_item, type) {
            var _input = [];
            for (i = 0; i < SPAVesselModalCtrl.ePage.Masters.Param.BulkInput.length; i++) {
                var _filterInput = {
                    "LCLCutOff": _item.CargoCutOffDate,
                    "LCLReceivalCommences": _item.BookingCutOffDate,
                    "EntitySource": "POH",
                    "SourceRefKey": SPAVesselModalCtrl.ePage.Masters.Param.BulkInput[i].POH_FK
                }
                _input.push(_filterInput);
            }
            return _input;
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [SPAVesselModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
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
                EntityObject: SPAVesselModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
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