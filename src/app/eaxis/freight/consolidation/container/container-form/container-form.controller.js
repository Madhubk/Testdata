(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerFormController", ContainerFormController);

    ContainerFormController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$filter", "toastr"];

    function ContainerFormController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, $filter, toastr) {
        /* jshint validthis: true */
        var ContainerFormCtrl = this;

        function Init() {

            ContainerFormCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            ContainerFormCtrl.ePage.Masters.Container = {};
            ContainerFormCtrl.ePage.Masters.Container.FormView = ContainerFormCtrl.currentContainer;

            //DatePicker
            ContainerFormCtrl.ePage.Masters.DatePicker = {};
            ContainerFormCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ContainerFormCtrl.ePage.Masters.DatePicker.isOpen = [];
            ContainerFormCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;





            ContainerFormCtrl.ePage.Masters.DropDownMasterList = {
                "CON_CNTMODE": {
                    "ListSource": []
                },
                "CNT_DELIVERYMODE": {
                    "ListSource": []
                },
                "CNT_SEALBY": {
                    "ListSource": []
                },
                "WEIGHTUNIT": {
                    "ListSource": []
                },
                "CNT_STATUS": {
                    "ListSource": []
                },
                "CNT_QUALITY": {
                    "ListSource": []
                },
                "CNT_TEMPSET": {
                    "ListSource": []
                },
                "CNT_AIRVENTSET": {
                    "ListSource": []
                }
            }
            ContainerFormCtrl.ePage.Masters.SelectedData = SelectedData
            ContainerFormCtrl.ePage.Masters.SelectedConTypeData = SelectedConTypeData
            ContainerFormCtrl.ePage.Masters.UpdateTotal = UpdateTotal
            ContainerFormCtrl.ePage.Masters.UpdateMeasures = UpdateMeasures
            ContainerFormCtrl.ePage.Masters.UpdateBackLeft = UpdateBackLeft
            ContainerFormCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_DeliverEmptyToAddressFK": helperService.metaBase(),
                "OAD_PickUpEmptyFromAddressFK": helperService.metaBase()
            }
            GetCfxTypeList();
            dynamicOrgAddressFetch()
            defaultContType();


        }

        function GetCfxTypeList() {
            var typeCodeList = ["CON_CNTMODE", "CNT_DELIVERYMODE", "CNT_SEALBY", "WEIGHTUNIT", "CNT_STATUS", "CNT_QUALITY", "CNT_TEMPSET", "CNT_AIRVENTSET"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                typeCodeList.map(function (value, key) {
                    ContainerFormCtrl.ePage.Masters.DropDownMasterList[value].ListSource = helperService.metaBase();
                    ContainerFormCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
            });
        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ContainerFormCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SelectedData(item, ListSource) {
            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }
        }

        function UpdateTotal() {
            ContainerFormCtrl.ePage.Masters.Container.FormView.GrossWeight = (parseFloat(ContainerFormCtrl.ePage.Masters.Container.FormView.TareWeight) + parseFloat(ContainerFormCtrl.ePage.Masters.Container.FormView.GoodsWeight) + parseFloat(ContainerFormCtrl.ePage.Masters.Container.FormView.DunnageWeight)).toFixed(3);
        }

        function UpdateMeasures(x, y, z, a) {
            var _temp = parseInt(ContainerFormCtrl.ePage.Masters.Container.FormView[x]) < parseInt(ContainerFormCtrl.ePage.Masters.Container.FormView[y])
            if (_temp) {
                ContainerFormCtrl.ePage.Masters.Container.FormView[z] = (ContainerFormCtrl.ePage.Masters.Container.FormView[y] - ContainerFormCtrl.ePage.Masters.Container.FormView[x]).toFixed(3);
                if (a != undefined) {
                    ContainerFormCtrl.ePage.Masters.Container.FormView[a] = ContainerFormCtrl.ePage.Masters.Container.FormView[z]
                }
            } else {
                ContainerFormCtrl.ePage.Masters.Container.FormView[z] = (0).toFixed(3);
                if (a != undefined) {
                    ContainerFormCtrl.ePage.Masters.Container.FormView[a] = ContainerFormCtrl.ePage.Masters.Container.FormView[z]
                }
            }

        }

        function UpdateBackLeft(x, y, z) {
            var _temp = parseInt(ContainerFormCtrl.ePage.Masters.Container.FormView[z]) > parseInt(ContainerFormCtrl.ePage.Masters.Container.FormView[y])
            if (_temp) {
                ContainerFormCtrl.ePage.Masters.Container.FormView[x] = (ContainerFormCtrl.ePage.Masters.Container.FormView[z] - ContainerFormCtrl.ePage.Masters.Container.FormView[y]).toFixed(3);
            } else {
                ContainerFormCtrl.ePage.Masters.Container.FormView[x] = (0).toFixed(3);
            }
        }

        function SelectedConTypeData($item) {
            ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_TareWeight = (parseInt($item.CNM_TareWeight)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_GrossWeight = (parseInt($item.CNM_GrossWeight)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_Height = (parseInt($item.CNM_Height)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_Length = (parseInt($item.CNM_Length)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_Width = (parseInt($item.CNM_Width)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.TotalHeight = (parseInt($item.CNM_Height)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.TotalLength = (parseInt($item.CNM_Length)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.TotalWidth = (parseInt($item.CNM_Width)).toFixed(3);
            ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_CubicCapacity = (parseInt($item.CNM_CubicCapacity)).toFixed(3);

        }

        function getSetNearByField(item, api, listSource) {
            var _filter = {
                ORG_FK: item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerFormCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function defaultContType() {
            var _filter = {
                PK: ContainerFormCtrl.ePage.Masters.Container.FormView.RC
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstContainer.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.MstContainer.API.FindLookup.DBObjectName
            };
            if (_filter.PK != null) {
                apiService.post("eAxisAPI", appConfig.Entities.MstContainer.API.FindLookup.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        var $item = response.data.Response[0]
                        ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_TareWeight = (parseInt($item.CNM_TareWeight)).toFixed(3);
                        ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_GrossWeight = (parseInt($item.CNM_GrossWeight)).toFixed(3);
                        ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_Height = (parseInt($item.CNM_Height)).toFixed(3);
                        ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_Length = (parseInt($item.CNM_Length)).toFixed(3);
                        ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_Width = (parseInt($item.CNM_Width)).toFixed(3);
                        ContainerFormCtrl.ePage.Masters.Container.FormView.CNM_CubicCapacity = (parseInt($item.CNM_CubicCapacity)).toFixed(3);
                        UpdateMeasures('CNM_Height', 'TotalHeight', 'OverhangHeight');
                        UpdateMeasures('CNM_Width', 'TotalWidth', 'OverhangWeight', 'OnFileLeft')
                        UpdateMeasures('CNM_Length', 'TotalLength', 'OverhangLength', 'OverhangFront');
                        UpdateBackLeft('OverhangFront', 'OverhangBack', 'OverhangLength');
                        UpdateBackLeft('OnFileLeft', 'OverhangRight', 'OverhangWeight');

                    } else {
                        console.log("Empty Response");
                    }
                });
            }

        }

        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_DeliverEmptyToAddressFK": ContainerFormCtrl.ePage.Masters.Container.FormView.DeliverEmptyToFK
            }, {
                "OAD_PickUpEmptyFromAddressFK": ContainerFormCtrl.ePage.Masters.Container.FormView.PickUpEmptyFromFK
            }];
            var dynamicFindAllInputBuild = []
            dynamicFindAllOrgAddressInput.map(function (value, key) {

                if (value[Object.keys(value).join()] !== null) {
                    dynamicFindAllInputBuild.push({
                        "FieldName": Object.keys(value).join(),
                        "value": value[Object.keys(value).join()]
                    })
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInputBuild,
                "FilterID": appConfig.Entities.OrgAddress.API.DynamicFindAll.FilterID
            };
            if (dynamicFindAllInputBuild.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        dynamicFindAllInputBuild.map(function (value, key) {
                            ContainerFormCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }


        Init();
    }
})();