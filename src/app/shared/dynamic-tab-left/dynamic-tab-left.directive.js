(function () {
    'user strict';

    angular
        .module('Application')
        .directive('compileDynamicDirective', CompileDynamicDirective);

    function CompileDynamicDirective($injector, $compile) {
        var exports = {
            restrict: "E",
            scope: {
                code: '=',
                obj: "=",
                tabObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {
            var _templateName = "mytaskdefaultedit";
            var _dirName;

            if (scope.code) {
                var _index = scope.code.indexOf("-");
                if (_index != -1) {
                    var _split = scope.code.split("-");
                    var _arr = [];
                    _arr.push(_split[0]);
                    _split.map(function (value, key) {
                        if (key > 0) {
                            _arr.push(value.charAt(0).toUpperCase() + value.slice(1));
                        }
                    });
                    _templateName = _arr.join("");
                } else {
                    _templateName = scope.code;
                }
            }

            var _isExist = $injector.has(_templateName + "Directive");
            if (!_isExist) {
                _templateName = "mytaskdefaultedit";
            }

            if (_templateName == "mytaskdefaultedit") {
                _dirName = _templateName;
            } else {
                _dirName = scope.code;
            }

            var _templateDir = '<' + _dirName + ' obj="obj" tab-obj="tabObj" />';
            var _newDirective = angular.element(_templateDir);
            var _view = $compile(_newDirective)(scope);
            ele.replaceWith(_view);
        }
    }

    angular
        .module('Application')
        .directive('dynamicTabLeft', DynamicTabLeft);

    DynamicTabLeft.$inject = ["$templateCache"];

    function DynamicTabLeft($templateCache) {
        var _template = `<uib-tabset class="tabs-left tabbable" active="DynamicTabLeft.TabIndex">
            <div class="tab-profile" data-ng-if="obj.TabTitle">
                <div class="tab-profile-title text-single-line text-center" data-ng-bind="obj.TabTitle"></div>
            </div>
            <uib-tab ng-repeat="x in listSource track by $index" select="DynamicTabLeft.OnTabSelect(x, $event)" deselect="DynamicTabLeft.OnTabDeselect(x, $selectedIndex, $event)" index="$index" disable="x.IsDisabled" data-ng-click="DynamicTabLeft.OnTabClick(x)">
                <uib-tab-heading title="{{x.Name}}">
                    <i class="{{x.Icon}} mr-5" data-ng-if="x.Icon"></i>
                    <span class="text-single-line" data-ng-bind="x.Name"></span>
                </uib-tab-heading>
                <div class="clearfix left-tab-content">
                    <compile-dynamic-directive code="x.Code" obj="obj" tab-obj="x.Obj"></compile-dynamic-directive>
                </div>
            </uib-tab>
        </uib-tabset>`;
        $templateCache.put("DynamicTabLeft.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                listSource: '=',
                obj: "="
            },
            link: Link,
            templateUrl: "DynamicTabLeft.html"
        };

        return exports;

        function Link(scope, ele, attr) {
            scope.DynamicTabLeft = {};
            scope.DynamicTabLeft.OnTabSelect = OnTabSelect;
            scope.DynamicTabLeft.OnTabDeselect = OnTabDeselect;
            scope.DynamicTabLeft.OnTabClick = OnTabClick;
        }

        function OnTabSelect($item, $event) {}

        function OnTabDeselect($item, $selectedIndex, $event) {}

        function OnTabClick($item) {}
    }
})();
