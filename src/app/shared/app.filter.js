(function () {
    "use strict";

    angular
        .module("Application")
        .filter("formatTimer", formatTimerFilter);

    function formatTimerFilter() {
        return function (input) {
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }
            var seconds = input % 60;
            var minutes = Math.floor(input / 60);
            var hours = Math.floor(minutes / 60);
            return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
        };
    }

    angular
        .module("Application")
        .filter("effortCalculation", EffortCalculation);

    function EffortCalculation() {
        return function (input, effortRemain, effort) {
            function toFixed(num, fixed) {
                var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
                return num.toString().match(re)[0];
            }

            effortRemain = (!effortRemain) ? 0 : effortRemain;
            effort = (!effort) ? 0 : effort;

            if (effort !== 0) {
                var _effortPercentage = 100 - ((effortRemain / effort) * 100);
                _effortPercentage = toFixed(_effortPercentage, 2);
            } else {
                _effortPercentage = 0;
            }
            _effortPercentage = _effortPercentage + "%";

            return _effortPercentage;
        };
    }

    angular
        .module("Application")
        .filter("getCharacters", GetCharacters);

    function GetCharacters() {
        return function (input, length) {
            return (!!input) ? input.substring(0, length).toUpperCase() : '';
        }
    }

    angular
        .module("Application")
        .filter("duration", Duration);

    function Duration() {
        return function (input) {
            var _input = new Date(input);
            var _duration = _input.getHours() + ":" + _input.getMinutes() + ":" + _input.getSeconds();

            return _duration;
        }
    }

    angular
        .module("Application")
        .filter("getIconColorForMenu", GetIconColorForMenu);

    function GetIconColorForMenu() {
        return function (input, type) {
            var _output = JSON.parse(input);
            if (!_output) {
                return "";
            } else {
                return _output[type];
            }
        };
    }

    angular
        .module("Application")
        .filter("roundCount", RoundCount);

    function RoundCount() {
        return function (input, number) {
            var _output = 0;
            if (input) {
                var _inpStr = input.toString();
                if (_inpStr.length > number) {
                    var _digits = "";
                    for (var i = 0; i < number; i++) {
                        _digits += "9";
                    }
                    _output = _digits + "+";
                } else {
                    _output = input;
                }
            }
            return _output;
        };
    }

    angular
        .module("Application")
        .filter("dateFormat", DateFormat);

    function DateFormat($filter, APP_CONSTANT) {
        var angularDateFilter = $filter('date');
        return function (input) {
            return angularDateFilter(input, APP_CONSTANT.DatePicker.format);
        };
    }

    angular
        .module("Application")
        .filter('auditHistory', AuditHistory);

    function AuditHistory() {
        return function (text, item) {
            var _historyFilter = "";
            if (item.Actions == "I") {
                if (item.OldValue != null && item.NewValue != null) {
                    _historyFilter = "<span>" + item.OldValue + "</span> Updated by <b> " + item.NewValue + "</b>";
                } else if (item.OldValue == null && item.NewValue != null) {
                    _historyFilter = "<b>" + item.NewValue + "</b> Inserted";
                }
            } else if (item.Actions == "U") {
                if (item.OldValue != null && item.NewValue != null) {
                    _historyFilter = "<span>" + item.OldValue + "</span> Updated by <b> " + item.NewValue + "<b>";
                } else if (item.OldValue == null && item.NewValue != null) {
                    _historyFilter = "<b>" + item.NewValue + "</b> Updated";
                }
            }
            return _historyFilter;
        }
    }

    // Get List Count
    angular
        .module("Application")
        .filter("listCount", ListCount);

    function ListCount() {
        return function (input, key, value) {
            var _output = [];
            if (input) {
                input.map(function (val, index) {
                    if (val[key] == value) {
                        _output.push(val);
                    }
                });
            }
            return _output.length;
        };
    }

    // Audit Group by
    angular
        .module("Application")
        .filter("auditGroup", AuditGroup);

    function AuditGroup() {
        return function (item) {
            console.log(item)
            item.map(function (value, key) {
                var x = value.CreatedDateTime;
                var timestamp = new Date(x).getTime();
                var todate = new Date(timestamp).getDate();
                var tomonth = new Date(timestamp).getMonth() + 1;
                var toyear = new Date(timestamp).getFullYear();
                var original_date = tomonth + '/' + todate + '/' + toyear;
                value.CreatedDateTime = original_date;
                console.log(item)
                return item
            });
        }
    }

    // Convert HTML to Text
    angular
        .module("Application")
        .filter("convertHtmlToText", ConvertHtmlToText);

    ConvertHtmlToText.$inject = ["$compile"];

    function ConvertHtmlToText($compile) {
        return function (input) {
            if (input) {
                var el = angular.element(input);
                var _contentText = $(el).text();
                return _contentText;
            } else {
                return input;
            }
        }
    }

    // Convert HTML to TrustHtml
    angular
        .module("Application")
        .filter("convertToTrustHtml", ConvertToTrustHtml);

    ConvertToTrustHtml.$inject = ["$sce"];

    function ConvertToTrustHtml($sce) {
        return function (input) {
            if (input) {
                var _contentText = $sce.trustAsHtml(input);
                return _contentText;
            } else {
                return input;
            }
        }
    }

    // Get File Extension
    angular
        .module("Application")
        .filter("getFileExtension", GetFileExtension);

    GetFileExtension.$inject = [];

    function GetFileExtension() {
        return function (input) {
            if (input) {
                var _index = input.indexOf("."),
                    _fileType;
                if (_index !== -1) {
                    _fileType = input.split(".").pop();
                } else {
                    _fileType = "file";
                }
                return _fileType;
            } else {
                return input;
            }
        }
    }

})();
