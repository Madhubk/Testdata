(function () {
    "use strict";

    angular
        .module("Application")
        .directive("delayReasonModal", DelayReasonModal);

    DelayReasonModal.$inject = ["$uibModal", "$templateCache"];

    function DelayReasonModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="DelayReasonModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Delay Reason</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <delay-reason input="input"></delay-reason>
        </div>`;
        $templateCache.put("DelayReasonModal.html", _template);

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
                    windowClass: "right delay-reason",
                    scope: scope,
                    templateUrl: "DelayReasonModal.html",
                    controller: 'DelayReasonModalController as DelayReasonModalCtrl',
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
