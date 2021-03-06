(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_PreAdviceInlineController", one_one_PreAdviceInlineController);

    one_one_PreAdviceInlineController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService", "errorWarningService", "toastr"];

    function one_one_PreAdviceInlineController($scope, $injector, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService, errorWarningService, toastr) {
        /* jshint validthis: true */
        var one_one_PreAdviceInlineCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            // var currentObject = one_one_PreAdviceInlineCtrl.currentObject[one_one_PreAdviceInlineCtrl.currentObject.label].ePage.Entities;
            one_one_PreAdviceInlineCtrl.ePage = {
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
            one_one_PreAdviceInlineCtrl.ePage.Masters.emptyText = '-';
            one_one_PreAdviceInlineCtrl.ePage.Masters.Enable = true;
            one_one_PreAdviceInlineCtrl.ePage.Masters.selectedRow = -1;
            one_one_PreAdviceInlineCtrl.ePage.Masters.selectedRowObj = {}
            one_one_PreAdviceInlineCtrl.ePage.Masters.TableProperties = {};
            one_one_PreAdviceInlineCtrl.ePage.Masters.OnChange = OnChange;
            one_one_PreAdviceInlineCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            one_one_PreAdviceInlineCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            one_one_PreAdviceInlineCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // error warning modal
            one_one_PreAdviceInlineCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            one_one_PreAdviceInlineCtrl.ePage.Masters.DatePicker = {};
            one_one_PreAdviceInlineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_one_PreAdviceInlineCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_one_PreAdviceInlineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_one_PreAdviceInlineCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitGridEdit();
        }

        function InitGridEdit() {
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("one_one_PreAdviceInlineCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
            // get table properties 
            if (one_one_PreAdviceInlineCtrl.tableProperties) {
                $timeout(function () {
                    one_one_PreAdviceInlineCtrl.ePage.Masters.TableProperties.UIPreAdviceViews = angular.copy(one_one_PreAdviceInlineCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }
            one_one_PreAdviceInlineCtrl.ePage.Entities.Header.Data.UIVesselDetails = one_one_PreAdviceInlineCtrl.currentObject;

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
                EntityObject: one_one_PreAdviceInlineCtrl.ePage.Entities.Header.Data
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            one_one_PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            one_one_PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.PreAdvice.Entity["Activiy"].GlobalErrorWarningList;
            one_one_PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.PreAdvice.Entity["Activiy"];
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_one_PreAdviceInlineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        one_one_PreAdviceInlineCtrl.ePage.Masters.TableProperties.UIPreAdviceViews = obj;
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
            one_one_PreAdviceInlineCtrl.gridChange({
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
                EntityObject: one_one_PreAdviceInlineCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();