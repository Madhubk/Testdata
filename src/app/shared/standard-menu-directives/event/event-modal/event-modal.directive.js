(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventModal", EventModal);

    EventModal.$inject = ["$uibModal", "$templateCache"];

    function EventModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="EventModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Event</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <event input="input" mode="1"></event>
        </div>`;
        $templateCache.put("EventModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                onCloseModal: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    // backdrop: "static",
                    keyboard: true,
                    windowClass: "right event",
                    scope: scope,
                    templateUrl: "EventModal.html",
                    controller: 'EventModalController as EventModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    console.log(response);
                    scope.onCloseModal({
                        $item: "event"
                    });
                }, function () {
                    console.log("Cancelled");
                    scope.onCloseModal({
                        $item: "event"
                    });
                });
            }
        }
    }
})();
