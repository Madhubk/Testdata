(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptionModal", ExceptionModal);

    ExceptionModal.$inject = ["$uibModal"];

    function ExceptionModal($uibModal) {
        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                type: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right exception",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/exception/exception-modal/exception-modal.html",
                    controller: 'ExceptionModalController as ExceptionModalCtrl',
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
                    // console.log(response);
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
