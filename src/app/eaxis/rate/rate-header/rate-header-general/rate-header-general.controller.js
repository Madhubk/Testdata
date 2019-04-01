(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RateHeaderGeneralController", RateHeaderGeneralController);

    RateHeaderGeneralController.$inject = ["$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "rateheaderConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$uibModal"];

    function RateHeaderGeneralController($scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, rateheaderConfig, appConfig, toastr, $document, confirmation, $filter, $uibModal) {
        /* jshint validthis: true */
        var RateHeaderGeneralCtrl = this;

        function Init() {
            var currentRateHeader = RateHeaderGeneralCtrl.currentRateHeader[RateHeaderGeneralCtrl.currentRateHeader.label].ePage.Entities;
            RateHeaderGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Rate_Header",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRateHeader
            };

            RateHeaderGeneralCtrl.ePage.Masters.Config = rateheaderConfig;
            RateHeaderGeneralCtrl.ePage.Masters.SelectedLookupOrganization = SelectedLookupOrganization;
            RateHeaderGeneralCtrl.ePage.Masters.OnChangeRateType = OnChangeRateType;
            RateHeaderGeneralCtrl.ePage.Masters.AddSaveButtonText = "Save and Add New Item";

            RateHeaderGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            // Date Picker
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker = {};
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.Options = angular.copy(APP_CONSTANT.DatePicker);
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            RateHeaderGeneralCtrl.ePage.Masters.ValidFromDate = ValidFromDate;
            RateHeaderGeneralCtrl.ePage.Masters.ValidToDate = ValidToDate;
            RateHeaderGeneralCtrl.ePage.Masters.RefNo = "New";
            // Boolean value to String and String to Boolean
            RateHeaderGeneralCtrl.ePage.Masters.IscancelledValue = ["True", "False"];

            RateHeaderGeneralCtrl.ePage.Masters.cancelled = cancelled;

            if (RateHeaderGeneralCtrl.ePage.Entities.Header.Data.Iscancelled == true) {
                RateHeaderGeneralCtrl.ePage.Masters.Iscancelled = "True";
            } else if (RateHeaderGeneralCtrl.ePage.Entities.Header.Data.Iscancelled == false) {
                RateHeaderGeneralCtrl.ePage.Masters.Iscancelled = "False";
            }
            

            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.Optionsdel = angular.copy(APP_CONSTANT.DatePicker);

            GetDropDownList();
            GeneralOperation();

            // Mini date is Today
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.Options['minDate'] = new Date() + 1;
        }

        //#region CFX Types
        function GetDropDownList() {
            var typeCodeList = ["RATE_TYPE"];
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
                        RateHeaderGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        RateHeaderGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == 'RATE_TYPE') {
                            RateHeaderGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = $filter('orderBy')(RateHeaderGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource, 'Sequence')
                        }
                    });
                }
            });
        }
        function OnChangeRateType(RateType) {
            angular.forEach(RateHeaderGeneralCtrl.ePage.Masters.RATE_TYPEListSource, function (value, key) {
                if (value.Key == RateType) {
                    RateHeaderGeneralCtrl.ePage.Masters.RateTypeFK = value.PK;
                    RateHeaderGeneralCtrl.ePage.Entities.Header.Data.RateType = value.Key;
                }
            });
        }
        function cancelled(value) {
            if (value == "True") {
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.Iscancelled = true;
            } else if (value == "False") {
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.Iscancelled = false;
            }
        }
        // #endregion

        //#region Date Pickers and General
        function GeneralOperation() {
            // Organization
            if (RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_Code == null) {
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_Code = "";
            }
            RateHeaderGeneralCtrl.ePage.Masters.Organization = RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_Code;
            if (RateHeaderGeneralCtrl.ePage.Masters.Organization == ' - ')
                RateHeaderGeneralCtrl.ePage.Masters.Organization = "";

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ValidFromDate() {
            RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ValidFrom = $filter('date')(RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ValidFrom, "dd-MMM-yyyy hh:mm a");
            RateHeaderGeneralCtrl.ePage.Masters.DatePicker.Optionsdel['minDate'] = RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ValidFrom;
        }

        function ValidToDate() {
            RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ValidTo = $filter('date')(RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ValidTo, "dd-MMM-yyyy hh:mm a");
        }
        //#endregion

        //#region Look Up
        function SelectedLookupOrganization(item) {
            if (item.data) {
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_FK = item.data.entity.PK;
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_Code = item.data.entity.Code;
                RateHeaderGeneralCtrl.ePage.Masters.Organization = item.data.entity.Code;

            }
            else {
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_FK = item.PK;
                RateHeaderGeneralCtrl.ePage.Entities.Header.Data.ORG_Code = item.Code;
                RateHeaderGeneralCtrl.ePage.Masters.Organization = item.Code;
            }
        }
        //#endregion

        Init();
    }
})();
