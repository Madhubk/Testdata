
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolActivityDetailsController", ConsolActivityDetailsController);

    ConsolActivityDetailsController.$inject = ["helperService", "appConfig", "apiService", "authService", "APP_CONSTANT"];

    function ConsolActivityDetailsController(helperService, appConfig, apiService, authService, APP_CONSTANT) {
        var ConsolActivityDetailsCtrl = this;
        var CurrentObject = ConsolActivityDetailsCtrl.currentObj[ConsolActivityDetailsCtrl.currentObj.label].ePage.Entities;

        function Init() {
            ConsolActivityDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Activity_Details",
                "Masters": {},
                "Meta": {},
                "Entities": CurrentObject
            };

            ConsolActivityDetailsCtrl.ePage.Masters.TaskObj=ConsolActivityDetailsCtrl.taskObj;
            ConsolActivityDetailsCtrl.ePage.Masters.ModeChange = ModeChange;
            ConsolActivityDetailsCtrl.ePage.Masters.SelectedDataPorts = SelectedDataPorts;
            ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList = {};
            // DatePicker
            ConsolActivityDetailsCtrl.ePage.Masters.DatePicker = {};
            ConsolActivityDetailsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConsolActivityDetailsCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsolActivityDetailsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Callback
            var _isEmpty = angular.equals({}, ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
            GetConContainerType();
            ValidationFindall();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConsolActivityDetailsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function GetConContainerType() {
            ConsolActivityDetailsCtrl.ePage.Masters.CfxTypesList = {}
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
                    ConsolActivityDetailsCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(ConsolActivityDetailsCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': ConsolActivityDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    ConsolActivityDetailsCtrl.ePage.Masters.conSelectedMode = obj;
                }
            });
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
                        ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });
            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ConsolActivityDetailsCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }

        function ValidationFindall() {
            if (ConsolActivityDetailsCtrl.ePage.Masters.TaskObj) {
                errorWarningService.AddModuleToList("MyTask", ConsolActivityDetailsCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "CON",
                    SubModuleCode: "CON"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {
                });
                ConsolActivityDetailsCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ConsolActivityDetailsCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[ConsolActivityDetailsCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                ConsolActivityDetailsCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[ConsolActivityDetailsCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            }
        }
        function ModeChange(obj) {
            if (obj) {
                ConsolActivityDetailsCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = obj.Key
                ConsolActivityDetailsCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = obj.PARENT_Key

            } else {
                ConsolActivityDetailsCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.ContainerMode = null
                ConsolActivityDetailsCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.TransportMode = null
            }
        }

        function SelectedDataPorts(Str1, Str2) {
            if (Str1 && Str2) {
                if (consolidationConfig.PortsComparison(Str1, Str2)) {
                    ConsolActivityDetailsCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.IsDomestic = true
                } else {
                    ConsolActivityDetailsCtrl.ePage.Entities.Header.ConData.UIConConsolHeader.IsDomestic = false;
                }
            }
        }
        Init();
    }
})();