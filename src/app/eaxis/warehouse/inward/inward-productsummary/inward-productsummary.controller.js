(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardProductsummaryController", InwardProductsummaryController);

    InwardProductsummaryController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$q"];

    function InwardProductsummaryController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $q) {

        var InwardProductsummaryCtrl = this;
        function Init() {

            var currentInward = InwardProductsummaryCtrl.currentInward[InwardProductsummaryCtrl.currentInward.label].ePage.Entities;
            InwardProductsummaryCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };

            InwardProductsummaryCtrl.ePage.Masters.Enable = true;
            InwardProductsummaryCtrl.ePage.Masters.selectedRow = -1;
            InwardProductsummaryCtrl.ePage.Masters.emptyText = '-';
            InwardProductsummaryCtrl.ePage.Masters.SearchTable = '';

            InwardProductsummaryCtrl.ePage.Masters.setSelectedRow = setSelectedRow;

            InwardProductsummaryCtrl.ePage.Masters.Config= inwardConfig;
            InwardProductsummaryCtrl.ePage.Masters.Config.ProductSummary(InwardProductsummaryCtrl.ePage.Entities.Header);   
           
            GetUserBasedGridColumList();
        }
        function setSelectedRow(index){
            InwardProductsummaryCtrl.ePage.Masters.selectedRow = index;
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_INWARDPRODUCTSUMMARY",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    InwardProductsummaryCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        InwardProductsummaryCtrl.ePage.Entities.Header.TableProperties.ProductSummaryList = obj;
                        InwardProductsummaryCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    InwardProductsummaryCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        Init();
    }

})();