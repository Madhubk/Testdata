(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickAllocationController", PickAllocationController);

    PickAllocationController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "confirmation", "toastr", "$filter", "$state", "$q"];

    function PickAllocationController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, confirmation, toastr, $filter, $state, $q) {

        var PickAllocationCtrl = this;

        function Init() {

            var currentPick = PickAllocationCtrl.currentPick[PickAllocationCtrl.currentPick.label].ePage.Entities;

            PickAllocationCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            PickAllocationCtrl.ePage.Masters.Config = pickConfig;

            PickAllocationCtrl.ePage.Masters.Enable = true;
            PickAllocationCtrl.ePage.Masters.SearchTable = '';
            PickAllocationCtrl.ePage.Masters.EnableForInventory = true;
            PickAllocationCtrl.ePage.Masters.SearchTableForInventory = '';
            PickAllocationCtrl.ePage.Masters.selectedRow = -1;

            PickAllocationCtrl.ePage.Masters.InventoryDetails = undefined;

            PickAllocationCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            PickAllocationCtrl.ePage.Masters.AllocateStock = AllocateStock;
            PickAllocationCtrl.ePage.Masters.DeAllocateStock = DeAllocateStock;
            PickAllocationCtrl.ePage.Masters.ManualAllocationUsingTextBox = ManualAllocationUsingTextBox;
            PickAllocationCtrl.ePage.Masters.ManualAllocationUsingCheckBox = ManualAllocationUsingCheckBox;
            PickAllocationCtrl.ePage.Masters.GetInventoryDetails = GetInventoryDetails;

            GetGeneralDetails();
            GetUserBasedGridColumList();
            GetUserBasedGridColumListForInventory();
        }

        function GetGeneralDetails() {
            // Order By
            PickAllocationCtrl.ePage.Masters.EnableAllocateStock = true;
            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'PK');

            if(PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines.length==0){
                PickAllocationCtrl.ePage.Masters.EnableAllocateStock = false;
            }

            var myData = PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutward.some(function (value, key) {
                if (value.WorkOrderStatus != 'FIN') { return true }
            });
            if (!myData || PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'PIF' || PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'CAN') {
                PickAllocationCtrl.ePage.Masters.EnableAllocateStock = false;
            }

        }

        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKOUTWARDLINES",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    PickAllocationCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PickAllocationCtrl.ePage.Entities.Header.TableProperties.UIWmsOutwardLines = obj;
                        PickAllocationCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    PickAllocationCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }

        function GetUserBasedGridColumListForInventory() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKINVENTORY",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    PickAllocationCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PickAllocationCtrl.ePage.Entities.Header.TableProperties.PickInventoryList = obj;
                        PickAllocationCtrl.ePage.Masters.UserHasValueForInventory = true;
                    }
                } else {
                    PickAllocationCtrl.ePage.Masters.UserValueForInventory = undefined;
                }
            })
        }

        

        function ManualAllocationUsingCheckBox(item) {

            // if checkbox enabled
            if (item.IsAllocate) {

                //Finding Total Allocated Value for that Selected Ordered Line
                var OverallAllocatedValue_In_Inv = 0;
                PickAllocationCtrl.ePage.Masters.InventoryDetails.map(function (value, key) {
                    if (parseFloat(value.AllocatedQty))
                    OverallAllocatedValue_In_Inv = OverallAllocatedValue_In_Inv + parseFloat(value.AllocatedQty);
                });

                // if Inlocation qty is empty
                if (!parseFloat(item.InLocationQty)) {
                    item.IsAllocate = false;
                    toastr.warning("Qty is Empty in that location, please choose another")
                }

                // if Inlocation Qty has value
                if (parseFloat(item.InLocationQty)){
                    
                    //If Ordered Qty Matches with Allocated Qty
                    if (parseFloat(PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.Units) == OverallAllocatedValue_In_Inv){
                        toastr.warning("Ordered Qty Already Allocated with Inventory Stocks")
                        item.IsAllocate = false
                    }

                    // If Ordered Qty is Greater than TotalAllocated value then calculating Remaining Qty
                    if (parseFloat(PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.Units) > OverallAllocatedValue_In_Inv){
                        var Remaining_OrdQty = parseFloat(PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.Units) - OverallAllocatedValue_In_Inv;

                         //Remaining Ordered Qty is less than Location qty else greater than location qty
                         if (Remaining_OrdQty < parseFloat(item.InLocationQty)) {
                            item.AllocatedQty = Remaining_OrdQty;
                            item.InLocationQty = (parseFloat(item.InLocationQty) - Remaining_OrdQty).toFixed(7);
                            item.CommitedUnit = ( parseFloat(item.CommitedUnit) + parseFloat(item.AllocatedQty)  ).toFixed(7);
                        } else {
                            item.AllocatedQty = parseFloat(item.InLocationQty);
                            item.InLocationQty = 0;
                            item.CommitedUnit = ( parseFloat(item.CommitedUnit) + parseFloat(item.AllocatedQty)  ).toFixed(7);
                        }
                    }
                } 
            }

            // If unchecked the checkbox reverting everything
            else {
                PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(value,key){
                    if ((value.WOL_InventoryLine_FK == item.PK) && (value.WOL_TransactionLine == PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.PK)) {
                        if(!value.PickedDateTime)
                        item.CommitedUnit = Math.abs(parseFloat(item.CommitedUnit) - parseFloat(value.Units));
                        item.InLocationQty = Math.abs(parseFloat(item.InLocationQty) + parseFloat(value.Units))
                    }
                });
                item.AllocatedQty = 0;
            }

            //Updating Available to Pick if Product Condition is Good
            if(item.ProductCondition=="GDC"){
                item.AvailableToPick = item.InLocationQty;
            }
            AddingPickLine(item)
        }

        function ManualAllocationUsingTextBox(item) {

            //Finding Total Allocated Value for that Selected Ordered Line
            var OverallAllocatedValue_In_Inv = 0;
            PickAllocationCtrl.ePage.Masters.InventoryDetails.map(function (value, key) {
                if (parseFloat(value.AllocatedQty))
                    OverallAllocatedValue_In_Inv = OverallAllocatedValue_In_Inv + parseFloat(value.AllocatedQty);
            });

             // If Already AllocatedQty Value getting Changed reverting Inlocation qty and committed value 
             PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(value,key){
                if ((value.WOL_InventoryLine_FK == item.PK) && (value.WOL_TransactionLine == PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.PK)){
                
                    if(!value.PickedDateTime){
                        item.CommitedUnit = Math.abs(parseFloat(item.CommitedUnit) - parseFloat(value.Units));
                        item.InLocationQty = Math.abs(parseFloat(item.InLocationQty) + parseFloat(value.Units))
                        value.Units = 0;
                    }  
                }
            });


            // If TextBox having Value
            if (parseFloat(item.AllocatedQty)) {
                item.IsAllocate = true;

                if (OverallAllocatedValue_In_Inv > parseFloat(PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.Units)) {
                    item.AllocatedQty = 0;
                    item.IsAllocate = false;
                    toastr.warning("Allocated Qty should not be greater than Ordered Qty");
                }

                // if Inlocation is less than allocated qty
                else if (parseFloat(item.AllocatedQty) > parseFloat(item.InLocationQty)) {
                    item.AllocatedQty = 0;
                    item.IsAllocate = false;
                    toastr.warning("Allocated Qty should not be greater than Inlocation Qty")
                }
            }else{
                item.IsAllocate = false;
                item.AllocatedQty = 0;
            }

            AddingPickLine(item);

            // After Adding Or removing line from Pickline Calculating CommitedUnit and Inlocation qty and Available to pick
            item.InLocationQty = (parseFloat(item.InLocationQty) - parseFloat(item.AllocatedQty)).toFixed(7);
            item.CommitedUnit = (parseFloat(item.CommitedUnit) + parseFloat(item.AllocatedQty)).toFixed(7);
            if(item.ProductCondition=="GDC"){
                item.AvailableToPick = item.InLocationQty;
            }

             // Adding Intransit Unit to the allocated Qty 
             PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(value,key){
                if ((value.WOL_InventoryLine_FK == item.PK) && (value.WOL_TransactionLine == PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.PK)){
                
                    if(value.PickedDateTime){
                        item.IsAllocate = true;
                        item.AllocatedQty = (parseFloat(item.AllocatedQty) + parseFloat(value.Units)).toFixed(7);
                    }  
                }
            });
        }

        function AddingPickLine(item) {
            var myData = false;
            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function (value, key) {
                if ((value.WOL_InventoryLine_FK == item.PK) && (value.WOL_TransactionLine == PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.PK)) {

                    if(!value.PickedDateTime){
                        if (parseFloat(item.AllocatedQty)) {
                            value.Units = parseFloat(item.AllocatedQty);
                        } else {
                            value.Units = 0;
                            value.IsDeleted = true;
                            item.IsTouched = true;
                        }
                        myData = true;
                    }
                }
            });

            if (!myData && parseFloat(item.AllocatedQty)) {
                var obj = {
                    "WOL_InventoryLine_FK": item.PK,
                    "WOL_TransactionLine": PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails.PK,
                    "Units": parseFloat(item.AllocatedQty),
                    "IsDeleted": false,
                    "IsModified": true,
                    "IsTouched" : true
                }
                PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.push(obj);
            }

            //Removing data which is not having PK
            for (var i = PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.length - 1; i >= 0; i--) {
                if (!PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine[i].PK && PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine[i].IsDeleted)
                    PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.splice(i, 1);
            }
        }

        function setSelectedRow(item, index) {
            PickAllocationCtrl.ePage.Masters.SelectedOutwardLineDetails = item;
            if (item.WorkOrderLineStatus == 'FIN' || !PickAllocationCtrl.ePage.Masters.InventoryDetails) {
                GetInventoryDetails(item);
            } else {
                Validation(PickAllocationCtrl.currentPick).then(function (response) {
                    GetInventoryDetails(item);
                })
            }
            PickAllocationCtrl.ePage.Masters.selectedRow = index;
        }

        function GetInventoryDetails(item) {
            PickAllocationCtrl.ePage.Entities.Header.GlobalVariables.FetchingInventoryDetails = false;
            if(item){
                PickAllocationCtrl.ePage.Masters.Loading = true;
                PickAllocationCtrl.ePage.Masters.LoadingValue = "Fetching Inventory Details.."
                var _filter = {
                    "PRO_FK": item.PRO_FK,
                    "ORG_FK": item.Client_FK,
                    "WAR_FK": item.WAR_FK,
                    "PartAttrib1": item.PartAttrib1,
                    "PartAttrib2": item.PartAttrib2,
                    "PartAttrib3": item.PartAttrib3,
                    "PackingDate": item.PackingDate,
                    "ExpiryDate": item.ExpiryDate,
                    "FinalisedDateNotNull":"NOTNULL",
                    "SortColumn": "WOL_CreatedDateTime",
                    "SortType": "ASC"
                };
                if(item.ProductCondition=="GDC"){
                    _filter.OriginalInventoryStatus = "AVL"
                }else{
                    _filter.OriginalInventoryStatus = "HEL"
                }
                
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": PickAllocationCtrl.ePage.Entities.Header.API.Inventory.FilterID
                };
                apiService.post("eAxisAPI", PickAllocationCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                    PickAllocationCtrl.ePage.Masters.Loading = false;
                    if (response.data.Response) {
                        PickAllocationCtrl.ePage.Masters.InventoryDetails = response.data.Response;
                        PickAllocationCtrl.ePage.Masters.InventoryDetails.map(function (value, key) {
    
                            value.AllocatedQty = 0;
    
                            // To Enable and Disable Inventory Columns based on status
                            if (item.WorkOrderLineStatus == 'FIN') {
                                value.IsDisabled = true;
                            }

                            // To Enable and Disable TextBox based on Miscserv
                            PickAllocationCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.map(function(val,k){
                                if((item.Client_FK == val.ORG_FK ) && ((val.IMPartAttrib1Type == 'SER' && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured)|| (val.IMPartAttrib2Type == 'SER' && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (val.IMPartAttrib3Type == 'SER' && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)))
                                value.DisableTextBox = true;
                            })
    
                            // To Enable and Disable Inventory Columns based on Release Line
                            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function (val, k) {
                                if ((val.WOL_TransactionLine == item.PK) && (val.WOL_InventoryLine_FK == value.PK)) {
                                    PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.map(function(v){
                                        if(v.WPL_FK == val.PK){
                                            value.IsDisabled = true;  
                                        }
                                    });
                                }
                            });

                            // Matching Current Inventory Value along with pickline to calculate Allocated Qty
                            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function (val, k) {
                                if ((val.WOL_TransactionLine == item.PK) && (val.WOL_InventoryLine_FK == value.PK)) {
                                    value.AllocatedQty = value.AllocatedQty + parseFloat(val.Units);
                                    value.IsAllocate = true;

                                    //If  qty is picked we need to disable the checkbox
                                    if(val.PickedDateTime){
                                        value.DisableCheckBox = true;
                                    }
                                }
                            });

                        })
                    }
                });
            }
        }
          
        function AllocateStock() {
            Validation(PickAllocationCtrl.currentPick).then(function(response){
                PickAllocationCtrl.ePage.Masters.Loading = true;
                PickAllocationCtrl.ePage.Masters.LoadingValue = "Allocating Stock..";

                PickAllocationCtrl.currentPick = filterObjectUpdate(PickAllocationCtrl.currentPick, "IsModified");

                // Changing IsModified if only values has been touched.
                PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(v,k){
                    if(v.IsTouched){
                        v.IsModified = true;
                    }else{
                        v.IsModified = false;
                    }
                });

                apiService.post("eAxisAPI", PickAllocationCtrl.ePage.Entities.Header.API.AllocateStock.Url, PickAllocationCtrl.ePage.Entities.Header.Data).then(function (response) {
                    PickAllocationCtrl.ePage.Masters.Loading = false;

                    if (response.data.Status == "Success") {
                        if (response.data.Response) {
                            PickAllocationCtrl.ePage.Entities.Header.Data = response.data.Response;
                            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'PK');
                            toastr.success("Stock allocated successfully");
                            
                            PickAllocationCtrl.ePage.Masters.selectedRow = -1;
                            PickAllocationCtrl.ePage.Masters.InventoryDetails = undefined;
                        }
                    } else {
                        toastr.error("Stock allocation failed");
                    }
                });
            
            });
        }

        function DeAllocateStock(){
            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(value,key){
                if(value.WorkOrderLineStatus!='FIN' && !value.PickedDateTime){
                    value.Units = 0;
                    value.IsDeleted= true;
                }
            });

            PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutward.map(function(value,key){
                value.PutOrPickSlipDateTime  = null;
                value.PutOrPickCompDateTime  = null;
                value.WorkOrderStatus = "OSP";
                value.WorkOrderStatusDesc = "Pick Started";
            });

            PickAllocationCtrl.ePage.Masters.selectedRow = -1;
            PickAllocationCtrl.ePage.Masters.InventoryDetails = undefined;
            Validation(PickAllocationCtrl.currentPick);
        }

        function Validation($item) {
            var deferred = $q.defer();
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickAllocationCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickAllocationCtrl.ePage.Entities.Header.Validations) {
                PickAllocationCtrl.ePage.Masters.Config.RemoveApiErrors(PickAllocationCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item).then(function (response) {
                    deferred.resolve(true);
                });

            } else {
                PickAllocationCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickAllocationCtrl.currentPick);
            }
            return deferred.promise;
        }

        function Save($item) {
            var deferred = $q.defer();
            PickAllocationCtrl.ePage.Masters.Loading = true;
            PickAllocationCtrl.ePage.Masters.LoadingValue = "Saving your Data..";

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            _input.UIWmsOutward.map(function (value, key) {
                value.WPK_FK = _input.UIWmsPickHeader.PK;
            })
            _input.UIWmsOutwardLines.map(function (value, key) {
                value.WPK_FK = _input.UIWmsPickHeader.PK;
            })

            // Changing IsModified if only values has been touched.
            _input.UIWmsPickLine.map(function(v,k){
                if(v.IsTouched){
                    v.IsModified = true;
                }else{
                    v.IsModified = false;
                }
            });
            _input.UIWmsPickLineSummary.map(function(v,k){
                if(v.IsTouched){
                    v.IsModified = true;
                }else{
                    v.IsModified = false;
                }
            });
            
            //Updating the status when manual allocation and deallocation happens
            _input.UIWmsOutward.map(function(value,key){
                _input.UIWmsPickLine.map(function(val,k){
                    if(!val.Units){
                        if(value.PK==val.WOD_FK){
                            value.PutOrPickSlipDateTime  = null;
                            value.PutOrPickCompDateTime  = null;
                            value.WorkOrderStatus = "OSP";
                            value.WorkOrderStatusDesc = "Pick Started";
                        }
                    }
                })
            });
            
            apiService.post("eAxisAPI", PickAllocationCtrl.ePage.Entities.Header.API.UpdatePick.Url, _input).then(function (response) {
                PickAllocationCtrl.ePage.Masters.Loading = false;
                if (response.data.Status === "Success") {
                    PickAllocationCtrl.ePage.Entities.Header.Data = response.data.Response;
                    PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WorkOrderStatus = 'ENT';
                    PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickAllocationCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'PK');

                    deferred.resolve(true);
                } else{
                    toastr.error("Could not Save...!");
                    PickAllocationCtrl.ePage.Masters.InventoryDetails = [];
                    PickAllocationCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickAllocationCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickAllocationCtrl.currentPick.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (PickAllocationCtrl.ePage.Entities.Header.Validations != null) {
                        PickAllocationCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickAllocationCtrl.currentPick);
                    }
                }
            })
            return deferred.promise;
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