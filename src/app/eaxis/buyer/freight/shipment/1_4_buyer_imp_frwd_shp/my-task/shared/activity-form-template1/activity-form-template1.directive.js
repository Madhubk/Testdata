(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityFormTemplate1", ActivityFormTemplate1Directive)
        .directive("taskActivityDynamicDirective", TaskActivityDynamicDirective);

    function ActivityFormTemplate1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/activity-form-template1/activity-form-template1.html",
            link: Link,
            controller: "ActivityFormTemplate1Controller",
            controllerAs: "ActivityFormTemplate1Ctrl",
            bindToController: true,
            scope: {
                currentObj: "=",
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    TaskActivityDynamicDirective.$inject = ["$compile", "$injector", "$filter", "myTaskActivityConfig"];

    function TaskActivityDynamicDirective($compile, $injector, $filter, myTaskActivityConfig) {
        var exports = {
            restrict: "EA",
            scope: {},
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {

            var DataEntryDetails = $filter('filter')(myTaskActivityConfig.Entities.TaskConfigData, { Category: 'Activity' });
            if (DataEntryDetails.length > 0) {

                var TempDetails = DataEntryDetails[0].Code.split('-');
                for (var i = 0; i < TempDetails.length; i++) {
                    if (i != 0) {
                        TempDetails[i] = TempDetails[i].charAt(0).toUpperCase() + TempDetails[i].slice(1);
                    }
                }
                TempDetails = TempDetails.join('');
                var _isExist = $injector.has(TempDetails + "Directive");
                if (_isExist) {
                    scope.templateDir = '<' + DataEntryDetails[0].Code + '/>';
                    var newDirective = angular.element(scope.templateDir);
                    var view = $compile(newDirective)(scope);
                    ele.append(view);
                } else {
                    var el = angular.element('<span/>');
                    el.append('<div class="warning-message">Incorrect Activity.</div>');
                    $compile(el)(scope);
                    ele.append(el);
                }
            } else {
                var el = angular.element('<span/>');
                el.append(' <div class="warning-message">Activity Screen Not Yet Configured.</div>');
                $compile(el)(scope);
                ele.append(el);
            }

        }
    }

})();
