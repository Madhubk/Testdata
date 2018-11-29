(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountMenuController", CycleCountMenuController);

    CycleCountMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "cycleCountConfig", "helperService", "appConfig", "authService", "$state","toastr","$filter","$uibModal"];

    function CycleCountMenuController($scope, $timeout, APP_CONSTANT, apiService, cycleCountConfig, helperService, appConfig, authService, $state,toastr,$filter,$uibModal) {

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

        
            // function
            CycleCountMenuCtrl.ePage.Masters.Validation = Validation;
            CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            CycleCountMenuCtrl.ePage.Masters.DisableSave = false;

            CycleCountMenuCtrl.ePage.Masters.CycleCountMenu = {};
            CycleCountMenuCtrl.ePage.Masters.DropDownMasterList = {};
            CycleCountMenuCtrl.ePage.Masters.Config = cycleCountConfig;
            CycleCountMenuCtrl.ePage.Masters.LoadNewStockTake = LoadNewStockTake;
            CycleCountMenuCtrl.ePage.Masters.CloseLine = CloseLine;
            CycleCountMenuCtrl.ePage.Masters.GenerateDocuments = GenerateDocuments;
            CycleCountMenuCtrl.ePage.Masters.FinalizeCycleCount = FinalizeCycleCount;
            CycleCountMenuCtrl.ePage.Masters.CancelCycleCount = CancelCycleCount;

            if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='LOD'){
                CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.PartiallyNonEditable = true;
            }
            if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='FIN' || CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='CAN'){
                CycleCountMenuCtrl.ePage.Masters.DisableSave = true;
                CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
            }

            // Menu list from configuration
            CycleCountMenuCtrl.ePage.Masters.CycleCountMenu.ListSource = CycleCountMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        
            GetDocuments();
        }

        function CloseLine(){
            CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.CloseLinesClicked = false;
            angular.forEach(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine,function(value,key){
                if(value.SingleSelect==true && value.Status=='OPN'){
                    value.Status = 'CLO';
                    value.CurrentCount = value.LastCount;
                }
            });
            Validation(CycleCountMenuCtrl.currentCycleCount);
        }

        //To add inventory lines into cyclecount line
        function LoadNewStockTake(){  
            CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "WAR_FK": CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_FK,
                    "ORG_FK":CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK,
                    "WRO_FK":CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WRO_FK,
                    "WAA_FK":CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAA_FK,
                    "WLO_FK":CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK,
                };

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode){
                    var ProductCodeArray = angular.copy(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode.split("|"));
                    var CommaSeperatedProductCode = ProductCodeArray.join(",");
                    _filter.ProductIn = CommaSeperatedProductCode;
                }

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeType=='TC'){
                    _filter.FinalisedDate = CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.FinalizedDate;
                }
               

                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeType=='TC'){
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": CycleCountMenuCtrl.ePage.Entities.Header.API.WmsStockmovementsSummary.FilterID,
                    };
                    apiService.post("eAxisAPI",CycleCountMenuCtrl.ePage.Entities.Header.API.WmsStockmovementsSummary.Url, _input).then(function(response){
                        if(response.data.Response){
                            CycleCountMenuCtrl.ePage.Masters.InventoryDetails = response.data.Response;
                        }
                        AddingInventoryTOLine();
                    });
                }else{
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": CycleCountMenuCtrl.ePage.Entities.Header.API.WmsInventoryByProductAttributesWithLocation.FilterID,
                    };
                    apiService.post("eAxisAPI", CycleCountMenuCtrl.ePage.Entities.Header.API.WmsInventoryByProductAttributesWithLocation.Url, _input).then(function (response) {
                        if(response.data.Response){
                            CycleCountMenuCtrl.ePage.Masters.InventoryDetails = response.data.Response;
                        }
                        AddingInventoryTOLine();
                    });
                }
        }

        function AddingInventoryTOLine(){
            CycleCountMenuCtrl.ePage.Masters.active = 1;
            if(CycleCountMenuCtrl.ePage.Masters.InventoryDetails.length>0){
                angular.forEach(CycleCountMenuCtrl.ePage.Masters.InventoryDetails,function(value,key){
                    var obj={
                           "PK":"",
                            "ClientCode": value.ClientCode,
                            "ClientName": value.ClientName,
                            "ClientFullName":value.ClientCode+' - '+value.ClientName,
                            "ORG_FK":value.ORG_FK,
                            "ProductCode": value.ProductCode,
                            "ProductDesc": value.ProductName,
                            "OSP_FK":value.PRO_FK,
                            "Commodity": "",
                            "ProductCondition":value.ProductCondition,
                            "PAC_NKPackType":value.StockKeepingUnit,
                            "PalletID": value.PalletID,
                            "Location": value.Location,
                            "WLO_FK":value.WLO_FK,
                            "AreaName": value.AreaName,
                            "RowName": value.WRO_Name,
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
                     if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CountEmptyLocationsCategory=='EMT'){
                         if(obj.SystemUnits >0){
                            CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.push(obj);
                         }
                     }else if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CountEmptyLocationsCategory=="OMT"){
                        if(obj.SystemUnits == 0){
                            CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.push(obj);
                         }
                     }else{
                        CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.push(obj);
                     }
                     if(key==CycleCountMenuCtrl.ePage.Masters.InventoryDetails.length-1){
                        if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length>0){
                            Validation(CycleCountMenuCtrl.currentCycleCount);
                        }else{
                            toastr.info("No Records Found");
                        }
                        CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.StockLoad = false;
                     }
                 });
            }else{
                toastr.info("Inventory is not Available");
				CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.StockLoad = false;
                CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }

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
                //Reverting the status if all the lines are deleted
                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='LOD' && CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length==0){
                    CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus = 'New';
                    CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CycleCountDesc = 'New (Unloaded)';
                    CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.PartiallyNonEditable = false;
                }
                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='New' && CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length!=0){
                    CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus = 'LOD';
                    CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CycleCountDesc = 'Loaded';
                }
                Saveonly($item);
            } else {
                CycleCountMenuCtrl.ePage.Masters.ReadyToFinalize = false;
                CycleCountMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CycleCountMenuCtrl.currentCycleCount);
            }
        }
        
        function Saveonly($item) {
            CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CycleCountMenuCtrl.ePage.Masters.DisableSave = true;
            CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsCycleCountHeader.PK = _input.PK;
                _input.UIWmsCycleCountHeader.CreatedDateTime = new Date();
                _input.UIWmsCycleCountHeader.StocktakeStatus = 'New';
                _input.UIWmsCycleCountHeader.CycleCountDesc = 'New (Unloaded)';
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if(CycleCountMenuCtrl.ePage.Masters.ReadyToFinalize){
                    CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus = "FIN";
                }
            }

            helperService.SaveEntity($item, 'CycleCount').then(function (response) {
                CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                CycleCountMenuCtrl.ePage.Masters.DisableSave = false;
                CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                
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
                    
                    if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='CAN'){
                        CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        CycleCountMenuCtrl.ePage.Masters.DisableSave = true;
                        toastr.success("Cancelled Successfully...!");
                    }else if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='FIN'){
                        CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        CycleCountMenuCtrl.ePage.Masters.DisableSave = true;
                        toastr.success("Saved Successfully...!");
                    }else if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus=='LOD'){
                        CycleCountMenuCtrl.ePage.Entities.Header.GlobalVariables.PartiallyNonEditable = true;
                        toastr.success("Saved Successfully...!");
                    }else{
                        toastr.success("Saved Successfully...!");
                    }

                    if(CycleCountMenuCtrl.ePage.Masters.SaveAndClose){
                        CycleCountMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        CycleCountMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }

                    GetLineList();
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    CycleCountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
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


        function FinalizeCycleCount(){
            var mydata = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.some(function(value,key){
                if(value.Status=='OPN')
                return true;
            });

            if(mydata){
                toastr.error("Before Finalizing CycleCount All Lines should be closed");
            }else{
                CycleCountMenuCtrl.ePage.Masters.ReadyToFinalize = true;
                Validation(CycleCountMenuCtrl.currentCycleCount);
            }
        }

        function GetLineList(){

             // warehouse
             if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode == null) {
                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode = "";
            }
            if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName == null) {
                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName = "";
            }
            CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode + ' - ' + CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
            if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse == ' - ')
                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = "";
            // Client
            if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode == null) {
                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode = "";
            }
            if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName == null) {
                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName = "";
            }
            CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode + ' - ' + CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
            if (CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client == ' - ')
                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = "";

                
            angular.forEach(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine,function(value,key){
                

                if(value.ClientCode==null){
                    value.ClientCode = '';
                }
                if(value.ClientName==null){
                    value.ClientName = '';
                }
                value.ClientFullName = value.ClientCode+' - '+value.ClientName;


                value.WarehouseCode = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode;
                value.WarehouseName = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
                value.WAR_FK = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_FK;
                value.SingleSelect = false;
                
                if(CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client){
                    value.Client = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }
            });
        }

        function CancelCycleCount($item){
            var myData = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.some(function(value,key){
               return value.Status=='CLO';    
            });

            if(!myData){
                $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function ($scope, $uibModalInstance) {
                        
                        $scope.close = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
    
                        $scope.ok = function(){
                            var InsertCommentObject = [];
                            var obj ={
                                "Description":"General",
                                "Comments": $scope.comment,
                                "EntityRefKey": CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.PK,
                                "EntityRefCode": CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeNumber,
                                "CommentsType":"GEN"
                            }
                            InsertCommentObject.push(obj);
                            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function(response){
    
                                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CancelledDate = new Date();
                                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeStatus = 'CAN';
                                CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CycleCountDesc = 'Cancelled';
                                Validation($item);
                                
                                $uibModalInstance.dismiss('cancel');
                            });
                        }
                    }
                });
            }else{
                toastr.error("Some line has closed so you cannot cancel this cyclecount");
            }
        }

        function GetDocuments(){

            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "CYL"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CycleCountMenuCtrl.ePage.Masters.DocumentValues =  response.data.Response;
                }
            });
        }

        function GenerateDocuments(item,type){

            CycleCountMenuCtrl.ePage.Masters.DisableReport = true;

            var obj = JSON.parse(item.OtherConfig)
            if(type=='excel'){
                obj.FileType = "Excel"
            }
            obj.JobDocs.EntityRefKey = item.Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = item.Description;
            obj.DataObjs[0].DataObject.Date = new Date();
            obj.DataObjs[0].DataObject.Date = $filter('date')(obj.DataObjs[0].DataObject.Date, 'yyyy-MM-dd');
            obj.DataObjs[0].DataObject.StocktakeNumber = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeNumber;
            obj.DataObjs[0].DataObject.CycleCountTypeDesc = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CycleCountTypeDesc;
            obj.DataObjs[0].DataObject.WarehouseName = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
            obj.DataObjs[0].DataObject.ClientName = CycleCountMenuCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
            obj.DataObjs[1].ApiName = obj.DataObjs[1].ApiName + CycleCountMenuCtrl.ePage.Entities.Header.Data.PK;
            
            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                if(response.data.Response.Status=='Success'){
                    apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                        if (response.data.Response){
                            if (response.data.Response !== "No Records Found!") {
                                helperService.DownloadDocument(response.data.Response);
                                CycleCountMenuCtrl.ePage.Masters.DisableReport = false;                            }
                        }
                    })
                }
            })
        }

        
        Init();

    }

})();