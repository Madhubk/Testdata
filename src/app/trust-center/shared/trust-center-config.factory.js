(function () {
    "use strict";

    angular
        .module("Application")
        .factory('trustCenterConfig', TrustCenterConfig);

    TrustCenterConfig.$inject = [];

    function TrustCenterConfig() {
        var exports = {
            "Entities": {
                "DashboardPageLink": {
                    "System": [{
                        Title: "SYSTEM CONFIGURATIONS",
                        List: [{
                            Code: "Component",
                            Description: "Component",
                            Icon: "fa fa-puzzle-piece",
                            Link: "TC/component",
                            Color: "#33a0d3"
                        }, {
                            Code: "MenuGroup",
                            Description: "Groups (Party Types)",
                            Icon: "glyphicons glyphicons-group",
                            Link: "TC/menu-group",
                            Color: "#f3a175"
                        }, {
                            Code: "Menu",
                            Description: "Menu",
                            Icon: "fa fa-bars",
                            Link: "TC/menu",
                            Color: "#fbad19"
                        }, {
                            Code: "AppSettingsFilters",
                            Description: "Filters",
                            Icon: "glyphicons glyphicons-filter",
                            Link: "TC/application-settings",
                            Color: "#01532f",
                            AdditionalData: "QUERY",
                            Type: "EntitySource"
                        }, {
                            Code: "AppSettingsEntityResult",
                            Description: "Entity Results",
                            Icon: "fa fa-th-large",
                            Link: "TC/application-settings",
                            Color: "#01532f",
                            AdditionalData: "ENTITYRESULT",
                            Type: "EntitySource"
                        }, {
                            Code: "AppSettingsEmailSettings",
                            Description: "Email Settings",
                            Icon: "fa glyphicons glyphicons-message-in",
                            Link: "TC/application-settings",
                            Color: "#ff3d00",
                            AdditionalData: "EMAILSETTINGS",
                            Type: "EntitySource"
                        }, {
                            Code: "AppSettingsSysConfig",
                            Description: "Configuration",
                            Icon: "glyphicons glyphicons-settings",
                            Link: "TC/application-settings",
                            Color: "#3b210e",
                            AdditionalData: "CONFIGURATION",
                            Type: "EntitySource"
                        }, {
                            Code: "AppSettingsExcelConfig",
                            Description: "Excel Template Configuration (Report)",
                            Icon: "fa fa-file-excel-o",
                            Link: "TC/application-settings",
                            Color: "#3b210e",
                            AdditionalData: "EXCELCONFIG",
                            Type: "EntitySource"
                        }, {
                            Code: "Session",
                            Description: "Session",
                            Icon: "glyphicons glyphicons-tick",
                            Link: "TC/session",
                            Color: "#00555c"
                        }]
                    }, {
                        Title: "USER SETTING",
                        List: [{
                            Code: "UserList",
                            Description: "User",
                            Icon: "fa fa-user",
                            Link: "TC/user-list",
                            Color: "#dd4b39"
                        }]
                    }],
                    "Configuration": [{
                        Title: "CONFIGURATIONS",
                        List: [{
                            Code: "ManageStaticListings",
                            Description: "Manage Static Listings",
                            Icon: "fa fa-list",
                            Link: "TC/manage-static-listing",
                            Color: "#1da1f2"
                        }, {
                            Code: "Filter",
                            Description: "Filter",
                            Icon: "glyphicons glyphicons-filter",
                            Link: "TC/filter-group",
                            Color: "#405de6"
                        }, {
                            Code: "Language",
                            Description: "Language",
                            Icon: "fa fa-language",
                            Link: "TC/language",
                            Color: "#ff8800"
                        }, {
                            Code: "Validation",
                            Description: "Validation",
                            Icon: "fa fa-file-text",
                            Link: "TC/validation",
                            Color: "#45668e"
                        },{
                            Code: "EventMaster",
                            Description: "Event Master",
                            Icon: "fa fa-calendar",
                            Link: "dynamic-list-view/vwEventMaster",
                            Color: "#a1755c"
                        },{
                            Code: "EventGroup",
                            Description: "Event Group",
                            Icon: "fa fa-object-group",
                            Link: "dynamic-list-view/EventGroup",
                            Color: "#de1829"
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
                            Code: "ProcessNew",
                            Description: "Process",
                            Icon: "fa fa-cogs",
                            Link: "TC/process",
                            Color: "#405de6"
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
                    }, {
                        Title: "DATA EXTRACTION",
                        List: [{
                            Code: "Audit",
                            Description: "Audit",
                            Icon: "fa fa-file-text",
                            Link: "TC/data-config",
                            Color: "#bd081c",
                            AdditionalData: "Audit",
                            BreadcrumbTitle: "Audit",
                            Type: "ConfigType"
                        }, {
                            Code: "Event",
                            Description: "Event",
                            Icon: "fa fa-calendar",
                            Link: "TC/data-config",
                            Color: "#de1829",
                            AdditionalData: "Event",
                            BreadcrumbTitle: "Event",
                            Type: "ConfigType"
                        }, {
                            Code: "Integration",
                            Description: "Integration",
                            Icon: "fa fa-compress",
                            Link: "TC/data-config",
                            Color: "#05b085",
                            AdditionalData: "Integration",
                            BreadcrumbTitle: "Integration",
                            Type: "ConfigType"
                        }, {
                            Code: "FullTextSearch",
                            Description: "Full Text Search",
                            Icon: "fa fa-font",
                            Link: "TC/data-config",
                            Color: "#05b085",
                            AdditionalData: "FullTextSearch",
                            BreadcrumbTitle: "Full Text Search",
                            Type: "ConfigType"
                        },  {
                            Code: "SharedEntity",
                            Description: "Shared Entities",
                            Icon: "fa fa-share-alt",
                            Link: "TC/data-config",
                            Color: "#05b085",
                            AdditionalData: "SharedEntity",
                            BreadcrumbTitle: "Shared Entities",
                            Type: "ConfigType"
                        }]
                    }]
                },
                "TypeMaster": {
                    "Filter": {
                        "TypeCode": "UICTRL"
                    },
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TypeMaster/FindAll",
                            "FilterID": "DYN_TYP"
                        }
                    }
                },
                "DataEntryFields": {
                    "Data": {},
                    "Filter": {},
                    "Meta": {
                        "DataEntryFieldMapping_PK": "",
                        "DataEntry_FK": "",
                        "Field_FK": "",
                        "Label": "",
                        "Sequence": "",
                        "IsActive": true,
                        "Type": "",
                        "IsKey": false
                    },
                    "API": {
                        "GetByID": {
                            "IsAPI": true,
                            "Url": "DataEntryFieldMapping/GetById/",
                            "FilterID": ""
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataEntryFieldMapping/FindAll",
                            "FilterID": "DYN_DAT"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "DataEntryFieldMapping/Insert",
                            "FilterID": ""
                        },
                        "Update": {
                            "IsAPI": true,
                            "Url": "DataEntryFieldMapping/Update",
                            "FilterID": ""
                        },
                        "Delete": {
                            "IsAPI": true,
                            "Url": "DataEntryFieldMapping/Delete/",
                            "FilterID": ""
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataEntryFieldMapping/Upsert",
                            "FilterID": ""
                        }
                    }
                },
                "EntityMaster": {
                    "Meta": {
                        "ListSource": []
                    },
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EntityMaster/FindAll",
                            "FilterID": "DYN_ENT"
                        }
                    }
                },
                "FieldMaster": {
                    "Data": {},
                    "Filter": [],
                    "Meta": [],
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "FieldMaster/FindAll",
                            "FilterID": "DYN_FIE"
                        }
                    }
                },
                "DataEntryDetails": {
                    "Meta": {
                        "DataEntry_PK": "",
                        "DataEntryName": "",
                        "IsActive": true,
                        "FilterID": "",
                        "FilterAPI": "",
                        "Title": "",
                        "DisplayMode": "",
                        "IsModified": true,
                        "IsDelete": false,
                        "Group": null,
                        "Type": null,
                        "FindConfig": null,
                        "DataEntryFieldMapping": [],
                        "GridConfig": {
                            "Header": [],
                            "SortObjects": []
                        },
                        "OtherConfig": {
                            "Pagination": {},
                            "CSS": {},
                            "SortColumn": {}
                        },
                        "LookupConfig": {}
                    },
                    "API": {
                        "GetById": {
                            "IsAPI": true,
                            "Url": "DataEntryDetails/GetById/",
                            "FilterID": ""
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataEntryDetails/Upsert",
                            "FilterID": ""
                        }
                    }
                },
                "OrgEmployeeAssignments": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "OrgName",
                            "displayName": "Org Name"
                        }, {
                            "field": "CompanyName",
                            "displayName": "Company Name"
                        }, {
                            "field": "DepartmentName",
                            "displayName": "Department Name"
                        }, {
                            "field": "BranchName",
                            "displayName": "Branch Name"
                        }, {
                            "field": "RoleName",
                            "displayName": "Role Name"
                        }],
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Company List",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='padding-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "ProcessInstanceWorkItem": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "PSI_InstanceNo",
                            "displayName": "Instance No",
                            "width": 150
                        }, {
                            "field": "WorkItemNo",
                            "displayName": "WorkItem No",
                            "width": 150
                        }, {
                            "field": "WSI_StepNo",
                            "displayName": "Step No",
                            "width": 150
                        }, {
                            "field": "WSI_StepName",
                            "displayName": "Step Name",
                            "width": 150
                        }, {
                            "field": "Status",
                            "displayName": "Status",
                            "width": 150
                        }, {
                            "field": "Execute",
                            "displayName": "Execute",
                            "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"link\")' data-ng-if='x.Status == \"AVAILABLE\"'>Complete</a>",
                            "width": 150
                        }],
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "WorkItem List",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='padding-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "SecSessionActivity": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "ActionType",
                            "displayName": "Action Type"
                        }, {
                            "field": "ActInfo",
                            "displayName": "Act Info"
                        }],
                        "GridConfig": {
                            "isHeader": true,
                            "isSearch": true,
                            "title": "Session Activity",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "NLog": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "MachineName",
                            "displayName": "Machine Name",
                            "width": 150
                        }, {
                            "field": "SiteName",
                            "displayName": "Site Name",
                            "width": 150
                        }, {
                            "field": "Logged",
                            "displayName": "Logged",
                            "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            "width": 150
                        }, {
                            "field": "Level",
                            "displayName": "Level",
                            "width": 150
                        }, {
                            "field": "UserName",
                            "displayName": "UserName",
                            "width": 150
                        }, {
                            "field": "Message",
                            "displayName": "Message",
                            "width": 150
                        }, {
                            "field": "Logger",
                            "displayName": "Logger",
                            "width": 150
                        }, {
                            "field": "Properties",
                            "displayName": "Properties",
                            "width": 150
                        }, {
                            "field": "ServerName",
                            "displayName": "ServerName",
                            "width": 150
                        }, {
                            "field": "Url",
                            "displayName": "Url",
                            "width": 200
                        }, {
                            "field": "ServerAddress",
                            "displayName": "ServerAddress",
                            "width": 150
                        }, {
                            "field": "Callsite",
                            "displayName": "Callsite",
                            "width": 250
                        }, {
                            "field": "Exception",
                            "displayName": "Exception",
                            "width": 150
                        }, {
                            "field": "Type",
                            "displayName": "Type",
                            "width": 150
                        }, {
                            "field": "Input",
                            "displayName": "Input",
                            "width": 150
                        }, {
                            "field": "ErrorId",
                            "displayName": "ErrorId",
                            "cellTemplate": "<a class='text-single-line' href='javascript:void(0);'  ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"link\")'>{{x[y.field]}}</a>",
                            "width": 150
                        }, {
                            "field": "Userid",
                            "displayName": "Userid",
                            "width": 150
                        }],
                        "GridConfig": {
                            "isHeader": true,
                            "isSearch": true,
                            "title": "NLog",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "ElmahError": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "ErrorId",
                            "displayName": "Error Id",
                            "width": 150
                        }, {
                            "field": "Application",
                            "displayName": "Application",
                            "width": 150
                        }, {
                            "field": "Host",
                            "displayName": "Host",
                            "width": 150
                        }, {
                            "field": "Type",
                            "displayName": "Type",
                            "width": 150
                        }, {
                            "field": "Source",
                            "displayName": "Source",
                            "width": 150
                        }, {
                            "field": "Message",
                            "displayName": "Message",
                            "width": 150
                        }, {
                            "field": "User",
                            "displayName": "User",
                            "width": 150
                        }, {
                            "field": "StatusCode",
                            "displayName": "Status Code",
                            "width": 150
                        }, {
                            "field": "TimeUtc",
                            "displayName": "Time Utc",
                            "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy h:mm:ss a'}}</div>",
                            "width": 150
                        }, {
                            "field": "Sequence",
                            "displayName": "Sequence",
                            "width": 150
                        }, {
                            "field": "AllXml",
                            "displayName": "AllXml",
                            "width": 150
                        }],
                        "GridConfig": {
                            "isHeader": true,
                            "isSearch": true,
                            "title": "Elmah Error",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
