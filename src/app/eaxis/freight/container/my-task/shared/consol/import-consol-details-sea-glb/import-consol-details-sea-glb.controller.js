/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportConsolDetailsSeaGlbController", ImportConsolDetailsSeaGlbController);

    ImportConsolDetailsSeaGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ImportConsolDetailsSeaGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ImportConsolDetailsSeaGlbCtrl = this;

        function Init() {
            ImportConsolDetailsSeaGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ImportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ImportConsolDetailsSeaGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
                GetConContainerType();
            }

            // DatePicker
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker = {};
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetMastersList();
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList = {};
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["CON_TYPE", "CON_PAYMENT", "CON_SI_FILING_TYPE", "CNTTYPE"];
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
                        ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            // Get Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });
            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }


        function ModeChange(obj) {
            if (obj) {
                ImportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = obj.Key
                ImportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = obj.PARENT_Key

            } else {
                ImportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = null
                ImportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = null
            }
        }

        function GetConContainerType() {
            ImportConsolDetailsSeaGlbCtrl.ePage.Masters.CfxTypesList = {}
            //ContainerType
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(ImportConsolDetailsSeaGlbCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': ImportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    ImportConsolDetailsSeaGlbCtrl.ePage.Masters.conSelectedMode = obj;
                }
            });
        }

        Init();
    }
})();