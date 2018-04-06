(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountMenuController", CycleCountMenuController);

    CycleCountMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "cycleCountConfig", "helperService", "appConfig", "authService", "$state","toastr"];

    function CycleCountMenuController($scope, $timeout, APP_CONSTANT, apiService, cycleCountConfig, helperService, appConfig, authService, $state,toastr) {

        var CycleCountMenuCtrl = this;

        function Init() {

            var currentCycleCount = CycleCountMenuCtrl.currentCycleCount[CycleCountMenuCtrl.currentCycleCount.label].ePage.Entities;

            CycleCountMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCount_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCycleCount

            };

            // Standard Menu Configuration and Data
            CycleCountMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseCycleCount;
            CycleCountMenuCtrl.ePage.Masters.StandardMenuInput.obj = CycleCountMenuCtrl.currentCycleCount;
            // function
            CycleCountMenuCtrl.ePage.Masters.Validation = Validation;
            CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            CycleCountMenuCtrl.ePage.Masters.IsDisableSave = false;

            CycleCountMenuCtrl.ePage.Masters.CycleCountMenu = {};
            CycleCountMenuCtrl.ePage.Masters.DropDownMasterList = {};
            CycleCountMenuCtrl.ePage.Masters.Config = cycleCountConfig;
            CycleCountMenuCtrl.ePage.Masters.LoadNewStockTake = LoadNewStockTake;
            CycleCountMenuCtrl.ePage.Masters.CloseLine = CloseLine;

            // Menu list from configuration
            CycleCountMenuCtrl.ePage.Masters.CycleCountMenu.ListSource = CycleCountMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function CloseLine(){
            CycleCountMenuCtrl.ePage.Entities.Header.CheckPoints.CloseLinesClicked = false;
            angular.forEach(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine,function(value,key){
                if(value.SingleSelect==true && value.Status=='OPN'){
                    value.Status = 'CLS';
                    value.DateClosed = new Date();
                    value.CurrentCount = value.LastCount;
                }
            });
            Validation(CycleCountMenuCtrl.currentCycleCount);
        }
        //To add inventory lines into cyclecount line
        function LoadNewStockTake(){  
            CycleCountMenuCtrl.ePage.Entities.Header.CheckPoints.PageBlur = true;
                var _filter = {
                    "WAR_FK": CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_FK,
                };

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client)
                _filter.ORG_FK =CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK;

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.RowName)
                _filter.WRO_FK =CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WRO_FK;

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.AreaName)
                _filter.WAA_FK =CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAA_FK;

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location)
                _filter.WLO_FK =CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK;

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": CycleCountMenuCtrl.ePage.Entities.Header.API.Inventory.FilterID,
                };

                apiService.post("eAxisAPI", CycleCountMenuCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function (response) {
                    CycleCountMenuCtrl.ePage.Entities.Header.CheckPoints.PageBlur = false;
                    CycleCountMenuCtrl.ePage.Masters.InventoryDetails = response.data.Response;
                    if(CycleCountMenuCtrl.ePage.Masters.InventoryDetails.length>0){
                        CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus = 'LOD';
                        CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CycleCountDesc = 'Loaded';
                    }else{
                        toastr.info("Inventory is not Available");
                    }
                    angular.forEach(CycleCountMenuCtrl.ePage.Masters.InventoryDetails,function(value,key){
                        var obj={
                              "PK":"",
                                "ClientCode": value.ClientCode,
                                "ClientName": value.ClientName,
                                "ClientFullName":value.ClientCode+' - '+value.ClientName,
                                "ORG_FK":value.ORG_FK,
                                "ProductCode": value.ProductCode,
                                "ProductDesc": value.ProductName,
                                "Product":value.ProductCode+' - '+value.ProductName,
                                "OSP_FK":value.PRO_FK,
                                "Commodity": "",
                                "PalletID": value.PalletID,
                                "Location": value.Location,
                                "WLO_FK":value.WLO_FK,
                                "AreaName": value.AreaName,
                                "RowName": "",
                                "SystemUnits": value.InLocationQty,
                                "LastCount": "",
                                "CurrentCount":"",
                                "DateVerified": "",
                                "LineComment": "",
                                "Status": "OPN",
                                "DateClosed": "",
                                "PickMethod": "",
                                "InventoryStatus": value.OriginalInventoryStatus,
                                "ExpiryDate": value.ExpiryDate,
                                "PackingDate":value.PackingDate,
                                "PartAttrib1":value.PartAttrib1,
                                "PartAttrib2":value.PartAttrib2,
                                "PartAttrib3":value.PartAttrib3,
                                "IsDeleted": false,
                                "IsManuallyAdded":false,
                        }
                        CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.push(obj);
                        if(key==CycleCountMenuCtrl.ePage.Masters.InventoryDetails.length-1){
                            CycleCountMenuCtrl.ePage.Entities.Header.CheckPoints.StockLoad = false;
                            Validation(CycleCountMenuCtrl.currentCycleCount);
                        }
                    });
                });
          }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            CycleCountMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CycleCountMenuCtrl.ePage.Entities.Header.Validations) {
                CycleCountMenuCtrl.ePage.Masters.Config.RemoveApiErrors(CycleCountMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                CycleCountMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CycleCountMenuCtrl.currentCycleCount);
            }
        }
        
        function Saveonly($item) {
            CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CycleCountMenuCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsCycleCountHeader.PK = _input.PK;
                _input.UIWmsCycleCountHeader.StocktakeStatus = 'New';
                _input.UIWmsCycleCountHeader.CycleCountDesc = 'New (Unloaded)';
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'CycleCount').then(function (response) {
                CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                CycleCountMenuCtrl.ePage.Masters.IsDisableSave = false;
                if (response.Status === "success") {

                    cycleCountConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeNumber) {
                                value.label = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeNumber;
                                value[CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeNumber] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = cycleCountConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(CycleCountMenuCtrl.currentCycleCount[CycleCountMenuCtrl.currentCycleCount.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        angular.forEach(response.Data.UIWmsCycleCountLine,function(value,key){
                            value.SingleSelect = false;
                        });
                        cycleCountConfig.TabList[_index][cycleCountConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        cycleCountConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/cycle-count") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if(CycleCountMenuCtrl.ePage.Masters.SaveAndClose){
                        CycleCountMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        CycleCountMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    CycleCountMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    CycleCountMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        CycleCountMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CycleCountMenuCtrl.currentCycleCount.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (CycleCountMenuCtrl.ePage.Entities.Header.Validations != null) {
                        CycleCountMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CycleCountMenuCtrl.currentCycleCount);
                    }
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }


        Init();

    }

})();