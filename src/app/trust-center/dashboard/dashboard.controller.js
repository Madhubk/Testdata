(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCDashboardController", TCDashboardController);

    TCDashboardController.$inject = ["$location", "authService", "helperService", "trustCenterConfig"];

    function TCDashboardController($location, authService, helperService, trustCenterConfig) {
        /* jshint validthis: true */
        var TCDashboardCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCDashboardCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCDashboardCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCDashboardCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitDashboard();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // region Breadcrumb
        function InitBreadcrumb() {
            TCDashboardCtrl.ePage.Masters.Breadcrumb = {};
            TCDashboardCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCDashboardCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
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
        // endregion

        // region Application
        function InitApplication() {
            TCDashboardCtrl.ePage.Masters.Application = {};
            TCDashboardCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCDashboardCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!TCDashboardCtrl.ePage.Masters.Application.ActiveApplication) {
                TCDashboardCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCDashboardCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCDashboardCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCDashboardCtrl.ePage.Masters.QueryString.AppName
                };
            }
        }
        // endregion

        // region Dashboard
        function InitDashboard() {
            TCDashboardCtrl.ePage.Masters.Dashboard = {};
            TCDashboardCtrl.ePage.Masters.Dashboard.OnMenuClick = OnMenuClick;

            GetConfigurationPageList();
        }

        function GetConfigurationPageList() {
            TCDashboardCtrl.ePage.Masters.DashboardMenuList = {
                "Column1": [{
                    Title: "SYSTEM",
                    List: [{
                        Code: "Parties",
                        Description: "Parties",
                        Icon: "glyphicons glyphicons-group",
                        Link: "TC/menu-group",
                        Color: "#33a0d3",
                        AdditionalData: {
                            BreadcrumbTitle: "Parties",
                            Input: {
                                Code: "Parties"
                            }
                        },
                        IsDisable : (authService.getUserInfo().TenantCode == "TBASE") ? false : true
                    }, {
                        Code: "BPMGroup",
                        Description: "BPM Groups",
                        Icon: "glyphicons glyphicons-group",
                        Link: "TC/menu-group",
                        Color: "#f3a175",
                        AdditionalData: {
                            BreadcrumbTitle: "BPM Groups",
                            Input: {
                                Code: "BPMGroups"
                            }
                        }
                    }, {
                        Code: "UserList",
                        Description: "Users",
                        Icon: "fa fa-user",
                        Link: "TC/user-list",
                        Color: "#dd4b39"
                    }, {
                        Code: "Session",
                        Description: "Session",
                        Icon: "glyphicons glyphicons-tick",
                        Link: "TC/session",
                        Color: "#00555c"
                    }]
                }, {
                    Title: "COMPONENTS",
                    List: [{
                        Code: "Event",
                        Description: "Event",
                        Icon: "fa fa-calendar",
                        Link: "TC/event",
                        Color: "#a1755c"
                    }, {
                        Code: "Email",
                        Description: "Email",
                        Icon: "fa fa-envelope",
                        Link: "TC/email",
                        Color: "#FF0000"
                    }, {
                        Code: "Comments",
                        Description: "Comments",
                        Icon: "fa fa-comment",
                        Link: "TC/comments",
                        Color: " #87CEEB"
                    }, {
                        Code: "Files",
                        Description: "Files (Document)",
                        Icon: "fa fa-file",
                        Link: "TC/document",
                        Color: "#90ee90"
                    }, {
                        Code: "Exception",
                        Description: "Exception",
                        Icon: "fa fa-exclamation-triangle",
                        Link: "TC/exception",
                        Color: "#de1829"
                    }, {
                        Code: "StandardTypelist",
                        Description: "Standard Typelist",
                        Icon: "fa fa-list-alt",
                        Link: "TC/sop-typelist",
                        Color: "#797979"
                    }]
                }],
                "Column2": [{
                    Title: "CONFIGURATION",
                    List: [{
                        Code: "HtmlComponents",
                        Description: "Html Components",
                        Icon: "fa fa-puzzle-piece",
                        Link: "TC/component",
                        Color: "#33a0d3",
                        AdditionalData: {
                            BreadcrumbTitle: "Html Components",
                            Input: {
                                Code: "NOCTRL"
                            }
                        }
                    }, {
                        Code: "ApiMethodAccess",
                        Description: "API Method Access",
                        Icon: "fa fa-puzzle-piece",
                        Link: "TC/component",
                        Color: "#33a0d3",
                        AdditionalData: {
                            BreadcrumbTitle: "API Method Access",
                            Input: {
                                Code: "API"
                            }
                        }
                    }, {
                        Code: "Validation",
                        Description: "Validation",
                        Icon: "fa fa-file-text",
                        Link: "TC/validation",
                        Color: "#45668e"
                    }, {
                        Code: "Languages",
                        Description: "Languages",
                        Icon: "fa fa-language",
                        Link: "TC/language",
                        Color: "#ff8800"
                    }, {
                        Code: "SystemFilters",
                        Description: "System Filters (Query)",
                        Icon: "glyphicons glyphicons-filter",
                        Link: "TC/application-settings",
                        Color: "#01532f",
                        AdditionalData: {
                            BreadcrumbTitle: "System Filters (Query)",
                            Input: {
                                Code: "QUERY"
                            }
                        }
                    }, {
                        Code: "ManageStaticListing",
                        Description: "Manage Static Listing",
                        Icon: "fa fa-list",
                        Link: "TC/manage-static-listing",
                        Color: "#1da1f2"
                    }, {
                        Code: "DynamicExpressionFilter",
                        Description: "Dynamic Expression Filter",
                        Icon: "glyphicons glyphicons-filter",
                        Link: "TC/filter-group",
                        Color: "#405de6"
                    }, {
                        Code: "AppSettingsExcelConfig",
                        Description: "Excel Template Configuration (Report)",
                        Icon: "fa fa-file-excel-o",
                        Link: "TC/application-settings",
                        Color: "#3b210e",
                        AdditionalData: {
                            BreadcrumbTitle: "Excel Template Configuration (Report)",
                            Input: {
                                Code: "EXCELCONFIG"
                            }
                        }
                    }, {
                        Code: "AppSettingsSysConfig",
                        Description: "Configuration",
                        Icon: "glyphicons glyphicons-settings",
                        Link: "TC/application-settings",
                        Color: "#3b210e",
                        AdditionalData: {
                            BreadcrumbTitle: "Configuration",
                            Input: {
                                Code: "CONFIGURATION"
                            }
                        }
                    }, {
                        Code: "AppSettingsEmailSettings",
                        Description: "Email Settings",
                        Icon: "fa glyphicons glyphicons-message-in",
                        Link: "TC/application-settings",
                        Color: "#ff3d00",
                        AdditionalData: {
                            BreadcrumbTitle: "Email Settings",
                            Input: {
                                Code: "EMAILSETTINGS"
                            }
                        }
                    }, {
                        Code: "AppSettingsEntityResult",
                        Description: "Entity Results",
                        Icon: "fa fa-th-large",
                        Link: "TC/application-settings",
                        Color: "#01532f",
                        AdditionalData: {
                            BreadcrumbTitle: "Entity Results",
                            Input: {
                                Code: "ENTITYRESULT"
                            }
                        }
                    }, {
                        Code: "AppSettingsBulkQuery",
                        Description: "Bulk Query",
                        Icon: "fa fa-th-large",
                        Link: "TC/application-settings",
                        Color: "#01532f",
                        AdditionalData: {
                            BreadcrumbTitle: "Bulk Query",
                            Input: {
                                Code: "BULKQUERYOUTPUT"
                            }
                        }
                    }]
                }],
                "Column3": [{
                    Title: "MENU",
                    List: [{
                        Code: "Menu",
                        Description: "Menu",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Menu",
                            Input: {
                                Code: "Menu"
                            }
                        }
                    }, {
                        Code: "Admin",
                        Description: "Admin",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Admin",
                            Input: {
                                Code: "Admin"
                            }
                        }
                    }, {
                        Code: "TabMenu",
                        Description: "Tab Menu",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Tab Menu",
                            Input: {
                                Code: "TabMenu"
                            }
                        }
                    }, {
                        Code: "Shortcut",
                        Description: "Shortcut",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Shortcut",
                            Input: {
                                Code: "Shortcut"
                            }
                        }
                    }, {
                        Code: "InternalUrl",
                        Description: "Internal Url",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Internal Url",
                            Input: {
                                Code: "InternalUrl"
                            }
                        }
                    }, {
                        Code: "Report",
                        Description: "Report",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Report",
                            Input: {
                                Code: "Report"
                            }
                        }
                    }, {
                        Code: "Document",
                        Description: "Document",
                        Icon: "fa fa-bars",
                        Link: "TC/menu",
                        Color: "#fbad19",
                        AdditionalData: {
                            BreadcrumbTitle: "Document",
                            Input: {
                                Code: "Document"
                            }
                        }
                    }]
                }, {
                    Title: "DYNAMIC PAGES",
                    List: [{
                        Code: "Page",
                        Description: "Page",
                        Icon: "fa fa-file",
                        Link: "TC/page",
                        Color: "#f94877"
                    }, {
                        Code: "RelatedLookup",
                        Description: "Related Lookup",
                        Icon: "fa fa-cog",
                        Link: "TC/related-lookup",
                        Color: "#fbad19"
                    }, {
                        Code: "ManageParameters",
                        Description: "Manage Parameters",
                        Icon: "fa fa-tasks",
                        Link: "TC/manage-parameters",
                        Color: "#00555c"
                    }, {
                        Code: "ShareTablesAndFields",
                        Description: "Share Tables and Fields",
                        Icon: "fa fa-table",
                        Link: "TC/share-table",
                        Color: "#a1755c"
                    }]
                }],
                "Column4": [{
                    Title: "DATA EXTRACTION",
                    List: [{
                        Code: "Audit",
                        Description: "Audit",
                        Icon: "fa fa-file-text",
                        Link: "TC/data-extraction/audit",
                        Color: "#bd081c"
                    }, {
                        Code: "Event",
                        Description: "Event",
                        Icon: "fa fa-calendar",
                        Link: "/TC/data-extraction/event",
                        Color: "#de1829"
                    }, {
                        Code: "Integration",
                        Description: "Integration",
                        Icon: "fa fa-compress",
                        Link: "/TC/data-extraction/integration",
                        Color: "#05b085"
                    }, {
                        Code: "FullTextSearch",
                        Description: "Full Text Search",
                        Icon: "fa fa-font",
                        Link: "/TC/data-extraction/full-text-search",
                        Color: "#05b085"
                    }, {
                        Code: "ReportFields",
                        Description: "Report Fields",
                        Icon: "fa fa-share-alt",
                        Link: "/TC/data-extraction/report-fields",
                        Color: "#05b085"
                    }, {
                        Code: "EntityScore",
                        Description: "Entity Score",
                        Icon: "fa fa-share-alt",
                        Link: "/TC/data-extraction/entity-score",
                        Color: "#05b085"
                    }]
                }, {
                    Title: "WORK FLOW",
                    List: [{
                        Code: "Process",
                        Description: "Process",
                        Icon: "fa fa-cogs",
                        Link: "TC/process",
                        Color: "#405de6"
                    }, {
                        Code: "ActivityFormConfiguration",
                        Description: "Activity Form Configuration",
                        Icon: "fa fa-cog",
                        Link: "TC/ebpm-types",
                        Color: "#87ceeb",
                        AdditionalData: {
                            BreadcrumbTitle: "Activity Form",
                            Input: {
                                MappingCode: "ACTIVITY_CONFIG"
                            }
                        }
                    }, {
                        Code: "ProcessTopics",
                        Description: "Process Topics",
                        Icon: "fa fa-cog",
                        Link: "TC/ebpm-types",
                        Color: "#87ceeb",
                        AdditionalData: {
                            BreadcrumbTitle: "Process Topics",
                            Input: {
                                MappingCode: "PROCESS_TOPIC"
                            }
                        }
                    }, {
                        Code: "DelayReason",
                        Description: "Delay Reason",
                        Icon: "fa fa-cog",
                        Link: "TC/ebpm-types",
                        Color: "#87ceeb",
                        AdditionalData: {
                            BreadcrumbTitle: "Delay Reason",
                            Input: {
                                MappingCode: "DELAY_REASON"
                            }
                        }
                    }, {
                        Code: "Checklist",
                        Description: "Checklist",
                        Icon: "fa fa-cog",
                        Link: "TC/ebpm-types",
                        Color: "#87ceeb",
                        AdditionalData: {
                            BreadcrumbTitle: "Checklist",
                            Input: {
                                MappingCode: "CHECKLIST"
                            }
                        }
                    }]
                }]
            };
        }

        function OnMenuClick($item) {
            if (TCDashboardCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppCode": TCDashboardCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": TCDashboardCtrl.ePage.Masters.Application.ActiveApplication.AppName,
                    "AppPk": TCDashboardCtrl.ePage.Masters.Application.ActiveApplication.PK
                };
            } else {
                var _queryString = TCDashboardCtrl.ePage.Masters.QueryString;
            }

            _queryString.AdditionalData = $item.AdditionalData;

            if ($item.Link.indexOf("TC/application-settings") !== -1) {
                _queryString.Type = "Type1";
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }
        // endregion

        Init();
    }
})();
