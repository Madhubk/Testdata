(function () {
    "use strict";

    angular
        .module("Application")
        .directive("myTaskDynamicEditDirective", MyTaskDynamicEditDirective)

    MyTaskDynamicEditDirective.$inject = ["$compile", "$injector", "authService"];

    function MyTaskDynamicEditDirective($compile, $injector, authService) {
        var exports = {
            restrict: "EA",
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            var _templateName = "mytaskdefaultedit";
            scope.IsCheckTemplateName = true;
            scope.OnComplete = OnComplete;
            scope.OnRefreshStatusCount = OnRefreshStatusCount;
            scope.OnRefreshTask = OnRefreshTask;

            CreateTemplateDirective();

            function GetTemplateName($item) {
                var _formName = "mytaskdefaultedit";
                if ($item) {
                    _formName = $item.replace(/ +/g, "").toLowerCase();

                    if (_formName.indexOf("_") != -1) {
                        _formName = _formName.split("_").join("") + "edit";
                    }
                }

                return _formName;
            }

            function CreateTemplateDirective() {
                if (scope.taskObj) {
                    if (scope.taskObj.OtherConfig) {
                        if(!scope.taskObj.OtherConfig.HideForm){
                            if (scope.taskObj.OtherConfig.IsRoleBased) {
                                if (scope.taskObj.OtherConfig.RoleBasedForm) {
                                    if (scope.taskObj.OtherConfig.RoleBasedForm.length > 0) {
                                        if (authService.getUserInfo().RoleList) {
                                            if (scope.IsCheckTemplateName) {
                                                authService.getUserInfo().RoleList.map(function (value1, key1) {
                                                    scope.taskObj.OtherConfig.RoleBasedForm.map(function (value2, key2) {
                                                        if (value1.Role_Code == value2.Role && scope.IsCheckTemplateName) {
                                                            _templateName = value2.FormName;
                                                            scope.IsCheckTemplateName = false;
                                                        }
                                                    });
                                                });
                                            }
                                        } else {
                                            _templateName = scope.taskObj.OtherConfig.RoleBasedForm[0].FormName;
                                            scope.IsCheckTemplateName = false;
                                        }
                                    }
                                }
                            } else if (scope.taskObj.OtherConfig.IsFormName) {
                                if (scope.taskObj.OtherConfig.FormName) {
                                    _templateName = scope.taskObj.OtherConfig.FormName;
                                    scope.IsCheckTemplateName = false;
                                }
                            }
                        }
                    }

                    if (scope.IsCheckTemplateName) {
                        _templateName = GetTemplateName(scope.taskObj.WSI_StepCode);
                    }

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
                                _templateName = "mytaskdefaultedit";
                            }
                        } else {
                            _templateName = "mytaskdefaultedit";
                        }
                    }

                    scope.templateDir = '<' + _templateName + ' task-obj="taskObj" entity-obj="entityObj" tab-obj="tabObj" on-complete="OnComplete($item)" on-refresh-status-count="OnRefreshStatusCount($item)" on-refresh-task="OnRefreshTask($item)"/>';
                    var newDirective = angular.element(scope.templateDir);
                    var view = $compile(newDirective)(scope);
                    ele.append(view);
                }
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
        }
    }

})();
