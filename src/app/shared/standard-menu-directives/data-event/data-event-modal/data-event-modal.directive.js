(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventDataModal", DataEventModal);

    DataEventModal.$inject = ["$uibModal", "$templateCache"];

    function DataEventModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="DataEventModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Data Event</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <event-data input="input"></event-data>
        </div>`;
        $templateCache.put("DataEventModal.html", _template);

        let exports = {
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
                $uibModal.open({
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
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(response => {}, () => {});
            }
        }
    }

    angular
        .module("Application")
        .controller("DataEventModalController", DataEventModalController);

    DataEventModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function DataEventModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let DataEventModalCtrl = this;

        function Init() {
            DataEventModalCtrl.ePage = {
                "Title": "",
                "Prefix": "DataEventModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            DataEventModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
