(function () {
    "use strict";

    angular
         .module("Application")
         .controller("AreasDetailsController",AreasDetailsController);

    AreasDetailsController.$inject=["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "areasConfig", "helperService", "$filter","$uibModal","toastr","appConfig","$injector"];

    function AreasDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService,areasConfig, helperService, $filter,$uibModal,toastr,appConfig,$injector){

        var AreasDetailsCtrl=this;
        
        function Init(){

            var currentAreas = AreasDetailsCtrl.currentAreas[AreasDetailsCtrl.currentAreas.label].ePage.Entities;            
            
            AreasDetailsCtrl.ePage={
                "Title": "",
                "Prefix": "Areas_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAreas

            }; 
            AreasDetailsCtrl.ePage.Masters.Config = areasConfig;
            AreasDetailsCtrl.ePage.Masters.DropDownMasterList = {};

            AreasDetailsCtrl.ePage.Masters.SelectedLookupData=SelectedLookupData;
            AreasDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetDropDownList();
            SettingDefaultWeightVolumeData();   
        }

        function SettingDefaultWeightVolumeData(){
            if(!AreasDetailsCtrl.ePage.Entities.Header.Data.MaxCubic){
                AreasDetailsCtrl.ePage.Entities.Header.Data.MaxCubic = 0;
            }
            if(!AreasDetailsCtrl.ePage.Entities.Header.Data.MaxWeight){
                AreasDetailsCtrl.ePage.Entities.Header.Data.MaxWeight = 0;
            }
            if(!AreasDetailsCtrl.ePage.Entities.Header.Data.Volume){
                AreasDetailsCtrl.ePage.Entities.Header.Data.Volume = 0;
            }
            if(!AreasDetailsCtrl.ePage.Entities.Header.Data.Weight){
                AreasDetailsCtrl.ePage.Entities.Header.Data.Weight = 0;
            }
            AreasDetailsCtrl.ePage.Entities.Header.Data.AvailableVolume = parseInt(AreasDetailsCtrl.ePage.Entities.Header.Data.MaxCubic,10) - parseInt(AreasDetailsCtrl.ePage.Entities.Header.Data.Volume,10);
            AreasDetailsCtrl.ePage.Entities.Header.Data.AvailableWeight = parseInt(AreasDetailsCtrl.ePage.Entities.Header.Data.MaxWeight,10) - parseInt(AreasDetailsCtrl.ePage.Entities.Header.Data.Weight,10);
        }

        function SelectedLookupData(item){
            OnChangeValues(item.WarehouseCode,'E5003');
            OnChangeValues(item.WarehouseName,'E5004');
        }
        
        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["AreaType"];
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
                        AreasDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AreasDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        // Validation

        function OnChangeValues(fieldvalue,code) { 
            angular.forEach(AreasDetailsCtrl.ePage.Masters.Config.ValidationValues,function(value,key){
                if(value.Code.trim() === code.trim()){
                    GetErrorMessage(fieldvalue,value)                   
                }
            });
        }

        function GetErrorMessage(fieldvalue,value){
            if (!fieldvalue) {
                AreasDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code,value.Message,"E",false,value.CtrlKey,AreasDetailsCtrl.currentAreas.label,false,undefined,undefined,undefined,undefined,undefined);
            } else {
                AreasDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code,"E",value.CtrlKey,AreasDetailsCtrl.currentAreas.label);
            }
        }

       

        Init();
    }

})();