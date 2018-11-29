(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryController", DeliveryController);

    DeliveryController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "deliveryConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function DeliveryController($location, APP_CONSTANT, authService, apiService, helperService, deliveryConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var DeliveryCtrl = this,
            location = $location;

        function Init() {
            DeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": deliveryConfig.Entities
            };
            
            DeliveryCtrl.ePage.Masters.dataentryName = "DeliveryRequest";
            DeliveryCtrl.ePage.Masters.taskName = "DeliveryRequest";
            DeliveryCtrl.ePage.Masters.TabList = [];
            deliveryConfig.TabList = [];
            DeliveryCtrl.ePage.Masters.activeTabIndex = 0;
            DeliveryCtrl.ePage.Masters.isNewClicked = false;
            DeliveryCtrl.ePage.Masters.IsTabClick = false;
            DeliveryCtrl.ePage.Masters.Config = deliveryConfig;

            deliveryConfig.ValidationFindall();

            //functions
            DeliveryCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DeliveryCtrl.ePage.Masters.AddTab = AddTab;
            DeliveryCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DeliveryCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DeliveryCtrl.ePage.Masters.CreateNewDelivery = CreateNewDelivery;
            DeliveryCtrl.ePage.Masters.SaveandClose = SaveandClose;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DeliveryCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewDelivery();
            }
        }

        function AddTab(currentDelivery, isNew) {
            DeliveryCtrl.ePage.Masters.currentDelivery = undefined;

            var _isExist = DeliveryCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentDelivery.entity.WorkOrderID)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });


            if (!_isExist) {
                DeliveryCtrl.ePage.Masters.IsTabClick = true;
                var _currentDelivery = undefined;
                if (!isNew) {
                    _currentDelivery = currentDelivery.entity;
                } else {
                    _currentDelivery = currentDelivery;
                }

                deliveryConfig.GetTabDetails(_currentDelivery, isNew).then(function (response) {
                    DeliveryCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DeliveryCtrl.ePage.Masters.activeTabIndex = DeliveryCtrl.ePage.Masters.TabList.length;
                        DeliveryCtrl.ePage.Masters.CurrentActiveTab(currentDelivery.entity.WorkOrderID);
                        DeliveryCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Delivery already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            DeliveryCtrl.ePage.Masters.currentDelivery = currentTab;
        }


        function RemoveTab(event, index, currentDelivery) {
            event.preventDefault();
            event.stopPropagation();
            var currentDelivery = currentDelivery[currentDelivery.label].ePage.Entities;
            DeliveryCtrl.ePage.Masters.TabList.splice(index, 1);

            // apiService.get("eAxisAPI", DeliveryCtrl.ePage.Entities.Header.API.SessionClose.Url + currentDelivery.Header.Data.PK).then(function(response){
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
        }

        function CreateNewDelivery() {
            var _isExist = DeliveryCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                DeliveryCtrl.ePage.Entities.Header.Message = false;
                DeliveryCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(DeliveryCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsDelivery,
                            data: response.data.Response.Response,
                            Validations: response.data.Response.Validations
                        };
                        DeliveryCtrl.ePage.Masters.AddTab(_obj, true);
                        DeliveryCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Delivery response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }

       

        function SaveandClose(index, currentDelivery){
            var currentDelivery = currentDelivery[currentDelivery.label].ePage.Entities;
            DeliveryCtrl.ePage.Masters.TabList.splice(index-1, 1);
            DeliveryCtrl.ePage.Masters.Config.SaveAndClose = false;
            // apiService.get("eAxisAPI", DeliveryCtrl.ePage.Entities.Header.API.SessionClose.Url + currentDelivery.Header.Data.PK).then(function(response){
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            DeliveryCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }

})();
