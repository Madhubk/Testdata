(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MappingHorizontalController", MappingHorizontalController);

    MappingHorizontalController.$inject = ["$location", "authService", "apiService", "helperService", "trustCenterConfig", "tcMappingConfig", "toastr", "confirmation"];

    function MappingHorizontalController($location, authService, apiService, helperService, trustCenterConfig, tcMappingConfig, toastr, confirmation) {
        /* jshint validthis: true */
        var MappingHorizontalCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            MappingHorizontalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Mapping_Horizontal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MappingHorizontalCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            MappingHorizontalCtrl.ePage.Masters.emptyText = "-";

            try {
                MappingHorizontalCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (MappingHorizontalCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitMappingList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            MappingHorizontalCtrl.ePage.Masters.Breadcrumb = {};
            MappingHorizontalCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _mappingName = "";
            if (MappingHorizontalCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _mappingName = " (" + MappingHorizontalCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            MappingHorizontalCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": MappingHorizontalCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": MappingHorizontalCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": MappingHorizontalCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "mapping",
                Description: "Mapping" + _mappingName,
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

        function InitMappingList() {
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal = {};
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config = tcMappingConfig.Entities.Mapping[MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode];

            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.configType = ["Tenant", "Application", "AccessTo", "BasedOn", "OtherEntitySource", "OtherEntitySource_2", "OtherEntitySource_3", "OtherEntitySource_4"];
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.ConfigTypeFunction = {};

            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.configType.map(function (value, key) {
                MappingHorizontalCtrl.ePage.Masters.MappingHorizontal[value] = helperService.metaBase();
            });

            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.AddNew = AddNew;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Delete = Delete;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.DeleteConfirmation = DeleteConfirmation;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Save = Save;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.OnApplicationChange = OnApplicationChange;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.OnTenantChange = OnTenantChange;

            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.GetAutoCompleteList = GetAutoCompleteList;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.OnBlurAutoCompleteList = OnBlurAutoCompleteList;

            if (MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.Visible) {
                GetTenantList();
            }
            if (MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.Visible) {
                GetApplicationList();
            }

            GetMappingList();
        }

        // ======================================================

        function GetTenantList() {
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Tenant.ListSource = undefined;
            var _filter = {
                "pageSize": 100,
                "currentPage": 1,
                "SortColumn": "TenantCode",
                "SortType": "desc"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.FilterID
            };

            apiService.post(MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.API, MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.APIUrl, _input).then(function (response) {
                if (response.data.Response) {
                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Tenant.ListSource = response.data.Response;
                } else {
                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Tenant.ListSource = [];
                }
            });
        }

        function OnTenantChange(row, $item) {
            if ($item) {
                if (MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.Visible && MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.Enable) {
                    row.TNT_FK = $item[MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.ValueField];
                    row.TenantCode = $item[MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.TextField];
                }
            } else {
                row.TNT_FK = undefined;
                row.TenantCode = undefined;
            }
        }

        function GetApplicationList() {
            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Application.ListSource = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.FilterID
            };

            apiService.post(MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.API, MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.APIUrl, _input).then(function (response) {
                if (response.data.Response) {
                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Application.ListSource = response.data.Response;
                } else {
                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Application.ListSource = [];
                }
            });
        }

        function OnApplicationChange(row, $item) {
            if ($item) {
                if (MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.Visible && MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.Enable) {
                    row.SAP_FK = $item[MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.ValueField];
                    row.SAP_Code = $item[MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Application.TextField];
                }
            } else {
                row.SAP_FK = undefined;
                row.SAP_Code = undefined;
            }
        }

        // ======================================================

        // ======================================================

        function GetMappingList() {
            var _filter = {
                "SAP_FK": MappingHorizontalCtrl.ePage.Masters.QueryString.AppPk,
                "MappingCode": MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode
            };

            if(MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode !== 'SECAPP_SECTENANT'){
                _filter.Item_FK = MappingHorizontalCtrl.ePage.Masters.QueryString.ItemPk;
            }

            if (MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config.Tenant.Visible && MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode !== 'SECAPP_SECTENANT') {
                _filter.TenantCode = authService.getUserInfo().TenantCode;
            }

            if (MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode === 'APP_TRUST_APP_TNT' || MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode === 'SECAPP_SECTENANT') {
                _filter.PropertyName = "false";
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList = response.data.Response;

                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList.map(function (value, key) {

                    });
                } else {
                    MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList = [];
                }
            });
        }

        function AddNew() {
            if(MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode === 'SECAPP_SECTENANT'){
                var _obj = {
                    SAP_FK: MappingHorizontalCtrl.ePage.Masters.QueryString.AppPk,
                    SAP_Code: MappingHorizontalCtrl.ePage.Masters.QueryString.AppCode
                };
            }else{
                var _obj = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    TNT_FK: authService.getUserInfo().TenantPK,
                    SAP_FK: MappingHorizontalCtrl.ePage.Masters.QueryString.AppPk,
                    SAP_Code: MappingHorizontalCtrl.ePage.Masters.QueryString.AppCode
                };
            }

            MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList.push(_obj);
        }

        function Save(row) {
            var _input = angular.copy(row);

            if (!_input.TenantCode) {
                _input.TenantCode = authService.getUserInfo().TenantCode;
                _input.TNT_FK = authService.getUserInfo().TenantPK;
            }
            if (!_input.SAP_Code) {
                _input.SAP_FK = MappingHorizontalCtrl.ePage.Masters.QueryString.AppPk;
                _input.SAP_Code = MappingHorizontalCtrl.ePage.Masters.QueryString.AppCode;
            }

            if(_input.Value){
                _input.IsJson = true;
            }
            
            _input.MappingCode = MappingHorizontalCtrl.ePage.Masters.QueryString.MappingCode;
            _input.Item_FK = MappingHorizontalCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemName = MappingHorizontalCtrl.ePage.Masters.QueryString.ItemName;
            _input.ItemCode = MappingHorizontalCtrl.ePage.Masters.QueryString.ItemCode;
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    var _index = MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index !== -1) {
                        MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList[_index] = _response;
                    }
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Could not Save...!");
                }
            });
        }

        function DeleteConfirmation(row) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete(row);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete(row) {
            var _input = angular.copy(row);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_input.PK);

                    if (_index !== -1) {
                        MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.MappingList.splice(_index, 1);
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        // ======================================================

        // ======================================================

        function GetAutoCompleteList($viewValue, mapObj, mapCode, mapFK, row) {
            var _configObj = angular.copy(MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config[mapObj]);

            if (_configObj.Visible && _configObj.Enable) {
                var _filterObj = [];
                if (_configObj.Input.length > 0) {
                    _configObj.Input.map(function (val, key) {
                        var _value = angular.copy(val.value);
                        if (val.Type == 1) {
                            if (authService.getUserInfo()[val.value]) {
                                _value = authService.getUserInfo()[val.value];
                            } else {
                                _value = undefined;
                            }
                        } else if (val.Type == 2) {
                            if (MappingHorizontalCtrl.ePage.Masters.QueryString[val.value]) {
                                _value = MappingHorizontalCtrl.ePage.Masters.QueryString[val.value];
                            } else {
                                _value = undefined;
                            }
                        } else if (val.Type == 3) {
                            if (row[val.value]) {
                                _value = row[val.value];
                            } else {
                                _value = undefined;
                            }
                        }

                        delete val.Type;
                        val.value = _value;

                        if (_value != undefined) {
                            _filterObj.push(val);
                        }
                    });
                } else {
                    _filterObj = [];
                }

                if ($viewValue !== "#") {
                    var _filter = {
                        FieldName: "Autocompletefield",
                        value: $viewValue
                    };

                    var _index = _filterObj.map(function (value, key) {
                        return value.FieldName;
                    }).indexOf(_filter.FieldName);

                    if (_index !== -1) {
                        _filterObj[_index].value = _filter.value;
                    } else {
                        _filterObj.push(_filter);
                    }

                    var _input = {
                        "searchInput": _filterObj,
                        "FilterID": _configObj.FilterID,
                    };
                    return AutoCompleteAPICall(mapObj, _input);
                } else if ($viewValue === "#" && _configObj.IsHashRequired) {
                    _filterObj.map(function (value, key) {
                        if (value.FieldName == "Autocompletefield") {
                            _filterObj.splice(key, 1);
                        }
                    });

                    var _input = {
                        "searchInput": _filterObj,
                        "FilterID": _configObj.FilterID,
                    };
                    return AutoCompleteAPICall(mapObj, _input);
                }
            }
        }

        function AutoCompleteAPICall(mapObj, input) {
            var _configObj = angular.copy(MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config[mapObj]),
                _api;

            if (_configObj.APIUrlSuffix) {
                _api = _configObj.APIUrl + MappingHorizontalCtrl.ePage.Masters.QueryString[_configObj.APIUrlSuffix];
            } else {
                _api = _configObj.APIUrl;
            }

            return apiService.post(_configObj.API, _api, input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event, mapObj, mapCode, mapFK, row) {
            var _configObj = angular.copy(MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config[mapObj]);

            if (_configObj.Visible && _configObj.Enable) {
                row[mapObj] = _configObj.TYPE;
                row[mapFK] = $item[_configObj.ValueField];
                row[mapCode] = $item[_configObj.TextField];
            }
        }

        function OnBlurAutoCompleteList($event, mapObj, mapCode, mapFK, row) {
            row[mapObj + "NoResults"] = false;
            row[mapObj + "Loading"] = false;
            var _configObj = angular.copy(MappingHorizontalCtrl.ePage.Masters.MappingHorizontal.Config[mapObj]);

            if (_configObj.Visible && _configObj.Enable) {
                if (!row[mapCode]) {
                    row[mapFK] = undefined;
                }
            }
        }

        // ======================================================

        Init();
    }
})();
