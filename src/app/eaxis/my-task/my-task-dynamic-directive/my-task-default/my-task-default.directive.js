(function () {
    "use strict";

    angular
        .module("Application")
        .directive("mytaskdefault", MyTaskDefaultDirective);

    MyTaskDefaultDirective.$inject = ["$templateCache"];

    function MyTaskDefaultDirective($templateCache) {
        var _template = `<div class="clearfix my-task-default-container">
                                            <div class="warning-message p-20 font-140 text-center warning">Task Not Yet Configured.</div>
                                        </div>`;
        $templateCache.put("MyTaskDefault.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "MyTaskDefault.html",
            scope: {
                taskObj: "=",
                getErrorWarningList: "&"
            }
        };

        return exports;
    }
})();
