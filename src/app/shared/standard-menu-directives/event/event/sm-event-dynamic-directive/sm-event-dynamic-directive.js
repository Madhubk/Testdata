(function () {
    "use strict";

    angular
        .module("Application")
        .directive("smEventDynamicDirective", SMEventDynamicDirective)

    SMEventDynamicDirective.$inject = ["$compile", "$injector"];

    function SMEventDynamicDirective($compile, $injector) {
        var exports = {
            restrict: "EA",
            scope: {
                eventObj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.IsCheckTemplateName = true;

            CreateTemplateDirective();

            function GetTemplateName($item) {
                var _formName = "smeventdefault";
                if ($item) {
                    _formName = $item.replace(/ +/g, "").toLowerCase();

                    if (_formName.indexOf("_") != -1) {
                        _formName = _formName.split("_").join("");
                    }
                }

                return _formName;
            }

            function CreateTemplateDirective() {
                var _templateName = GetTemplateName(scope.eventObj.EventCode);

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
                        _templateName = GetTemplateName(scope.eventObj.EventCode);
                        var _isExist = $injector.has(_templateName + "Directive");
                        if (!_isExist) {
                            _templateName = "smeventdefault";
                        }
                    } else {
                        _templateName = "smeventdefault";
                    }
                }

                scope.templateDir = '<' + _templateName + ' event-obj="eventObj"/>'
                var newDirective = angular.element(scope.templateDir);
                var view = $compile(newDirective)(scope);
                ele.append(view);
            }
        }
    }

})();
