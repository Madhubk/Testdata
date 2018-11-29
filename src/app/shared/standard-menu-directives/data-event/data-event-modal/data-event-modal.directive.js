(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventDataModal", DataEventModal);

    DataEventModal.$inject = ["$uibModal", "$templateCache"];

    function DataEventModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="DataEventModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Data Event</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <event-data input="input"></event-data>
        </div>`;
        $templateCache.put("DataEventModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "="
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
                    windowClass: "right data-event",
                    scope: scope,
                    templateUrl: "DataEventModal.html",
                    controller: 'DataEventModalController as DataEventModalCtrl',
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
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
