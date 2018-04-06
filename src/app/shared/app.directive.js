(function () {
    "use strict";

    angular
        .module("Application")
        .directive("numbersOnly", NumbersOnly)
        .directive("capitalize", Capitalize)
        .directive("sbPrecision", SBPrecision)
        .directive('uibDatepickerPopup', UibDatepickerPopup)
        .directive('dynamicLoad', DynamicLoad)
        .directive('customDateTimeFormat', CustomDateTimeFormat);

    CustomDateTimeFormat.$inject = ["$filter"];

    function NumbersOnly() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function FromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9.]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(FromUser);
            }
        };
    }

    function Capitalize() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                var _capitalize = function (inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                _capitalize(scope[attrs.ngModel]);
            }
        };
    }

    function SBPrecision() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attributes, ngModel) {
                var precision = attributes.sbPrecision;

                function SetPrecision() {
                    var value = ngModel.$modelValue;
                    if (value && !isNaN(value)) {
                        var formatted = Number(value).toFixed(precision);
                        ngModel.$viewValue = formatted;
                        ngModel.$setViewValue(formatted);
                        ngModel.$render();
                    }
                    if (value == null || value == '') {
                        var formatted = Number(0).toFixed(precision);
                        ngModel.$viewValue = formatted;
                        ngModel.$setViewValue(formatted);
                        ngModel.$render();
                    }
                }

                element.bind('blur', SetPrecision);
                setTimeout(SetPrecision, 0);
            }
        };
    }

    function UibDatepickerPopup(uibDateParser) {
        return {
            restrict: 'A',
            priority: 1,
            require: '^ngModel',
            link: function (scope, element, attr, ngModel) {
                var dateFormat = attr.uibDatepickerPopup;
                ngModel.$formatters.push(function formatter(modelValue) {
                    var date = modelValue != null ? new Date(modelValue) : new Date('');
                    return date;
                });
            }
        };
    }

    function DynamicLoad($document, $window) {
        return {
            restrict: 'A',
            scope: {
                loadMore: '='
            },
            link: function (scope, element, attr, ngModel) {
                var el = element[0] || element;
                $document.on('scroll', function () {
                    if (($document.height() - $window.innerHeight) - $window.scrollY < 20) {
                        scope.loadMore();
                    }
                    scope.$apply(function () {});
                });
            }
        };
    }

    // Date and Time Format
    function CustomDateTimeFormat($filter) {
        var _exports = {
            restrict: 'A',
            priority: 1,
            require: '^ngModel',
            link: Link
        };

        return _exports;

        function Link(scope, element, attr, ngModel) {
            var _input = attr,
                _output = null;

            ngModel.$parsers.push(function (modelValue) {
                _output = null;
                if (modelValue) {
                    if (_input.enableDate == "true" && _input.enableTime == "false") {
                        _output = $filter('date')(modelValue, _input.datetimePicker);
                    } else {
                        _output = $filter('date')(modelValue, "dd-MMM-yyyy hh:mm:ss");
                    }
                }

                return _output;
            });

            ngModel.$formatters.push(function formatter(modelValue) {
                _output = null;
                if (modelValue) {
                    if (_input.enableDate == "true" && _input.enableTime == "false") {
                        _output = $filter('date')(modelValue, _input.datetimePicker);
                    } else {
                        _output = $filter('date')(modelValue, "dd-MMM-yyyy hh:mm:ss");
                    }
                }

                return _output;
            });
        }
    }
})();
