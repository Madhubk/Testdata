(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_PreAdviceInlineController", three_three_PreAdviceInlineController);

    three_three_PreAdviceInlineController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService", "errorWarningService", "toastr"];

    function three_three_PreAdviceInlineController($scope, $injector, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService, errorWarningService, toastr) {
        /* jshint validthis: true */
        var three_three_PreAdviceInlineCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            // var currentObject = three_three_PreAdviceInlineCtrl.currentObject[three_three_PreAdviceInlineCtrl.currentObject.label].ePage.Entities;
            three_three_PreAdviceInlineCtrl.ePage = {
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
            three_three_PreAdviceInlineCtrl.ePage.Masters.emptyText = '-';
            three_three_PreAdviceInlineCtrl.ePage.Masters.Enable = true;
            three_three_PreAdviceInlineCtrl.ePage.Masters.selectedRow = -1;
            three_three_PreAdviceInlineCtrl.ePage.Masters.selectedRowObj = {}
            three_three_PreAdviceInlineCtrl.ePage.Masters.TableProperties = {};
            three_three_PreAdviceInlineCtrl.ePage.Masters.OnChange = OnChange;
            three_three_PreAdviceInlineCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            three_three_PreAdviceInlineCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            three_three_PreAdviceInlineCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // error warning modal
            three_three_PreAdviceInlineCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            three_three_PreAdviceInlineCtrl.ePage.Masters.DatePicker = {};
            three_three_PreAdviceInlineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_PreAdviceInlineCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_PreAdviceInlineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            three_three_PreAdviceInlineCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitGridEdit();
        }

        function InitGridEdit() {
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("three_three_PreAdviceInlineCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
            // get table properties 
            if (three_three_PreAdviceInlineCtrl.tableProperties) {
                $timeout(function () {
                    three_three_PreAdviceInlineCtrl.ePage.Masters.TableProperties.UIPreAdviceViews = angular.copy(three_three_PreAdviceInlineCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }
            three_three_PreAdviceInlineCtrl.ePage.Entities.Header.Data.UIVesselDetails = three_three_PreAdviceInlineCtrl.currentObject;

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
                EntityObject: three_three_PreAdviceInlineCtrl.ePage.Entities.Header.Data
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            three_three_PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_three_PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.PreAdvice.Entity["Activiy"].GlobalErrorWarningList;
            three_three_PreAdviceInlineCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.PreAdvice.Entity["Activiy"];
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_PreAdviceInlineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        three_three_PreAdviceInlineCtrl.ePage.Masters.TableProperties.UIPreAdviceViews = obj;
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
            three_three_PreAdviceInlineCtrl.gridChange({
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
                EntityObject: three_three_PreAdviceInlineCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();