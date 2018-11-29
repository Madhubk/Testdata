(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCSOPTypelistController", TCSOPTypelistController);

        TCSOPTypelistController.$inject = ["$timeout", "$location", "authService", "helperService", "sopTypelistConfig", "toastr"];

    function TCSOPTypelistController($timeout, $location, authService, helperService, sopTypelistConfig, toastr) {
        /* jshint validthis: true */
        var TCSOPTypelistCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCSOPTypelistCtrl.ePage = {
                "Title": "",
                "Prefix": "SOP_Typelist",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": sopTypelistConfig.Entities
            };

            TCSOPTypelistCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCSOPTypelistCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCSOPTypelistCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitSOPTypelist();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCSOPTypelistCtrl.ePage.Masters.Breadcrumb = {};
            TCSOPTypelistCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCSOPTypelistCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCSOPTypelistCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCSOPTypelistCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCSOPTypelistCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "SOPTypelist",
                Description: "SOP Typelist",
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        function InitSOPTypelist() {
            TCSOPTypelistCtrl.ePage.Masters.dataentryName = "SOPTypelist";
            sopTypelistConfig.TabList = [];
            TCSOPTypelistCtrl.ePage.Masters.TabList = sopTypelistConfig.TabList;
            TCSOPTypelistCtrl.ePage.Masters.activeTabIndex = 0;
            TCSOPTypelistCtrl.ePage.Masters.IsTabClick = false;
            TCSOPTypelistCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCSOPTypelistCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCSOPTypelistCtrl.ePage.Masters.AddTab = AddTab;
            TCSOPTypelistCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCSOPTypelistCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCSOPTypelistCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (TCSOPTypelistCtrl.ePage.Masters.QueryString.SOPTypelistInfo) {
                if (TCSOPTypelistCtrl.ePage.Masters.QueryString.SOPTypelistInfo.PK) {
                    var _soptypelistInfo = {
                        entity: TCSOPTypelistCtrl.ePage.Masters.QueryString.SOPTypelistInfo
                    };
                    AddTab(_soptypelistInfo, false);
                }
            }
        }

        function CreateNewTab() {
            var _isExist = TCSOPTypelistCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCSOPTypelistCtrl.ePage.Masters.IsNewTabClicked = true;

                TCSOPTypelistCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCSOPTypelistCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCSOPTypelistCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.Code)
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
                TCSOPTypelistCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.Code]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: $item.entity
                                    }
                                }
                            }
                        },
                        label: $item.entity.Code,
                        code: $item.entity.Code,
                        isNew: isNew
                    };

                    sopTypelistConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCSOPTypelistCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCSOPTypelistCtrl.ePage.Masters.activeTabIndex = TCSOPTypelistCtrl.ePage.Masters.TabList.length;
                            TCSOPTypelistCtrl.ePage.Masters.IsTabClick = false;

                            TCSOPTypelistCtrl.ePage.Masters.CurrentActiveTab($item.entity.Code);
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

                    TCSOPTypelistCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCSOPTypelistCtrl.ePage.Masters.activeTabIndex = TCSOPTypelistCtrl.ePage.Masters.TabList.length;
                        TCSOPTypelistCtrl.ePage.Masters.IsTabClick = false;

                        TCSOPTypelistCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCSOPTypelistCtrl.ePage.Masters.IsNewTabClicked = false;
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

            TCSOPTypelistCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCSOPTypelistCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCSOPTypelistCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
