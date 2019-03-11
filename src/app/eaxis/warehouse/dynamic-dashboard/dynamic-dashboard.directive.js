(function () {
    "use strict"
    angular
        .module("Application")
        .directive("dynamicDashboardDirective", DynamicDashboardDirective);

    DynamicDashboardDirective.$inject = ["$compile", "$injector", "$filter"];

    function DynamicDashboardDirective($compile, $injector, $filter) {
        var exports = {
            restrict: "EA",
            scope: {
                componentList: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {                        
            scope.componentList = $filter('orderBy')(scope.componentList, 'SequenceNo');
            var ComponentDetails = $filter('filter')(scope.componentList, { IsShow: 'true' });
            if (ComponentDetails.length > 0) {
                angular.forEach(ComponentDetails, function (value, key) {
                    // if (key < 2) {
                    var TempDetails = value.Directive.split('-');
                    for (var i = 0; i < TempDetails.length; i++) {
                        if (i != 0) {
                            TempDetails[i] = TempDetails[i].charAt(0).toUpperCase() + TempDetails[i].slice(1);
                        }
                    }
                    TempDetails = TempDetails.join('');
                    var _isExist = $injector.has(TempDetails + "Directive");
                    if (_isExist) {
                        scope.templateDir = '<' + value.Directive + '/>';
                        var newDirective = angular.element(scope.templateDir);
                        var view = $compile(newDirective)(scope);
                        ele.append(view);
                    }
                    // }
                    // else {
                    //     var el = angular.element('<span/>');
                    //     el.append('<div class="warning-message">Incorrect Activity.</div>');
                    //     $compile(el)(scope);
                    //     ele.append(el);
                    // }
                });
            } else {
                var el = angular.element('<span/>');
                el.append(' <div class="warning-message">Activity Screen Not Yet Configured.</div>');
                $compile(el)(scope);
                ele.append(el);
            }
        }
    }

})();
