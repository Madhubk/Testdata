/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolDetailsGlbController", ConsolDetailsGlbController);

    ConsolDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ConsolDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ConsolDetailsGlbCtrl = this;

        function Init() {
            ConsolDetailsGlbCtrl.ePage = {
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
            ConsolDetailsGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ConsolDetailsGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ConsolDetailsGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
                GetConContainerType();
            }

            // DatePicker
            ConsolDetailsGlbCtrl.ePage.Masters.DatePicker = {};
            ConsolDetailsGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConsolDetailsGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsolDetailsGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConsolDetailsGlbCtrl.ePage.Masters.TableProperty = {
                "status": {
                    "isenabled": true,
                    "position": "5",
                    "width": "120"
                },
                "vessel": {
                    "isenabled": true,
                    "position": "7",
                    "width": "120"
                },
                "voyageflight": {
                    "isenabled": true,
                    "position": "6",
                    "width": "120"
                },
                "etd": {
                    "isenabled": true,
                    "position": "10",
                    "width": "120"
                },
                "eta": {
                    "isenabled": true,
                    "position": "11",
                    "width": "120"
                },
                "atd": {
                    "isenabled": true,
                    "position": "12",
                    "width": "120"
                },
                "ata": {
                    "isenabled": true,
                    "position": "13",
                    "width": "120"
                },
                "legno": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                },
                "islinked": {
                    "isenabled": true,
                    "position": "2",
                    "width": "100"
                },
                "mode": {
                    "isenabled": true,
                    "position": "3",
                    "width": "120"
                },
                "type": {
                    "isenabled": true,
                    "position": "4",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "8",
                    "width": "120"
                },
                "pod": {
                    "isenabled": true,
                    "position": "9",
                    "width": "120"
                },
                "definedby": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                },
                "entitysource": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                }
            }

            GetMastersList();
            ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList = {};
            ConsolDetailsGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConsolDetailsGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });
            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ConsolDetailsGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }


        function ModeChange(obj) {
            if (obj) {
                ConsolDetailsGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = obj.Key
                ConsolDetailsGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = obj.PARENT_Key

            } else {
                ConsolDetailsGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = null
                ConsolDetailsGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = null
            }
        }

        function GetConContainerType() {
            ConsolDetailsGlbCtrl.ePage.Masters.CfxTypesList = {}
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
                    ConsolDetailsGlbCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(ConsolDetailsGlbCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': ConsolDetailsGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    ConsolDetailsGlbCtrl.ePage.Masters.conSelectedMode = obj;
                }
            });
        }

        Init();
    }
})();