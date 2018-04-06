(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventDataModal", DataEventModal);

    DataEventModal.$inject = ["$uibModal"];

    function DataEventModal($uibModal) {
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
                    templateUrl: "app/shared/standard-menu-directives/data-event/data-event-modal/data-event-modal.html",
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
