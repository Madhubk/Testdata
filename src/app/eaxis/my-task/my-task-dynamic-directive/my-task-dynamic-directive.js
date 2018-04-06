(function () {
    "use strict";

    angular
        .module("Application")
        .directive("myTaskDynamicDirective", MyTaskDynamicDirective)

    MyTaskDynamicDirective.$inject = ["$compile", "$injector"];

    function MyTaskDynamicDirective($compile, $injector) {
        var exports = {
            restrict: "EA",
            scope: {
                taskObj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            var _templateName = "mytaskdefault";
            if (scope.taskObj.WSI_StepCode) {
                _templateName = scope.taskObj.WSI_StepCode.replace(/ +/g, "").toLowerCase();

                if (_templateName.indexOf("_") != -1) {
                    _templateName = _templateName.split("_").join("");
                }
            }

            var _isExist = $injector.has(_templateName + "Directive");
            if (!_isExist) {
                _templateName = "mytaskdefault";
            }

            scope.templateDir = '<' + _templateName + ' task-obj="taskObj"/>'
            var newDirective = angular.element(scope.templateDir);
            var view = $compile(newDirective)(scope);
            ele.append(view);
        }
    }

})();
