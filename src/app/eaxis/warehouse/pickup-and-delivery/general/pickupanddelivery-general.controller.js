(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupanddeliveryGeneralController", PickupanddeliveryGeneralController);

    PickupanddeliveryGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "pickupanddeliveryConfig", "helperService", "toastr", "$filter"];

    function PickupanddeliveryGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, pickupanddeliveryConfig, helperService, toastr, $filter) {

        var PickupanddeliveryGeneralCtrl = this;

        function Init() {
            var currentPickupanddelivery = PickupanddeliveryGeneralCtrl.currentPickupanddelivery[PickupanddeliveryGeneralCtrl.currentPickupanddelivery.label].ePage.Entities;
            console.log(currentPickupanddelivery);
            PickupanddeliveryGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickupanddelivery_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickupanddelivery,
            };
            if(PickupanddeliveryGeneralCtrl.currentPickupanddelivery.isNew)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.Type = "";
            }
            PickupanddeliveryGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            //DropDown
            GetDropDownList();
            dateFilters();
            RemoveHyphen();
            PickupanddeliveryGeneralCtrl.ePage.Masters.SelectedLookupDataServiceLevel = SelectedLookupDataServiceLevel;
            PickupanddeliveryGeneralCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;            
            PickupanddeliveryGeneralCtrl.ePage.Masters.SelectedLookupDataTransClient = SelectedLookupDataTransClient;
            PickupanddeliveryGeneralCtrl.ePage.Masters.SelectedLookupDataTransporter = SelectedLookupDataTransporter;
            PickupanddeliveryGeneralCtrl.ePage.Masters.SelectedLookupDataTransportationby = SelectedLookupDataTransportationby;
            PickupanddeliveryGeneralCtrl.ePage.Masters.SelectedLookupDataPicDelclient = SelectedLookupDataPicDelclient;
            // DatePicker
            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker = {};
            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker.Options.format = "MMM d, y h:mm:ss a";
            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker.OnClosed = OnClosed;    
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PickupanddeliveryGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OnClosed(selectdate){
            dateFilters();
        }

        function dateFilters(){
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.RequestDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.RequestDateTime, "MMM d, y h:mm:ss a");
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ExpectedDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ExpectedDateTime, "MMM d, y h:mm:ss a");
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.GateInDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.GateInDateTime, "MMM d, y h:mm:ss a");
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.DockInDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.DockInDateTime, "MMM d, y h:mm:ss a");
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.LoadOrUnloadStartDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.LoadOrUnloadStartDateTime, "MMM d, y h:mm:ss a");
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.LoadOrUnloadEndDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.LoadOrUnloadEndDateTime, "MMM d, y h:mm:ss a");                
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.DockOutDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.DockOutDateTime, "MMM d, y h:mm:ss a"); 
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.GateOutDateTime = $filter('date')(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.GateOutDateTime, "MMM d, y h:mm:ss a");
        }
        function SelectedLookupDataServiceLevel(item){
            if(item.entity)
            {
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName = item.entity.Description;
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel = item.entity.Code;
            PickupanddeliveryGeneralCtrl.ePage.Masters.ServiceCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName;
            }
            else
            {
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName = item.Description;
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel = item.Code;
            PickupanddeliveryGeneralCtrl.ePage.Masters.ServiceCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName;
            }
        }
        function RemoveHyphen(){
            // Client Code
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode = "";
            }   
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName == null)         
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName = "";    
            }
            PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName == "-")
            {
                PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName = "";   
            }
            // Trans Client Code
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode = "";
            }   
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName == null)         
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName = "";    
            }
            PickupanddeliveryGeneralCtrl.ePage.Masters.TransClientCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.TransClientCodeName == "-")
            {
               PickupanddeliveryGeneralCtrl.ePage.Masters.TransClientCodeName = ""; 
            }
            // Transporter CodeName
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode = "";
            }   
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName == null)         
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName = "";    
            }
            PickupanddeliveryGeneralCtrl.ePage.Masters.TransporterCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.TransporterCodeName == "-")
            {
               PickupanddeliveryGeneralCtrl.ePage.Masters.TransporterCodeName = ""; 
            }
            //Transportationby CodeName
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode = "";
            }   
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName == null)         
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName = "";    
            }
            PickupanddeliveryGeneralCtrl.ePage.Masters.TransportationbyCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.TransportationbyCodeName == "-")
            {
               PickupanddeliveryGeneralCtrl.ePage.Masters.TransportationbyCodeName = ""; 
            }
            //Pickup and Delivery Name
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.OrgCode == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.OrgCode = "";
            }   
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.OrgName == null)         
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.OrgName = "";    
            }
            PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.OrgCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.OrgName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName == "-")
            {
               PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName = ""; 
            }            
            //Service Level
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName == null)
            {
               PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName = "";    
            }
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel = "";    
            } 
            PickupanddeliveryGeneralCtrl.ePage.Masters.ServiceCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterServiceLevel+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ServiceLevelName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.ServiceCodeName == "-")
            {
                PickupanddeliveryGeneralCtrl.ePage.Masters.ServiceCodeName = "";   
            }
            // pic del point
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode == null)
            {
               PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode = "";    
            }
            if(PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName == null)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName = "";    
            } 
            PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName;
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName == "-")
            {
                PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName = "";  
            }
        }
        function SelectedLookupDataClient(item,index){
            if(item.entity)
            {
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode = item.entity.Code;
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName = item.entity.FullName;
            PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName;
            }
            else
            {
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode = item.Code;
            PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName = item.FullName;
            PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientCode+'-'+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ClientName;
            }
            if(PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName == "-")
            {
                PickupanddeliveryGeneralCtrl.ePage.Masters.ClientCodeName = "";   
            }
        }
        function SelectedLookupDataTransClient(item){
            if(item.entity)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode = item.entity.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName = item.entity.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.Client_ORG_FK = item.entity.PK;
                PickupanddeliveryGeneralCtrl.ePage.Masters.TransClientCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName;
            }
            else
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode = item.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName = item.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.Client_ORG_FK = item.PK;
                PickupanddeliveryGeneralCtrl.ePage.Masters.TransClientCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.ClientName;
            }
        }
        function SelectedLookupDataTransporter(item){
         if(item.entity)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode = item.entity.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName = item.entity.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Masters.TransporterCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName;
            }
            else
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode = item.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName = item.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Masters.TransporterCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransporterName;
            }   
        }
        function SelectedLookupDataTransportationby(item){
         if(item.entity)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode = item.entity.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName = item.entity.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Masters.TransportationbyCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName;
            }
            else
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode = item.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName = item.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Masters.TransportationbyCodeName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsTransport.TransportationByName;
            }   
        }
        function SelectedLookupDataPicDelclient(item){
            if(item.entity)
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode = item.entity.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName = item.entity.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ORG_FK = item.entity.PK;
                PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName;
            }
            else
            {
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode = item.Code;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName = item.FullName;
                PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.ORG_FK = item.PK;
                PickupanddeliveryGeneralCtrl.ePage.Masters.PickupDeliveryName = PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgCode+"-"+PickupanddeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.OrgName;
            }
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
                        PickupanddeliveryGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickupanddeliveryGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        Init();
    }
})();
