(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompareDateController", CompareDateController);

    CompareDateController.$inject = ["helperService", "APP_CONSTANT"];

    function CompareDateController(helperService, APP_CONSTANT) {
        /* jshint validthis: true */
        var CompareDateCtrl = this;

        function Init() {
            CompareDateCtrl.ePage = {
                "Title": "",
                "Prefix": "CompareDate",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitDate();
            InitCompareDropDown();
        }

        function InitCompareDropDown() {
            CompareDateCtrl.ePage.Masters.Compare = {};
            CompareDateCtrl.ePage.Masters.Compare.OnCompareChange = OnCompareChange;

            GetCompareList();
        }

        function GetCompareList() {
            CompareDateCtrl.ePage.Masters.Compare.ListSource = [{
                Code: "Yesterday",
                Description: "Yesterday",
                CompareOperator: "Equals",
                Type: 1,
                IsActive: true
            }, {
                Code: "Today",
                Description: "Today",
                CompareOperator: "Equals",
                Type: 1,
                IsActive: true
            }, {
                Code: "LastWeek",
                Description: "Last Week",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: true
            }, {
                Code: "ThisWeek",
                Description: "This Week",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: true
            }, {
                Code: "LastMonth",
                Description: "Last Month",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: true
            }, {
                Code: "ThisMonth",
                Description: "This Month",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: true
            }, {
                Code: "Last7Days",
                Description: "Last 7 Days",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: true
            }, {
                Code: "Last30Days",
                Description: "Last 30 Days",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: false
            }, {
                Code: "IsBefore",
                Description: "Is Before",
                CompareOperator: "LessThan",
                Type: 3,
                IsActive: true
            }, {
                Code: "IsAfter",
                Description: "Is After",
                CompareOperator: "GreaterThan",
                Type: 3,
                IsActive: true
            }, {
                Code: "IsBetween",
                Description: "Is Between",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 4,
                IsActive: true
            }, {
                Code: "Before3Months",
                Description: "Before 3 Months",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: false
            }, {
                Code: "Before6Months",
                Description: "Before 6 Months",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 2,
                IsActive: false
            }, {
                Code: "BeforeAnYear",
                Description: "Before an Year",
                CompareOperator: "GreaterThanOrEqual,LessThanOrEqual",
                Type: 3,
                IsActive: false
            }];
        }

        function OnCompareChange($item) {
            CompareDateCtrl.ePage.Masters.Compare.ActiveCompare = angular.copy($item);
            CompareDateCtrl.ePage.Masters.ngModal = {
                Value: [{
                    "LogicalOperator": "AND",
                    "FilterInput": []
                }]
            };

            if (CompareDateCtrl.ePage.Masters.Compare.ActiveCompare) {
                var _filterInput = {
                    "FieldName": CompareDateCtrl.fieldName,
                    "LogicalOperator": "AND",
                    "DataType": "Datetime?",
                    "InputName": "",
                    "Value": ""
                };

                var _compareOperatorIndex = CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.CompareOperator.indexOf(",");
                var _compareOperatorStart, _compareOperatorEnd;

                if (_compareOperatorIndex !== -1) {
                    var _splitOperator = CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.CompareOperator.split(",");
                    _compareOperatorStart = _splitOperator[0];
                    _compareOperatorEnd = _splitOperator[1];
                } else {
                    _compareOperatorStart = CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.CompareOperator;
                }

                if (CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.Type == 1) {
                    var _date = helperService.DateFilter(CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.Code);

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0] = {};
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = _date;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;
                } else if (CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.Type == 2) {
                    debugger;
                    var _date = helperService.DateFilter(CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.Code);
                    var _index = _date.indexOf(",");

                    if (_index !== -1) {
                        var _splitDate = _date.split(",");
                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));
                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));

                        CompareDateCtrl.ePage.Masters.DatePicker.StartDate = new Date(_splitDate[0]).toISOString();
                        CompareDateCtrl.ePage.Masters.DatePicker.EndDate = new Date(_splitDate[1]).toISOString();

                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = CompareDateCtrl.ePage.Masters.DatePicker.StartDate;
                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;

                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].Value = CompareDateCtrl.ePage.Masters.DatePicker.EndDate;
                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].InputName = "EndDate";
                        CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].CompareOperator = _compareOperatorEnd;
                    }
                } else if (CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.Type == 3) {
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));

                    CompareDateCtrl.ePage.Masters.DatePicker.StartDate = new Date().toISOString();

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = CompareDateCtrl.ePage.Masters.DatePicker.StartDate;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;
                } else if (CompareDateCtrl.ePage.Masters.Compare.ActiveCompare.Type == 4) {
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));

                    CompareDateCtrl.ePage.Masters.DatePicker.StartDate = new Date().toISOString();
                    CompareDateCtrl.ePage.Masters.DatePicker.EndDate = new Date().toISOString();

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = CompareDateCtrl.ePage.Masters.DatePicker.StartDate;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].Value = CompareDateCtrl.ePage.Masters.DatePicker.EndDate;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].InputName = "EndDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].CompareOperator = _compareOperatorEnd;
                }
            } else {
                CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0] = {};
                CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = new Date().toISOString();
                CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = "Equals";
            }

            CompareDateCtrl.modalValue = angular.copy(JSON.stringify(CompareDateCtrl.ePage.Masters.ngModal.Value));
        }

        function InitDate() {
            // DatePicker
            CompareDateCtrl.ePage.Masters.DatePicker = {};
            CompareDateCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            // CompareDateCtrl.ePage.Masters.DatePicker.Options.maxDate = new Date();
            // CompareDateCtrl.ePage.Masters.DatePicker.Options.minDate = new Date();
            CompareDateCtrl.ePage.Masters.DatePicker.isOpen = [];
            CompareDateCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitStartDate();
            InitEndDate();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CompareDateCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitStartDate() {
            CompareDateCtrl.ePage.Masters.DatePicker.OnStartDateSelected = OnStartDateSelected;
        }

        function OnStartDateSelected($item) {
            CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = $item;
            CompareDateCtrl.modalValue = angular.copy(JSON.stringify(CompareDateCtrl.ePage.Masters.ngModal.Value));
        }

        function InitEndDate() {
            CompareDateCtrl.ePage.Masters.DatePicker.OnEndDateSelected = OnEndDateSelected;
        }

        function OnEndDateSelected($item) {
            CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].Value = $item;
            CompareDateCtrl.modalValue = angular.copy(JSON.stringify(CompareDateCtrl.ePage.Masters.ngModal.Value));
        }

        Init();
    }
})();
