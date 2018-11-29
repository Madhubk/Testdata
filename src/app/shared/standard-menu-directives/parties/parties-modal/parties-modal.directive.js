(function () {
    "use strict";

    angular
        .module("Application")
        .directive("partiesModal", PartiesModal);

    PartiesModal.$inject = ["$uibModal", "$templateCache"];

    function PartiesModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="PartiesModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Parties</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <parties input="input" mode="mode" type="type"></parties>
        </div>`;
        $templateCache.put("PartiesModal.html", _template);

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
                    windowClass: "right parties",
                    scope: scope,
                    templateUrl: "PartiesModal.html",
                    controller: 'PartiesModalController as PartiesModalCtrl',
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
