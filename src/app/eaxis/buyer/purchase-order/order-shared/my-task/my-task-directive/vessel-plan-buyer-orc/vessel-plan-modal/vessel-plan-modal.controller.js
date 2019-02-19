(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VesselPlanModalController", VesselPlanModalController);

    VesselPlanModalController.$inject = ["$uibModalInstance", "$injector", "$timeout", "$q", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "param", "errorWarningService"];

    function VesselPlanModalController($uibModalInstance, $injector, $timeout, $q, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, param, errorWarningService) {
        var VesselPlanModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            VesselPlanModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Vessel_Planning",
                "Masters": param.ParentObj.Masters,
                "Meta": param.ParentObj.Meta,
                "Entities": param.ParentObj.Entities
            };

            // DatePicker
            VesselPlanModalCtrl.ePage.Masters.DatePicker = {};
            VesselPlanModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VesselPlanModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            VesselPlanModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitVesselPlanning();
        }

        function InitVesselPlanning() {
            VesselPlanModalCtrl.ePage.Masters.Param = param;
            VesselPlanModalCtrl.ePage.Masters.DropDownMasterList = {};
            VesselPlanModalCtrl.ePage.Masters.VesselUpdate = VesselUpdate;
            VesselPlanModalCtrl.ePage.Masters.Cancel = Cancel;
            VesselPlanModalCtrl.ePage.Masters.IsTransport = true;
            VesselPlanModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            VesselPlanModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            VesselPlanModalCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            VesselPlanModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            if (param.Type == "New") {
                VesselPlanModalCtrl.ePage.Masters.SaveText = "Save";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = param.Input;
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.CarrierOrg_Code = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.BookingCutOffDate = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.CargoCutOffDate = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.DischargePort = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.ETA = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.ETD = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.LoadPort = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.Vessel = "";
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.VoyageFlight = "";
            } else {
                VesselPlanModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = param.Input;
                VesselPlanModalCtrl.ePage.Masters.SaveText = "Update";
            }

            GetRelatedLookupList();
            GetMastersDropDownList();
            InitValidation();
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "BP_OrdCarrier_12833,BP_OrdPlannedVessel_13185,BP_VesselPOL_13309,BP_VesselPOD_13310",
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
                        VesselPlanModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        VesselPlanModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Cancel() {
            (VesselPlanModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length == 0) ? $uibModalInstance.dismiss('cancel'): false;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VesselPlanModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitValidation() {
            var _obj = {
                ModuleName: ["PreAdvice"],
                Code: [VesselPlanModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "BUY_ORD_PRE_ADV",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                ErrorCode: [],
                EntityObject: VesselPlanModalCtrl.ePage.Entities.Header.Data
            };

            errorWarningService.GetErrorCodeList(_obj);
            VesselPlanModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.PreAdvice.Entity[VesselPlanModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
            VesselPlanModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.PreAdvice.Entity[VesselPlanModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            // error warning modal
            VesselPlanModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
        }

        function VesselUpdate(_item, btn) {
            CommonErrorObjInput();
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.PreAdvice.Entity[VesselPlanModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    // insert call for vessel
                    VesselPlanModalCtrl.ePage.Masters.IsDisableSave = true;
                    VesselPlanModalCtrl.ePage.Masters.SaveText = "Please wait..";
                    var _input = InputData(_item, false);
                    apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Insert.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            UpdateRecords(response.data.Response).then(function (response) {
                                if (response.data.Status == "Success") {
                                    VesselPlanModalCtrl.ePage.Masters.IsDisableSave = false;
                                    VesselPlanModalCtrl.ePage.Masters.SaveText = btn;
                                    $uibModalInstance.close(response);
                                } else {
                                    toastr.error("Save failed...");
                                    VesselPlanModalCtrl.ePage.Masters.IsDisableSave = false;
                                    VesselPlanModalCtrl.ePage.Masters.SaveText = btn;
                                }
                            });
                        } else {
                            toastr.error("Save failed...");
                            VesselPlanModalCtrl.ePage.Masters.IsDisableSave = false;
                            VesselPlanModalCtrl.ePage.Masters.SaveText = btn;
                        }
                    });
                } else {
                    ShowErrorWarningModal(VesselPlanModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo);
                }
            });
        }

        function UpdateRecords(list) {
            var deferred = $q.defer();
            var _updateRecord = [];
            list.map(function (val, key) {
                var _input = {
                    "EntityRefPK": VesselPlanModalCtrl.ePage.Masters.TaskObj.EntityRefKey,
                    "Properties": [{
                        "PropertyName": "POH_CRT_FK",
                        "PropertyNewValue": val.PK
                    }]
                };
                _updateRecord.push(_input);
            });
            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.updaterecords.Url, _updateRecord).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function InputData(_item) {
            var _jobRoutesInput = [];
            var _input = {
                "Vessel": _item.Vessel,
                "VoyageFlight": _item.VoyageFlight,
                "LoadPort": _item.LoadPort,
                "DischargePort": _item.DischargePort,
                "ETD": _item.ETD,
                "ETA": _item.ETA,
                // "JBS_FK": val.PK,
                "CarrierOrg_FK": _item.CarrierOrg_FK,
                "CarrierOrg_Code": _item.CarrierOrg_Code,
                "CargoCutOffDate": _item.CargoCutOffDate,
                "BookingCutOffDate": _item.BookingCutOffDate,
                "EntitySource": "POH",
                "EntityRefKey": VesselPlanModalCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            _jobRoutesInput.push(_input);
            return _jobRoutesInput;
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["PreAdvice"],
                Code: [VesselPlanModalCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "BUY_ORD_PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: VesselPlanModalCtrl.ePage.Entities.Header.Data,
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