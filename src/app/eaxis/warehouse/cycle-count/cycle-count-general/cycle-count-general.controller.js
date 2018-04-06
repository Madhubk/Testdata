(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountGeneralController", CycleCountGeneralController);

    CycleCountGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "cycleCountConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function CycleCountGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, cycleCountConfig, helperService, toastr, $injector, $window, confirmation) {

        var CycleCountGeneralCtrl = this;

        function Init() {

            var currentCycleCount = CycleCountGeneralCtrl.currentCycleCount[CycleCountGeneralCtrl.currentCycleCount.label].ePage.Entities;

            CycleCountGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCount_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCycleCount,
            };

            // DatePicker
            CycleCountGeneralCtrl.ePage.Masters.DatePicker = {};
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            CycleCountGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            CycleCountGeneralCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;
            CycleCountGeneralCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            CycleCountGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            CycleCountGeneralCtrl.ePage.Masters.Config = cycleCountConfig;
            CycleCountGeneralCtrl.ePage.Masters.SelectedLookupDataLocation = SelectedLookupDataLocation;


            generalOperations();
            GetDropDownList();
            AllocatePartAttribute();
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        // Get CFXType Dropdown list
        function GetDropDownList() {
            var typeCodeList = ["EmptyLocation","CycleCountType", "ABCCategory","PickMethod"];
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
                        CycleCountGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CycleCountGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        // generalOperations
        function generalOperations() {
            // warehouse
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode = "";
            }
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName = "";
            }
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode + ' - ' + CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse == ' - ')
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = "";
            // Client
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode = "";
            }
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName = "";
            }
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode + ' - ' + CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client == ' - ')
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = "";

            if(CycleCountGeneralCtrl.currentCycleCount.isNew){
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeDate = new Date();
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CountEmptyLocationsCategory = "EMT";
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeType = 'STD';
            }
        }
        // lookup warehouse
        function SelectedLookupDataWarCode(item) {
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse,'E13001');
        }
        // lookup client
        function SelectedLookupDataClient(item) {
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = item.Code+' - '+item.FullName;
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK = item.PK;
            AllocatePartAttribute();
        }

          // lookup Location
          function SelectedLookupDataLocation(item, index) {
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK = item.PK;
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location = item.Location;
        }
        
        function OnChangeValues(fieldvalue, code) {
            angular.forEach(CycleCountGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                CycleCountGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CycleCountGeneralCtrl.currentCycleCount.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                CycleCountGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CycleCountGeneralCtrl.currentCycleCount.label);
            }
        }

        function AllocatePartAttribute() {
            if(CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK){
                var _filter = {
                    "ORG_FK": CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": CycleCountGeneralCtrl.ePage.Entities.Header.API.OrgMiscServ.FilterID
                };
    
                apiService.post("eAxisAPI", CycleCountGeneralCtrl.ePage.Entities.Header.API.OrgMiscServ.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }
        
        Init();
    }

})();