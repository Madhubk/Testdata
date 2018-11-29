(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EventController", EventController);

    EventController.$inject = ["$timeout", "$location", "authService", "helperService", "eventConfig", "toastr"];

    function EventController($timeout, $location, authService, helperService, eventConfig, toastr) {
        /* jshint validthis: true */
        var EventCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            EventCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": eventConfig.Entities
            };

            EventCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                EventCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (EventCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitEvent();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            EventCtrl.ePage.Masters.Breadcrumb = {};
            EventCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            EventCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": EventCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": EventCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": EventCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "event",
                Description: "Event",
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

        function InitEvent() {
            EventCtrl.ePage.Masters.dataentryName = "vwEventMaster";
            eventConfig.TabList = [];
            EventCtrl.ePage.Masters.TabList = eventConfig.TabList;
            EventCtrl.ePage.Masters.activeTabIndex = 0;
            EventCtrl.ePage.Masters.IsTabClick = false;
            EventCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            EventCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            EventCtrl.ePage.Masters.AddTab = AddTab;
            EventCtrl.ePage.Masters.RemoveTab = RemoveTab;
            EventCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            EventCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (EventCtrl.ePage.Masters.QueryString.EventInfo) {
                if (EventCtrl.ePage.Masters.QueryString.EventInfo.PK) {
                    var _eventInfo = {
                        entity: EventCtrl.ePage.Masters.QueryString.EventInfo
                    };
                    AddTab(_eventInfo, false);
                }
            }
        }

        function CreateNewTab() {
            var _isExist = EventCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                EventCtrl.ePage.Masters.IsNewTabClicked = true;

                EventCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            EventCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = EventCtrl.ePage.Masters.TabList.some(function (value) {
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
                EventCtrl.ePage.Masters.IsTabClick = true;
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

                    eventConfig.GetTabDetails(_item, isNew).then(function (response) {
                        EventCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            EventCtrl.ePage.Masters.activeTabIndex = EventCtrl.ePage.Masters.TabList.length;
                            EventCtrl.ePage.Masters.IsTabClick = false;

                            EventCtrl.ePage.Masters.CurrentActiveTab($item.entity.Code);
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

                    EventCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        EventCtrl.ePage.Masters.activeTabIndex = EventCtrl.ePage.Masters.TabList.length;
                        EventCtrl.ePage.Masters.IsTabClick = false;

                        EventCtrl.ePage.Masters.CurrentActiveTab("New");
                        EventCtrl.ePage.Masters.IsNewTabClicked = false;
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

            EventCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            EventCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                EventCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
