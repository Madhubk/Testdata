(function () {
    "use strict";

    angular
        .module("Application")
        .filter("formatTimer", formatTimerFilter)
        .filter("effortCalculation", EffortCalculation)
        .filter("getCharacters", GetCharacters)
        .filter("duration", Duration)
        .filter("getIconColorForMenu", GetIconColorForMenu)
        .filter("roundCount", RoundCount)
        .filter("dateFormat", DateFormat)
        .filter('auditHistory', AuditHistory)
        .filter("listCount", ListCount)
        .filter("auditGroup", AuditGroup)
        .filter("convertHtmlToText", ConvertHtmlToText)
        .filter("convertToTrustHtml", ConvertToTrustHtml)
        .filter("getFileExtension", GetFileExtension)
        .filter("unique", Unique)
        .filter("dateTimeDifference", DateTimeDifference);

    ConvertHtmlToText.$inject = ["$compile"];
    ConvertToTrustHtml.$inject = ["$sce"];

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

    function GetCharacters() {
        return function (input, length) {
            return (!!input) ? input.substring(0, length).toUpperCase() : '';
        }
    }

    function Duration() {
        return function (input) {
            var _input = new Date(input);
            var _duration = _input.getHours() + ":" + _input.getMinutes() + ":" + _input.getSeconds();

            return _duration;
        }
    }

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

    function DateFormat($filter, APP_CONSTANT) {
        return function (input, type) {
            return $filter('date')(input, type ? APP_CONSTANT.DatePicker[type] : APP_CONSTANT.DatePicker.dateFormat);
        };
    }

    function AuditHistory() {
        return function (text, item) {
            var _historyFilter = "";
            if (item.Actions == "I") {
                if (item.OldValue != null && item.NewValue != null) {
                    _historyFilter = "<span>" + item.OldValue + "</span> Changed to <b> " + item.NewValue + "</b>";
                } else if (item.OldValue == null && item.NewValue != null) {
                    _historyFilter = "<b>" + item.NewValue + "</b> Added";
                }
            } else if (item.Actions == "U") {
                if (item.OldValue != null && item.NewValue != null) {
                    _historyFilter = "<span>" + item.OldValue + "</span> Changed to <b> " + item.NewValue + "<b>";
                } else if (item.OldValue == null && item.NewValue != null) {
                    _historyFilter = "<b>" + item.NewValue + "</b> Changed";
                }
            }
            return _historyFilter;
        }
    }

    // Get List Count
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

    // Unique
    function Unique() {
        return function (items, filterOn) {
            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {},
                    newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }
                });
                items = newItems;
            }
            return items;
        };
    }

    // MyTask Time Difference
    function DateTimeDifference() {
        return function (input, p_allowFuture, outputType) {
            var substitute = function (stringOrFunction, number, strings) {
                    var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                allowFuture = p_allowFuture || false,
                strings = {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "overdue",
                    suffixFromNow: "due",
                    seconds: "less than a minute",
                    minute: "about a minute",
                    minutes: "%d minutes",
                    hour: "about an hour",
                    hours: "about %d hours",
                    day: "a day",
                    days: "%d days",
                    month: "about a month",
                    months: "%d months",
                    year: "about a year",
                    years: "%d years"
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator == undefined ? " " : strings.wordSeparator,
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;

            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
                seconds < 90 && substitute(strings.minute, 1, strings) ||
                minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
                minutes < 90 && substitute(strings.hour, 1, strings) ||
                hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
                hours < 42 && substitute(strings.day, 1, strings) ||
                days < 30 && substitute(strings.days, Math.round(days), strings) ||
                days < 45 && substitute(strings.month, 1, strings) ||
                days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
                years < 1.5 && substitute(strings.year, 1, strings) ||
                substitute(strings.years, Math.round(years), strings);

            var _value = $.trim([prefix, words, suffix].join(separator));
            var _obj = {
                Desc: (_value.split(' ')[0] > 40) ? input : _value,
                IsDeley: (suffix == "overdue") ? true : false
            };
            
            return _obj[outputType];
        };
    }
})();
