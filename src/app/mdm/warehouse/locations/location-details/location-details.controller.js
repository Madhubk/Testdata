(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LocationDetailsController", LocationDetailsController);

    LocationDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "locationConfig", "helperService", "$filter", "$uibModal", "toastr", "appConfig","$sce"];

    function LocationDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, locationConfig, helperService, $filter, $uibModal, toastr, appConfig,$sce) {
        / jshint validthis: true /
        var LocationDetailsCtrl = this;
        function Init() {


            var currentLocation = LocationDetailsCtrl.currentLocation[LocationDetailsCtrl.currentLocation.label].ePage.Entities;

            LocationDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Location_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentLocation
            };

            LocationDetailsCtrl.ePage.Masters.Config = locationConfig;

            //For table
            LocationDetailsCtrl.ePage.Masters.SelectAll = false;
            LocationDetailsCtrl.ePage.Masters.EnableUpdateButton = false;
            LocationDetailsCtrl.ePage.Masters.Enable = true;
            LocationDetailsCtrl.ePage.Masters.selectedRow = -1;
            LocationDetailsCtrl.ePage.Masters.emptyText = '-';
            LocationDetailsCtrl.ePage.Masters.SearchTable = '';

            LocationDetailsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            LocationDetailsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            LocationDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            
            LocationDetailsCtrl.ePage.Masters.DropDownMasterList = {};

            LocationDetailsCtrl.ePage.Masters.GetPickPathSequenceValue = GetPickPathSequenceValue;
            LocationDetailsCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            LocationDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            LocationDetailsCtrl.ePage.Masters.GetLocations = GetLocations;
            LocationDetailsCtrl.ePage.Masters.CheckMaximumValues = CheckMaximumValues;
            LocationDetailsCtrl.ePage.Masters.UpdateV2 = UpdateV2;
            LocationDetailsCtrl.ePage.Masters.GenerateBarcode = GenerateBarcode;

            GetUserBasedGridColumList();
            GeneralOperations();
            GetDropDownList();
            GetOtherWarehouseDetails();
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_LOCATIONMASTER",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    LocationDetailsCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        LocationDetailsCtrl.ePage.Entities.Header.TableProperties.WmsLocation = obj;
                        LocationDetailsCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    LocationDetailsCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
        
        //#region GeneralOperations

        function GetInventoryDetails(callback){
            if(!LocationDetailsCtrl.currentLocation.isNew){
                LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "WRO_FK": LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.PK,
                    "PageNumber":"1",
                    "PageSize": "10",
                    "SortType": "ASC",
                    "SortColumn":"WOL_CreatedDateTime",
                };
                
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": LocationDetailsCtrl.ePage.Entities.Header.API.Inventory.FilterID
                };
                apiService.post("eAxisAPI", LocationDetailsCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                    LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    if(response.data.Response.length>0){
                        LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.CanEditLocation = true;
                    }
                    callback();
                });
            }
        }

        function GeneralOperations(){
            GetInventoryDetails(function(response){
                if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName == null)
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName = "";
                if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode == null)
                    LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode = "";

                    LocationDetailsCtrl.ePage.Masters.Warehouse = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode + "-" + LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName;
                if (LocationDetailsCtrl.ePage.Masters.Warehouse == '-')
                    LocationDetailsCtrl.ePage.Masters.Warehouse = "";

                if(!LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Trays){
                    LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Trays = 1;
                } 
                LocationDetailsCtrl.ePage.Masters.DropdownCountForColumns = [];
                for(var i =0;i<500;i++){
                    var obj = {};
                    obj.Value = i;
                    if(LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.CanEditLocation && (i<=LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Columns)){
                        obj.isDisabled = true;
                    }else{
                        obj.isDisabled = false;
                    }
                    LocationDetailsCtrl.ePage.Masters.DropdownCountForColumns.push(obj); 
                }

                LocationDetailsCtrl.ePage.Masters.DropdownCountForLevels = [];
                for(var i =0;i<500;i++){
                    var obj = {};
                    obj.Value = i;
                    if(LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.CanEditLocation && (i<=LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Levels)){
                        obj.isDisabled = true;
                    }else{
                        obj.isDisabled = false;
                    }
                    LocationDetailsCtrl.ePage.Masters.DropdownCountForLevels.push(obj);  
                }

            })

            
            GetLocationLocalVariables();
        }

        function GetLocationLocalVariables(){

            LocationDetailsCtrl.ePage.Masters.LocalVariables ={
                "WAR_WarehouseCode":LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode,
                "WAA_Name":"",
                "WAA_FK":"",
                "LocationStatus":"",
                "LocationStatusDescription":"",
                "LocationType":"",
                "PickMethod":"",
                "PickMethodsDescription":"",
                "MaxWeight":"",
                "MaxWeightUnit":"",
                "MaxCubic":"",
                "MaxCubicUnit":"",
                "MaxQuantity":"",
            }

        }

        function SelectedLookupWarehouse(item) {
            
            LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK = item.PK;
            LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName = item.WarehouseName;
            LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode = item.WarehouseCode;
            LocationDetailsCtrl.ePage.Masters.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            OnChangeValues(LocationDetailsCtrl.ePage.Masters.Warehouse, 'E6001');

            GetOtherWarehouseDetails().then(function(response){
                GetPickPathSequenceValue('value');
            })
        }

        function GetPickPathSequenceValue(item){
            if(item=='value'){
                LocationDetailsCtrl.ePage.Masters.max = 0;
                angular.forEach(LocationDetailsCtrl.ePage.Masters.OtherWarehouseDetails, function (value, key) {
                    if (value.PickPathSequence > LocationDetailsCtrl.ePage.Masters.max) {
                        LocationDetailsCtrl.ePage.Masters.max = value.PickPathSequence;
                    }
                });
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.PickPathSequence = LocationDetailsCtrl.ePage.Masters.max + 1;
            }else{
            var myData = LocationDetailsCtrl.ePage.Masters.OtherWarehouseDetails.some(function(value,key){
                if(parseInt(value.PickPathSequence)==parseInt(item) && value.WAR_FK==LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK)
                return true;
            })
            if(myData){
                toastr.error("RowPath Sequence is Already Used in Another Row");
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.PickPathSequence = "";
                }
            }
        }

        function GetOtherWarehouseDetails() {
            var deferred = $q.defer();
            var _filter = {
                "WAR_FK": LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": locationConfig.Entities.Header.API.RowFindAll.FilterID,
            };
            if(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK){
                apiService.post("eAxisAPI", LocationDetailsCtrl.ePage.Entities.Header.API.RowFindAll.Url, _input).then(function (response) {                
                    LocationDetailsCtrl.ePage.Masters.OtherWarehouseDetails = response.data.Response;
                    deferred.resolve(LocationDetailsCtrl.ePage.Masters.OtherWarehouseDetails);
                });
            }
            return deferred.promise;
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "CubicUnit", "PickMethod", "LocStatus"];
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
                        LocationDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        LocationDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region  Validation

        function CheckMaximumValues(){
            if((LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeightUnit && !LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeight) || (!LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeightUnit && LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeight)){
                OnChangeValues(null,'E6012')
            }else{
                OnChangeValues('value','E6012')
            }

            if((LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubicUnit && !LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubic) || (!LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubicUnit && LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubic)){
                OnChangeValues(null,'E6013')
            }else{
                OnChangeValues('value','E6013')
            }
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(LocationDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                LocationDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, LocationDetailsCtrl.currentLocation.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                LocationDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, LocationDetailsCtrl.currentLocation.label);
            }
        }
        //#endregion

        //#region Checkboxselection
        function setSelectedRow(index){
            LocationDetailsCtrl.ePage.Masters.selectedRow = index;
        }

        function SelectAllCheckBox(){
            angular.forEach(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation, function (value, key) {
            if (LocationDetailsCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                LocationDetailsCtrl.ePage.Masters.EnableUpdateButton = true;
            }
            else{
                value.SingleSelect = false;
                LocationDetailsCtrl.ePage.Masters.EnableUpdateButton = false;
            }
            });
        }
    
        function SingleSelectCheckBox() {
            var Checked = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.some(function (value, key) {
                 if(!value.SingleSelect)
                 return true;
            });
            if (Checked) {
                LocationDetailsCtrl.ePage.Masters.SelectAll = false;
            } else {
                LocationDetailsCtrl.ePage.Masters.SelectAll = true;
            }
    
            var Checked1 = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                LocationDetailsCtrl.ePage.Masters.EnableUpdateButton = true;
            } else {
                LocationDetailsCtrl.ePage.Masters.EnableUpdateButton = false;
            }
        }
        //#endregion

        //#region  Save
        function GetLocations($item,$event) {
            var _Data = $item[$item.label].ePage.Entities,
                input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            LocationDetailsCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (LocationDetailsCtrl.ePage.Entities.Header.Validations) {
                LocationDetailsCtrl.ePage.Masters.Config.RemoveApiErrors(LocationDetailsCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                LocationDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(LocationDetailsCtrl.currentLocation);
            }
        }

        function UpdateV2(){
            if(!LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.CanEditLocation){
                LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                angular.forEach(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation,function(value,key){
                    if(value.SingleSelect){
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.WAA_Name){
                            value.WAA_Name = LocationDetailsCtrl.ePage.Masters.LocalVariables.WAA_Name;
                            value.WAA_FK =LocationDetailsCtrl.ePage.Masters.LocalVariables.WAA_FK;
                        }
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.LocationStatus){
                            value.LocationStatus = LocationDetailsCtrl.ePage.Masters.LocalVariables.LocationStatus;
                            value.LocationStatusDescription = LocationDetailsCtrl.ePage.Masters.LocalVariables.LocationStatusDescription;
                        }
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.LocationType){
                            value.LocationType = LocationDetailsCtrl.ePage.Masters.LocalVariables.LocationType;
                        }
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.PickMethod){
                            value.PickMethod = LocationDetailsCtrl.ePage.Masters.LocalVariables.PickMethod;
                            value.PickMethodsDescription = LocationDetailsCtrl.ePage.Masters.LocalVariables.PickMethodsDescription;
                        }
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeight){
                            value.MaxWeight = LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeight;
                            value.MaxWeightUnit = LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxWeightUnit;
                        }
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubic){
                            value.MaxCubic = LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubic;
                            value.MaxCubicUnit = LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxCubicUnit;
                        }
                        if(LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxQuantity){
                            value.MaxQuantity = LocationDetailsCtrl.ePage.Masters.LocalVariables.MaxQuantity;
                        }
                    }
                });
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation = filterObjectUpdate(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation, "IsModified");
                apiService.post("eAxisAPI", LocationDetailsCtrl.ePage.Entities.Header.API.updateOnlyLocation.Url, LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation).then(function (response) {
                    LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    LocationDetailsCtrl.ePage.Masters.EnableUpdateButton = false;
    
                    if (response.data.Response) {
                        GetLocationLocalVariables();
                        LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation = response.data.Response;
                        toastr.success("Location Updated Successfully.. ")
                    }
                });
            }else{
                toastr.warning("Product Availble in the current Row. So it cannot be edited.");
            }
        }

        function Save($item) {
            LocationDetailsCtrl.ePage.Masters.active = 0;
            LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            if ($item.isNew) {
                _input.WmsRow.PK = _input.PK;
                _input.WmsRow.CreatedDateTime = new Date();

                //Converting into Upper Case
                _input.WmsRow.Name = _input.WmsRow.Name.toUpperCase();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Location').then(function (response) {
                LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                
                if (response.Status === "success") {
                    locationConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                                value[LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name] = value.New;
                                delete value.New;
                                value.code=LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                            }
                        }
                    });

                    var _index = locationConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(LocationDetailsCtrl.currentLocation[LocationDetailsCtrl.currentLocation.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        
                        //Changing Label name when row name changes
                        if(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name != locationConfig.TabList[_index].label){
                            locationConfig.TabList[_index].label = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label] = locationConfig.TabList[_index][locationConfig.TabList[_index].code];
                            delete locationConfig.TabList[_index][locationConfig.TabList[_index].code];
                            locationConfig.TabList[_index].code = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name
                        }

                        locationConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/location") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    toastr.success("Saved Successfully...!");
                    LocationDetailsCtrl.ePage.Masters.active = 1;

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    LocationDetailsCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        LocationDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, LocationDetailsCtrl.currentLocation.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (LocationDetailsCtrl.ePage.Entities.Header.Validations != null) {
                        LocationDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(LocationDetailsCtrl.currentLocation);
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
        //#endregion
        
        //#region Generate Barcode
        function GenerateBarcode(){
            LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            LocationDetailsCtrl.ePage.Masters.BarcodeGenerationList = [];
            LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.map(function(value,key){
                if(value.SingleSelect){
                    LocationDetailsCtrl.ePage.Masters.BarcodeGenerationList.push(value);
                }
            });
            apiService.post("eAxisAPI", LocationDetailsCtrl.ePage.Entities.Header.API.LocationBarcode.Url, LocationDetailsCtrl.ePage.Masters.BarcodeGenerationList).then(function (response){
                if(response.data.Response){
                    LocationDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    $uibModal.open({
                        windowClass: "general-edit  locationbarcode",
                        templateUrl: 'app/mdm/warehouse/locations/location-details/tabs/location-barcode-modal.html',
                        controller: function ($scope, $uibModalInstance) {
                            
                            function base64ToArrayBuffer(base64) {
                                var binaryString = window.atob(base64);
                                var binaryLen = binaryString.length;
                                var bytes = new Uint8Array(binaryLen);
                                for (var i = 0; i < binaryLen; i++) {
                                    var ascii = binaryString.charCodeAt(i);
                                    bytes[i] = ascii;
                                }
                                var blob = new Blob([(bytes)], {
                                    type: "application/pdf"
                                });
                                var fileURL = URL.createObjectURL(blob);
                                $scope.Barcodecontent = $sce.trustAsResourceUrl(fileURL);
                                var a = document.createElement("a");
                                document.body.appendChild(a);
                                a.style = "display: none";
                                a.href = fileURL;
                                a.download = 'locationbarcode.pdf';
                            }
        
                            base64ToArrayBuffer(response.data.Response);
        
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    });
                }else{
                    toastr.error("Could Not Generate Barcode");
                }
            });
        }
        //#endregion
        Init();
    }
})();