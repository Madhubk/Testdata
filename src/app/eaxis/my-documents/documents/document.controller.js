(function () {
    "use strict";

    angular
        .module("Application")
        .controller("documentController", DocumentController);

    DocumentController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "customerPortalDocumentConfig", "appConfig"];

    function DocumentController($rootScope, $scope, state, $timeout, $location, $q, APP_CONSTANT, authService, apiService, helperService, toastr, customerPortalDocumentConfig, appConfig) {
        var DocumentCtrl = this;

        function Init() {

            DocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Customer_Portal_Documents",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": customerPortalDocumentConfig.Entities
            };

            console.log(DocumentCtrl.ePage)
            DocumentCtrl.ePage.Masters.DocumentDetails = {};
            DocumentCtrl.ePage.Masters.DocumentDetails.GridData = [];
            DocumentCtrl.ePage.Masters.taskName = "AllDocuments";
            DocumentCtrl.ePage.Masters.dataentryName = "AllDocuments";
            DocumentCtrl.ePage.Masters.config = DocumentCtrl.ePage.Entities;

            // Document Grid Data
            DocumentCtrl.ePage.Masters.DocumentDetails.SelectedShipment = SelectedShipment;
            DocumentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            // DatePicker
            DocumentCtrl.ePage.Masters.DatePicker = {};
            DocumentCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DocumentCtrl.ePage.Masters.DatePicker.isOpen = [];
            DocumentCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            
            
            

            console.log(DocumentCtrl.ePage.Masters.DocumentDetails.GridData)
            
            CheckUserBasedMenuVisibleType()
        }
        // -------------Date time picker-------------
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            DocumentCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function SelectedGridRow($item) {
            // body...
            console.log($item)
        }
        function SelectedShipment($item) {
            // body...
        }
        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        DocumentCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }
        
        Init();
    }
})();
