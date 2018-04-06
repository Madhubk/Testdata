(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgWarehouseModalController", OrgWarehouseModalController);

    OrgWarehouseModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param", "appConfig"];

    function OrgWarehouseModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, organizationConfig, helperService, toastr, param, appConfig) {
        var OrgWarehouseModalCtrl = this;

        function Init() {

            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgWarehouseModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Warehouse_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgWarehouseModalCtrl.ePage.Masters.param = param;
            OrgWarehouseModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgWarehouseModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgWarehouseModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgWarehouseModalCtrl.ePage.Masters.Save = Save;
            OrgWarehouseModalCtrl.ePage.Masters.Cancel = Cancel;
            OrgWarehouseModalCtrl.ePage.Masters.Config = organizationConfig;
            OrgWarehouseModalCtrl.ePage.Masters.SelectedArea = SelectedArea;
            OrgWarehouseModalCtrl.ePage.Masters.SelectedPWarehouse = SelectedPWarehouse;
            OrgWarehouseModalCtrl.ePage.Masters.SelectedRWarehouse = SelectedRWarehouse;

            OrgWarehouseModalCtrl.ePage.Masters.AlgmChange = AlgmChange;
            OrgWarehouseModalCtrl.ePage.Masters.PickAlgm = PickAlgm;
            OrgWarehouseModalCtrl.ePage.Masters.PutAlgm = PutAlgm;
            OrgWarehouseModalCtrl.ePage.Masters.ReceiveSave =  ReceiveSave; 

            OrgWarehouseModalCtrl.ePage.Masters.Validation = Validation;  
            OrgWarehouseModalCtrl.ePage.Masters.PartAttributesCondition =  PartAttributesCondition;     
         GetDropDownList();
         InitWarehouse();        
         InitRemoveError();
         //getMiscServ();

        }

        function InitRemoveError()
        {
            OnChangeValues('value','E9037');
            OnChangeValues('value','E9038');
            OnChangeValues('value','E9039');
            OnChangeValues('value','E9034');
            OnChangeValues('value','E9035');
            OnChangeValues('value','E9036');
        }

        function PartAttributesCondition(){
            if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Name && !OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Type){
                OnChangeValues(null,'E9037')
            }

            if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Name && !OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Type){
                OnChangeValues(null,'E9038')
            }

            if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Name && !OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Type){
                OnChangeValues(null,'E9039')
            }

            if(!OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Name && OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Type){
                OnChangeValues(null,'E9034')
            }

            if(!OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Name && OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Type){
                OnChangeValues(null,'E9035')
            }

            if(!OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Name && OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Type){
                OnChangeValues(null,'E9036')
            }

            if((OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Name && OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Type) || (!OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Name && !OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib1Type)){
                OnChangeValues('value','E9034')
                OnChangeValues('value','E9037')
            }
            if((OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Name && OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Type) || (!OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Name && !OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib2Type)){
                OnChangeValues('value','E9035')
                OnChangeValues('value','E9038')
            }
            if((OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Name && OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Type) || (!OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Name && !OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.IMPartAttrib3Type)){
                OnChangeValues('value','E9036')
                OnChangeValues('value','E9039')
            }
        }

        function InitWarehouse(){
        OrgWarehouseModalCtrl.ePage.Masters.Company = {};
        OrgWarehouseModalCtrl.ePage.Masters.Company.FormView = {};
        OrgWarehouseModalCtrl.ePage.Masters.Company.FormView = angular.copy(OrgWarehouseModalCtrl.ePage);
        
        }
        
        function AlgmChange(selected,item){
            if(selected == 'picking')
            {
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickFromDefaultFIFO = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickFromFullPallets = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickFromConsolidatedFullPallets = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickSortExpiryDate = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickFromPickFaces = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickFromPalletOverflow = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPickFromBrokenPallets = 0;    
            }
            else if(selected == 'receive')
            {
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToLocation = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToPickFace = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToClientArea = 0;
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToProductArea = 0;
            }
            // make selectable value 1
            OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item[item] = 1;
        }
        function PickAlgm(value,field){

             
        }  
        function PutAlgm (value, field){
            if(value<=4){
                if(field != 'WmsPutawayToLocation')
                if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToLocation == value && value != 0){
                    toastr.warning("duplicates in Algorithm Sequence not allowed");             
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item[field] = 0;
                    return false;
                }
                if(field != 'WmsPutawayToProductArea')
                if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToProductArea == value && value != 0){
                    toastr.warning("duplicates in Algorithm Sequence not allowed");                
                    OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item[field] = 0;
                    return false;
                }
                if(field != 'WmsPutawayToPickFace')
                if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToPickFace == value && value != 0){
                    toastr.warning("duplicates in Algorithm Sequence not allowed"); 
                    OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item[field] = 0;               
                    return false;
                }
                if(field != 'WmsPutawayToClientArea')
                if(OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WmsPutawayToClientArea == value && value != 0){
                    toastr.warning("duplicates in Algorithm Sequence not allowed");                
                    OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item[field] = 0;
                    return false;
                }
            }
            else if(value == undefined){
                toastr.warning("!Value is Empty.choose anyone from 0 to 4");
            }
            else{
                toastr.warning("!Value is maximum.choose anyone in 0 to 4");
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item[field] = 0;
            }
        }
        function OnChangeValues(fieldvalue,code) { 
            angular.forEach(OrgWarehouseModalCtrl.ePage.Masters.Config.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value);                   
                }
            });
        }
        
        function GetErrorMessage(fieldvalue,value){
            if (!fieldvalue) {
                OrgWarehouseModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code,value.Message,"E",true,value.CtrlKey,OrgWarehouseModalCtrl.ePage.Masters.param.Entity.label,false,undefined,undefined,undefined,undefined,value.GParentRef);
            } else {
                OrgWarehouseModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code,"E",value.CtrlKey,OrgWarehouseModalCtrl.ePage.Masters.param.Entity.label);
            }
        }

        function SelectedArea(item){
            if(item.entity)
            {
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.AreaType = item.entity.AreaType;    
            }
            else
            {
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.AreaType = item.AreaType;   
            }    
        }
        function SelectedRWarehouse(item){
            if(item.entity)
            {
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WAR_FK=item.entity.PK;
            }
            else{
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WAR_FK=item.PK;       
            }
        }
        function SelectedPWarehouse(item){
            if(item.entity)
            {
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WAR_FK=item.entity.PK;
            }
            else{
                OrgWarehouseModalCtrl.ePage.Masters.Company.FormView.Masters.param.Item.WAR_FK=item.PK;       
            }
        }

        function getMiscServ() {
            apiService.get("eAxisAPI", appConfig.Entities.Organization.API.GetById.Url + OrgWarehouseModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseModalCtrl.ePage.Entities.Header.Data.OrgMiscServ = response.data.Response.OrgMiscServ;
                }
            });       
        }
        function GetDropDownList()
        {
            // Get CFXType Dropdown list
            var typeCodeList = ["IncoTerms","Orderby","PartAttrType","PickOption","Fulfill","PickMode","DGContact","AnalysisPeriod","AnalysisMethod","INW_LINE_UQ"];
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
                    OrgWarehouseModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                    OrgWarehouseModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
            }
            });
        }
        function ReceiveSave(obj,entity,type){
            if((obj.OrgMiscServ.WmsPutawayToLocation != undefined || obj.OrgMiscServ.WmsPutawayToLocation <= 4)&&
               (obj.OrgMiscServ.WmsPutawayToPickFace != undefined || obj.OrgMiscServ.WmsPutawayToPickFace <= 4)&&
               (obj.OrgMiscServ.WmsPutawayToProductArea != undefined || obj.OrgMiscServ.WmsPutawayToProductArea <= 4)&&
               (obj.OrgMiscServ.WmsPutawayToClientArea != undefined || obj.OrgMiscServ.WmsPutawayToClientArea <= 4 ))
            {
                Save(obj,entity,type);                    
            }
            else{
                toastr.warning("!Algorithm Sequence cant be Empty.Enter anyone from 0 to 4");
            }
        }

        function Validation($item,entity,type) {
            var _index = organizationConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.OrgHeader.PK
            }).indexOf(OrgWarehouseModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK);
            $item.label = OrgWarehouseModalCtrl.ePage.Masters.param.Entity.label;
            //console.log(_Data.Header.Meta.ErrorWarning.GlobalErrorWarningList);
            var _Data = $item.Entities,
                _input = _Data.Header.Data,
                _errorcount = OrgWarehouseModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList;
                OrgWarehouseModalCtrl.ePage.Masters.Config.GeneralValidation($item,type);
                if(OrgWarehouseModalCtrl.ePage.Entities.Header.Validations){
                    OrgWarehouseModalCtrl.ePage.Masters.Config.RemoveApiErrors(OrgWarehouseModalCtrl.ePage.Entities.Header.Validations,$item.label); 
                }

            if(_errorcount.length==0){
                Save(_input,entity, type) 
            }else{
                if(OrgWarehouseModalCtrl.ePage.Masters.param.Entity.isNew == false)
                    OrgWarehouseModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgWarehouseModalCtrl.ePage.Entities);                    
            }
        }

        function Save(obj, entity, type) {

                var _isEmpty = angular.equals(obj, {});

                if (_isEmpty) {
                    toastr.warning("Please fill fields...!");
                } else {
                    if(entity!=="OrgMiscServ")
                    {
                       var  _isExist = OrgWarehouseModalCtrl.ePage.Entities.Header.Data[entity].some(function (value, key) {
                                return value.PK === obj.PK;
                            });
                    
                        if (!_isExist) {
                            OrgWarehouseModalCtrl.ePage.Entities.Header.Data[entity].push(obj);
                        } else {               
                            var _index = OrgWarehouseModalCtrl.ePage.Entities.Header.Data[entity].map(function (value, key) {
                                if (value.PK === obj.PK) {
                                    obj.IsModified = true;
                                    OrgWarehouseModalCtrl.ePage.Entities.Header.Data[entity][key] = obj;
                                }
                            });
                        }
                    }else if(entity=="OrgMiscServ"){
                        //obj.OrgMiscServ.IsModified = true;
                        //getMiscServ();
                        OrgWarehouseModalCtrl.ePage.Entities.Header.Data[entity]=obj.OrgMiscServ;
                        OrgWarehouseModalCtrl.ePage.Entities.Header.Data[entity].IsModified = true;
                        OrgWarehouseModalCtrl.ePage.Masters.param.Entity.isNew = false;
                    }
                    OrgWarehouseModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                    OrgWarehouseModalCtrl.ePage.Masters.IsDisableSave = true;



                    helperService.SaveEntity(OrgWarehouseModalCtrl.ePage.Masters.param.Entity,'Organization').then(function (response) {
                        if (response.Status === "success") {
                            var _exports = {
                                Data: obj,
                                entity: entity,
                                type: type
                            };
                            $uibModalInstance.close(_exports);
                            OrgWarehouseModalCtrl.ePage.Masters.Config.refreshgrid();

                        } else if (response.Status === "failed") {
                            angular.forEach(response.Validations, function (value, key) {
                            OrgWarehouseModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OrgWarehouseModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code, false, undefined, undefined, undefined, undefined, value.GParentRef);
                            });
                        if (response.Validations != null) {
                            OrgWarehouseModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgWarehouseModalCtrl.ePage.Entities.Header.Data);
                        }
                            Cancel();
                        }
                        OrgWarehouseModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        OrgWarehouseModalCtrl.ePage.Masters.IsDisableSave = false;
                    });
                }
        }

        function Cancel() {
            OrgWarehouseModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();