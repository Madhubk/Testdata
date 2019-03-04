(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EditPageController", EditPageController);

    EditPageController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "toastr", "jsonEditModal", "trustCenterConfig"];

    function EditPageController($scope, $location, authService, apiService, helperService, toastr, jsonEditModal, trustCenterConfig) {
        var EditPageCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            EditPageCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_EditPage",
                "Masters": {
                    "templates": [],
                    "Entity": {},
                    "Fields": {},
                    "selected": null,
                    "trash": false,
                    "IsProperty": false,
                    "models": {},
                    "DataEntryFieldMapping": {},
                    "saveValue": "Save"
                },
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EditPageCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                EditPageCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (EditPageCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitEditPage();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ================Breadcrumb Start================

        function InitBreadcrumb() {
            EditPageCtrl.ePage.Masters.Breadcrumb = {};
            EditPageCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (EditPageCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + EditPageCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            EditPageCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": EditPageCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": EditPageCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": EditPageCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "page",
                Description: "Page",
                Link: "TC/page",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": EditPageCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": EditPageCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": EditPageCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "edit",
                Description: "Edit" + _breadcrumbTitle,
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

        // ================Breadcrumb End================

        function InitEditPage() {
            EditPageCtrl.ePage.Masters.EditPage = {};
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails = {};
            var _NewDataEntryObj = {
                "IsActive": true,
                "IsModified": true,
                "IsDelete": false,
                "Group": EditPageCtrl.ePage.Masters.QueryString.Module,
                "Type": EditPageCtrl.ePage.Masters.QueryString.SubModule,
                "FindConfig": {},
                "DataEntryFieldMapping": [],
                "GridConfig": {
                    "Header": [],
                    "SortObjects": []
                },
                "OtherConfig": {
                    "Pagination": {},
                    "FilterConfig": {},
                    "CSS": {},
                    "SortColumn": {},
                    "GridOptions": {},
                    "ListingPageConfig": {
                        "StandardToolbar": {
                            "ToolList": {}
                        }
                    }
                },
                "LookupConfig": {}
            };

            EditPageCtrl.ePage.Masters.EditPage.Save = Save;
            EditPageCtrl.ePage.Masters.EditPage.OnSourceListChange = OnSourceListChange;

            EditPageCtrl.ePage.Masters.EditPage.SaveBtnText = "Save";
            EditPageCtrl.ePage.Masters.EditPage.IsDisableSaveBtn = false;

            InitFormDesign();
            InitSearchPage();
            InitLookupPage();
            GetSourceList();
            GetModuleList();

            if (EditPageCtrl.ePage.Masters.QueryString.Mode == "New") {
                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails = _NewDataEntryObj;
                EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = [];
                SetDefaultValues();
            } else {
                GetDataEntryDetails();
            }
        }

        function GetModuleList() {
            EditPageCtrl.ePage.Masters.ModuleList = undefined;
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.ModuleList = response.data.Response;
                }
            });
        }

        function GetDataEntryDetails() {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataEntryDetails.API.GetById.Url + EditPageCtrl.ePage.Masters.QueryString.PagePk).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (EditPageCtrl.ePage.Masters.QueryString.Mode == "Copy") {
                            _response.DataEntry_PK = undefined;
                            _response.EntityRefCode = undefined;
                            _response.EntityRefKey = undefined;
                            _response.EntitySource = undefined;
                            _response.FindConfig = {};

                            _response.DataEntryFieldMapping.map(function (value1, key1) {
                                value1.DataEntryFieldMapping_PK = undefined;
                                value1.AttributeDetails.map(function (value2, key2) {
                                    value2.FieldAttribute_PK = undefined;
                                });
                            });
                        }

                        if (!_response.Group) {
                            _response.Group = EditPageCtrl.ePage.Masters.QueryString.Module;
                        }
                        if (!_response.Type) {
                            _response.Type = EditPageCtrl.ePage.Masters.QueryString.SubModule;
                        }
                        if (!_response.EntitySource) {
                            _response.EntitySource = EditPageCtrl.ePage.Masters.QueryString.EntitySource;
                        }
                        _response.IsModified = true;
                        _response.GridConfig.SortObjects = helperService.createToArrayOfObject(_response.GridConfig.SortObjects);
                        EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List = _response.DataEntryFieldMapping;

                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails = _response;

                        if (!EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList) {
                            GetDefaultFilterList();
                        }
                    }
                }
            });
        }

        function SetDefaultValues() {
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.EntitySource = "GENERAL";

            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.GridOptions.paginationPageSize = "25";
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.GridOptions.paginationPageSizes = '[25, 50, 100]';
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.GridOptions.headerRowHeight = "30";
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.GridOptions.rowHeight = "30";
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.CSS.IsAutoListing = true;
        }

        function GetSourceList() {
            EditPageCtrl.ePage.Masters.EditPage.SourceList = ["GENERAL", "ROLE", "TENANT", "ORGANIZATION", "EXPRESSION"];
            EditPageCtrl.ePage.Masters.EditPage.SourceList = [{
                Source: "GENERAL",
                Priority: 1
            }, {
                Source: "ROLE",
                Priority: 2
            }, {
                Source: "TENANT",
                Priority: 3
            }, {
                Source: "ORGANIZATION",
                Priority: 4
            }, {
                Source: "EXPRESSION",
                Priority: 5
            }];

            OnSourceListChange(EditPageCtrl.ePage.Masters.EditPage.SourceList[0]);
        }

        function OnSourceListChange($item) {
            if ($item) {
                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Source = angular.copy($item);

                var _list = {
                    "GENERAL": GetGeneralList,
                    "ROLE": GetRoleList,
                    "TENANT": GetTenantList,
                    "ORGANIZATION": GetOrganizationList,
                    "EXPRESSION": GetExpressionList
                };

                _list[EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Source.Source]();

                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Priority =  EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Source.Priority;
            } else {
                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Source = undefined;
                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Priority =  undefined;
            }
        }

        function GetGeneralList() {
            console.log("General");
        }

        function GetRoleList() {
            console.log("Role");
        }

        function GetTenantList() {
            console.log("Tenant");
        }

        function GetOrganizationList() {
            console.log("Organization");
        }

        function GetExpressionList() {
            console.log("Expression");
        }

        function Save() {
            EditPageCtrl.ePage.Masters.EditPage.SaveBtnText = "Please Wait...";
            EditPageCtrl.ePage.Masters.EditPage.IsDisableSaveBtn = true;

            var _input = angular.copy(EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails);
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = EditPageCtrl.ePage.Masters.QueryString.AppPk;
            _input.GridConfig.SortObjects = helperService.CreateToArrayToObject(_input.GridConfig.SortObjects);

            if (_input.DataEntryFieldMapping && _input.DataEntryFieldMapping.length > 0) {
                if (_input.GridConfig.Header) {
                    _input.GridConfig.Header.map(function (value, key) {
                        if (!value.width || value.width == '' || value.width == ' ') {
                            value.width = undefined;
                        }
                    });
                }

                EditPageCtrl.ePage.Masters.EditPage.SearchPage.GridOptions.map(function (value, key) {
                    if (!_input.OtherConfig.GridOptions[value.Field] && value.Type == "boolean") {
                        _input.OtherConfig.GridOptions[value.Field] = false;
                    }
                });

                _input.strGridConfig = JSON.stringify(_input.GridConfig);
                _input.strOtherConfig = JSON.stringify(_input.OtherConfig);
                _input.strLookupConfig = JSON.stringify(_input.LookupConfig);

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryDetails.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        EditPageCtrl.ePage.Masters.QueryString.PagePk = response.data.Response[0].DataEntry_PK;
                        GetDataEntryDetails();
                        toastr.success("Saves Successfully...!");
                    } else {
                        toastr.error("Failed to Save...!")
                    }

                    EditPageCtrl.ePage.Masters.EditPage.SaveBtnText = "Save";
                    EditPageCtrl.ePage.Masters.EditPage.IsDisableSaveBtn = false;
                });
            } else {
                toastr.warning("At least one field is required...!");
            }
        }

        // ================Form Design================
        function InitFormDesign() {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign = {};
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping = {
                List: []
            };

            EditPageCtrl.ePage.Masters.EditPage.FormDesign.OnDropperItemClick = OnDropperItemClick;
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.OnAccessClick = OnAccessClick;
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.RemoveDroppedFromElement = RemoveDroppedFromElement;

            EditPageCtrl.ePage.Masters.EditPage.FormDesign.OnEntityNameChange = OnEntityNameChange;
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.OnFieldNameChange = OnFieldNameChange;

            GetTypeMasterUIControl();
            GetEntityMaster();
            GetFieldMaster();

            $scope.$watch('EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping', function (model) {
                if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List.length > 0) {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List.map(function (val, key) {
                        val.Sequence = key;
                        val.IsModified = true;
                        val.AttrIndex = GetAttrIndex(val.AttributeDetails);
                        val.AttributeDetails.map(function (v, k) {
                            v.IsModified = true;
                        });
                    });
                }

                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.DataEntryFieldMapping = EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List;
            }, true);
        }

        function GetTypeMasterUIControl() {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.ToolsList = [];
            var _filter = {
                "TypeCode": "UICTRL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (val, key) {
                            if (val.IsActive) {
                                var _obj = {
                                    "UIControl": val.TypeValue,
                                    "Desc": val.Description,
                                    "CSS": val.OtherConfig,
                                    "AttributeDetails": AttributeJsonParse(val.AttributeJson),
                                    "DataEntryFieldMapping_PK": "",
                                    "DataEntry_FK": EditPageCtrl.ePage.Masters.QueryString.PagePk,
                                    "Field_FK": "",
                                    "Entity_FK": "",
                                    "Label": "",
                                    "Sequence": "",
                                    "IsActive": true,
                                    "Type": "",
                                    "IsKey": false,
                                    "TenantCode": authService.getUserInfo().TenantCode,
                                    "SAP_FK": EditPageCtrl.ePage.Masters.QueryString.AppPk,
                                    "strOtherConfig": JSON.stringify({
                                        "D": {
                                            "CSS": {
                                                "WidthCSS": "col-xs-3"
                                            }
                                        },
                                        "S": {
                                            "CSS": {
                                                "WidthCSS": "col-xs-12"
                                            }
                                        }
                                    }),
                                    "IsModified": true,
                                    "IsDelete": false
                                };
                                EditPageCtrl.ePage.Masters.EditPage.FormDesign.ToolsList.push(_obj);
                            }
                        });
                    }
                }
            });
        }

        function GetEntityMaster() {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": trustCenterConfig.Entities.API.EntityMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntityMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList = response.data.Response;
                } else {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList = [];
                }
            });
        }

        function GetFieldMaster() {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": trustCenterConfig.Entities.API.FieldMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.FieldMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList = response.data.Response;
                } else {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList = [];
                }
            });
        }

        function OnEntityNameChange($item) {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveEntity = $item;
            MergeLabel($item, "Entity");
        }

        function OnFieldNameChange($item) {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveField = $item;
            MergeLabel($item, "Field");
        }

        function MergeLabel($item, type) {
            var _entity = "",
                _field = "";

            if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveEntity) {
                _entity = EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveEntity.EntityName;
            }
            if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveField) {
                _field = EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveField.FieldName;
            }

            var _label = _entity + "." + _field;
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Label = _label;
        }

        function OnDropperItemClick($item) {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem = $item;

            if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Entity_FK) {
                if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList.length > 0) {
                    var _indexEntity = EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList.map(function (value, key) {
                        return value.Entity_PK;
                    }).indexOf(EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Entity_FK);

                    OnEntityNameChange(EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList[_indexEntity]);
                }
            }

            if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Field_FK) {
                if (EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList.length > 0) {
                    var _indexField = EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList.map(function (value, key) {
                        return value.Field_PK;
                    }).indexOf(EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Field_FK);

                    OnFieldNameChange(EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList[_indexField]);
                }
            }
        }

        function OnAccessClick($item) {
            var _queryString = {
                "AppPk": EditPageCtrl.ePage.Masters.QueryString.AppPk,
                "AppCode": EditPageCtrl.ePage.Masters.QueryString.AppCode,
                "AppName": EditPageCtrl.ePage.Masters.QueryString.AppName
            };

            _queryString.DisplayName = $item.Label.split(".").pop();
            _queryString.ItemPk = $item.DataEntryFieldMapping_PK;
            _queryString.ItemCode = $item.Label.split(".").pop();
            _queryString.ItemName = "FIELD";
            _queryString.MappingCode = "FIELD_ORG_APP_TNT";
            _queryString.BreadcrumbTitle = "Field Organization";

            $location.path("TC/mapping-vertical/" + helperService.encryptData(_queryString));
        }

        function RemoveDroppedFromElement($item) {
            if ($item.DataEntryFieldMapping_PK == '') {
                EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List.splice($item.Sequence, 1)
            } else {
                $item.IsDelete = true;
                EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List.push($item);
                EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List.splice($item.Sequence, 1)
            }
        }

        function AttributeJsonParse(val) {
            var _tempArray = [];
            JSON.parse(val).map(function (val, key) {
                val["FieldAttribute_PK"] = "";
                val["DataEntryFieldMapping_FK"] = "";
                val["AttributeKey"] = val.Key;
                val["AttributeValue"] = val.Value;
                val["IsAPIConfig"] = false;
                val["IsActive"] = true;
                val["IsModified"] = true;
                val["IsDelete"] = false;
                val["TenantCode"] = authService.getUserInfo().TenantCode;
                val["SAP_FK"] = EditPageCtrl.ePage.Masters.QueryString.AppPk;
                delete val.Key;
                delete val.Value;
                _tempArray.push(val)
            });
            return _tempArray;
        }

        function GetAttrIndex(val) {
            var _index;
            val.map(function (val, key) {
                if (val.AttributeKey == 'LabelText') {
                    _index = key;
                }
            });
            return _index;
        }

        // ================Search Page Configuration================
        function InitSearchPage() {
            EditPageCtrl.ePage.Masters.EditPage.SearchPage = {};

            EditPageCtrl.ePage.Masters.EditPage.SearchPage.OpenJsonModal = OpenJsonModal;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.AddNewSortColumn = AddNewSortColumn;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.RemoveSortColumn = RemoveSortColumn;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.AddNewGridConfig = AddNewGridConfig;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.RemoveGridConfig = RemoveGridConfig;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.OnStandaredToolbarChange = OnStandaredToolbarChange;

            GetStandardMenuList();
            GetGridOptions();
        }

        function GetStandardMenuList() {
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.StandardMenuList = [{
                Code: "comment",
                Desc: "Comment",
            }, {
                Code: "document",
                Desc: "Document",
            }, {
                Code: "exception",
                Desc: "Exception",
            }, {
                Code: "email",
                Desc: "Email",
            },  {
                Code: "event",
                Desc: "Event",
            }, {
                Code: "audit-log",
                Desc: "Audit Log",
            }, {
                Code: "task",
                Desc: "Task",
            }, {
                Code: "keyword",
                Desc: "Keyword",
            }, {
                Code: "parties",
                Desc: "Parties",
            }, {
                Code: "checklist",
                Desc: "Checklist",
            }, {
                Code: "delay-reason",
                Desc: "Delay Reason",
            }, {
                Code: "email-group",
                Desc: "Email Group",
            }, {
                Code: "email-template-creation",
                Desc: "Email Template Creation",
            },  {
                Code: "task-flow-graph",
                Desc: "Task Flow Graph",
            }, {
                Code: "event-data",
                Desc: "Event Data",
            }];
        }

        function GetGridOptions() {
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.GridOptions = [{
                "Field": "enableColumnResizing",
                "Label": "Enable Column Resizing",
                "Type": "boolean"
            }, {
                "Field": "enableRowSelection",
                "Label": "Enable Row Selection",
                "Type": "boolean"
            }, {
                "Field": "enableRowHeaderSelection",
                "Label": "Enable Row Header Selection",
                "Type": "boolean"
            }, {
                "Field": "multiSelect",
                "Label": "MultiSelect",
                "Type": "boolean"
            }, 
            // {
            //     "Field": "enableGridMenu",
            //     "Label": "Enable Grid Menu",
            //     "Type": "boolean"
            // }, {
            //     "Field": "enableColumnMenus",
            //     "Label": "Enable Column Menus",
            //     "Type": "boolean"
            // }, {
            //     "Field": "cellTooltip",
            //     "Label": "Cell Tooltip",
            //     "Type": "boolean"
            // }, {
            //     "Field": "enableCellSelection",
            //     "Label": "Enable Cell Selection",
            //     "Type": "boolean"
            // }, {
            //     "Field": "enableCellEdit",
            //     "Label": "Enable Cell Edit",
            //     "Type": "boolean"
            // }, {
            //     "Field": "enableCellEditOnFocus",
            //     "Label": "Enable Cell Edit On Focus",
            //     "Type": "boolean"
            // }, {
            //     "Field": "enablePinning",
            //     "Label": "Enable Pinning",
            //     "Type": "boolean"
            // }, 
            {
                "Field": "enableSorting",
                "Label": "Enable Sorting",
                "Type": "boolean"
            }, 
            // {
            //     "Field": "enableFiltering",
            //     "Label": "Enable Filtering",
            //     "Type": "boolean"
            // }, 
            {
                "Field": "useExternalSorting",
                "Label": "Use External Sorting",
                "Type": "boolean"
            }, {
                "Field": "useExternalPagination",
                "Label": "Use External Pagination",
                "Type": "boolean"
            }, {
                "Field": "enablePaginationControls",
                "Label": "Enable Pagination Controls",
                "Type": "boolean"
            }, {
                "Field": "headerRowHeight",
                "Label": "Header Row Height",
                "Type": "text"
            }, {
                "Field": "rowHeight",
                "Label": "Row Height",
                "Type": "text"
            }, 
            // {
            //     "Field": "exporterMenuCsv",
            //     "Label": "Exporter Menu Csv",
            //     "Type": "boolean"
            // }, {
            //     "Field": "exporterCsvFilename",
            //     "Label": "Exporter Csv Filename",
            //     "Type": "text"
            // }, {
            //     "Field": "exporterMenuPdf",
            //     "Label": "Exporter Menu Pdf",
            //     "Type": "boolean"
            // }, {
            //     "Field": "exporterPdfFilename",
            //     "Label": "Exporter Pdf Filename",
            //     "Type": "text"
            // }, {
            //     "Field": "exporterMenuExcel",
            //     "Label": "Exporter Menu Excel",
            //     "Type": "boolean"
            // }, {
            //     "Field": "exporterExcelFilename",
            //     "Label": "Exporter Excel Filename",
            //     "Type": "text"
            // }, 
            {
                "Field": "paginationPageSizes",
                "Label": "Pagination Page Sizes",
                "Type": "textArea"
            }, {
                "Field": "paginationPageSize",
                "Label": "Pagination Page Size",
                "Type": "text"
            }, {
                "Field": "rowTemplate",
                "Label": "Row Template",
                "Type": "textArea"
            }, 
            // {
            //     "Field": "gridMenuShowHideColumns",
            //     "Label": "Grid Menu Show Hide Columns",
            //     "Type": "boolean"
            // }, 
            {
                "Field": "gridMenuCustomItems",
                "Label": "Grid Menu Custom Items",
                "Type": "textArea"
            }];
        }

        function OpenJsonModal(name, $item) {
            var modalDefaults = {
                resolve: {
                    param: function () {
                        var exports = {
                            "Data": $item
                        };
                        return exports;
                    }
                }
            };

            jsonEditModal.showModal(modalDefaults, {})
                .then(function (result) {
                    if (name == 'GridConfigHeader') {
                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.GridConfig.Header = JSON.parse(result);
                    } else if (name == 'otherConfig') {
                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig = JSON.parse(result);
                    } else if (name == 'gridOptions') {
                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.GridOptions = JSON.parse(result);
                    } else if (name == 'listingPageConfig') {
                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.ListingPageConfig = JSON.parse(result);
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewSortColumn() {
            var _obj = {};
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.GridConfig.SortObjects.push(_obj);
        }

        function RemoveSortColumn($index) {
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.GridConfig.SortObjects.splice($index, 1);
        }

        function AddNewGridConfig() {
            var _obj = {};
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.GridConfig.Header.push(_obj);
        }

        function RemoveGridConfig($index) {
            EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.GridConfig.Header.splice($index, 1);
        }

        function GetDefaultFilterList() {
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = undefined;
            var _filter = {
                "SourceEntityRefKey": EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.DataEntryName,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": EditPageCtrl.ePage.Masters.QueryString.AppPk,
                "EntitySource": "QUERY",
                "TypeCode": EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.DataEntry_PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.AppSettings.API.FindAll.Url + EditPageCtrl.ePage.Masters.QueryString.AppPk, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = response.data.Response;
                } else {
                    EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = [];
                }
            });
        }

        function OnStandaredToolbarChange($event) {
            var _target = $event.target;
            var _isChecked = _target.checked;
            if (!_isChecked) {
                for (var x in EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.ListingPageConfig.StandardToolbar.ToolList) {
                    EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig.ListingPageConfig.StandardToolbar.ToolList[x] = false;
                }
            }
        }

        // ================Lookup Page Configuration================
        function InitLookupPage() {
            EditPageCtrl.ePage.Masters.EditPage.LookupPage = {};
            EditPageCtrl.ePage.Masters.EditPage.LookupPage.JsonEditiorOptions = {
                mode: 'tree'
            };

            EditPageCtrl.ePage.Masters.EditPage.LookupPage.OnLookupConfigLoad = OnLookupConfigLoad;
            EditPageCtrl.ePage.Masters.EditPage.LookupPage.ChangeJsonView = ChangeJsonView;
        }

        function OnLookupConfigLoad(instance) {
            instance.expandAll();
        }

        function ChangeJsonView() {
            EditPageCtrl.ePage.Masters.EditPage.LookupPage.JsonEditiorOptions.mode = EditPageCtrl.ePage.Masters.EditPage.LookupPage.JsonEditiorOptions.mode == 'tree' ? 'code' : 'tree';
        }

        Init();
    }
})();
