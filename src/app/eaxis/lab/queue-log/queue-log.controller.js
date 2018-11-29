(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisQueueLogController", EAxisQueueLogController);

    EAxisQueueLogController.$inject = ["$timeout", "$location", "authService", "helperService", "queueLogConfig", "toastr", "jsonEditModal", "$uibModal"];

    function EAxisQueueLogController($timeout, $location, authService, helperService, queueLogConfig, toastr, jsonEditModal, $uibModal) {
        /* jshint validthis: true */
        var EAxisQueueLogCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            EAxisQueueLogCtrl.ePage = {
                "Title": "",
                "Prefix": "QueueLog",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": queueLogConfig.Entities
            };

            InitQueueLog();

        }

        function InitQueueLog() {
            EAxisQueueLogCtrl.ePage.Masters.dataentryName = "QueueLog";
            queueLogConfig.TabList = [];
            EAxisQueueLogCtrl.ePage.Masters.TabList = queueLogConfig.TabList;
            EAxisQueueLogCtrl.ePage.Masters.activeTabIndex = 0;
            EAxisQueueLogCtrl.ePage.Masters.IsTabClick = false;
            EAxisQueueLogCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            EAxisQueueLogCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            EAxisQueueLogCtrl.ePage.Masters.AddTab = AddTab;
            EAxisQueueLogCtrl.ePage.Masters.RemoveTab = RemoveTab;
            EAxisQueueLogCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            EAxisQueueLogCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            EAxisQueueLogCtrl.ePage.Masters.OpenJsonModal = OpenJsonModal;


        }

        function CreateNewTab() {
            var _isExist = EAxisQueueLogCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                EAxisQueueLogCtrl.ePage.Masters.IsNewTabClicked = true;

                EAxisQueueLogCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            EAxisQueueLogCtrl.ePage.Masters.CurrentTab = undefined;
            var _isExist = EAxisQueueLogCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.EntitySource)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                EAxisQueueLogCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.EntitySource]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: $item.entity
                                    }
                                }
                            }
                        },
                        label: $item.entity.SourceEntityRefKey,
                        code: $item.entity.SourceEntityRefKey,
                        isNew: isNew
                    };

                    queueLogConfig.GetTabDetails(_item, isNew).then(function (response) {
                        EAxisQueueLogCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            EAxisQueueLogCtrl.ePage.Masters.activeTabIndex = EAxisQueueLogCtrl.ePage.Masters.TabList.length;
                            EAxisQueueLogCtrl.ePage.Masters.IsTabClick = false;
                            EAxisQueueLogCtrl.ePage.Masters.CurrentActiveTab($item.entity.EntitySource);
                        });
                    });
                } else {
                    var obj = {
                        New: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: {}
                                    }
                                }
                            }
                        },
                        label: "New",
                        code: "New",
                        isNew: isNew
                    };

                    EAxisQueueLogCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        EAxisQueueLogCtrl.ePage.Masters.activeTabIndex = EAxisQueueLogCtrl.ePage.Masters.TabList.length;
                        EAxisQueueLogCtrl.ePage.Masters.IsTabClick = false;

                        EAxisQueueLogCtrl.ePage.Masters.CurrentActiveTab("New");
                        EAxisQueueLogCtrl.ePage.Masters.IsNewTabClicked = false;
                    });
                }
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, $item) {
            event.preventDefault();
            event.stopPropagation();
            var _item = $item[$item.label].ePage.Entities;

            EAxisQueueLogCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            EAxisQueueLogCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                EAxisQueueLogCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "editJson") {
                OpenJsonModal($item.data)
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        function OpenJsonModal($item) {
           var _item =$item.entity.Data;
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