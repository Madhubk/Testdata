(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisQueueLogSingleRecordViewController", EAxisQueueLogSingleRecordViewController);

    EAxisQueueLogSingleRecordViewController.$inject = ["helperService", "$location", "toastr", "jsonEditModal", "$uibModal"];

    function EAxisQueueLogSingleRecordViewController(helperService, $location, toastr, jsonEditModal, $uibModal) {

        var EAxisQueueLogSingleRecordViewCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            EAxisQueueLogSingleRecordViewCtrl.ePage = {
                "Title": "",
                "Prefix": "EAxisQueueLogSingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
            InitQueueLogSingleRecordView();

        }

        function InitQueueLogSingleRecordView() {
            if (EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.QueryString.DataEntryName) {
                EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.dataentryName = EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.QueryString.DataEntryName;
            }
            EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.DefaultFilter = {
                "QUL_FK": EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.QueryString.QUL_FK,
                "Type": EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.QueryString.TargetSource
            }

            EAxisQueueLogSingleRecordViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
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
                $location.path("EA/lab/queue-log-single-record-view/" + helperService.encryptData(_queryString));
            } else if ($item.action === "editJson") {
                OpenJsonModal($item.data);
            }
        }

        function OpenJsonModal($item) {
            if ($item.entity == 'Response') {
                var _item = $item.entity.Response;
            } else if ($item.entity == 'UsedInput') {
                var _item = $item.entity.UsedInput;
            } else {
                var _item = $item.entity.Config;
            }

            if (_item !== undefined && _item !== null && _item !== '' && _item !== ' ') {
                if (typeof JSON.parse(_item) == "object") {
                    var modalDefaults = {
                        resolve: {
                            param: function () {
                                var exports = {
                                    "Data": _item
                                };
                                return exports;
                            }
                        }
                    };

                    jsonEditModal.showModal(modalDefaults, {})
                        .then(function (result) {
                            _item = result;
                        }, function () {
                            console.log("Cancelled");
                        });
                }
            }
        }

        Init();
    }

})();