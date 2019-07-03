(function () {
    "use strict";

    angular.module("Application")
        .controller("FinancePeriodGeneralController", FinancePeriodGeneralController);

    FinancePeriodGeneralController.$inject = ["helperService", "financeperiodConfig", "appConfig", "APP_CONSTANT", "authService", "apiService"];

    function FinancePeriodGeneralController(helperService, financeperiodConfig, appConfig, APP_CONSTANT, authService, apiService) {

        var FinancePeriodGeneralCtrl = this;

        function Init() {

            var currentFinancialperiod = FinancePeriodGeneralCtrl.currentFinancialperiod[FinancePeriodGeneralCtrl.currentFinancialperiod.code].ePage.Entities;

            FinancePeriodGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Financeperiod",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFinancialperiod
            };

            FinancePeriodGeneralCtrl.ePage.Masters.Config = financeperiodConfig;

            /* Function */
            FinancePeriodGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            FinancePeriodGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;

            FinancePeriodGeneralCtrl.ePage.Masters.DatePicker = {};
            FinancePeriodGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            FinancePeriodGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            FinancePeriodGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            FinancePeriodGeneralCtrl.ePage.Masters.OnChangeCalendarType = OnChangeCalendarType;
            FinancePeriodGeneralCtrl.ePage.Masters.OnChangeDate = OnChangeDate;
            // InitGLccount();

            FinancePeriodGeneralCtrl.ePage.Masters.DropDownMasterList = {
                "CalendarType": {
                    "ListSource": []
                },
                "FinPeriodType": {
                    "ListSource": []
                },
                "Status": {
                    "ListSource": []
                }
            };
            GetMastersDropDownList();
        }

        function GetMastersDropDownList() {
            var typeCodeList = ["CALENDARTYPE", "FINPERIODTYPE", "FINPERIODSTS"];
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
                        FinancePeriodGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        FinancePeriodGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {

            $event.preventDefault();
            $event.stopPropagation();
            FinancePeriodGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //#region GLccount
        // function InitGLccount(){
        //     if (FinancePeriodGeneralCtrl.currentFinancialperiod.isNew) {
        //         FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.IsValid = true;
        //     }
        // }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(FinancePeriodGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                FinancePeriodGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinancePeriodGeneralCtrl.currentFinancialperiod.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                FinancePeriodGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, FinancePeriodGeneralCtrl.currentFinancialperiod.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        function setSelectedRow($index) {
            FinancePeriodGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function OnChangeDate($index, $item, value) {
        }

        function OnChangeCalendarType() {
            if (FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.Year != "") {
                if (FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.CalendarType == "FIN") {
                    var m = 3;
                    var year = FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.Year - 1;
                    var year2 = FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.Year;
                    var stDate, edDate = 0;
                    FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.LstUIAccPeriodManagement = [];
                    
                    for (var i = 0; i <= 11; i++) {
                        var periodStart = new Date(year, m, 1);
                        var periodEnd = new Date(year, m + 1, 0);
                        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                        ];
                        var period = monthNames[new Date(periodStart).getMonth()];
                        var year1 = year.toString().substr(-2) + "-" + year2.toString().substr(-2);
                        m++;
                        stDate = i;
                        edDate = i;

                        var objFinGrid = {
                            "PK": "00000000-0000-0000-0000-000000000000",
                            "Period": period + " -" + year1,
                            "Year": year,
                            "StartDate": periodStart,
                            "EndDate": periodEnd,
                            "GC_Company": FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.UIAccPeriodManagement.GC_Company,
                            "IsSubLedgerClosed": false,
                            "IsGeneralLedgerClosed": false,
                            "IsSubledgerClosedForAdjustments": false,
                            "ArchiveCommenced": false,
                            "CreatedDatetime": null,
                            "ModifiedDatetime": null,
                            "CalendarType": null,
                            "PeriodType": null,
                            "Status": null,
                            "IsModified": false,
                            "IsDeleted": false
                        };
                        FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.LstUIAccPeriodManagement.push(objFinGrid);

                    }
                    //FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.StartDate
                    //FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.StartDate
                }
                else if (FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.CalendarType == "CAL") {
                    var m = 0;
                    var year = FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.Year - 1;
                    var year2 = FinancePeriodGeneralCtrl.ePage.Entities.Header.data.UIAccPeriodManagement.Year;
                    var stDate, edDate = 0;
                    FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.LstUIAccPeriodManagement = [];

                    for (var i = 0; i <= 11; i++) {
                        var periodStart = new Date(year, m, 1);
                        var periodEnd = new Date(year, m + 1, 0);
                        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                        ];
                        var period = monthNames[new Date(periodStart).getMonth()];
                        var year1 = year.toString().substr(-2) + "-" + year2.toString().substr(-2);
                        m++;
                        stDate = i;
                        edDate = i;

                        var objFinGrid = {
                            "PK": "00000000-0000-0000-0000-000000000000",
                            "Period": period + " -" + year1,
                            "Year": year,
                            "StartDate": periodStart,
                            "EndDate": periodEnd,
                            "GC_Company": FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.UIAccPeriodManagement.GC_Company,
                            "IsSubLedgerClosed": false,
                            "IsGeneralLedgerClosed": false,
                            "IsSubledgerClosedForAdjustments": false,
                            "ArchiveCommenced": false,
                            "CreatedDatetime": null,
                            "ModifiedDatetime": null,
                            "CalendarType": null,
                            "PeriodType": null,
                            "Status": null,
                            "IsModified": false,
                            "IsDeleted": false
                        };

                        FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.LstUIAccPeriodManagement.push(objFinGrid);
                    }
                }
            }
        }

        Init()
    }
})();