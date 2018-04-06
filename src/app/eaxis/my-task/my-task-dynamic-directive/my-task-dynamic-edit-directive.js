(function () {
    "use strict";

    angular
        .module("Application")
        .directive("myTaskDynamicEditDirective", MyTaskDynamicEditDirective)

    MyTaskDynamicEditDirective.$inject = ["$compile", "$injector"];

    function MyTaskDynamicEditDirective($compile, $injector) {
        var exports = {
            restrict: "EA",
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.OnComplete = function (_$item) {
                scope.onComplete({
                    $item: _$item
                });
            }

            var _templateName = "mytaskdefaultedit";
            if (scope.taskObj.WSI_StepCode) {
                _templateName = scope.taskObj.WSI_StepCode.replace(/ +/g, "").toLowerCase();

                if (_templateName.indexOf("_") != -1) {
                    _templateName = _templateName.split("_").join("") + "edit";
                }
            }

            var _isExist = $injector.has(_templateName + "Directive");
            if (!_isExist) {
                _templateName = "mytaskdefaultedit";
            }

            scope.templateDir = '<' + _templateName + ' task-obj="taskObj" entity-obj="entityObj" tab-obj="tabObj" on-complete="OnComplete($item)"/>'
            var newDirective = angular.element(scope.templateDir);
            var view = $compile(newDirective)(scope);
            ele.append(view);
        }
    }

})();
