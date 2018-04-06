(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventModal", EventModal);

    EventModal.$inject = ["$uibModal"];

    function EventModal($uibModal) {
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
                    windowClass: "right event",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/event/event-modal/event-modal.html",
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
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
