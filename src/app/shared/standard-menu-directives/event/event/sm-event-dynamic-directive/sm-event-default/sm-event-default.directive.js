(function () {
    "use strict";

    angular
        .module("Application")
        .directive("smeventdefault", EMEventDefaultDirective);

    EMEventDefaultDirective.$inject = ["$templateCache"];

    function EMEventDefaultDirective($templateCache) {
        let _template = `<div class="clearfix sm-event-default-container">
                                            <div class="warning-message p-20 font-140 text-center warning">Event Not Yet Configured.</div>
                                        </div>`;
        $templateCache.put("SMEventDefault.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "SMEventDefault.html",
            // link: Link,
            scope: {
                eventObj: "="
            }
        };

        return exports;
    }
})();
