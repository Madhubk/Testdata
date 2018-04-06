(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupanddeliveryController", PickupanddeliveryController);

    PickupanddeliveryController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "pickupanddeliveryConfig", "$timeout", "toastr", "appConfig"];

    function PickupanddeliveryController($location, APP_CONSTANT, authService, apiService, helperService, pickupanddeliveryConfig, $timeout, toastr, appConfig) {


        var PickupanddeliveryCtrl = this;

        function Init() {

            PickupanddeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickupanddelivery",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": pickupanddeliveryConfig.Entities
            };
            PickupanddeliveryCtrl.ePage.Masters.taskName = "TransportPickupandDelivery";
            PickupanddeliveryCtrl.ePage.Masters.dataentryName = "TransportPickupandDelivery";

            PickupanddeliveryCtrl.ePage.Masters.TabList = [];
            PickupanddeliveryCtrl.ePage.Masters.activeTabIndex = 0;
            PickupanddeliveryCtrl.ePage.Masters.SaveButtonText = "Save";
            PickupanddeliveryCtrl.ePage.Masters.IsDisableSave = false;
            PickupanddeliveryCtrl.ePage.Masters.IsNewClicked = false;
            PickupanddeliveryCtrl.ePage.Masters.IsTabClick = false;



            PickupanddeliveryCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            PickupanddeliveryCtrl.ePage.Masters.AddTab = AddTab;
            PickupanddeliveryCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            PickupanddeliveryCtrl.ePage.Masters.RemoveTab = RemoveTab;


            PickupanddeliveryCtrl.ePage.Masters.CreateNewPickupanddelivery = CreateNewPickupanddelivery;

        }
        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                PickupanddeliveryCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentPickupanddelivery, isNew) {
            PickupanddeliveryCtrl.ePage.Masters.currentPickupanddelivery = undefined;

            var _isExist = PickupanddeliveryCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentPickupanddelivery.entity.ReferenceNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                PickupanddeliveryCtrl.ePage.Masters.IsTabClick = true;
                var _currentPickupanddelivery = undefined;
                if (!isNew) {
                    _currentPickupanddelivery = currentPickupanddelivery.entity;
                } else {
                    _currentPickupanddelivery = currentPickupanddelivery;
                }

                pickupanddeliveryConfig.GetTabDetails(_currentPickupanddelivery, isNew).then(function (response) {
                    PickupanddeliveryCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        PickupanddeliveryCtrl.ePage.Masters.activeTabIndex = PickupanddeliveryCtrl.ePage.Masters.TabList.length;
                        if(isNew == true){
                            PickupanddeliveryCtrl.ePage.Masters.CurrentActiveTab(currentPickupanddelivery.data.UIWmsPickupAndDeliveryPointsHeader.ReferenceNo);
                        }
                        else if(isNew == false){
                            PickupanddeliveryCtrl.ePage.Masters.CurrentActiveTab(currentPickupanddelivery.entity.ReferenceNo);    
                        }                        
                        PickupanddeliveryCtrl.ePage.Masters.IsTabClick = false;

                    });
                });
            } else {
                toastr.info('Pickupanddelivery already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            console.log(currentTab)
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            PickupanddeliveryCtrl.ePage.Masters.currentPickupanddelivery = currentTab;
        }

        function RemoveTab(event, index, currentPickupanddelivery) {
            event.preventDefault();
            event.stopPropagation();
            var currentPickupanddelivery = currentPickupanddelivery[currentPickupanddelivery.label].ePage.Entities;
            PickupanddeliveryCtrl.ePage.Masters.TabList.splice(index, 1);
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

        function CreateNewPickupanddelivery() {

            PickupanddeliveryCtrl.ePage.Masters.IsNewClicked = true;
            helperService.getFullObjectUsingGetById(PickupanddeliveryCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {

                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.UIWmsPickupAndDeliveryPointsHeader,
                        data: response.data.Response.Response
                    };
                    PickupanddeliveryCtrl.ePage.Masters.AddTab(_obj, true);
                    PickupanddeliveryCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Pickupanddelivery response");
                }
            });
        }
      

        Init();
    }

})();	