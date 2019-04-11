(function () {
    "use strict";

    angular
        .module("Application")
        .directive("customToolbar", CustomToolbar);

    function CustomToolbar() {
        let exports = {
            restrict: "EA",
            template: `<div class="clearfix custom-toolbar-wrapper">
                                    <div class="pull-left">
                                        <div compile-custom-toolbar dir-name="dataentryObject.OtherConfig.ListingPageConfig.CustomToolbarName" dataentry-object="dataentryObject" input="input"></div>
                                    </div>
                                </div>`,
            scope: {
                input: "=",
                dataentryObject: "="
            }
        };
        return exports;
    }

    angular
        .module('Application')
        .directive('compileCustomToolbar', CompileCustomToolbar);

    CompileCustomToolbar.$inject = ["$compile", "$injector", "toastr"];

    function CompileCustomToolbar($compile, $injector, toastr) {
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
            let _dirName = scope.dirName;

            if (_dirName && _dirName.indexOf("-") != -1) {
                let _join;
                _dirName.split("-").map((value, key) => {
                    if (key == 0) {
                        _join = value;
                    } else if (key > 0) {
                        _join = _join + '' + value.charAt(0).toUpperCase() + value.slice(1);
                    }
                });
                _dirName = _join;
            }

            let _isExist = $injector.has(_dirName + "Directive");

            if (_isExist) {
                let template = '<' + scope.dirName + ' input="input" dataentry-object="dataentryObject"> </' + scope.dirName + '>';
                let _element = angular.element(template);
                let _template = $compile(_element)(scope);
                elem.replaceWith(_template);
            } else {
                toastr.warning("There is no Custom toolbar Directive...!");
            }
        }
    }
})();
