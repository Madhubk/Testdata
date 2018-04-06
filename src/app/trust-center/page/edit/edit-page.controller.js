(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EditPageController", EditPageController);

    EditPageController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "trustCenterConfig", "toastr", "confirmation", "$window", "$filter", "$timeout", "jsonEditModal"];

    function EditPageController($scope, $location, authService, apiService, helperService, appConfig, trustCenterConfig, toastr, confirmation, $window, $filter, $timeout, jsonEditModal) {
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
            EditPageCtrl.ePage.Masters.emptyText = "-";

            try {
                EditPageCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (EditPageCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitSubModule();
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
                Code: "configuration",
                Description: "Configuration",
                Link: "TC/dashboard/" + helperService.encryptData('{"Type":"Configuration", "BreadcrumbTitle": "Configuration"}'),
                IsRequireQueryString: false,
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

        // ================SubModule Strt================
        function InitSubModule() {
            EditPageCtrl.ePage.Masters.SubModule = {};
            EditPageCtrl.ePage.Masters.SubModule.OnSubModuleChange = OnSubModuleChange;

            GetSubModuleList();
        }

        function GetSubModuleList() {
            EditPageCtrl.ePage.Masters.SubModule.ListSource = undefined;

            var _filter = {
                "PropertyName": "DEM_Type",
                "Group": EditPageCtrl.ePage.Masters.QueryString.Module,
                "SAP_FK": EditPageCtrl.ePage.Masters.QueryString.AppPk
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntryMaster.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.GetColumnValuesWithFilters.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.SubModule.ListSource = response.data.Response;
                } else {
                    EditPageCtrl.ePage.Masters.SubModule.ListSource = [];
                }
            });
        }

        function OnSubModuleChange($item) {
            EditPageCtrl.ePage.Masters.SubModule.ActiveSubModule = angular.copy($item);
        }
        // ================SubModule End================

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
                    "CSS": {},
                    "SortColumn": {}
                },
                "LookupConfig": {}
            };

            EditPageCtrl.ePage.Masters.EditPage.Save = Save;
            EditPageCtrl.ePage.Masters.EditPage.OnSourceListChange = OnSourceListChange;

            EditPageCtrl.ePage.Masters.EditPage.SaveBtnText = "Save";
            EditPageCtrl.ePage.Masters.EditPage.IsDisableSaveBtn = false;

            if (EditPageCtrl.ePage.Masters.QueryString.Mode == "New") {
                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails = _NewDataEntryObj;
            } else {
                GetDataEntryDetails();
            }

            InitFormDesign();
            InitSearchPage();
            InitLookupPage();
            GetSourceList();
        }

        function GetDataEntryDetails() {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.DataEntryDetails.API.GetById.Url + EditPageCtrl.ePage.Masters.QueryString.PagePk).then(function (response) {
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
                        _response.IsModified = true;
                        _response.GridConfig.SortObjects = helperService.createToArrayOfObject(_response.GridConfig.SortObjects);
                        EditPageCtrl.ePage.Masters.EditPage.FormDesign.DataEntryFieldMapping.List = _response.DataEntryFieldMapping;

                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails = _response;

                        GetDefaultFilterList();
                    }
                }
            });
        }

        function GetSourceList() {
            EditPageCtrl.ePage.Masters.EditPage.SourceList = ["GENERAL", "ROLE", "TENANT"];

            OnSourceListChange(EditPageCtrl.ePage.Masters.EditPage.SourceList[0]);
        }

        function OnSourceListChange($item) {
            if ($item) {
                EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Source = $item;

                var _list = {
                    "GENERAL": GetGeneralList,
                    "ROLE": GetRoleList,
                    "TENANT": GetTenantList
                };

                _list[EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.Source]();
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

        function Save() {
            EditPageCtrl.ePage.Masters.EditPage.SaveBtnText = "Please Wait...";
            EditPageCtrl.ePage.Masters.EditPage.IsDisableSaveBtn = true;

            var _input = angular.copy(EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails);
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = EditPageCtrl.ePage.Masters.QueryString.AppPk;
            _input.GridConfig.SortObjects = helperService.CreateToArrayToObject(_input.GridConfig.SortObjects);
            _input.strGridConfig = JSON.stringify(_input.GridConfig);
            _input.strOtherConfig = JSON.stringify(_input.OtherConfig);
            _input.strLookupConfig = JSON.stringify(_input.LookupConfig);

            apiService.post("eAxisAPI", trustCenterConfig.Entities.DataEntryDetails.API.Upsert.Url, [_input]).then(function (response) {
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
        }

        function GetTypeMasterUIControl() {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.ToolsList = [];
            var _input = {
                "searchInput": helperService.createToArrayOfObject(trustCenterConfig.Entities.TypeMaster.Filter),
                "FilterID": trustCenterConfig.Entities.TypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.TypeMaster.API.FindAll.Url, _input).then(function (response) {
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
                "FilterID": trustCenterConfig.Entities.EntityMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.EntityMaster.API.FindAll.Url, _input).then(function (response) {
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
                "FilterID": trustCenterConfig.Entities.FieldMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.FieldMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList = response.data.Response;
                } else {
                    EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList = [];
                }
            });
        }

        function OnEntityNameChange($item){
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveEntity = $item;
            MergeLabel($item, "Entity");
        }

        function OnFieldNameChange($item){
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveField = $item;
            MergeLabel($item, "Field");
        }

        function MergeLabel($item, type){
            var _entity = "", _field = "";

            if(EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveEntity){
                _entity = EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveEntity.EntityName;
            }
            if(EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveField){
                _field = EditPageCtrl.ePage.Masters.EditPage.FormDesign.ActiveField.FieldName;
            }

            var _label = _entity + "." + _field;
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Label = _label;
        }

        function OnDropperItemClick($item) {
            EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem = $item;

            if(EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Entity_FK){
                if(EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList.length > 0){
                    var _indexEntity = EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList.map(function(value, key){
                        return value.Entity_PK;
                    }).indexOf(EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Entity_FK);

                    OnEntityNameChange(EditPageCtrl.ePage.Masters.EditPage.FormDesign.EntityList[_indexEntity]);
                }
            }

            if(EditPageCtrl.ePage.Masters.EditPage.FormDesign.SelectedDroppedItem.Field_FK){
                if(EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList.length > 0){
                    var _indexField = EditPageCtrl.ePage.Masters.EditPage.FormDesign.FieldList.map(function(value, key){
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

        // ================Search Page Configuration================
        function InitSearchPage() {
            EditPageCtrl.ePage.Masters.EditPage.SearchPage = {};

            EditPageCtrl.ePage.Masters.EditPage.SearchPage.OpenJsonModal = OpenJsonModal;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.AddNewSortColumn = AddNewSortColumn;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.RemoveSortColumn = RemoveSortColumn;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.AddNewGridConfig = AddNewGridConfig;
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.RemoveGridConfig = RemoveGridConfig;
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
                    if (name == 'GridConfig')
                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.GridConfig.Header = JSON.parse(result);
                    else
                        EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.OtherConfig = JSON.parse(result);
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

        function GetDefaultFilterList(){
            EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = undefined;
            var _filter = {
                "SourceEntityRefKey": EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.DataEntryName,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": EditPageCtrl.ePage.Masters.QueryString.AppPk,
                "EntitySource": "QUERY",
                "TypeCode":EditPageCtrl.ePage.Masters.EditPage.DataEntryDetails.DataEntry_PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + EditPageCtrl.ePage.Masters.QueryString.AppPk, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = response.data.Response;
                }else{
                    EditPageCtrl.ePage.Masters.EditPage.SearchPage.DefaultFilterList = [];
                }
            });
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
