(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardPickController", OutwardPickController);

    OutwardPickController.$inject = ["$scope", "$state", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "$injector", "$window", "toastr", "confirmation"];

    function OutwardPickController($scope, $state, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, $injector, $window, toastr, confirmation) {

        var OutwardPickCtrl = this;

        function Init() {

            var currentOutward = OutwardPickCtrl.currentOutward[OutwardPickCtrl.currentOutward.label].ePage.Entities;
            var pickDetails = OutwardPickCtrl.pickDetails;

            OutwardPickCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Pick",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward,
                "PickDetails":pickDetails,
            };

            OutwardPickCtrl.ePage.Masters.Enable = true;
            OutwardPickCtrl.ePage.Masters.selectedRow = -1;
            OutwardPickCtrl.ePage.Masters.emptyText = '-';
            OutwardPickCtrl.ePage.Masters.SearchTable = '';

            OutwardPickCtrl.ePage.Masters.setSelectedRow = setSelectedRow;

            OutwardPickCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            OutwardPickCtrl.ePage.Masters.GoToReleasePage = GoToReleasePage;

            GeneralValues();
            GetUserBasedGridColumList();

        }

        
        //#region User Based Table Column
        function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_OUTWARDPICK",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    OutwardPickCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        OutwardPickCtrl.ePage.Entities.Header.TableProperties.UIWmsPickLine = obj;
                        OutwardPickCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    OutwardPickCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
         
        function setSelectedRow(index){
            OutwardPickCtrl.ePage.Masters.selectedRow = index;
        }
        
        function GoToReleasePage() {
            var _queryString = {
                PK: OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.PK,
                PickNo: OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.PickNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardrelease/" + _queryString, "_blank");
        }

        function GeneralValues() {
            if (OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.WarehouseCode == null)
                OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.WarehouseCode = '';

            if (OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.WarehouseName == null)
                OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.WarehouseName = '';

            OutwardPickCtrl.ePage.Masters.Warehouse = OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.WarehouseCode + ' - ' + OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.WarehouseName;

            if (OutwardPickCtrl.ePage.Masters.Warehouse == ' - ')
                OutwardPickCtrl.ePage.Masters.Warehouse = '';

        }

        function SingleRecordView() {
            var _queryString = {
                PK: OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.PK,
                PickNo: OutwardPickCtrl.ePage.PickDetails.UIWmsPickHeader.PickNo,
                ConfigName:"pickConfig"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardpick/" + _queryString, "_blank");
        }

        Init();
    }

})();