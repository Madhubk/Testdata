(function(){
    "use strict";

    angular
         .module("Application")
         .controller("TransportPickupanddeliveryController",TransportPickupanddeliveryController);

    TransportPickupanddeliveryController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "transportConfig", "helperService", "toastr", "$injector", "confirmation", "$window", "$uibModal", "$filter", "$document"];

    function TransportPickupanddeliveryController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, transportConfig, helperService, toastr, $injector, confirmation, $window, $uibModal, $filter, $document){

        var TransportPickupanddeliveryCtrl = this;
        var Config1 = $injector.get("outwardConfig");
        var Config2 = $injector.get("inwardConfig");
        function Init(){
            var currentTransport = TransportPickupanddeliveryCtrl.currentTransport[TransportPickupanddeliveryCtrl.currentTransport.label].ePage.Entities;
            console.log(currentTransport);

            TransportPickupanddeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Transport_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTransport,
            };
            
        TransportPickupanddeliveryCtrl.ePage.Masters.DropDownMasterList ={};
        TransportPickupanddeliveryCtrl.ePage.Masters.setSelectedRow = setSelectedRow;  
        TransportPickupanddeliveryCtrl.ePage.Masters.attachoutwardOrders = attachoutwardOrders;
        //TransportPickupanddeliveryCtrl.ePage.Masters.attachinwardOrders = attachinwardOrders;
        TransportPickupanddeliveryCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
        TransportPickupanddeliveryCtrl.ePage.Masters.DeleteTransOrdOrder = DeleteTransOrdOrder;
        TransportPickupanddeliveryCtrl.ePage.Masters.DeleteTransInwOrder = DeleteTransInwOrder;
        TransportPickupanddeliveryCtrl.ePage.Masters.EditOrderDetails = EditOrderDetails;
        //TransportPickupanddeliveryCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
        TransportPickupanddeliveryCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
        TransportPickupanddeliveryCtrl.ePage.Masters.Servicetype = Servicetype;
        TransportPickupanddeliveryCtrl.ePage.Masters.SelectedLookupDataSupplier = SelectedLookupDataSupplier;
        TransportPickupanddeliveryCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
        //TransportPickupanddeliveryCtrl.ePage.Masters.addinwnew = addinwnew;
        TransportPickupanddeliveryCtrl.ePage.Masters.addordnew = addordnew;
        TransportPickupanddeliveryCtrl.ePage.Masters.setSelectedRow = setSelectedRow;    
        TransportPickupanddeliveryCtrl.ePage.Masters.onClick = onClick;
        TransportPickupanddeliveryCtrl.ePage.Masters.SelectedLookupfromclient = SelectedLookupfromclient;
        TransportPickupanddeliveryCtrl.ePage.Masters.SelectedLookuptoclient = SelectedLookuptoclient;
        TransportPickupanddeliveryCtrl.ePage.Masters.RemoveRow = RemoveRow;
        TransportPickupanddeliveryCtrl.ePage.Masters.orglist = orglist;
        TransportPickupanddeliveryCtrl.ePage.Masters.item = 0;
        inputnull(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item]);
        TransportPickupanddeliveryCtrl.ePage.Masters.ClientCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName;
        TransportPickupanddeliveryCtrl.ePage.Masters.OrgCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName;
        removehyphen();
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type == "PIC")
                        {
                            var FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                            var PK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].PK;
                            var TPT_FK=TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].TPT_FK;
                            pickupcheck(FK,PK,TPT_FK);    
                        }
                        else if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type == "DEL")
                        {
                            var FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK; 
                            var PK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].PK;
                            var TPT_FK=TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].TPT_FK;
                            deliverycheck(FK,PK,TPT_FK);       
                        }

        GetDropDownList();
        dateFilters();
            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker = {};
            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker.Options.format = "MMM d, y h:mm:ss a";
            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker.OnClosed = OnClosed;
        
        
        //getOrdersList();        
    }
        function orglist()
            {
                // var obj = {
                //     "Address1" : "",
                //     "Address2" : "",
                //     "City"     : "",
                //     "ClientCode": "",
                //     "ClientName" : "",
                //     "DockInDateTime": "" ,
                //     "DockOutDateTime" : "",
                //     "Email" : "",
                //     "ExpectedDateTime": "",
                //     "Fax": "",
                //     "GateInDateTime": "",
                //     "GateOutDateTime": "",
                //     "GoodsSignedBy": "",
                //     "GoodsSignedByContactNo": "",
                //     "GoodsSignedBySignature": "",
                //     "Instructions": "",
                //     "IsDeleted": "",
                //     "IsModified": "",
                //     "LoadOrUnloadEndDateTime": "",
                //     "LoadOrUnloadStartDateTime": "",
                //     "Mobile": "",
                //     "ModifiedBy": "",
                //     "ModifiedDateTime": "",
                //     "OAD_FK": "",
                //     "ORG_Client_FK": "",
                //     "ORG_FK": "",
                //     "OrgCode": "",
                //     "OrgName": "",
                //     "PK": "",
                //     "Phone": "",
                //     "PickedOrDeliveredDateTime": "",
                //     "PostCode": "",
                //     "ReferenceNo": "",
                //     "RelatedPortCode": "",
                //     "RequestDateTime": "",
                //     "SAP_FK": "",
                //     "Sequence": "",
                //     "State": "",
                //     "Status": "",
                //     "TPT_FK": "",
                //     "Type" :""
                // }
                apiService.get("eAxisAPI", transportConfig.Entities.Header.API.TPDGetByID.Url+null).then(function (response) {
                    console.log(response.data.Response.Response.UIWmsPickupAndDeliveryPointsHeader);
                    var obj = response.data.Response.Response.UIWmsPickupAndDeliveryPointsHeader;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints.push(obj);
                });   
            }

            function Servicetype()
            {
                    OnCompanySelect(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item],
                        TransportPickupanddeliveryCtrl.ePage.Masters.item 
                                );
            }
            
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            TransportPickupanddeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }    
        function OnClosed(selectdate){
            dateFilters();
        }
        function dateFilters(){
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].RequestDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].RequestDateTime, "MMM d, y h:mm:ss a");
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ExpectedDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ExpectedDateTime, "MMM d, y h:mm:ss a");
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateInDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateInDateTime, "MMM d, y h:mm:ss a");
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockInDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockInDateTime, "MMM d, y h:mm:ss a");
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadStartDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadStartDateTime, "MMM d, y h:mm:ss a");
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadEndDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadEndDateTime, "MMM d, y h:mm:ss a");                
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockOutDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockOutDateTime, "MMM d, y h:mm:ss a"); 
            TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateOutDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateOutDateTime, "MMM d, y h:mm:ss a");
        }
        function RemoveRow($item,index)
            {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Delete?',
                    bodyText: 'Are you sure?'
                };
                confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type =="PIC")
                        {
                            TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].ORG_Client_FK = "";
                            TransportPickupanddeliveryCtrl.ePage.Masters.picklist.splice(index,1);   
                        }
                    else
                        {
                            TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].ORG_Client_FK = "";
                            TransportPickupanddeliveryCtrl.ePage.Masters.dellist.splice(index,1);                             
                        }
                    toastr.info('Record removed from the list'); 
                }, function () {
                    console.log("Cancelled");
                });
            }               
        function SelectedLookupfromclient(item, index)
            {
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type =="PIC") 
                {
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].From_Address1 = item.Address1;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].From_Address2 = item.Address2;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].From_City = item.City;
                // TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].From_OrgCode= item.OrgCode;
                 TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].From_OrgName= item.OrgName;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].PickupFrom_TPD_FK = item.PK;
                // TransportPickupanddeliveryCtrl.ePage.Masters.From_OrgCode=item.OrgCode +'-'+ item.Address1;                                   
                }
                else
                {
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].From_Address1 = item.Address1;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].From_Address2 = item.Address2;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].From_City = item.City;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].From_OrgCode= item.OrgCode;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].From_OrgName= item.OrgName;   
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].DeliveryTo_TPD_FK = item.ORG_PK;
                }
            }
        function SelectedLookuptoclient(item, index)
            {
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type =="PIC") 
                {
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].To_Address1 = item.Address1;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].To_Address2 = item.Address2;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].To_City = item.City;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].To_OrgCode= item.OrgCode;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].To_OrgName= item.OrgName;
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[index].PickupFrom_TPD_FK = item.PK;
                }
                else
                {
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].To_Address1 = item.Address1;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].To_Address2 = item.Address2;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].To_City = item.City;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].To_OrgCode= item.OrgCode;
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].To_OrgName= item.OrgName;   
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[index].DeliveryTo_TPD_FK = item.PK;
                }
            }
        function inputnull(item)
            {
                if(item){
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName == null)
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName = "";
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode == null)
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode = "";
                }
            }          
        function SelectedLookupDataClient(item)
            {
                if(item.entity){
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName = item.entity.FullName;
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode = item.entity.Code;
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_Client_FK = item.entity.PK;
                TransportPickupanddeliveryCtrl.ePage.Masters.ClientCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName;            
                }
                else
                {
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName = item.FullName;
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode = item.Code;
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_Client_FK = item.PK;
                TransportPickupanddeliveryCtrl.ePage.Masters.ClientCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName;            
                }                
            }
        function SelectedLookupDataSupplier(item)
            {
                if(item.entity){
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName = item.entity.FullName;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode = item.entity.Code;
                    TransportPickupanddeliveryCtrl.ePage.Masters.OrgCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName;

                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK = item.entity.PK;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OAD_FK = item.entity.OAD_PK;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Address1 = item.entity.OAD_Address1;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Address2 = item.entity.OAD_Address2;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].State = item.entity.OAD_State;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].City = item.entity.OAD_City;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].PostCode = item.entity.OAD_PostCode;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Fax = item.entity.OAD_Fax;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Phone = item.entity.OAD_Phone;
                }
                else
                {
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName = item.FullName;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode = item.Code;
                    TransportPickupanddeliveryCtrl.ePage.Masters.OrgCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName;

                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK = item.PK;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OAD_FK = item.OAD_PK;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Address1 = item.OAD_Address1;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Address2 = item.OAD_Address2;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].State = item.OAD_State;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].City = item.OAD_City;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].PostCode = item.OAD_PostCode;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Fax = item.OAD_Fax;
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Phone = item.OAD_Phone;
                }
            }
        function GetDropDownList() 
                {
                // Get CFXType Dropdown list
                    var typeCodeList = ["SERVICE_TYPE" ];
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
                            TransportPickupanddeliveryCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                            TransportPickupanddeliveryCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        });
                    }
                    });
                }           
        function removehyphen()                
            {
                if(TransportPickupanddeliveryCtrl.ePage.Masters.ClientCodeName == "-")
                {
                    TransportPickupanddeliveryCtrl.ePage.Masters.ClientCodeName = "";                    
                }
                if(TransportPickupanddeliveryCtrl.ePage.Masters.OrgCodeName == "-")
                {
                    TransportPickupanddeliveryCtrl.ePage.Masters.OrgCodeName = "";                    
                }
            }
        function OnCompanySelect($item, index) 
            {
                TransportPickupanddeliveryCtrl.ePage.Masters.item = index;
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item] = $item;
                inputnull(index);
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName == undefined)
                {
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName = "";    
                }
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode == undefined)
                {
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode = "";
                }
                TransportPickupanddeliveryCtrl.ePage.Masters.ClientCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ClientName;
                TransportPickupanddeliveryCtrl.ePage.Masters.OrgCodeName = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgCode+"-"+TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].OrgName;
                removehyphen();

                // date filters
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].RequestDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].RequestDateTime, "MMM d, y h:mm:ss a");
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ExpectedDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ExpectedDateTime, "MMM d, y h:mm:ss a");
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateInDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateInDateTime, "MMM d, y h:mm:ss a");
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockInDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockInDateTime, "MMM d, y h:mm:ss a");
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadStartDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadStartDateTime, "MMM d, y h:mm:ss a");
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadEndDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].LoadOrUnloadEndDateTime, "MMM d, y h:mm:ss a");                
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockOutDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].DockOutDateTime, "MMM d, y h:mm:ss a"); 
                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateOutDateTime = $filter('date')(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].GateOutDateTime, "MMM d, y h:mm:ss a");
                
                // if($item.Type == "PIC")
                // {
                //     angular.forEach(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders,function(value,key){
                //     if(value.PickupFrom_TPD_FK == $item.ORG_FK  || value.ORG_Client_FK == $item.ORG_FK )
                //         {
                //             $item.
                //         }
                // }




                var FK = $item.ORG_FK;
                    var PK = $item.PK;
                    var TPT_FK=$item.TPT_FK;
                    if($item.Type == "PIC")
                    {
                        pickupcheck(FK,PK,TPT_FK);    
                    }
                    else if($item.Type == "DEL")
                    {   
                        deliverycheck(FK,PK,TPT_FK);       
                    }
                              
            }
        function nullinputs()
            {
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName == null)
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName = "";
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode == null)
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode = "";
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName == null)
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName = "";
                if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode == null)
                    TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode = "";
            }            
        function pickupcheck(FK,PK,TPT_FK)
            {
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist = [];
                angular.forEach(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders,function(value,key){
                        
                    if(value.PickupFrom_TPD_FK == PK || value.ORG_Client_FK == FK) 
                    {
                        TransportPickupanddeliveryCtrl.ePage.Masters.picklist.push(angular.copy(value)); 
                    }            
                });                                
            }
        function deliverycheck(FK,PK,TPT_FK)
            {
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist = [];
                angular.forEach(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders,function(value,key){
                    if(value.DeliveryTo_TPD_FK == PK || value.ORG_Client_FK == FK) 
                    {
                        TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push(angular.copy(value)); 
                    }
                });
            }
        function setSelectedRow(item)
            {
                TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow = item;
            }
            // attach orders   
        function attachoutwardOrders($item,index)
            {    
            if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type =="PIC") 
                {
                    if($item.data.entity)
                    {
                        // if($item.data.entity.ORG_Client_FK == ""||null)
                        // {           
                            var obj = {
                                "DeliveryTo_TPD_FK":"",
                                "ExternalReference":"",
                                "IsDeleted":"",
                                "PK":"",
                                "PickupFrom_TPD_FK":"",
                                "TPT_FK":"",
                                "WOD_FK":"",
                                "WorkOrderType":"",
                                "IsModified":"",
                                "WorkOrderID":""
                            }
                            if(TransportPickupanddeliveryCtrl.ePage.Masters.picklist == undefined)
                                {
                                    TransportPickupanddeliveryCtrl.ePage.Masters.picklist= [];
                                    obj.PickupFrom_TPD_FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;            
                                    obj.ExternalReference = $item.data.entity.ExternalReference;
                                    $item.data.entity.ORG_Client_FK=TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                                    obj.TPT_FK = $item.data.entity.TPT_FK;
                                    obj.IsDeleted = $item.data.entity.IsDeleted;
                                    obj.WOD_FK=$item.data.entity.PK;
                                    obj.WorkOrderID = $item.data.entity.WorkOrderID;
                                    obj.WorkOrderType = $item.data.entity.WorkOrderType;
                                    obj.IsModified = $item.data.entity.IsModified;
                                    TransportPickupanddeliveryCtrl.ePage.Masters.picklist.push(obj);       
                                }
                            else if(TransportPickupanddeliveryCtrl.ePage.Masters.picklist.length == 0)
                                {
                                    obj.PickupFrom_TPD_FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                                    
                                    obj.ExternalReference = $item.data.entity.ExternalReference;
                                    obj.TPT_FK = $item.data.entity.TPT_FK;
                                    obj.IsDeleted = $item.data.entity.IsDeleted;
                                    obj.WOD_FK=$item.data.entity.PK;
                                    obj.WorkOrderID = $item.data.entity.WorkOrderID;
                                    obj.WorkOrderType = $item.data.entity.WorkOrderType;
                                    obj.IsModified = $item.data.entity.IsModified;
                                    TransportPickupanddeliveryCtrl.ePage.Masters.picklist.push(obj);
                                }                
                            else if(TransportPickupanddeliveryCtrl.ePage.Masters.picklist.length > 0)
                                {   
                                    var _isExist = TransportPickupanddeliveryCtrl.ePage.Masters.picklist.some(function (value, item) {
                                        return value.PK === $item.data.entity.PK;
                                    });
                                    if (!_isExist) 
                                        {
                                            if ($item.data.entity.PK !== TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.PK) {
                                            obj.PickupFrom_TPD_FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                                            obj.ExternalReference = $item.data.entity.ExternalReference;
                                            obj.TPT_FK = $item.data.entity.TPT_FK;
                                            obj.IsDeleted = $item.data.entity.IsDeleted;
                                            obj.WOD_FK=$item.data.entity.PK;
                                            obj.WorkOrderID = $item.data.entity.WorkOrderID;
                                            obj.WorkOrderType = $item.data.entity.WorkOrderType;
                                            obj.IsModified = $item.data.entity.IsModified;
                                            TransportPickupanddeliveryCtrl.ePage.Masters.picklist.push(obj);
                                                //$item = filterObjectUpdate(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data, "IsModified");
                                                // apiService.post("eAxisAPI", 'WmsTransportList/Update', TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data).then(function (response) {
                                                //     if (response.data.Status == 'Success') {
                                                //         apiService.get("eAxisAPI", 'WmsTransportList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                                                //             TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data = response.data.Response;
                                                //         });
                                                //     }
                                                // });                    
                                                } 
                                            else 
                                                {
                                                    toastr.warning("You cannot add the same opened ORDER...!");
                                                }
                                        } 
                                    else 
                                    {
                                        toastr.warning("Record Already Available...!");
                                    }
                                }
                        // }
                        // else
                        // {
                        //     toastr.warning("Record is Already Mapped into  "+$item.data.entity.ClientCode+"-"+$item.data.entity.ClientName);
                        // }
                    }
                    else
                        {
                            $item.some(function(value,key){
                               var _isExist = TransportPickupanddeliveryCtrl.ePage.Masters.picklist.some(function (values, item) {
                                return values.PK === value.PK; 
                                });
                               if (!_isExist) 
                               {    
                                    value.ORG_Client_FK = values.ORG_FK;
                                    TransportPickupanddeliveryCtrl.ePage.Masters.picklist.push(value);
                               }
                               else{
                                    toastr.warning("Record Already Available...!");
                               }
                            });   
                        }
                    angular.forEach(TransportPickupanddeliveryCtrl.ePage.Masters.picklist,function(value1,key){
                        var count = 0;
                        angular.forEach(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders,function(value2,key){
                            if(value1.PK != value2.PK)
                               {
                                count ++;
                                var ordercount = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.length;
                                if(count == ordercount)
                                    {
                                        TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.push(value1);                                           
                                    }  
                               }
                        });    
                    });
                    if(TransportPickupanddeliveryCtrl.currentTransport.isNew)
                    {
                        var count = TransportPickupanddeliveryCtrl.ePage.Masters.picklist.length
                        for(i=0;i<count;i++)
                            {    
                                TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.push(TransportPickupanddeliveryCtrl.ePage.Masters.picklist[i]);                        
                            }
                    }                         
                }

            else if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type == "DEL") 
                {
                    if($item.data.entity)
                    {
                        // if($item.data.entity.ORG_Client_FK == ""||null)   
                        // {
                            var obj = {
                                "DeliveryTo_TPD_FK":"",
                                "ExternalReference":"",
                                "IsDeleted":"",
                                "PK":"",
                                "PickupFrom_TPD_FK":"",
                                "TPT_FK":"",
                                "WOD_FK":"",
                                "WorkOrderType":"",
                                "IsModified":"",
                                "WorkOrderID":""
                            }
                            if(TransportPickupanddeliveryCtrl.ePage.Masters.dellist == undefined)
                            {
                                TransportPickupanddeliveryCtrl.ePage.Masters.dellist=[];
                                obj.DeliveryTo_TPD_FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                                obj.ExternalReference = $item.data.entity.ExternalReference;
                                obj.TPT_FK = $item.data.entity.TPT_FK;
                                obj.IsDeleted = $item.data.entity.IsDeleted;
                                obj.WOD_FK=$item.data.entity.PK;
                                obj.WorkOrderID = $item.data.entity.WorkOrderID;
                                obj.WorkOrderType = $item.data.entity.WorkOrderType;
                                obj.IsModified = $item.data.entity.IsModified;
                                TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push(obj);    
                            }
                            else if(TransportPickupanddeliveryCtrl.ePage.Masters.dellist.length == 0)
                            {
                                obj.DeliveryTo_TPD_FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                                obj.ExternalReference = $item.data.entity.ExternalReference;
                                obj.TPT_FK = $item.data.entity.TPT_FK;
                                obj.IsDeleted = $item.data.entity.IsDeleted;
                                obj.WOD_FK=$item.data.entity.PK;
                                obj.WorkOrderID = $item.data.entity.WorkOrderID;
                                obj.WorkOrderType = $item.data.entity.WorkOrderType;
                                obj.IsModified = $item.data.entity.IsModified;
                                TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push(obj);
                            }
                            else if(TransportPickupanddeliveryCtrl.ePage.Masters.dellist.length > 0)
                            { 
                                var _isExist = TransportPickupanddeliveryCtrl.ePage.Masters.dellist.some(function (value, item) {
                                    return value.PK === $item.data.entity.PK;
                                });
                                if (!_isExist) 
                                    {
                                        if ($item.data.entity.PK !== TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.PK) 
                                        {
                                            obj.DeliveryTo_TPD_FK = TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].ORG_FK;
                                            obj.ExternalReference = $item.data.entity.ExternalReference;
                                            obj.TPT_FK = $item.data.entity.TPT_FK;
                                            obj.IsDeleted = $item.data.entity.IsDeleted;
                                            obj.WOD_FK=$item.data.entity.PK;
                                            obj.WorkOrderID = $item.data.entity.WorkOrderID;
                                            obj.WorkOrderType = $item.data.entity.WorkOrderType;
                                            obj.IsModified = $item.data.entity.IsModified;
                                            TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push(obj);
                                        } 
                                        else 
                                        {
                                            toastr.warning("You cannot add the same opened ORDER...!");
                                        }
                                    } 
                                else 
                                    {
                                        toastr.warning("Record Already Available...!");
                                    }
                            }
                        // }
                        // else
                        // {
                        //     toastr.warning("Record is Already Mapped into  "+$item.data.entity.ClientCode+"-"+$item.data.entity.ClientName);           
                        // }    
                    }
                    else
                    {
                        $item.some(function(value,key){
                           var _isExist = TransportPickupanddeliveryCtrl.ePage.Masters.dellist.some(function (values, item) {
                            return values.PK === value.PK; 
                            });
                           if (!_isExist) 
                           {
                                value.ORG_Client_FK = values.ORG_FK; 
                                TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push(value);
                           }
                           else{
                                toastr.warning("Record Already Available...!");
                           }
                        });   
                    }
                    angular.forEach(TransportPickupanddeliveryCtrl.ePage.Masters.dellist,function(value1,key){
                        angular.forEach(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders,function(value2,key){
                            count = 0;
                            if(value1.PK != value2.PK)
                               {
                                count ++;
                                if(count == TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.length)
                                    {
                                        TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.push(value1);                                           
                                    }  
                               }
                        });    
                    });
                }                
            }
        function onClick(index) 
            {      
                TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow = index;
                if (TransportPickupanddeliveryCtrl.ePage.Masters.PrevRow != TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow ||  TransportPickupanddeliveryCtrl.ePage.Masters.hideIndex == -1 ) {
                    TransportPickupanddeliveryCtrl.ePage.Masters.hideIndex = index;
                    TransportPickupanddeliveryCtrl.ePage.Masters.PrevRow = TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow;
                }
                else {
                    TransportPickupanddeliveryCtrl.ePage.Masters.hideIndex = -1;
                }  
                $timeout(function(){ $scope.$apply();}, 500);            
                
            };   
        function setSelectedRow(index)
            {
                TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow = index;
            }   
            $document.bind('keydown', function (e) {
                if (TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow!=-1) {
                    if (e.keyCode == 38) {     
                        if (TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow == TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.length - 1) {
                            return;
                        }
                        TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }

                    if (e.keyCode == 13) {
                        onClick(TransportPickupanddeliveryCtrl.ePage.Masters.selectedRow);                   
                    }

               }
            });

    // function attachinwardOrders($item)
    //     {
    //         if($item.data.entity)
    //         {
    //             var _isExist = TransportPickupanddeliveryCtrl.ePage.Masters.dellist.some(function (value, item) {
    //                 return value.PK === $item.data.entity.PK;
    //             });
    //             if (!_isExist) {
    //                 if ($item.data.entity.PK !== TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.PK) {
    //                     TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push($item.data.entity);
    //                     // $item = filterObjectUpdate(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data, "IsModified");
    //                     // apiService.post("eAxisAPI", 'WmsTransportList/Update', TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data).then(function (response) {
    //                     //     if (response.data.Status == 'Success') {
    //                     //         apiService.get("eAxisAPI", 'WmsTransportList/GetById/' + response.data.Response.Response.PK).then(function (response) {
    //                     //             TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data = response.data.Response;
    //                     //         });
    //                     //     }
    //                     // });
    //                 } else {
    //                     toastr.warning("You cannot add the same opened ORDER...!");
    //                 }
    //             } else {
    //                 toastr.warning("Record Already Available...!");
    //             }
    //         }
    //         else
    //         {
    //             $item.some(function(value,key){
    //                var _isExist = TransportPickupanddeliveryCtrl.ePage.Masters.dellist.some(function (values, item) {
    //                 return values.PK === value.PK; 
    //                 });
    //                if (!_isExist) 
    //                {
    //                     TransportPickupanddeliveryCtrl.ePage.Masters.dellist.push(value);
    //                }
    //                else{
    //                     toastr.warning("Record Already Available...!");
    //                }
    //             });   
    //         }    
    //     }                
    function filterObjectUpdate(obj, key) 
        {
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
    function addordnew() 
        {
            if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type == "PIC")
            {
                helperService.getFullObjectUsingGetById(Config1.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIWmsOutwardHeader.PK = response.data.Response.Response.PK;                    

                        apiService.post("eAxisAPI", transportConfig.Entities.Header.API.WmsOutwardInsert.Url, response.data.Response.Response).then(function (response) {
                        });

                        var _queryString = {
                            PK: response.data.Response.Response.UIWmsOutwardHeader.PK,
                            WorkOrderID: response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID
                        };
                        _queryString = helperService.encryptData(_queryString);
                        $window.open("#/EA/single-record-view/transorder/" + _queryString, "_blank");
                    }
                });
            }
            else if(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPoints[TransportPickupanddeliveryCtrl.ePage.Masters.item].Type == "DEL")
            {
                helperService.getFullObjectUsingGetById(Config2.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIWmsInwardHeader.PK = response.data.Response.Response.PK;

                    apiService.post("eAxisAPI",transportConfig.Entities.Header.API.WmsInwardInsert.Url, response.data.Response.Response).then(function (response) {
                    });

                    var _queryString = {
                        PK: response.data.Response.Response.UIWmsInwardHeader.PK,
                        WorkOrderID: response.data.Response.Response.UIWmsInwardHeader.WorkOrderID
                    };
                    _queryString = helperService.encryptData(_queryString);
                    $window.open("#/EA/single-record-view/transinorder/" + _queryString, "_blank");
                    }
                });
            }    
        }
    // function addinwnew() 
    //     {
    //         helperService.getFullObjectUsingGetById(Config2.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
    //             if (response.data.Response) {
    //                 response.data.Response.Response.UIWmsInwardHeader.PK = response.data.Response.Response.PK;

    //                 apiService.post("eAxisAPI", 'WmsInwardList/Insert', response.data.Response.Response).then(function (response) {
    //                 });

    //                 var _queryString = {
    //                     PK: response.data.Response.Response.UIWmsInwardHeader.PK,
    //                     WorkOrderID: response.data.Response.Response.UIWmsInwardHeader.WorkOrderID
    //                 };
    //                 _queryString = helperService.encryptData(_queryString);
    //                 $window.open("#/EA/single-record-view/transinorder/" + _queryString, "_blank");
    //             }
    //         });
    //     }        
    function EditOrderDetails(obj) 
        {
            var _queryString = {
                PK: obj.WOD_FK,
                WorkOrderID: obj.WorkOrderID
            };
            _queryString = helperService.encryptData(_queryString);
            if(obj.WorkOrderType == "ORD")
            {
                $window.open("#/EA/single-record-view/transorder/" + _queryString, "_blank");
            }
            else
            {
                $window.open("#/EA/single-record-view/transinorder/" + _queryString, "_blank");
            }
        }    
    function DeleteConfirmation($item, $index) 
        {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            if($item.WorkOrderType == "ORD")
            {
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteTransOrdOrder($item, $item);
                }, function () {
                    console.log("Cancelled");
                });
            }
            else
            {
             confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteTransInwOrder($item, $item);
                }, function () {
                    console.log("Cancelled");
                });   
            }    
        }
    function DeleteTransOrdOrder($item, $index) 
        {
            var _item = TransportPickupanddeliveryCtrl.ePage.Masters.picklist.map(function (value, key) {
                return value.WorkOrderID;
            }).itemOf($item.WorkOrderID);


            if (_item !== -1) {
                TransportPickupanddeliveryCtrl.ePage.Masters.picklist[$index].IsDeleted = true;
                // $item = filterObjectUpdate(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data, "IsModified");
                // apiService.post("eAxisAPI", 'WmsTransportList/Update', TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data).then(function (response) {
                //     if (response.data.Status == 'Success') {
                //         apiService.get("eAxisAPI", 'WmsTransportList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                //             TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data = response.data.Response;
                //         });
                //     }
                // });
            }
        }
    function DeleteTransInwOrder($item, $index) 
        {
            var _item = TransportPickupanddeliveryCtrl.ePage.Masters.dellist.map(function (value, key) {
                return value.WorkOrderID;
            }).itemOf($item.WorkOrderID);


            if (_item !== -1) {
                TransportPickupanddeliveryCtrl.ePage.Masters.dellist[$index].IsDeleted = true;
                // $item = filterObjectUpdate(TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data, "IsModified");
                // apiService.post("eAxisAPI", 'WmsTransportList/Update', TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data).then(function (response) {
                //     if (response.data.Status == 'Success') {
                //         apiService.get("eAxisAPI", 'WmsTransportList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                //             TransportPickupanddeliveryCtrl.ePage.Entities.Header.Data = response.data.Response;
                //         });
                //     }
                // });
            }
        }      
       


    Init();
  }
})();