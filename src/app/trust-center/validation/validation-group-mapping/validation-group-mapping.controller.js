(function () {
    'use strict'

    angular
        .module("Application")
        .controller("TCValidationGroupMappingController", TCValidationGroupMappingController);

    TCValidationGroupMappingController.$inject = ["authService", "apiService", "helperService", "trustCenterConfig", "$location", "$uibModalInstance", "param"];

    function TCValidationGroupMappingController(authService, apiService, helperService, trustCenterConfig, $location, $uibModalInstance, param) {
        /* jshint validthis: true */
        var TCValidationGroupMappingCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCValidationGroupMappingCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Validation_Group_Mapping",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCValidationGroupMappingCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCValidationGroupMappingCtrl.ePage.Masters.Application = {};
            TCValidationGroupMappingCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(param.ActiveApplication);

            try {
                TCValidationGroupMappingCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCValidationGroupMappingCtrl.ePage.Masters.QueryString.AppPk) {
                    InitValidationGroupMapping();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitValidationGroupMapping() {
            TCValidationGroupMappingCtrl.ePage.Masters.Param = param;
            TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup = {};
            TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup.OnValidationGroupClick = OnValidationGroupClick;
            TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup.Close = Close;

            GetValidationGroupList();
        }

        function GetValidationGroupList() {
            TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup.ListSource = undefined;
            var _filter = {
                SAP_FK: TCValidationGroupMappingCtrl.ePage.Masters.Application.ActiveApplication.PK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ValidationGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ValidationGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup.ListSource = response.data.Response;
                    if (response.data.Response.length > 0) {
                        GetValidationGroupMappingList();
                    }
                } else {
                    TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup.ListSource = [];
                }
            });
        }

        function GetValidationGroupMappingList() {
            var _filter = {
                Code_2: TCValidationGroupMappingCtrl.ePage.Masters.Param._filter.Code,
                Fk_2: TCValidationGroupMappingCtrl.ePage.Masters.Param._filter.PK,
                MappingCode: "VLG_VLD",
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCValidationGroupMappingCtrl.ePage.Masters.ValidationGroup.ListSource.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.Fk_1) {
                                    value1.IsChecked = true;
                                    value1.MappingObj = value2;
                                }
                            });
                        });
                    }
                }
            });
        }

        function OnValidationGroupClick($event, $item) {
            var checkbox = $event.target,
                check = checkbox.checked,
                _input = {};

            if (check == true) {
                _input = {
                    Fk_1: $item.PK,
                    Code_1: $item.GroupName,

                    Fk_2: TCValidationGroupMappingCtrl.ePage.Masters.Param._filter.PK,
                    Code_2: TCValidationGroupMappingCtrl.ePage.Masters.Param._filter.Code,

                    MappingCode: "VLG_VLD",
                    SAP_FK: TCValidationGroupMappingCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    TenantCode: authService.getUserInfo().TenantCode,
                    "IsModified": true,
                    "IsActive": true
                };
            } else if (check == false) {
                _input = $item.MappingObj;
                _input.IsModified = true;
                _input.IsDeleted = true;
                _input.IsActive = true;
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntitiesMapping.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.IsChecked = true;
                        $item.MappingObj = response.data.Response[0];
                    }
                }
            });
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
