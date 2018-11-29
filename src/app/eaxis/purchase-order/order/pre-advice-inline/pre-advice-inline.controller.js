(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PreAdviceInlineController", PreAdviceInlineController);

    PreAdviceInlineController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService", "errorWarningService", "toastr"];

    function PreAdviceInlineController($scope, $injector, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService, errorWarningService, toastr) {
        /* jshint validthis: true */
        var PreAdviceInlineCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            // var currentObject = PreAdviceInlineCtrl.currentObject[PreAdviceInlineCtrl.currentObject.label].ePage.Entities;
            PreAdviceInlineCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice_Inline_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIVesselDetails": []
                        }
                    }
                },
                "GlobalVariables": {
                    "Loading": false,
                    "NonEditable": false
                }
            };

            InitInlineGrid();
        }

        function InitInlineGrid() {
            PreAdviceInlineCtrl.ePage.Masters.emptyText = '-';
            PreAdviceInlineCtrl.ePage.Masters.Enable = true;
            PreAdviceInlineCtrl.ePage.Masters.selectedRow = -1;
            PreAdviceInlineCtrl.ePage.Masters.selectedRowObj = {}
            PreAdviceInlineCtrl.ePage.Masters.TableProperties = {};
            PreAdviceInlineCtrl.ePage.Masters.OnChange = OnChange;
            PreAdviceInlineCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            PreAdviceInlineCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            PreAdviceInlineCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // error warning modal
            PreAdviceInlineCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            PreAdviceInlineCtrl.ePage.Masters.DatePicker = {};
            PreAdviceInlineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PreAdviceInlineCtrl.ePage.Masters.DatePicker.isOpen = [];
            PreAdviceInlineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            PreAdviceInlineCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitGridEdit();
        }

        function InitGridEdit() {
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("PreAdviceInlineCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
            // get table properties 
            if (PreAdviceInlineCtrl.tableProperties) {
                $timeout(function () {
                    PreAdviceInlineCtrl.ePage.Masters.TableProperties.UIPreAdviceViews = angular.copy(PreAdviceInlineCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }
            PreAdviceInlineCtrl.ePage.Entities.Header.Data.UIVesselDetails = PreAdviceInlineCtrl.currentObject;

            GetRelatedLookupList();
            InitValidation();

        }

        function OnChangeDatePicker(type, check, obj) {
            switch (type) {
                case "PlannedETD":
                    DateCheck(type, check, 'Greater than', obj);
                    break;
                case "PlannedETA":
                    DateCheck(type, check, 'Less than', obj);
                    break;
                case "CargoCutOffDate":
                    DateCheck(type, check, 'Greater than', obj);
                    break;
                case "BookingCutOffDate":
                    DateCheck(type, check, 'Less than', obj);
                    break;
                default:
                    break;
            }
        }

        function DateCheck(type, check, condition, obj) {
            if (condition == 'Greater than') {
                if (obj[type] && obj[check]) {
                    var checkDate1 = new Date(obj[type]);
                    var checkDate2 = new Date(obj[check]);
                    if (Date.parse(checkDate1) <= Date.parse(checkDate2)) {} else {
                        obj[type] = undefined;
                        toastr.warning(type + ' is not ' + condition + ' ' + check);
                    }
                }
            } else {
                if (obj[type] && obj[check]) {
                    var checkDate1 = new Date(obj[type]);
                    var checkDate2 = new Date(obj[check]);
                    if (Date.parse(checkDate1) >= Date.parse(checkDate2)) {} else {
                        obj[type] = undefined;
                        toastr.warning(type + ' is not ' + condition + ' ' + check);
                    }
                }
            }
        }

        function InitValidation() {
            var _obj = {
                ModuleName: ["PreAdvice"],
                Code: ["Activiy"],
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
                EntityObject: PreAdviceInlineCtrl.ePage.Entities.Header.Data
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.PreAdvice.Entity["Activiy"].GlobalErrorWarningList;
            PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.PreAdvice.Entity["Activiy"];
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PreAdviceInlineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "SHIPMENTPREADVICE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value);
                        PreAdviceInlineCtrl.ePage.Masters.TableProperties.UIPreAdviceViews = obj;
                    }
                }
            });
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

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function OnChange(item) {
            PreAdviceInlineCtrl.gridChange({
                item: item
            });
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

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["PreAdvice"],
                Code: ["Activiy"],
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
                EntityObject: PreAdviceInlineCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();