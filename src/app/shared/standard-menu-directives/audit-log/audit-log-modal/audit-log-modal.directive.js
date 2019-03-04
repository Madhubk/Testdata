(function () {
    "use strict";

    angular
        .module("Application")
        .directive("auditLogModal", AuditLogModal);

    AuditLogModal.$inject = ["$uibModal", "$templateCache"];

    function AuditLogModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="AuditLogModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Audit Log</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <audit-log input="input" mode="1" entity="AuditLogModalCtrl.ePage.Masters.AuditEntity"></audit-log>
        </div>`;
        $templateCache.put("AuditLogModal.html", _template);

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
                    keyboard: true,
                    windowClass: "right audit-log",
                    scope: scope,
                    templateUrl: "AuditLogModal.html",
                    controller: 'AuditLogModalController as AuditLogModalCtrl',
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
        .controller("AuditLogModalController", AuditLogModalController);

    AuditLogModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function AuditLogModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let AuditLogModalCtrl = this;

        function Init() {
            AuditLogModalCtrl.ePage = {
                "Title": "",
                "Prefix": "AuditLogModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param
            };

            AuditLogModalCtrl.ePage.Masters.Close = Close;

            AuditLogModalCtrl.ePage.Masters.AuditEntity = {
                "ClassSource": "ShpShipmentHeader",
                "DisplayName": "Shipment",
                "icon": "menu-icon fa fa-truck",
                "EntitySource": "SHP",
                "EntityRefKey": "SHP_PK",
                "EntityRefCode": "SHP_ShipmentNo",
                "IsParentEntityRefKey": false,
                "ParentEntitySource": undefined,
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "IsAdditionalEntityRefKey": false,
                "AdditionalEntitySource": undefined,
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined
            };
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
