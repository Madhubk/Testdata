(function(){
    "use strict";

    angular
         .module("Application")
         .controller("TransportOrdersController",TransportOrdersController);

    TransportOrdersController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "transportConfig", "helperService", "toastr", "$injector", "confirmation", "$window","$document"];

    function TransportOrdersController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, transportConfig, helperService, toastr, $injector, confirmation, $window, $document){

        var TransOrdersCtrl = this;
        var Config = $injector.get("outwardConfig");        
        function Init(){
      
            var currentTransport = TransOrdersCtrl.currentTransport[TransOrdersCtrl.currentTransport.label].ePage.Entities;
            console.log(currentTransport);

            TransOrdersCtrl.ePage = {
                "Title": "",
                "Prefix": "Transport_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTransport,
        };

       
        TransOrdersCtrl.ePage.Masters.DropDownMasterList ={};
        TransOrdersCtrl.ePage.Masters.setSelectedRow = setSelectedRow;  
        TransOrdersCtrl.ePage.Masters.onClick = onClick;
        TransOrdersCtrl.ePage.Masters.attachoutwardOrders = attachoutwardOrders;
        TransOrdersCtrl.ePage.Masters.attachinwardOrders = attachinwardOrders;
        TransOrdersCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
        TransOrdersCtrl.ePage.Masters.DeleteTransOrder = DeleteTransOrder;
        TransOrdersCtrl.ePage.Masters.DeleteTransInOrder = DeleteTransInOrder;
        TransOrdersCtrl.ePage.Masters.EditOrderDetails = EditOrderDetails;
        TransOrdersCtrl.ePage.Masters.addinwnew = addinwnew;
        TransOrdersCtrl.ePage.Masters.addordnew = addordnew;
        TransOrdersCtrl.ePage.Masters.SelectedLookupfromclient = SelectedLookupfromclient;
        TransOrdersCtrl.ePage.Masters.SelectedLookuptoclient = SelectedLookuptoclient;
        TransOrdersCtrl.ePage.Masters.RemoveRow = RemoveRow;
        //DropDown
       // GetDropDownList();
     //  getOrdersList();
    }
    function RemoveRow(item,index){
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
            .then(function (result) {
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.splice(index,1);   
                // if(item.PK){                         
                //     apiService.get("eAxisAPI", TransOrdersCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function(response) {
                //     });
                // }
                toastr.info('Record removed from the list'); 
            }, function () {
                console.log("Cancelled");
            });
            
        }

    function SelectedLookupfromclient(item, index)
            {                
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Address1 = item.Address1;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Address2 = item.Address2;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_City = item.City;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode= item.OrgCode;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName= item.OrgName;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].PickupFrom_TPD_FK=item.PK;
            }
    function SelectedLookuptoclient(item, index)
            {
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Address1 = item.Address1;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Address2 = item.Address2;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_City = item.City;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode= item.OrgCode;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName= item.OrgName;
                TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].DeliveryTo_TPD_FK=item.PK;
            }
    function onClick(index, item) 
        {   
            if(item)
            {
                TransOrdersCtrl.ePage.Masters.PickupCodeName = item.From_OrgCode+" - "+item.From_Address1;
                TransOrdersCtrl.ePage.Masters.DeliveryCodeName = item.To_OrgCode+" - "+ item.To_Address1;    
            }
            TransOrdersCtrl.ePage.Masters.selectedRow = index;
            if (TransOrdersCtrl.ePage.Masters.PrevRow != TransOrdersCtrl.ePage.Masters.selectedRow ||  TransOrdersCtrl.ePage.Masters.hideIndex == -1 ) {
                TransOrdersCtrl.ePage.Masters.hideIndex = index;
                TransOrdersCtrl.ePage.Masters.PrevRow = TransOrdersCtrl.ePage.Masters.selectedRow;
            }
            else {
                TransOrdersCtrl.ePage.Masters.hideIndex = -1;
            }  
            $timeout(function(){ $scope.$apply();}, 500);            
            
        };          
    function setSelectedRow(index)
        {
            TransOrdersCtrl.ePage.Masters.selectedRow = index;
        }   
        $document.bind('keydown', function (e) {
            if (TransOrdersCtrl.ePage.Masters.selectedRow!=-1) {
                if (e.keyCode == 38) {     
                    if (TransOrdersCtrl.ePage.Masters.selectedRow == 0) {
                        return;
                    }
                    TransOrdersCtrl.ePage.Masters.selectedRow--;
                    $scope.$apply();
                    e.preventDefault();
                }
                if (e.keyCode == 40) {
                    if (TransOrdersCtrl.ePage.Masters.selectedRow == TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.length - 1) {
                        return;
                    }
                    TransOrdersCtrl.ePage.Masters.selectedRow++;
                    $scope.$apply();
                    e.preventDefault();
                }

                if (e.keyCode == 13) {
                    onClick(TransOrdersCtrl.ePage.Masters.selectedRow);                   
                }

           }
        });
    function GetDropDownList() 
        {
        // Get CFXType Dropdown list
            var typeCodeList = ["TRA_TRANSPORTTYPE","TRA_TRANSMODE","DropMode","TRA_TRANSBY","TRANS_VEHTYPE"];
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
                    TransOrdersCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                    TransOrdersCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
            }
            });
        }
        // attach orders
    function attachoutwardOrders($item) 
        {
            
            var _isExist = TransOrdersCtrl.ePage.Entities.Header.Data.WmsOutward.some(function (value, index) {
                return value.PK === $item.data.entity.PK;
            });

            if (!_isExist) {
                if ($item.data.entity.PK !== TransOrdersCtrl.ePage.Entities.Header.Data.PK) {
                    TransOrdersCtrl.ePage.Entities.Header.Data.WmsOutward.push($item.data.entity);
                } else {
                    toastr.warning("You cannot add the same opened ORDER...!");
                }
            } else {
                toastr.warning("Record Already Available...!");
            }
            
        }
    function attachinwardOrders($item) 
        {
            var _isExist = TransOrdersCtrl.ePage.Entities.Header.Data.WmsInward.some(function (value, index) {
                return value.PK === $item.data.entity.PK;
            });

            if (!_isExist) {
                if ($item.data.entity.PK !== TransOrdersCtrl.ePage.Entities.Header.Data.PK) {
                    TransOrdersCtrl.ePage.Entities.Header.Data.WmsInward.push($item.data.entity);
                } else {
                    toastr.warning("You cannot add the same opened ORDER...!");
                }
            } else {
                toastr.warning("Record Already Available...!");
            }
        }        
    function addordnew() 
        {
            helperService.getFullObjectUsingGetById(Config1.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIWmsTransportHeader.PK = response.data.Response.Response.PK;
                    TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.WorkOrderID = response.data.Response.Response.UIWmsTransportHeader.WorkOrderID

                    apiService.post("eAxisAPI",TransOrdersCtrl.ePage.Entities.Header.API.InsertTrans.Url, response.data.Response.Response).then(function (response) {
                    });

                    var _queryString = {
                        PK: response.data.Response.Response.UIWmsTransportHeader.PK,
                        WorkOrderID: response.data.Response.Response.UIWmsTransportHeader.WorkOrderID
                    };
                    _queryString = helperService.encryptData(_queryString);
                    $window.open("#/EA/single-record-view/transorder/" + _queryString, "_blank");
                }
            });
        }
    function addinwnew() 
        {
            helperService.getFullObjectUsingGetById(Config2.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIWmsTransportHeader.PK = response.data.Response.Response.PK;
                    TransOrdersCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.WorkOrderID = response.data.Response.Response.UIWmsTransportHeader.WorkOrderID

                    apiService.post("eAxisAPI", TransOrdersCtrl.ePage.Entities.Header.API.InsertTrans.Url, response.data.Response.Response).then(function (response) {
                    });

                    var _queryString = {
                        PK: response.data.Response.Response.UIWmsTransportHeader.PK,
                        WorkOrderID: response.data.Response.Response.UIWmsTransportHeader.WorkOrderID
                    };
                    _queryString = helperService.encryptData(_queryString);
                    $window.open("#/EA/single-record-view/transinorder/" + _queryString, "_blank");
                }
            });
        }
    function EditOrderDetails(obj) 
        {
            
            var _queryString = {
                PK: obj.WOD_FK,
                WorkOrderID: obj.WorkOrderID
            };
            _queryString = helperService.encryptData(_queryString);
            if(obj.WordOrderType == "ORD")
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

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteTransInOrder($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
    function DeleteTransOrder($item) 
        {
            var _index = TransOrdersCtrl.ePage.Entities.Header.Data.WmsOutward.map(function (value, key) {
                return value.WorkOrderID;
            }).indexOf($item.WorkOrderID);


            if (_index !== -1) {
                TransOrdersCtrl.ePage.Entities.Header.Data.WmsOutward.splice(_index, 1);
            }
        }
    function DeleteTransInOrder($item) 
        {
            var _index = TransOrdersCtrl.ePage.Entities.Header.Data.WmsInward.map(function (value, key) {
                return value.WorkOrderID;
            }).indexOf($item.WorkOrderID);


            if (_index !== -1) {
                TransOrdersCtrl.ePage.Entities.Header.Data.WmsInward.splice(_index, 1);
            }
        }    

    
    Init();
  }
})();