(function () {
    "use strict";

    angular
        .module("Application")
        .directive("customToolbar", CustomToolbar);

    CustomToolbar.$inject = ["$templateCache"];

    function CustomToolbar($templateCache) {
        var _template = `<div class="clearfix custom-toolbar-wrapper">
            <div class="eaxis-footer-left">
            <div compile-dynamic-directive-custom-toolbar dir-name="dataentryObject.OtherConfig.ListingPageConfig.CustomToolbarName" dataentry-object="dataentryObject" input="input"></div>
            </div>
        </div>`;
        $templateCache.put("CustomToolbar.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "CustomToolbar.html",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }

    angular
        .module('Application')
        .directive('compileDynamicDirectiveCustomToolbar', CompileDynamicDirectiveCustomToolbar);

    CompileDynamicDirectiveCustomToolbar.$inject = ["$compile", "$injector", "toastr"];

    function CompileDynamicDirectiveCustomToolbar($compile, $injector, toastr) {
        var exports = {
            restrict: 'A',
            scope: {
                dirName: '=',
                dataentryObject: "=",
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, elem, attrs) {
            var _dirName = scope.dirName;

            if (scope.dirName) {
                if (scope.dirName.indexOf("-") != -1) {
                    var _split = scope.dirName.split("-");
                    var _join;
                    if (_split.length > 0) {
                        _split.map(function (value, key) {
                            if (key == 0) {
                                _join = value;
                            } else if (key > 0) {
                                _join = _join + '' + (value.charAt(0).toUpperCase() + value.slice(1));
                            }
                        });
                    }
                    _dirName = _join;
                }
            }

            var _isExist = $injector.has(_dirName + "Directive");

            if (_isExist) {
                var template = '<' + scope.dirName + ' input="input" dataentry-object="dataentryObject"> </' + scope.dirName + '>';
                var _element = angular.element(template);
                var _template = $compile(_element)(scope);
                elem.replaceWith(_template);
            } else {
                toastr.warning("There is no Custom toolbar Directive...!");
            }
        }
    }
})();
