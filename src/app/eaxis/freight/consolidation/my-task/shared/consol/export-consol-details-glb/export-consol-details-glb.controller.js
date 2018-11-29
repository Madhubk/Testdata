(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportConsolDetailsGlbController", ExportConsolDetailsGlbController);

    ExportConsolDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportConsolDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportConsolDetailsGlbCtrl = this;

        function Init() {
            ExportConsolDetailsGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ExportConsolDetailsGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ExportConsolDetailsGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ExportConsolDetailsGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
            }

            // DatePicker
            ExportConsolDetailsGlbCtrl.ePage.Masters.DatePicker = {};
            ExportConsolDetailsGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportConsolDetailsGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportConsolDetailsGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetConContainerType();
            GetMastersList();
            ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList = {};
            ExportConsolDetailsGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportConsolDetailsGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });
            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ExportConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }


        function ModeChange(obj) {
            if (obj) {
                ExportConsolDetailsGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode = obj.Key;
                ExportConsolDetailsGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode = obj.PARENT_Key;
            } else {
                ExportConsolDetailsGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode = null;
                ExportConsolDetailsGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode = null;
            }
        }

        function GetConContainerType() {
            ExportConsolDetailsGlbCtrl.ePage.Masters.CfxTypesList = {}
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
                    ExportConsolDetailsGlbCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(ExportConsolDetailsGlbCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': ExportConsolDetailsGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    ExportConsolDetailsGlbCtrl.ePage.Masters.conSelectedMode = obj;
                }
            });
        }

        Init();
    }
})();