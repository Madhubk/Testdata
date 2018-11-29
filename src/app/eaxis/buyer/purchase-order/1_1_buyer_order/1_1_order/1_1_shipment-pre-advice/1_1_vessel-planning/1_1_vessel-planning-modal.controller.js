(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrdVesselModalController", one_one_OrdVesselModalController);

    one_one_OrdVesselModalController.$inject = ["$timeout", "$injector", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "param", "toastr", "errorWarningService", "one_order_listConfig"];

    function one_one_OrdVesselModalController($timeout, $injector, $uibModalInstance, APP_CONSTANT, authService, apiService, appConfig, helperService, param, toastr, errorWarningService, one_order_listConfig) {
        var one_one_OrdVesselModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            one_one_OrdVesselModalCtrl.ePage = {
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

            InitVesselPlanning();
        }

        function InitVesselPlanning() {
            // DatePicker
            one_one_OrdVesselModalCtrl.ePage.Masters.DatePicker = {};
            one_one_OrdVesselModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_one_OrdVesselModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_one_OrdVesselModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            one_one_OrdVesselModalCtrl.ePage.Masters.VesselUpdate = VesselUpdate;
            one_one_OrdVesselModalCtrl.ePage.Masters.Cancel = Cancel;
            one_one_OrdVesselModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            one_one_OrdVesselModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            one_one_OrdVesselModalCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            one_one_OrdVesselModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            one_one_OrdVesselModalCtrl.ePage.Masters.DropDownMasterList = {};
            one_one_OrdVesselModalCtrl.ePage.Masters.IsModeDisable = true;
            one_one_OrdVesselModalCtrl.ePage.Masters.Text = "PreAdvice";

            if (param.Type == "New") {
                one_one_OrdVesselModalCtrl.ePage.Masters.SaveText = "Save";
                one_one_OrdVesselModalCtrl.ePage.Masters.Param = param.Mode.UIOrder_Buyer;
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = {};
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.CarrierOrg_Code = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.BookingCutOffDate = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.CargoCutOffDate = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.DischargePort = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.ETA = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.ETD = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.LoadPort = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.Vessel = "";
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails.VoyageFlight = "";
            } else {
                one_one_OrdVesselModalCtrl.ePage.Masters.SaveText = "Update";
                one_one_OrdVesselModalCtrl.ePage.Masters.Param = param.Mode.UIOrder_Buyer;
                one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data.UIVesselDetails = param.Input;
            }

            InitValidation();
            GetMastersDropDownList();
            GetRelatedLookupList();
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_one_OrdVesselModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitValidation() {
            if (param.currentOrder.code) {
                var _obj = {
                    ModuleName: ["PreAdvice"],
                    Code: [param.currentOrder.code],
                    API: "Group", // Validation/Group
                    FilterInput: {
                        ModuleCode: "ORD",
                        SubModuleCode: "ORD"
                    },
                    GroupCode: "PRE_ADV",
                    //     RelatedBasicDetails: [{
                    //         "UIField": "TEST",
                    //         "DbField": "TEST",
                    //         "Value": "TEST"
                    //     }],
                    ErrorCode: [],
                    EntityObject: one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data
                };

                errorWarningService.GetErrorCodeList(_obj);
                // error warning modal
                one_one_OrdVesselModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                one_one_OrdVesselModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.PreAdvice.Entity[one_one_OrdVesselModalCtrl.ePage.Masters.Param.OrderNo].GlobalErrorWarningList;
                one_one_OrdVesselModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.PreAdvice.Entity[one_one_OrdVesselModalCtrl.ePage.Masters.Param.OrderNo];
            }
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
                        one_one_OrdVesselModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        one_one_OrdVesselModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdCarrier_2833,OrdPlannedVessel_3185,VesselPOL_3309,VesselPOD_3310",
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

        function VesselUpdate(_item, type) {
            CommonErrorObjInput();
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.PreAdvice.Entity[param.currentOrder.code].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    var _input = InputData(_item, false);
                    apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.ListInsert.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            JobRoutes(response.data.Response, _item);
                        } else {
                            toastr.error("Save failed...");
                        }
                    });
                } else {
                    one_one_OrdVesselModalCtrl.ePage.Masters.ShowErrorWarningModal("Add");
                }
            });
        }

        function ShowErrorWarningModal(type) {
            if (type == 'Add') {
                $("#errorWarningContainer" + one_one_OrdVesselModalCtrl.ePage.Masters.Text).addClass("open");
            } else {
                $("#errorWarningContainer" + one_one_OrdVesselModalCtrl.ePage.Masters.Text).removeClass("open");
            }
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

        function JobRoutes(data, _item) {
            var _jobRoutesInput = [];
            var _input = {
                "Vessel": _item.Vessel,
                "VoyageFlight": _item.VoyageFlight,
                "LoadPort": _item.LoadPort,
                "DischargePort": _item.DischargePort,
                "ETD": _item.ETD,
                "ETA": _item.ETA,
                "JBS_FK": data[0].PK,
                "CarrierOrg_FK": _item.CarrierOrg_FK,
                "CarrierOrg_Code": _item.CarrierOrg_Code,
                "EntitySource": "POH",
                "EntityRefKey": data[0].SourceRefKey
            };
            _jobRoutesInput.push(_input);
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
                var _input = {
                    "EntityRefPK": one_one_OrdVesselModalCtrl.ePage.Masters.Param.PK,
                    "Properties": [{
                        "PropertyName": "POH_CRT_FK",
                        "PropertyNewValue": val.PK
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
            var _filterInput = {
                "LCLCutOff": _item.CargoCutOffDate,
                "LCLReceivalCommences": _item.BookingCutOffDate,
                "EntitySource": "POH",
                "SourceRefKey": one_one_OrdVesselModalCtrl.ePage.Masters.Param.PK
            }
            _input.push(_filterInput);
            return _input;
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["PreAdvice"],
                Code: [param.currentOrder.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD",
                },
                GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: one_one_OrdVesselModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();