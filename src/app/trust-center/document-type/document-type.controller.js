(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCDocumentTypeController", TCDocumentTypeController);

    TCDocumentTypeController.$inject = ["$timeout", "$location", "authService", "helperService", "documentTypeConfig", "toastr"];

    function TCDocumentTypeController($timeout, $location, authService, helperService, documentTypeConfig, toastr) {
        /* jshint validthis: true */
        var TCDocumentTypeCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCDocumentTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "DocumentType",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": documentTypeConfig.Entities
            };

            TCDocumentTypeCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCDocumentTypeCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCDocumentTypeCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitDocumentType();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCDocumentTypeCtrl.ePage.Masters.Breadcrumb = {};
            TCDocumentTypeCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCDocumentTypeCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCDocumentTypeCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCDocumentTypeCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCDocumentTypeCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "document",
                Description: "Document",
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

        function InitDocumentType() {
            TCDocumentTypeCtrl.ePage.Masters.dataentryName = "MstDocType";
            documentTypeConfig.TabList = [];
            TCDocumentTypeCtrl.ePage.Masters.TabList = documentTypeConfig.TabList;
            TCDocumentTypeCtrl.ePage.Masters.activeTabIndex = 0;
            TCDocumentTypeCtrl.ePage.Masters.IsTabClick = false;
            TCDocumentTypeCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCDocumentTypeCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCDocumentTypeCtrl.ePage.Masters.AddTab = AddTab;
            TCDocumentTypeCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCDocumentTypeCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCDocumentTypeCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function CreateNewTab() {
            var _isExist = TCDocumentTypeCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCDocumentTypeCtrl.ePage.Masters.IsNewTabClicked = true;

                TCDocumentTypeCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCDocumentTypeCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCDocumentTypeCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.DocType)
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
                TCDocumentTypeCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.DocType]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: $item.entity
                                    }
                                }
                            }
                        },
                        label: $item.entity.DocType,
                        code: $item.entity.DocType,
                        isNew: isNew
                    };

                    documentTypeConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCDocumentTypeCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCDocumentTypeCtrl.ePage.Masters.activeTabIndex = TCDocumentTypeCtrl.ePage.Masters.TabList.length;
                            TCDocumentTypeCtrl.ePage.Masters.IsTabClick = false;

                            TCDocumentTypeCtrl.ePage.Masters.CurrentActiveTab($item.entity.DocType);
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

                    TCDocumentTypeCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCDocumentTypeCtrl.ePage.Masters.activeTabIndex = TCDocumentTypeCtrl.ePage.Masters.TabList.length;
                        TCDocumentTypeCtrl.ePage.Masters.IsTabClick = false;

                        TCDocumentTypeCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCDocumentTypeCtrl.ePage.Masters.IsNewTabClicked = false;
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

            TCDocumentTypeCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCDocumentTypeCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCDocumentTypeCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
