(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseDetailsController", WarehouseDetailsController);

    WarehouseDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "warehousesConfig", "helperService", "$filter", "$uibModal", "toastr", "appConfig", "$injector", "$document", "confirmation",];

    function WarehouseDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, warehousesConfig, helperService, $filter, $uibModal, toastr, appConfig, $injector, $document, confirmation) {
        var WarehouseDetailsCtrl = this;

        function Init() {
            var currentWarehouse = WarehouseDetailsCtrl.currentWarehouse[WarehouseDetailsCtrl.currentWarehouse.label].ePage.Entities;

            WarehouseDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            WarehouseDetailsCtrl.ePage.Masters.Config = $injector.get("warehousesConfig");
            WarehouseDetailsCtrl.ePage.Masters.DropDownMasterList = {};

            WarehouseDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            WarehouseDetailsCtrl.ePage.Masters.SelectedLookupOrganisation = SelectedLookupOrganisation;
            WarehouseDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            WarehouseDetailsCtrl.ePage.Masters.OtherOrganizationAddresses = OtherOrganizationAddresses;

            GetDropDownList();
            RemoveHyphen();
            GetAddressList();
            GetOtherOrganizationAddress();
        }

        //#region Get dropdown values
        function GetDropDownList() {
            var typeCodeList = ["WarehouseType", "AreaType"];
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
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        WarehouseDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        WarehouseDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion Dropdwon list

        //#region SelectedLookupData
        function SelectedLookupData(item) {
            OnChangeValues(item.Code, 'E4004');
            OnChangeValues(item.BranchName, 'E4005');
        }

        function SelectedLookupOrganisation(item) {
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization = item.Code + ' - ' + item.FullName;
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OAD_FK = item.OAD_PK;
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.ORG_FK = item.PK;
            OnChangeValues(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization, 'E4007');
            GetAddressList();
            GetOtherOrganizationAddress();
        }
        //#endregion SelectedLookupData

        //#region General 
        function RemoveHyphen() {
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationCode == null) {
                WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationCode = '';
            }
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationName == null) {
                WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationName = '';
            }
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization = WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationCode + ' - ' + WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationName;
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization == ' - ')
                WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization = '';
        }

        function GetAddressList() {
            var _filter = {
                "PK": WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OAD_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OAD_FK) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.PK = response.data.Response[0].ORG_FK;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_PK = response.data.Response[0].PK;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Address1 = response.data.Response[0].Address1;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Address2 = response.data.Response[0].Address2;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_City = response.data.Response[0].City;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Code = response.data.Response[0].Code;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_CountryCode = response.data.Response[0].CountryCode;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Email = response.data.Response[0].Email;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Fax = response.data.Response[0].Fax;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_State = response.data.Response[0].State;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_PostCode = response.data.Response[0].PostCode;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Phone = response.data.Response[0].Phone;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Mobile = response.data.Response[0].Mobile;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.CountryCode = WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_CountryCode;

                        OnChangeValues(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.CountryCode, 'E4006');
                    }
                });
            }
        }

        function GetOtherOrganizationAddress() {
            WarehouseDetailsCtrl.ePage.Masters.OtherOrganizationAddress = '';
            var _filter = {
                "ORG_FK": WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.ORG_FK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.ORG_FK) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        WarehouseDetailsCtrl.ePage.Masters.OtherOrganizationAddress = response.data.Response;
                    }
                });
            }
        }

        function OtherOrganizationAddresses(otheraddress) {
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/mdm/warehouse/warehouses/warehouse-details/organizationaddress/address.html',
                controller: 'OrganizationAddressController as OrganizationAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "CurrentData": WarehouseDetailsCtrl.ePage.Entities.Header.Data,
                            "otheraddress": otheraddress
                        };
                        return exports;
                    }
                }
            });
        }
        //#endregion General

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(WarehouseDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                WarehouseDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, WarehouseDetailsCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                WarehouseDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, WarehouseDetailsCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length; i++) {
                OnChangeValues('value', "E4009", true, i);
                OnChangeValues('value', "E4010", true, i);
                OnChangeValues('value', "E4011", true, i);
            }
            return true;
        }
        //#endregion Validation

        Init();
    }
})();