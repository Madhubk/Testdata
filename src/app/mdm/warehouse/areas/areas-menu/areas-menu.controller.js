(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AreasMenuController", AreasMenuController);

    AreasMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "areasConfig", "helperService", "appConfig", "$state","toastr"];

    function AreasMenuController($scope, $timeout, APP_CONSTANT, apiService, areasConfig, helperService, appConfig, $state,toastr) {
        var AreasMenuCtrl = this;

        function Init() {

            var currentAreas = AreasMenuCtrl.currentAreas[AreasMenuCtrl.currentAreas.label].ePage.Entities;
            AreasMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Areas_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAreas
            };
           
            // function

            AreasMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            AreasMenuCtrl.ePage.Masters.Validation = Validation;
            AreasMenuCtrl.ePage.Masters.IsDisableSave = false;
            AreasMenuCtrl.ePage.Masters.Config = areasConfig;
            
            AreasMenuCtrl.ePage.Masters.CopyofCurrentObject = angular.copy(AreasMenuCtrl.ePage.Entities.Header.Data);

            GetInventoryDetails();
            
        }


        function GetInventoryDetails(){
            if(!AreasMenuCtrl.currentAreas.isNew){
                AreasMenuCtrl.ePage.Masters.Loading = true;
                var _filter = {
                    "WAA_FK": AreasMenuCtrl.ePage.Entities.Header.Data.PK,
                    "PageNumber":"1",
                    "PageSize": "1",
                    "SortType": "ASC",
                    "SortColumn":"WOL_CreatedDateTime",
                };
                
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": AreasMenuCtrl.ePage.Entities.Header.API.Inventory.FilterID
                };
                apiService.post("eAxisAPI", AreasMenuCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                    AreasMenuCtrl.ePage.Masters.Loading = false;
                    if(response.data.Response.length>0){
                        AreasMenuCtrl.ePage.Entities.Header.GlobalVariables.CannotEditArea = true;
                        toastr.warning('Product available in this Area. So you can not edit some fields.', {
                            tapToDismiss: false,
                            closeButton: true,
                            timeOut: 20000
                        });
                    }
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            AreasMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AreasMenuCtrl.ePage.Entities.Header.Validations) {
                AreasMenuCtrl.ePage.Masters.Config.RemoveApiErrors(AreasMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                AreasMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AreasMenuCtrl.currentAreas);
            }
        }

        function Save($item) {
            AreasMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            AreasMenuCtrl.ePage.Masters.IsDisableSave = true;
            AreasMenuCtrl.ePage.Masters.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();

                //Converting into Upper Case
                _input.Name = _input.Name.toUpperCase();
            } else {
                AreasMenuCtrl.ePage.Entities.Header.Data = PostSaveObjectUpdate(AreasMenuCtrl.ePage.Entities.Header.Data, AreasMenuCtrl.ePage.Masters.CopyofCurrentObject,[]);
            }
            helperService.SaveEntity($item, 'Areas').then(function (response) {
                AreasMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                AreasMenuCtrl.ePage.Masters.IsDisableSave = false;
                AreasMenuCtrl.ePage.Masters.Loading = false;
                
                if (response.Status === "success") {

                    areasConfig.TabList.map(function (value, key) {
                        
                        if (value.New) {
                            if (value.code == '') {
                                value.label = AreasMenuCtrl.ePage.Entities.Header.Data.Name;
                                value[AreasMenuCtrl.ePage.Entities.Header.Data.Name] = value.New;
                                delete value.New;
                                value.code = AreasMenuCtrl.ePage.Entities.Header.Data.Name;
                            }
                        }
                    });
                    
                    var _index = areasConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(AreasMenuCtrl.currentAreas[AreasMenuCtrl.currentAreas.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        
                        areasConfig.TabList[_index][areasConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        //Changing Label name when area name changes
                        if(AreasMenuCtrl.ePage.Entities.Header.Data.Name != areasConfig.TabList[_index].label){
                            areasConfig.TabList[_index].label = AreasMenuCtrl.ePage.Entities.Header.Data.Name;
                            areasConfig.TabList[_index][areasConfig.TabList[_index].label] = areasConfig.TabList[_index][areasConfig.TabList[_index].code];
                            delete areasConfig.TabList[_index][areasConfig.TabList[_index].code];
                            areasConfig.TabList[_index].code = AreasMenuCtrl.ePage.Entities.Header.Data.Name
                        }

                        areasConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/areas") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    toastr.success("Saved Successfully...!");
                    if(AreasMenuCtrl.ePage.Masters.SaveAndClose){
                        AreasMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        AreasMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }

                    //Taking Copy of Current Object
                    AreasMenuCtrl.ePage.Entities.Header.Data = AfterSaveObjectUpdate(AreasMenuCtrl.ePage.Entities.Header.Data,"IsModified");
                    AreasMenuCtrl.ePage.Masters.CopyofCurrentObject = angular.copy(AreasMenuCtrl.ePage.Entities.Header.Data);

                } else if (response.Status === "failed") {
                    
                    AreasMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        AreasMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AreasMenuCtrl.currentAreas.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (AreasMenuCtrl.ePage.Entities.Header.Validations != null) {
                        toastr.error("Validation Failed...!");
                        AreasMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AreasMenuCtrl.currentAreas);
                    }else{
                        toastr.error("Could not Save...!");
                    }
                }
            });
        }
        
        function PostSaveObjectUpdate(newValue,oldValue, exceptObjects) {
            for (var i in newValue) {
                if(typeof newValue[i]=='object'){
                    PostSaveObjectUpdate(newValue[i],oldValue[i],exceptObjects);
                }else{
                    var Satisfied = exceptObjects.some(function(v){return v===i});
                    if(!Satisfied && i!= "$$hashKey"){
                        if(!oldValue){
                            newValue["IsModified"] = true;
                            break;
                        }else{
                            if(newValue[i]!=oldValue[i]){
                                newValue["IsModified"] = true;
                                break;
                            }
                        }
                    }
                }
            }
            return newValue;
        }

        function AfterSaveObjectUpdate(obj,key){
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    AfterSaveObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = false;
                }
            }
            return obj;
        }

        Init();

    }

})();