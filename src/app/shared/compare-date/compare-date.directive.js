(function () {
    "use strict";

    angular
        .module("Application")
        .directive("compareDate", CompareDate);

    function CompareDate() {
        var exports = {
            restrict: 'EA',
            templateUrl: 'app/shared/compare-date/compare-date.html',
            controller: "CompareDateController",
            controllerAs: "CompareDateCtrl",
            scope: {
                modalValue: '=',
                label: "=",
                fieldName: "=",
                isDisabled: "=",
                selectedOperator: "=",
                defaultValue: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("CompareDateController", CompareDateController);

    CompareDateController.$inject = ["$filter", "helperService", "APP_CONSTANT"];

    function CompareDateController($filter, helperService, APP_CONSTANT) {
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

        // #region Compare Date
        function InitCompareDropDown() {
            CompareDateCtrl.ePage.Masters.Compare = {};
            CompareDateCtrl.ePage.Masters.Compare.OnCompareChange = OnCompareChange;

            if (CompareDateCtrl.selectedOperator) {
                CompareDateCtrl.ePage.Masters.Compare.Value = CompareDateCtrl.selectedOperator.Code;
                OnCompareChange(CompareDateCtrl.selectedOperator);
            }

            GetCompareList();
        }

        function GetCompareList() {
            CompareDateCtrl.ePage.Masters.Compare.ListSource = [{
                Code: "Yesterday",
                Description: "Yesterday",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "Today",
                Description: "Today",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "LastWeek",
                Description: "Last Week",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "ThisWeek",
                Description: "This Week",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "LastMonth",
                Description: "Last Month",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "ThisMonth",
                Description: "This Month",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "Last7Days",
                Description: "Last 7 Days",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: true
            }, {
                Code: "Last30Days",
                Description: "Last 30 Days",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: false
            }, {
                Code: "IsBefore",
                Description: "Is Before",
                CompareOperator: ["LessThan"],
                Type: 3,
                IsActive: true
            }, {
                Code: "IsAfter",
                Description: "Is After",
                CompareOperator: ["GreaterThan"],
                Type: 3,
                IsActive: true
            }, {
                Code: "IsBetween",
                Description: "Is Between",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 4,
                IsActive: true
            }, {
                Code: "Before3Months",
                Description: "Before 3 Months",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: false
            }, {
                Code: "Before6Months",
                Description: "Before 6 Months",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 2,
                IsActive: false
            }, {
                Code: "BeforeAnYear",
                Description: "Before an Year",
                CompareOperator: ["GreaterThanOrEqual", "LessThanOrEqual"],
                Type: 3,
                IsActive: false
            }, {
                Code: "AsOn",
                Description: "As On",
                CompareOperator: ["Equals"],
                Type: 3,
                IsActive: true
            }];

            if (CompareDateCtrl.defaultValue) {
                let _index = CompareDateCtrl.ePage.Masters.Compare.ListSource.findIndex(x => x.Code == CompareDateCtrl.defaultValue);

                if (_index != -1) {
                    OnCompareChange(CompareDateCtrl.ePage.Masters.Compare.ListSource[_index]);
                    CompareDateCtrl.ePage.Masters.Compare.Value = CompareDateCtrl.defaultValue;
                }
            }
        }

        function OnCompareChange($item) {
            CompareDateCtrl.selectedOperator = $item;
            let _item = angular.copy($item)
            CompareDateCtrl.ePage.Masters.Compare.ActiveCompare = angular.copy($item);
            CompareDateCtrl.modalValue = undefined;
            CompareDateCtrl.ePage.Masters.ngModal = {
                Value: [{
                    LogicalOperator: "AND",
                    FilterInput: []
                }]
            };

            if (_item) {
                let _filterInput = {
                    FieldName: CompareDateCtrl.fieldName,
                    LogicalOperator: "AND",
                    DataType: "Datetime?",
                    InputName: "",
                    Value: "",
                    CompareOperator: ""
                };
                let _compareOperator = _item.CompareOperator,
                    _compareOperatorStart,
                    _compareOperatorEnd,
                    _startTime = " 00:00",
                    _endTime = " 23:59";

                if (_compareOperator.length > 1) {
                    _compareOperatorStart = _compareOperator[0];
                    _compareOperatorEnd = _compareOperator[1];
                } else {
                    _compareOperatorStart = _compareOperator[0];
                }

                CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));

                if (_item.Type == 1) {
                    let _startDate = helperService.DateFilter(_item.Code);

                    CompareDateCtrl.ePage.Masters.DatePicker.StartDate = _startDate + _startTime;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = _startDate + _startTime;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;
                } else if (_item.Type == 2) {
                    let _date = helperService.DateFilter(_item.Code),
                        _index = _date.indexOf(","),
                        _startDate, _endDate;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));

                    if (_index !== -1) {
                        let _splitDate = _date.split(",");
                        _startDate = $filter('date')(new Date(_splitDate[0]), APP_CONSTANT.DatePicker.dateFormatDB);
                        _endDate = $filter('date')(new Date(_splitDate[1]), APP_CONSTANT.DatePicker.dateFormatDB);
                    } else {
                        _startDate = $filter('date')(new Date(_date), APP_CONSTANT.DatePicker.dateFormatDB);
                        _endDate = $filter('date')(new Date(_date), APP_CONSTANT.DatePicker.dateFormatDB);
                    }

                    CompareDateCtrl.ePage.Masters.DatePicker.StartDate = _startDate + _startTime;
                    CompareDateCtrl.ePage.Masters.DatePicker.EndDate = _endDate + _endTime;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = _startDate + _startTime;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].Value = _endDate + _endTime;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].InputName = "EndDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].CompareOperator = _compareOperatorEnd;
                } else if (_item.Type == 3) {
                    let _modalValue = angular.copy(CompareDateCtrl.modalValue),
                        _startDate;

                    if (_modalValue) {
                        _modalValue = (typeof _modalValue == "string") ? JSON.parse(_modalValue) : _modalValue;

                        if (_modalValue[0].FilterInput[0].Value) {
                            _startDate = (_modalValue[0].FilterInput[0].Value) ? $filter('date')(new Date(_modalValue[0].FilterInput[0].Value), APP_CONSTANT.DatePicker.dateFormatDB) : $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormatDB);
                        }
                    } else {
                        _startDate = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormatDB);
                    }

                    CompareDateCtrl.ePage.Masters.DatePicker.StartDate = _startDate + _startTime;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = _startDate + _startTime;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;
                } else if (_item.Type == 4) {
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput.push(angular.copy(_filterInput));
                    let _modalValue = angular.copy(CompareDateCtrl.modalValue),
                        _startDate, _endDate;

                    if (_modalValue) {
                        _modalValue = (typeof _modalValue == "string") ? JSON.parse(_modalValue) : _modalValue;

                        _startDate = (_modalValue[0].FilterInput[0].Value) ? $filter('date')(new Date(_modalValue[0].FilterInput[0].Value), APP_CONSTANT.DatePicker.dateFormatDB) : $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormatDB);
                        _endDate = (_modalValue[0].FilterInput[1].Value) ? $filter('date')(new Date(_modalValue[0].FilterInput[1].Value), APP_CONSTANT.DatePicker.dateFormatDB) : $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormatDB);
                    } else {
                        _startDate = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormatDB);
                        _endDate = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormatDB);
                    }

                    CompareDateCtrl.ePage.Masters.DatePicker.StartDate = _startDate + _startTime;
                    CompareDateCtrl.ePage.Masters.DatePicker.EndDate = _endDate + _endTime;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].Value = _startDate + _startTime;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].InputName = "StartDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[0].CompareOperator = _compareOperatorStart;

                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].Value = _endDate + _endDate;
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].InputName = "EndDate";
                    CompareDateCtrl.ePage.Masters.ngModal.Value[0].FilterInput[1].CompareOperator = _compareOperatorEnd;
                }

                CompareDateCtrl.modalValue = angular.copy(JSON.stringify(CompareDateCtrl.ePage.Masters.ngModal.Value));
            }
        }
        // #endregion

        // #region Date
        function InitDate() {
            // DatePicker
            CompareDateCtrl.ePage.Masters.DatePicker = {};
            CompareDateCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
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
        // #endregion

        Init();
    }
})();