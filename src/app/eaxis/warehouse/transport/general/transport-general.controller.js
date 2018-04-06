(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportGeneralController", TransportGeneralController);

    TransportGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "transportConfig", "helperService", "toastr"];

    function TransportGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, transportConfig, helperService, toastr) {

        var TransGeneralCtrl = this;

        function Init() {
            var currentTransport = TransGeneralCtrl.currentTransport[TransGeneralCtrl.currentTransport.label].ePage.Entities;
            console.log(currentTransport);
            TransGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Transport_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTransport,
            };
            TransGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            //DropDown
            GetDropDownList();
            GetFirstPickup();
            GetFinalDelivery();
            Lastdelivery();
            LookupInit();
            inputnull();
            removehyphen();
            TransGeneralCtrl.ePage.Masters.Transtype = Transtype;
            TransGeneralCtrl.ePage.Masters.SelectedLookupDataServiceLevel = SelectedLookupDataServiceLevel;
            TransGeneralCtrl.ePage.Masters.SelectedLookupDataLastClient = SelectedLookupDataLastClient;
            TransGeneralCtrl.ePage.Masters.SelectedLookupDataFirstClient = SelectedLookupDataFirstClient;
            TransGeneralCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            TransGeneralCtrl.ePage.Masters.SelectedLookupDataTransporter = SelectedLookupDataTransporter;
            TransGeneralCtrl.ePage.Masters.SelectedLookupDataTransportationby = SelectedLookupDataTransportationby;            
        }
        function removehyphen(){
            if(TransGeneralCtrl.ePage.Masters.ClientCodeName == "-")
            {
               TransGeneralCtrl.ePage.Masters.ClientCodeName = ""; 
            }
            if(TransGeneralCtrl.ePage.Masters.TransporterCodeName == "-")
            {
                TransGeneralCtrl.ePage.Masters.TransporterCodeName = "";
            }
            if(TransGeneralCtrl.ePage.Masters.TransportationCodeName == "-")
            {
                TransGeneralCtrl.ePage.Masters.TransportationCodeName = "";
            }
            if(TransGeneralCtrl.ePage.Masters.ServiceCodeName == "-"){
                TransGeneralCtrl.ePage.Masters.ServiceCodeName  = "";
            }
        }
        function inputnull(){
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName == null)
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName = "";
            }                
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode == null)
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode = "";
            }
            TransGeneralCtrl.ePage.Masters.ClientCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode+'-'+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName;
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode == null)                
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode = "";
            }                
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName == null)
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName = "";
            }
            TransGeneralCtrl.ePage.Masters.TransporterCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName;
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode == null)
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode = "";
            }
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName == null)
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName = "" ;
            }
            TransGeneralCtrl.ePage.Masters.TransportationCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName;
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel == null)
            {
             TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel = "";   
            }
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName == null){
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName = "";
            }
            TransGeneralCtrl.ePage.Masters.ServiceCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName;
        }
        function SelectedLookupDataServiceLevel(item){
                if(item.entity){
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel = item.entity.Code;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName = item.entity.Description;
                    TransGeneralCtrl.ePage.Masters.ServiceCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName;                
                }
                else
                {
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel = item.Code;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName = item.Description;
                    TransGeneralCtrl.ePage.Masters.ServiceCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterServiceLevel+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ServiceLevelName;    
                }
        }
        function SelectedLookupDataClient(item){
            if(item.entity)
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode = item.entity.Code;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName = item.entity.FullName;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.Client_ORG_FK = item.entity.PK;
                TransGeneralCtrl.ePage.Masters.ClientCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName;    
            }
            else
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode = item.Code;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName = item.FullName;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.Client_ORG_FK = item.PK;
                TransGeneralCtrl.ePage.Masters.ClientCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.ClientName;
            }
        }
        function SelectedLookupDataTransporter(item){
            if(item.entity){
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode = item.entity.Code;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName = item.entity.FullName;
                TransGeneralCtrl.ePage.Masters.TransporterCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName;
            }
            else{
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode = item.Code;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName = item.FullName;
                TransGeneralCtrl.ePage.Masters.TransporterCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransporterName;
            }
        }
        function SelectedLookupDataTransportationby(item){
            if(item.entity){
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode = item.entity.Code;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName = item.entity.FullName;
                TransGeneralCtrl.ePage.Masters.TransportationCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName;    
            }
            else
            {
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode = item.Code;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName = item.FullName;
                TransGeneralCtrl.ePage.Masters.TransportationCodeName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationByName;       
            }
        }
        function LookupInit(){
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.length > 0)
            {
                if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode == null)
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode = "";
                if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName == null)
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName = "";
                if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode == null)
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode = "";                
                if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName == null)
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName = "";
            }
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.length > 0)
                {
                    TransGeneralCtrl.ePage.Masters.FirstPickupName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName;
                    TransGeneralCtrl.ePage.Masters.LastDeliveryName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName;            
                }
            else
            {
                 TransGeneralCtrl.ePage.Masters.FirstPickupName = "";
                 TransGeneralCtrl.ePage.Masters.LastDeliveryName = "";
            }
            
            if(TransGeneralCtrl.ePage.Masters.FirstPickupName == "-")
                TransGeneralCtrl.ePage.Masters.FirstPickupName = "";
            if(TransGeneralCtrl.ePage.Masters.LastDeliveryName == "-")
                TransGeneralCtrl.ePage.Masters.LastDeliveryName = "";
        }   
        function Lastdelivery(){
            TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.length - 1 ;
        }

        function SelectedLookupDataLastClient(item){ 
            //if(TransGeneralCtrl.currentTransport.isNew == false)
            //{
                if(item.entity){
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName = item.entity.FullName;             
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode = item.entity.Code;  
                    TransGeneralCtrl.ePage.Masters.LastDeliveryName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName;
                    
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].ORG_FK = item.entity.PK;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OAD_FK = item.entity.OAD_PK;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Address1 = item.entity.OAD_Address1;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Address2 = item.entity.OAD_Address2;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].State = item.entity.OAD_State;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].City = item.entity.OAD_City;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].PostCode = item.entity.OAD_PostCode;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Fax = item.entity.OAD_Fax;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Phone = item.entity.OAD_Phone;
                }
                else
                {
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName = item.FullName;             
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode = item.Code;
                    TransGeneralCtrl.ePage.Masters.LastDeliveryName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OrgName;

                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].ORG_FK = item.PK;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].OAD_FK = item.OAD_PK;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Address1 = item.OAD_Address1;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Address2 = item.OAD_Address2;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].State = item.OAD_State;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].City = item.OAD_City;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].PostCode = item.OAD_PostCode;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Fax = item.OAD_Fax;
                    TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransGeneralCtrl.ePage.Masters.LastDeliveryNameObj].Phone = item.OAD_Phone;
                }
            //}    
        }  
        function SelectedLookupDataFirstClient(item){
            if(item.entity){
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName = item.entity.FullName;             
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode = item.entity.Code;  
                TransGeneralCtrl.ePage.Masters.FirstPickupName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName;

                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].ORG_FK = item.entity.PK;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OAD_FK = item.entity.OAD_PK;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Address1 = item.entity.OAD_Address1;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Address2 = item.entity.OAD_Address2;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].State = item.entity.OAD_State;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].City = item.entity.OAD_City;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].PostCode = item.entity.OAD_PostCode;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Fax = item.entity.OAD_Fax;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Phone = item.entity.OAD_Phone;
            }
            else{
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName = item.FullName;             
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode = item.Code;
                TransGeneralCtrl.ePage.Masters.FirstPickupName = TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgCode+"-"+TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OrgName;
                
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].ORG_FK = item.PK;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].OAD_FK = item.OAD_FK;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Address1 = item.OAD_Address1;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Address2 = item.OAD_Address2;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].State = item.OAD_State;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].City = item.OAD_City;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].PostCode = item.OAD_PostCode;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Fax = item.OAD_Fax;
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[0].Phone = item.OAD_Phone;
            }
        }
        function GetFinalDelivery(){
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.length == 1)
            {
                var obj = {
                    "PK":"",
                    "OAD_FK":"",
                    "Address1":"",
                    "Address2":"",
                    "State":"",
                    "PostCode":"",
                    "City":"",
                    "Fax":"",
                    "Phone":"",
                    "Type":""
                };
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.push(obj);
            }
        }
        function GetFirstPickup(){
            if(TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.length == 0)
            {
                var obj = {
                    "PK":"",
                    "OAD_FK":"",
                    "Address1":"",
                    "Address2":"",
                    "State":"",
                    "PostCode":"",
                    "City":"",
                    "Fax":"",
                    "Phone":"",
                    "Type":""
                };
                TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.push(obj);
            }
        }

        function Transtype(key){
            TransGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.TransportationType = key;
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["TRA_TRANSPORTTYPE", "TRA_TRANSMODE","CONT_MODE", "DropMode", "TRA_TRANSBY", "TRANS_VEHTYPE","SERVICE_TYPE"];
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
                        TransGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        TransGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        Init();
    }
})();
