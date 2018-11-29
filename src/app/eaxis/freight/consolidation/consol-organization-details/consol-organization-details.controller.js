
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolOrganizationDetailsController", ConsolOrganizationDetailsController);

    ConsolOrganizationDetailsController.$inject = ["$injector", "helperService", "appConfig", "apiService", "APP_CONSTANT", "dynamicLookupConfig"];

    function ConsolOrganizationDetailsController($injector, helperService, appConfig, apiService, APP_CONSTANT, dynamicLookupConfig) {
        /* jshint validthis: true */
        var ConsolOrganizationDetailsCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ConsolOrganizationDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Activity_Details",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };
            ConsolOrganizationDetailsCtrl.ePage.Masters.DropDownMasterList = {};
            ConsolOrganizationDetailsCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ConsolOrganizationDetailsCtrl.ePage.Masters.SelectedData = SelectedData;

            ConsolOrganizationDetailsCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                "OAD_CarrierAddressFK": helperService.metaBase(),
                "OAD_CreditorAddressFK": helperService.metaBase()
            };
            GetDynamicLookupConfig();
            ConsolEntityInit();
        }
        function ConsolEntityInit() {
            ConsolOrganizationDetailsCtrl.ePage.Masters.ConsolEntityObj = ConsolOrganizationDetailsCtrl.currentObj;

            apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ConsolOrganizationDetailsCtrl.ePage.Masters.ConsolEntityObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ConsolOrganizationDetailsCtrl.ePage.Entities.Header.Data = response.data.Response;
                    dynamicOrgAddressFetch();
                }
            });
        }
        function SelectedData(item, ListSource) {
            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }
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
                    ConsolOrganizationDetailsCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }
        function GetDynamicLookupConfig() {
            var DataEntryNameList = "OrganizationList,OrgCarrierList";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    ConsolOrganizationDetailsCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_SendingForwarderAddressFK": ConsolOrganizationDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_SendingForwarderFK
            }, {
                "OAD_ReceivingForwarderAddressFK": ConsolOrganizationDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ReceivingForwarderFK
            }, {
                "OAD_CarrierAddressFK": ConsolOrganizationDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CarrierFK
            }, {
                "OAD_CreditorAddressFK": ConsolOrganizationDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CreditorFK
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
                            ConsolOrganizationDetailsCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }

        

        Init();
    }
})();