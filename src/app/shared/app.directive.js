(function () {
    "use strict";

    angular
        .module("Application")
        .directive("chosen", ChosenDropdown)
        .directive('pageTitle', PageTitle)
        .directive('loadScript', LoadScript)
        .directive('sidebarMenu', SidebarMenu)
        .directive('loadingContainer', LoadingContainer)
        .directive('sidebarCollapse', SidebarCollapse)
        .directive('uibDatepickerPopup', UibDatepickerPopup)
        .directive('customDateTimeFormat', CustomDateTimeFormat)
        .directive('loadDynamicCtrl', LoadDynamicCtrl)
        .directive("capitalize", Capitalize)
        .directive("numbersOnly", NumbersOnly)
        .directive("sbPrecision", SBPrecision)
        .directive('dynamicLoad', DynamicLoad)
        .directive('noSpecialChar', NoSpecialChar)
        .directive('alphabetsOnly', AlphabetsOnly)
        .directive('noSpecialExceptComma', NoSpecialExceptComma)
        .directive('numbersOnlyDot', NumbersOnlyDot);

    function ChosenDropdown() {
        var _exports = {
            restrict: 'A',
            require: "ngModel",
            scope: {
                disableSearch: "=",
                tags: "=",
                model: '=ngModel'
            },
            link: Link
        };

        return _exports;

        function Link(scope, element, attrs) {
            var $el = $(element);
            // var data = [
            //     { id: 0, text: '<div style="color:green">enhancement</div>' },
            //     { id: 1, text: '<div style="color:red">bug</div><div><small>This is some small text on a new line</small></div>' }];

            var _options = {
                allowClear: false,
                closeOnSelect: true,
                debug: false,
                disabled: false,
                dropdownAutoWidth: false,
                dropdownParent: $(document.body),
                minimumResultsForSearch: 0,
                maximumInputLength: 0,
                maximumSelectionLength: 0,
                minimumInputLength: 0,
                selectOnClose: false,
                tokenSeparators: [],
                theme: "default",
                width: "resolve",
                // tags: false,
                // data: null,
                // data: data,
                // templateResult: function (d) { return $(d.text); },
                // templateSelection: function (d) { return $(d.text); }
            };

            (attrs.multiple) ? _options.multiple = true: _options.multiple = false;
            (attrs.multiple) ? _options.placeholder = "Select any option": _options.placeholder = undefined;
            (scope.tags) ? _options.tags = true: _options.tags = false;
            if (scope.disableSearch)
                _options.minimumResultsForSearch = Infinity;

            $el.select2();

            scope.$watch("model", function () {
                setTimeout(function () {
                    $el.select2();
                });
            });
        }
    }

    function NumbersOnly() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function FromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

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
                element.on('keypress', function (event) {
                    var capitalize = function (inputValue) {
                        if (angular.isUndefined(inputValue))
                            return;

                        var capitalized = inputValue.toUpperCase();
                        if (capitalized !== inputValue) {
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                        }
                        return capitalized;
                    }

                    modelCtrl.$parsers.push(capitalize);
                    capitalize(scope[attrs.ngModel]);
                });
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
                    if (value == null || value == '' || value == 0) {
                        var formatted = ''
                        ngModel.$viewValue = formatted;
                        // ngModel.$setViewValue(formatted);
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
    function CustomDateTimeFormat($filter, $timeout, APP_CONSTANT) {
        var _exports = {
            restrict: 'A',
            priority: 1,
            require: '^ngModel',
            link: Link
        };

        return _exports;

        function Link(scope, element, attr, ngModel) {
            ngModel.$parsers.push(Parser);
            ngModel.$formatters.push(Formatter);

            function Parser(modelValue) {
                var _output = null;

                if (modelValue) {
                    if (attr.enableDate == "true" && attr.enableTime == "false") {
                        _output = $filter('date')(modelValue, APP_CONSTANT.DatePicker.dateFormatDB);

                        $timeout(function () {
                            ngModel.$modelValue = $filter('date')(modelValue, attr.datetimePicker);
                            ngModel.$viewValue = _output;
                            // ngModel.$setViewValue(_output);
                            // ngModel.$render();
                        });
                    } else {
                        _output = $filter('date')(modelValue, APP_CONSTANT.DatePicker.dateTimeFullFormat);
                    }
                }

                return _output;
            }

            function Formatter(modelValue) {
                var _output = null;

                if (modelValue) {
                    if (attr.enableDate == "true" && attr.enableTime == "false") {
                        _output = $filter('date')(modelValue, attr.datetimePicker);
                    } else {
                        _output = $filter('date')(modelValue, APP_CONSTANT.DatePicker.dateTimeFullFormat);
                    }
                }

                return _output;
            }
        }
    }

    // Load Script Dynamically
    function LoadScript($location) {
        var _exports = {
            restrict: 'AE',
            link: Link
        };

        return _exports;

        function Link(scope, element, attr) {
            var _location = $location.path();

            if (_location.indexOf(attr.app) != -1) {
                if (_location.indexOf(attr.module) != -1) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = attr.src;
                    document.body.appendChild(script);
                    element.remove();
                } else {
                    element.remove();
                }
            }
        }
    }

    // Load Controller Dynamically
    function LoadDynamicCtrl($parse, $compile) {
        var _exports = {
            restrict: 'AE',
            terminal: true,
            priority: 100000,
            link: Link
        };

        return _exports;

        function Link(scope, elem, attr) {
            var name = $parse(elem.attr('load-dynamic-ctrl'))(scope);
            elem.removeAttr('load-dynamic-ctrl');
            elem.attr('data-ng-controller', name);
            $compile(elem)(scope);
        }
    }

    function PageTitle($rootScope, $timeout) {
        return {
            link: function (scope, element) {
                var listener = function (event, toState) {
                    var title = 'MyHub Plus';
                    if (toState.ncyBreadcrumb && toState.ncyBreadcrumb.label)
                        title = toState.ncyBreadcrumb.label;
                    $timeout(function () {
                        element.text(title);
                    }, 0, false);
                };
                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }

    function SidebarCollapse() {
        return {
            restrict: 'AC',
            template: '<i class="collapse-icon fa fa-bars"></i>',
            link: function (scope, el, attr) {
                el.on('click', function () {
                    if (!$('#sidebar').is(':visible'))
                        $("#sidebar").toggleClass("hide");
                    $("#sidebar").toggleClass("menu-compact");
                    $(".sidebar-collapse").toggleClass("active");
                    var isCompact = $("#sidebar").hasClass("menu-compact");

                    if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
                        $(".sidebar-menu").slimScroll({
                            destroy: true
                        });
                        $(".sidebar-menu").attr('style', '');
                    }
                    if (isCompact) {
                        $(".open > .submenu")
                            .removeClass("open");
                    } else {
                        if ($('.page-sidebar').hasClass('sidebar-fixed')) {
                            var position = (readCookie("rtl-support") || location.pathname == "/index-rtl-fa.html" || location.pathname == "/index-rtl-ar.html") ? 'right' : 'left';
                            $('.sidebar-menu').slimscroll({
                                height: $(window).height() - 90,
                                position: position,
                                size: '3px',
                                color: themeprimary
                            });
                        }
                    }
                    //Slim Scroll Handle
                });
            }
        };
    }

    function SidebarMenu() {
        return {
            restrict: 'AC',
            link: function (scope, el, attr) {
                el.find('li.active').parents('li').addClass('active open');

                el.on('click', 'a', function (e) {
                    //e.preventDefault();
                    var isCompact = $("#sidebar").hasClass("menu-compact");
                    var menuLink = $(e.target);
                    if ($(e.target).is('span'))
                        menuLink = $(e.target).closest('a');
                    if (!menuLink || menuLink.length == 0)
                        return;
                    if (!menuLink.hasClass("menu-dropdown")) {
                        if (isCompact && menuLink.get(0).parentNode.parentNode == this) {
                            var menuText = menuLink.find(".menu-text").get(0);
                            if (e.target != menuText && !$.contains(menuText, e.target)) {
                                return false;
                            }
                        }
                        return;
                    }
                    var submenu = menuLink.next().get(0);
                    if (!$(submenu).is(":visible")) {
                        var c = $(submenu.parentNode).closest("ul");
                        if (isCompact && c.hasClass("sidebar-menu"))
                            return;
                        c.find("* > .open > .submenu")
                            .each(function () {
                                if (this != submenu && !$(this.parentNode).hasClass("active"))
                                    $(this).slideUp(200).parent().removeClass("open");
                            });
                    }
                    if (isCompact && $(submenu.parentNode.parentNode).hasClass("sidebar-menu"))
                        return false;
                    $(submenu).slideToggle(200).parent().toggleClass("open");
                    return false;
                });
            }
        };
    }

    function LoadingContainer() {
        return {
            restrict: 'AC',
            link: function (scope, el, attrs) {
                el.removeClass('app-loading');
                scope.$on('$stateChangeStart', function (event) {
                    el.addClass('app-loading');
                });
                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    event.targetScope.$watch('$viewContentLoaded', function () {
                        el.removeClass('app-loading ');
                    });
                });
            }
        };
    }
    
    // no special Chars
    function NoSpecialChar() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined)
                        return ''
                    var cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
                    var cleanInputValue1 = inputValue.replace(/_/g, '');

                    if (cleanInputValue1 == cleanInputValue) {
                        modelCtrl.$setViewValue(cleanInputValue);
                        modelCtrl.$render();
                        return inputValue;
                    } else {
                        var test = inputValue.substring(0, inputValue.length - 1);
                        modelCtrl.$setViewValue(test);
                        modelCtrl.$render();
                        return inputValue;
                    }
                });
            }
        };
        // return {
        //   restrict: 'A',
        //   require: 'ngModel',
        //   link: function (scope, elem, attrs, ngModel){
        //             ngModel.$parsers.push(function(viewValue) {
        //             var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:',;"<>?.]*$/;
        //             // if view values matches regexp, update model value
        //             if (viewValue.match(reg)) {
        //               return viewValue;
        //             }
        //             // keep the model value as it is
        //             var transformedValue = ngModel.$modelValue;
        //             ngModel.$setViewValue(transformedValue);
        //             ngModel.$render();
        //             return transformedValue;
        //         });  
        //     }
        // };
    }

    function AlphabetsOnly() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function FromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^a-zA-Z\s]/g, '');

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

    function NoSpecialExceptComma() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$parsers.push(function (viewValue) {
                    var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?.]*$/;
                    // if view values matches regexp, update model value
                    if (viewValue.match(reg)) {
                        return viewValue;
                    }
                    // keep the model value as it is
                    var transformedValue = ngModel.$modelValue;
                    ngModel.$setViewValue(transformedValue);
                    ngModel.$render();
                    return transformedValue;
                });
            }
        };
    }

    function NumbersOnlyDot() {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.on('keypress', function (event) {
                    scope.ngModel = element.val();
                    if (scope.ngModel == undefined) {
                        if (event.which < 48 || event.which > 57) {
                            event.preventDefault();
                        }
                    } else {
                        scope.ngModel.replace(/[^0-9\.]/g, '');
                        var arrayL = [];
                        arrayL = scope.ngModel.split('.');
                        if (event.which == 46 && arrayL.length == 2) {
                            event.preventDefault();
                        } else if ((event.which < 48 || event.which > 57) && event.which != 46) {
                            event.preventDefault();
                        }
                    }
                });
            }
        };
    }

})();
