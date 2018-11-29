(function () {
    "use strict";

    angular
    .module("Application")
    .controller("LoadPlanningEditController", LoadPlanningEditController);

    LoadPlanningEditController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$filter","$injector","param", "confirmation","dynamicLookupConfig"];
    
    function LoadPlanningEditController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $filter,$injector, param, confirmation,dynamicLookupConfig) {

        var LoadPlanningEditCtrl = this;
        // dynamicLookupConfig = $injector.get("dynamicLookupConfig");
        function Init() {
            var currentLoad = param;

            LoadPlanningEditCtrl.ePage = {
                "Title": "",
                "Prefix": "LevelLoadEdit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentLoad
            };
            LoadPlanningEditCtrl.ePage.Masters.Cancel = Cancel;
            LoadPlanningEditCtrl.ePage.Masters.Save = Save;
            LoadPlanningEditCtrl.ePage.Masters.OnDropperItemClick = OnDropperItemClick;
            getConsignmentFA()
            getItemFA()
        }

        function getItemFA(){
            var _filter = {
                 "IsStockOnHand" : 1
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSLPL"
            };
            apiService.post("eAxisAPI", "TmsLoadPlanning/FindAll", _input).then(function SuccessCallback(response) {    
                if(response.data.Response){
                    //LoadPlanningEditCtrl.ePage.Masters.AvailItem = response.data.Response;
                    var AvailItem = response.data.Response;
                    LoadPlanningEditCtrl.ePage.Masters.AvailItem = [];
                    angular.forEach(AvailItem,function(value,key){
                        var _obj = {
                            "EventCode":  value.EventCode,
                            "ConsolCode": value.ConsolCode,
                            "DispatchHub":value.DispatchHub,
                            "TIT_ItemRef_ID": value.MhuType,
                            "TIT_ItemCode": value.ItemCode,
                            "TIT_ItemDesc": "",
                            "Quantity": 1,
                            "TIT_ReceiverRef": "",
                            "TIT_SenderRef": "",
                            "TIT_Height": "",
                            "TIT_Width": "",
                            "TIT_Length": "",
                            "TIT_Weight": "",
                            "TIT_Volumn": "",
                            "TIT_UOM": "",
                            "TIT_VolumeUQ": "",
                            "TIT_WeightUQ": "",
                            "TIT_FK": value.PK,
                            "TIT_Receiver_ORG_FK": "",
                            "TIT_ReceiverName": "",
                            "TIT_ReceiverCode": value.ReceiverCode,
                            "TIT_Sender_ORG_FK": "",
                            "TIT_SenderName": "",
                            "TIT_SenderCode": value.SenderCode,
                            "TIT_ItemStatus": "",
                            "PK":"",
                            "TMC_FK": "930CA80D-C73D-408A-B696-00C7FA3DD495",
                            "IsDeleted": false,
                            "IsModified": false
                        }   
                    LoadPlanningEditCtrl.ePage.Masters.AvailItem.push(_obj)     
                    });
                }
                LoadPlanningEditCtrl.ePage.Masters.AvailItem = $filter('unique')(LoadPlanningEditCtrl.ePage.Masters.AvailItem,'TIT_ItemCode')
            });
        }

        function getConsignmentFA(){
            var _filter = {
                "SenderCode"  : LoadPlanningEditCtrl.ePage.Entities.Detail.Depot, 
                "ReceiverCode": LoadPlanningEditCtrl.ePage.Entities.Detail.Store,
                "ConsignStatus" : "DRF",
                "ServiceType" : "LDS"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCON"
            };
            apiService.post("eAxisAPI", "TmsConsignment/FindAll", _input).then(function SuccessCallback(response) {    
                LoadPlanningEditCtrl.ePage.Masters.ConsignmentResponse = response.data.Response;
                apiService.get("eAxisAPI", "TmsConsignmentList/GetById/"+"956B6D37-D1D1-4853-82EB-0788DD825C20").then(function SuccessCallback(response) {    
                    LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList = response.data.Response;               
                    LoadPlanningEditCtrl.ePage.Masters.PlannedItem = $filter('filter')(LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList.TmsConsignmentItem, {TIT_ItemStatus : 'LIC'})
                });
            })
        }

        function OnDropperItemClick(item,type){
            LoadPlanningEditCtrl.ePage.Masters.SelectedItem = item;
            // if(type == "Avail"){
            //     var obj = {
            //         "TIT_ItemRef_ID": "",
            //         "TIT_ItemCode": "",
            //         "TIT_ItemDesc": "",
            //         "Quantity": 1,
            //         "TIT_ReceiverRef": "",
            //         "TIT_SenderRef": "",
            //         "TIT_Height": "",
            //         "TIT_Width": "",
            //         "TIT_Length": "",
            //         "TIT_Weight": "",
            //         "TIT_Volumn": "",
            //         "TIT_UOM": "",
            //         "TIT_VolumeUQ": "",
            //         "TIT_WeightUQ": "",
            //         "TIT_FK": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.PK,
            //         "TIT_Receiver_ORG_FK": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.Receiver_ORG_FK,
            //         "TIT_ReceiverName": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.ReceiverName,
            //         "TIT_ReceiverCode": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.ReceiverCode,
            //         "TIT_Sender_ORG_FK": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.Sender_ORG_FK,
            //         "TIT_SenderName": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.SenderName,
            //         "TIT_SenderCode": LoadPlanningEditCtrl.ePage.Masters.SelectedItem.SenderCode,
            //         "TIT_ItemStatus": "",
            //         "PK": "",
            //         "IsDeleted": false,
            //         "IsModified": false
            //     }
            //     LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList.TmsConsignmentItem.push(obj)    
            //     console.log(LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList.TmsConsignmentItem)
            // }    
            // else if(type == "plan"){
            //     LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList.TmsConsignmentItem.splice(item.TIT_FK, 1)
            // }             
        }

        function Save(){
            angular.forEach(LoadPlanningEditCtrl.ePage.Masters.PlannedItem,function(value,key){
                delete value.EventCode;
                delete value.ConsolCode;
                delete value.DispatchHub;
            });

            angular.forEach(LoadPlanningEditCtrl.ePage.Masters.PlannedItem,function(value1,key1){
                if(!value1.PK){
                    LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList.TmsConsignmentItem.push(value1)
                }
            });    
            
            LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList = filterObjectUpdate(LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList, "IsModified");
            
            apiService.post("eAxisAPI", 'TmsConsignmentList/Update', LoadPlanningEditCtrl.ePage.Masters.MajorConsignmentList).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Succcessfully")
                }
            });
        }
        
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
            // $uibModalInstance.close(LevelLoadEditCtrl.ePage.Entities.Entity)
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