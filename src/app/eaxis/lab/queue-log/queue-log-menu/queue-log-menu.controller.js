(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QueueLogMenuController", QueueLogMenuController);

    QueueLogMenuController.$inject = ["helperService", "authService", "queueLogConfig", "appConfig", "apiService", "$uibModal", "$scope", "$location"];

    function QueueLogMenuController(helperService, authService, queueLogConfig, appConfig, apiService, $uibModal, $scope, $location) {
        var QueueLogMenuCtrl = this;

        function Init() {
            var currentQueueLog = QueueLogMenuCtrl.currentQueueLog[QueueLogMenuCtrl.currentQueueLog.label].ePage.Entities;
            QueueLogMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "QueueAcknowledgement",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentQueueLog,
            };
            InitQueueAckknowledge();
        }

        function InitQueueAckknowledge() {
            QueueLogMenuCtrl.ePage.Masters.dataentryName = "QueueAcknowledgement";
            QueueLogMenuCtrl.ePage.Masters.DefaultFilter = {
                "QUL_FK": QueueLogMenuCtrl.ePage.Entities.Header.Data.PK,
                "Status":QueueLogMenuCtrl.ePage.Entities.Header.Data.Status,
                "Tenantcode": authService.getUserInfo().TenantCode,
                "SAP_FK": authService.getUserInfo().AppPK
            }
           QueueLogMenuCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function SelectedGridRow($item) {
            $item.dataEntryMaster.Entities.map(function (value1, key1) {
                if (value1.ConfigData && value1.ConfigData.length > 0) {
                    value1.ConfigData.map(function (value2, key2) {
                        if (value2.AttributesDetails.UIControl == "tcgrid") {
                            $item.data.entity.DataEntryName = value2.AttributesDetails.DataEntryPage;
                        }
                    });
                }
            });
            var _queryString = $item.data.entity;
            if ($item.action === "link" || $item.action === "dblClick") {
                $location.path("EA/lab/queue-log-single-record-view/" + helperService.encryptData(_queryString));
             }
        }
        Init();
    }
})();