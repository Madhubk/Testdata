(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardViewDetailController", OutwardViewDetailController);

    OutwardViewDetailController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter","appConfig"];

    function OutwardViewDetailController($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter,appConfig) {

        var OutwardViewDetailCtrl = this;

        function Init() {

            var currentOutwardViewDetail = OutwardViewDetailCtrl.currentOutwardViewDetail[OutwardViewDetailCtrl.currentOutwardViewDetail.label].ePage.Entities;

            OutwardViewDetailCtrl.ePage = {
                "Title": "",
                "Prefix": "OutwardView_Detail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutwardViewDetail,
            };

            GetContainerlist();
            GetReferencelist();
            GetPickList();
            AllocatePartAttribute();
        }
        Init();

        function GetContainerlist() {

            var _filter = {
                "WOD_FK": OutwardViewDetailCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OutwardViewDetailCtrl.ePage.Entities.Header.API.Containers.FilterID
            };
            apiService.post("eAxisAPI", OutwardViewDetailCtrl.ePage.Entities.Header.API.Containers.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = response.data.Response;

                    OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = $filter('orderBy')(OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer, 'CreatedDateTime');
                }
            });
        }



        function GetReferencelist() {
            var _filter = {
                "WOD_FK": OutwardViewDetailCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OutwardViewDetailCtrl.ePage.Entities.Header.API.References.FilterID
            };

            apiService.post("eAxisAPI", OutwardViewDetailCtrl.ePage.Entities.Header.API.References.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = response.data.Response;
                    OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = $filter('orderBy')(OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference, 'CreatedDateTime');
                }
            });
        }

        function GetPickList() {
            OutwardViewDetailCtrl.ePage.Masters.isloading=true;
            if(OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK){
                apiService.get("eAxisAPI", OutwardViewDetailCtrl.ePage.Entities.Header.API.PickListGetById.Url + OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                    if (response.data.Response) {
                
                        OutwardViewDetailCtrl.ePage.Masters.PickListDetails = response.data.Response;
                        OutwardViewDetailCtrl.ePage.Masters.isloading=false;
    
                    }
                });
            }
        }

        function AllocatePartAttribute() {
           
            if(OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK){
                var _filter = {
                    "ORG_FK": OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK     
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };
        
                    apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name; 
                            OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                            OutwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;

                        }
                    });
                }
            }




    }

})();