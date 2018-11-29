(function () {
    "use strict";

    angular
    .module("Application")
    .controller("LevelLoadEditController", LevelLoadEditController);

    LevelLoadEditController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$filter","$injector","param", "confirmation","dynamicLookupConfig"];
    
    function LevelLoadEditController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $filter,$injector, param, confirmation,dynamicLookupConfig) {

        var LevelLoadEditCtrl = this;
        // dynamicLookupConfig = $injector.get("dynamicLookupConfig");
        function Init() {
            var currentLoad = param;

            LevelLoadEditCtrl.ePage = {
                "Title": "",
                "Prefix": "LevelLoadEdit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentLoad
            };

            LevelLoadEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            LevelLoadEditCtrl.ePage.Masters.Cancel = Cancel;
            LevelLoadEditCtrl.ePage.Masters.emptyText = "-";
            LevelLoadEditCtrl.ePage.Masters.selectedRow = -1;
            LevelLoadEditCtrl.ePage.Masters.Lineslist = true;
            LevelLoadEditCtrl.ePage.Masters.HeaderName = '';

            LevelLoadEditCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            LevelLoadEditCtrl.ePage.Masters.Edit = Edit;
            LevelLoadEditCtrl.ePage.Masters.RemoveRow = RemoveRow;
            LevelLoadEditCtrl.ePage.Masters.AddNew = AddNew;
            LevelLoadEditCtrl.ePage.Masters.Back = Back;
            LevelLoadEditCtrl.ePage.Masters.Done = Done;
            LevelLoadEditCtrl.ePage.Masters.SaveList = SaveList;
            LevelLoadEditCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            LevelLoadEditCtrl.ePage.Masters.DropDownMasterList = {};
            FilterbyStore()
            GetDynamicLookupConfig()
            GetDropDownList() 
            if(LevelLoadEditCtrl.ePage.Entities.isNewMode){
                AddNew()
            }
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["LevelLoadType"];
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
                        LevelLoadEditCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        LevelLoadEditCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function FilterbyStore(){
            LevelLoadEditCtrl.ePage.Masters.LevelLoad = [];
            LevelLoadEditCtrl.ePage.Masters.LevelLoad = $filter('filter')(LevelLoadEditCtrl.ePage.Entities.Entity,function (value, key) {
                return value.StoreCode == LevelLoadEditCtrl.ePage.Entities.Item;
            });
        }

        function Cancel() {
            // $uibModalInstance.dismiss("cancel");
            $uibModalInstance.close(LevelLoadEditCtrl.ePage.Entities.Entity)
        }

        function Back() {
            var item = LevelLoadEditCtrl.ePage.Masters.LevelLoad[LevelLoadEditCtrl.ePage.Masters.selectedRow];
            if (item.PK == "" || item.PK == undefined) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        LevelLoadEditCtrl.ePage.Masters.LevelLoad.splice(LevelLoadEditCtrl.ePage.Masters.selectedRow, 1);
                        LevelLoadEditCtrl.ePage.Masters.Lineslist = true;
                        LevelLoadEditCtrl.ePage.Masters.selectedRow = LevelLoadEditCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                LevelLoadEditCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done($item){
            var _isExist;
            var test1 = _.groupBy(LevelLoadEditCtrl.ePage.Entities.Entity, 'StoreCode');
            angular.forEach(test1, function (value, key) {
                if (key == $item.StoreCode) {
                   _isExist = test1[key].some(function (value1,key1){
                        return value1.LevelLoadType == $item.LevelLoadType
                    });

                    // angular.forEach(test1[key],function(value1,key1){
                    //     if(value1.LevelLoadType == $item.LevelLoadType){
                    //         _isExist = true;
                    //         return false
                    //     }else{
                    //         _isExist = false;
                    //         $item.IsModified = true;
                    //     }
                    // });     
                }
            });

            
            if (!_isExist) {
                var item  = [];
                item.push ($item);
                var isStoreExist = false;
                angular.forEach(test1, function (value, key) {
                    if (value.length == 0 && key == $item.StoreCode) {
                        isStoreExist = true; 
                    }    
                });    
                if(!isStoreExist){
                    if(!item[0].StoreCode){
                        toastr.warning("Store is Mandatory");    
                    }else if(!item[0].LevelLoadType){
                        toastr.warning("LevelLoadType is Mandatory");
                    }else{
                        apiService.post("eAxisAPI", "TmsLevelLoadLimit/Insert", item).then(function SuccessCallback(response) {
                            if (response.data.Status == "Success") {
                                toastr.success("Saved Successfully");
                                LevelLoadEditCtrl.ePage.Masters.Lineslist = true;
                            }else{
                                toastr.error("Save Failed");
                            }
                        });
                    }
                }else{
                    toastr.warning($item.StoreCode + " Already Available...!");
                }                       
           } else {
                if(!$item.PK){
                    toastr.warning($item.LevelLoadType + " Already Available...!");
                }else{
                    if(!$item.LevelLoadType){
                        toastr.warning("LevelLoadType is Mandatory")
                    }
                    $item.IsModified = true;
                    apiService.post("eAxisAPI", "TmsLevelLoadLimit/Update", $item).then(function SuccessCallback(response) {
                     if (response.data.Status == "Success") {
                            toastr.success(" Saved Successfully");
                            LevelLoadEditCtrl.ePage.Masters.Lineslist = true;
                        }else{
                            toastr.error("Save Failed");
                        }
                    });     
                }
            }            
        }

        function SaveList($item) {
            LevelLoadEditCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = LevelLoadEditCtrl.ePage.Masters.LevelLoad,
                _input = _Data;

            $item = filterObjectUpdate($item, "IsModified");

            angular.forEach(_input, function (value, key) {
                value.IsModified = true;
            });
            angular.forEach(_input, function (value, key) {
                if(value.PK == undefined){
                _input = value; 
                }
            });

            apiService.post("eAxisAPI", "TmsLevelLoadLimit/Update", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    toastr.success("Item Saved Successfully");
                    LevelLoadEditCtrl.ePage.Masters.IsLoadingToSave = false;
                    LevelLoadEditCtrl.ePage.Entities.Header.Data = response.data.Response.Response;
                } else {
                    toastr.error("Item save failed. Please try again later");
                    LevelLoadEditCtrl.ePage.Masters.IsLoadingToSave = false;
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

        function AddNew() {
            var obj = {
                    "DepotLimitMax"     : "999",
                    "DepotLimitMin"     : "999",
                    "DepotLimitWarning" : "999",
                    "StorageDaysMax"    : "999",
                    "StorageDaysWarning": "999",
                    "StoreName"         : "",
                    "PK"                : "",
                    "StoreCode"         : LevelLoadEditCtrl.ePage.Entities.Item,
                    "LevelLoadType"     : "",
                    "MondayLimit"       : "",
                    "TuesdayLimit"      : "",
                    "WednesdayLimit"    : "",   
                    "ThursdayLimit"     : "",
                    "FridayLimit"       : "",
                    "SaturdayLimit"     : "",
                    "IsModified"        : false,
                    "IsDeleted"         :  false,
                    }
            LevelLoadEditCtrl.ePage.Masters.LevelLoad.push(obj);
            LevelLoadEditCtrl.ePage.Masters.Edit(LevelLoadEditCtrl.ePage.Masters.LevelLoad.length - 1, 'New List');
        }

        function SelectedLookupSender(item){
            if(item.data){
                LevelLoadEditCtrl.ePage.Entities.Item = item.data.entity.Code;
                LevelLoadEditCtrl.ePage.Masters.LevelLoad[LevelLoadEditCtrl.ePage.Masters.selectedRow].StoreCode = item.data.entity.Code;
            }else{
                LevelLoadEditCtrl.ePage.Entities.Item = item.Code;
                LevelLoadEditCtrl.ePage.Masters.LevelLoad[LevelLoadEditCtrl.ePage.Masters.selectedRow].StoreCode = item.Code;
            }
        }

        function setSelectedRow(index) {
            LevelLoadEditCtrl.ePage.Masters.selectedRow = index;
        }

        function Edit(index, name) {
            LevelLoadEditCtrl.ePage.Masters.selectedRow = index;
            LevelLoadEditCtrl.ePage.Masters.Lineslist = false;
            LevelLoadEditCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        function RemoveRow($item) {
            var item = LevelLoadEditCtrl.ePage.Masters.LevelLoad[LevelLoadEditCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK == "") {
                        var ReturnValue = RemoveAllLineErrors();
                        if (ReturnValue) {
                            LevelLoadEditCtrl.ePage.Masters.LevelLoad.splice(LevelLoadEditCtrl.ePage.Masters.selectedRow, 1);
                            LevelLoadEditCtrl.ePage.Masters.Config.GeneralValidation(LevelLoadEditCtrl.currentLoad);
                        }
                        LevelLoadEditCtrl.ePage.Masters.Lineslist = true;
                        LevelLoadEditCtrl.ePage.Masters.selectedRow = LevelLoadEditCtrl.ePage.Masters.selectedRow - 1;
                    } else {
                        item.IsDeleted = true;

                        LevelLoadEditCtrl.ePage.Entities.Header.Data = filterObjectUpdate(LevelLoadEditCtrl.ePage.Entities.Header.Data, "IsModified");
                        apiService.post("eAxisAPI", 'TmsConsignmentList/Update', LevelLoadEditCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                                    LevelLoadEditCtrl.ePage.Entities.Header.Data = response.data.Response;
                                    toastr.success('Item Removed Successfully');
                                    var ReturnValue = RemoveAllLineErrors();
                                    if (ReturnValue) {
                                        LevelLoadEditCtrl.ePage.Masters.Config.GeneralValidation(LevelLoadEditCtrl.currentLoad);
                                    }
                                    LevelLoadEditCtrl.ePage.Masters.selectedRow = LevelLoadEditCtrl.ePage.Masters.selectedRow - 1;
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var DataEntryNameList = "OrganizationList,TransportsConsignment,TransportItem,TransportsManifest,ConsignmentLeg";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    LevelLoadEditCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }

})();