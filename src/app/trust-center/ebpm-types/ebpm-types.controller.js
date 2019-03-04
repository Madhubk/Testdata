(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEBPMTypesController", TCEBPMTypesController);

    TCEBPMTypesController.$inject = ["$timeout", "$location", "authService", "helperService", "ebpmTypesConfig", "toastr"];

    function TCEBPMTypesController($timeout, $location, authService, helperService, ebpmTypesConfig, toastr) {
        /* jshint validthis: true */
        var TCEBPMTypesCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCEBPMTypesCtrl.ePage = {
                "Title": "",
                "Prefix": "Module_Settings",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ebpmTypesConfig.Entities
            };

            TCEBPMTypesCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCEBPMTypesCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCEBPMTypesCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitEBPMTypeslist();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCEBPMTypesCtrl.ePage.Masters.Breadcrumb = {};
            TCEBPMTypesCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TCEBPMTypesCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TCEBPMTypesCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle + ")";
            }

            TCEBPMTypesCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCEBPMTypesCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCEBPMTypesCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCEBPMTypesCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "EBPMTypes",
                Description: "EBPM Types" + _breadcrumbTitle,
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

        function InitEBPMTypeslist() {
            TCEBPMTypesCtrl.ePage.Masters.BaseFilter = {
                "MappingCode": TCEBPMTypesCtrl.ePage.Masters.QueryString.AdditionalData.Input.MappingCode
            }
            TCEBPMTypesCtrl.ePage.Masters.dataentryName = "EBPMCfxTypes";
           
            ebpmTypesConfig.TabList = [];
            TCEBPMTypesCtrl.ePage.Masters.TabList = ebpmTypesConfig.TabList;
            TCEBPMTypesCtrl.ePage.Masters.activeTabIndex = 0;
            TCEBPMTypesCtrl.ePage.Masters.IsTabClick = false;
            TCEBPMTypesCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCEBPMTypesCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCEBPMTypesCtrl.ePage.Masters.AddTab = AddTab;
            TCEBPMTypesCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCEBPMTypesCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCEBPMTypesCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (TCEBPMTypesCtrl.ePage.Masters.QueryString.ModuleSettingsInfo) {
                if (TCEBPMTypesCtrl.ePage.Masters.QueryString.ModuleSettingsInfo.PK) {
                    var _modulesettingsInfo = {
                        entity: TCEBPMTypesCtrl.ePage.Masters.QueryString.ModuleSettingsInfo
                    };
                    AddTab(_modulesettingsInfo, false);
                }
            }
        }

        function CreateNewTab() {
            var _isExist = TCEBPMTypesCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCEBPMTypesCtrl.ePage.Masters.IsNewTabClicked = true;

                TCEBPMTypesCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCEBPMTypesCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCEBPMTypesCtrl.ePage.Masters.TabList.some(function (value) {
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
                TCEBPMTypesCtrl.ePage.Masters.IsTabClick = true;
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

                    ebpmTypesConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCEBPMTypesCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCEBPMTypesCtrl.ePage.Masters.activeTabIndex = TCEBPMTypesCtrl.ePage.Masters.TabList.length;
                            TCEBPMTypesCtrl.ePage.Masters.IsTabClick = false;

                            TCEBPMTypesCtrl.ePage.Masters.CurrentActiveTab($item.entity.Code);
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

                    TCEBPMTypesCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCEBPMTypesCtrl.ePage.Masters.activeTabIndex = TCEBPMTypesCtrl.ePage.Masters.TabList.length;
                        TCEBPMTypesCtrl.ePage.Masters.IsTabClick = false;

                        TCEBPMTypesCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCEBPMTypesCtrl.ePage.Masters.IsNewTabClicked = false;
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

            TCEBPMTypesCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCEBPMTypesCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCEBPMTypesCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
