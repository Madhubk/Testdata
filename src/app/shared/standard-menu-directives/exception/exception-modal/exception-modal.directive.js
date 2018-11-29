(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptionModal", ExceptionModal);

    ExceptionModal.$inject = ["$uibModal", "$templateCache"];

    function ExceptionModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="ExceptionModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Exception</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <exception input="input" mode="mode" type="type"></exception>
        </div>`;
        $templateCache.put("ExceptionModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                type: "=",
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
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right exception",
                    scope: scope,
                    templateUrl: "ExceptionModal.html",
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
                    console.log(response);
                    scope.onCloseModal({
                        $item: "exception"
                    });
                }, function () {
                    console.log("Cancelled");
                    scope.onCloseModal({
                        $item: "exception"
                    });
                });
            }
        }
    }
})();
