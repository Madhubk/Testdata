(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventModal", EventModal);

    EventModal.$inject = ["$uibModal", "$templateCache"];

    function EventModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="EventModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Event</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <event input="input" mode="1"></event>
        </div>`;
        $templateCache.put("EventModal.html", _template);

        let exports = {
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
                $uibModal.open({
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
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    scope.onCloseModal({
                        $item: "event"
                    });
                }, function () {
                    scope.onCloseModal({
                        $item: "event"
                    });
                });
            }
        }
    }

    angular
        .module("Application")
        .controller("EventModalController", EventModalController);

    EventModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EventModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let EventModalCtrl = this;

        function Init() {
            EventModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EventModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EventModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
