/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportConsolDetailsSeaGlbController", ExportConsolDetailsSeaGlbController);

    ExportConsolDetailsSeaGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportConsolDetailsSeaGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportConsolDetailsSeaGlbCtrl = this;

        function Init() {
            ExportConsolDetailsSeaGlbCtrl.ePage = {
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
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ExportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ExportConsolDetailsSeaGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
                GetConContainerType();
            }

            // DatePicker
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker = {};
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.TableProperty = {
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
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList = {};
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });
            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }


        function ModeChange(obj) {
            if (obj) {
                ExportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = obj.Key
                ExportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = obj.PARENT_Key

            } else {
                ExportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = null
                ExportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = null
            }
        }

        function GetConContainerType() {
            ExportConsolDetailsSeaGlbCtrl.ePage.Masters.CfxTypesList = {}
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
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(ExportConsolDetailsSeaGlbCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': ExportConsolDetailsSeaGlbCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    ExportConsolDetailsSeaGlbCtrl.ePage.Masters.conSelectedMode = obj;
                }
            });
        }

        Init();
    }
})();