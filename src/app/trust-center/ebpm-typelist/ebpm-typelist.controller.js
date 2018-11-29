(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEBPMTypelistController", TCEBPMTypelistController);

        TCEBPMTypelistController.$inject = ["$timeout", "$location", "authService", "helperService", "ebpmTypelistConfig", "toastr"];

    function TCEBPMTypelistController($timeout, $location, authService, helperService, ebpmTypelistConfig, toastr) {
        /* jshint validthis: true */
        var TCEBPMTypelistCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCEBPMTypelistCtrl.ePage = {
                "Title": "",
                "Prefix": "EBPM_Typelist",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ebpmTypelistConfig.Entities
            };

            TCEBPMTypelistCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCEBPMTypelistCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCEBPMTypelistCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitEbpmTypelist();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCEBPMTypelistCtrl.ePage.Masters.Breadcrumb = {};
            TCEBPMTypelistCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCEBPMTypelistCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCEBPMTypelistCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCEBPMTypelistCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCEBPMTypelistCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "EbpmTypelist",
                Description: "EbpmTypelist",
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

        function InitEbpmTypelist() {
            TCEBPMTypelistCtrl.ePage.Masters.dataentryName = "SOPTypelist";
            ebpmTypelistConfig.TabList = [];
            TCEBPMTypelistCtrl.ePage.Masters.TabList = ebpmTypelistConfig.TabList;
            TCEBPMTypelistCtrl.ePage.Masters.activeTabIndex = 0;
            TCEBPMTypelistCtrl.ePage.Masters.IsTabClick = false;
            TCEBPMTypelistCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCEBPMTypelistCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCEBPMTypelistCtrl.ePage.Masters.AddTab = AddTab;
            TCEBPMTypelistCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCEBPMTypelistCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCEBPMTypelistCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (TCEBPMTypelistCtrl.ePage.Masters.QueryString.EBPMTypelistInfo) {
                if (TCEBPMTypelistCtrl.ePage.Masters.QueryString.EBPMTypelistInfo.PK) {
                    var _ebpmtypelistInfo = {
                        entity: TCEBPMTypelistCtrl.ePage.Masters.QueryString.EBPMTypelistInfo
                    };
                    AddTab(_ebpmtypelistInfo, false);
                }
            }
        }

        function CreateNewTab() {
            var _isExist = TCEBPMTypelistCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCEBPMTypelistCtrl.ePage.Masters.IsNewTabClicked = true;

                TCEBPMTypelistCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCEBPMTypelistCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCEBPMTypelistCtrl.ePage.Masters.TabList.some(function (value) {
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
                TCEBPMTypelistCtrl.ePage.Masters.IsTabClick = true;
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

                    ebpmTypelistConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCEBPMTypelistCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCEBPMTypelistCtrl.ePage.Masters.activeTabIndex = TCEBPMTypelistCtrl.ePage.Masters.TabList.length;
                            TCEBPMTypelistCtrl.ePage.Masters.IsTabClick = false;

                            TCEBPMTypelistCtrl.ePage.Masters.CurrentActiveTab($item.entity.Code);
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

                    TCEBPMTypelistCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCEBPMTypelistCtrl.ePage.Masters.activeTabIndex = TCEBPMTypelistCtrl.ePage.Masters.TabList.length;
                        TCEBPMTypelistCtrl.ePage.Masters.IsTabClick = false;

                        TCEBPMTypelistCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCEBPMTypelistCtrl.ePage.Masters.IsNewTabClicked = false;
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

            TCEBPMTypelistCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCEBPMTypelistCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCEBPMTypelistCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
