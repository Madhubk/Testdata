(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisExcelTemplateController", EAxisExcelTemplateController);

    EAxisExcelTemplateController.$inject = ["$timeout", "$location", "authService", "helperService", "excelTemplateConfig", "toastr"];

    function EAxisExcelTemplateController($timeout, $location, authService, helperService, excelTemplateConfig, toastr) {
        /* jshint validthis: true */
        var EAxisExcelTemplateCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            EAxisExcelTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": excelTemplateConfig.Entities
            };

            InitExcelTemplate();

        }

        function InitExcelTemplate() {
            EAxisExcelTemplateCtrl.ePage.Masters.dataentryName = "AppSettings";
            EAxisExcelTemplateCtrl.ePage.Masters.DefaultFilter = {
                "EntitySource": "EXCELCONFIG",
                "Tenantcode": authService.getUserInfo().TenantCode,
                "SAP_FK": authService.getUserInfo().AppPK
            };

            excelTemplateConfig.TabList = [];
            EAxisExcelTemplateCtrl.ePage.Masters.TabList = excelTemplateConfig.TabList;
            EAxisExcelTemplateCtrl.ePage.Masters.activeTabIndex = 0;
            EAxisExcelTemplateCtrl.ePage.Masters.IsTabClick = false;
            EAxisExcelTemplateCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            EAxisExcelTemplateCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            EAxisExcelTemplateCtrl.ePage.Masters.AddTab = AddTab;
            EAxisExcelTemplateCtrl.ePage.Masters.RemoveTab = RemoveTab;
            EAxisExcelTemplateCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            EAxisExcelTemplateCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
         }

        function CreateNewTab() {
            var _isExist = EAxisExcelTemplateCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                EAxisExcelTemplateCtrl.ePage.Masters.IsNewTabClicked = true;

                EAxisExcelTemplateCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            EAxisExcelTemplateCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = EAxisExcelTemplateCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.SourceEntityRefKey)
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
                EAxisExcelTemplateCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.SourceEntityRefKey]: {
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

                    excelTemplateConfig.GetTabDetails(_item, isNew).then(function (response) {
                        EAxisExcelTemplateCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            EAxisExcelTemplateCtrl.ePage.Masters.activeTabIndex = EAxisExcelTemplateCtrl.ePage.Masters.TabList.length;
                            EAxisExcelTemplateCtrl.ePage.Masters.IsTabClick = false;

                            EAxisExcelTemplateCtrl.ePage.Masters.CurrentActiveTab($item.entity.SourceEntityRefKey);
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

                    EAxisExcelTemplateCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        EAxisExcelTemplateCtrl.ePage.Masters.activeTabIndex = EAxisExcelTemplateCtrl.ePage.Masters.TabList.length;
                        EAxisExcelTemplateCtrl.ePage.Masters.IsTabClick = false;

                        EAxisExcelTemplateCtrl.ePage.Masters.CurrentActiveTab("New");
                        EAxisExcelTemplateCtrl.ePage.Masters.IsNewTabClicked = false;
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

            EAxisExcelTemplateCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            EAxisExcelTemplateCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                EAxisExcelTemplateCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();