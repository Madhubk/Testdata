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
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&",
                getErrorWarningList: "&"
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.IsCheckTemplateName = true;
            scope.OnComplete = OnComplete;
            scope.OnRefreshStatusCount = OnRefreshStatusCount;
            scope.OnRefreshTask = OnRefreshTask;
            scope.GetErrorWarningList = GetErrorWarningList;

            CreateTemplateDirective();

            function GetTemplateName($item) {
                var _formName = "mytaskdefault";
                if ($item) {
                    _formName = $item.replace(/ +/g, "").toLowerCase();

                    if (_formName.indexOf("_") != -1) {
                        _formName = _formName.split("_").join("");
                    }
                }

                return _formName;
            }

            function CreateTemplateDirective() {
                var _templateName = GetTemplateName(scope.taskObj.WSI_StepCode);

                if (_templateName) {
                    var _index = _templateName.indexOf("-");
                    if (_index != -1) {
                        var _split = _templateName.split("-");
                        var _arr = [];
                        _arr.push(_split[0]);
                        _split.map(function (value, key) {
                            if (key > 0) {
                                _arr.push(value.charAt(0).toUpperCase() + value.slice(1));
                            }
                        });
                        var templateName = _arr.join("");
                    } else {
                        var templateName = _templateName;
                    }
                }

                var _isExist = $injector.has(templateName + "Directive");
                if (!_isExist) {
                    if (!scope.IsCheckTemplateName) {
                        _templateName = GetTemplateName(scope.taskObj.WSI_StepCode);
                        var _isExist = $injector.has(_templateName + "Directive");
                        if (!_isExist) {
                            _templateName = "mytaskdefault";
                        }
                    } else {
                        _templateName = "mytaskdefault";
                    }
                }

                scope.templateDir = '<' + _templateName + ' task-obj="taskObj" on-complete="OnComplete($item)" on-refresh-status-count="OnRefreshStatusCount($item)" on-refresh-task="OnRefreshTask($item)" get-error-warning-list="GetErrorWarningList($item)"/>'
                var newDirective = angular.element(scope.templateDir);
                var view = $compile(newDirective)(scope);
                ele.append(view);
            }

            function OnComplete(_$item) {
                scope.onComplete({
                    $item: _$item
                });
            }

            function OnRefreshStatusCount(_$item) {
                scope.onRefreshStatusCount({
                    $item: _$item
                });
            }

            function OnRefreshTask(_$item) {
                scope.onRefreshTask({
                    $item: _$item
                });
            }

            function GetErrorWarningList(_$item) {
                scope.getErrorWarningList({
                    $item: _$item
                });
            }
        }
    }

})();
