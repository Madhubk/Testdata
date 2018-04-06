(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupandDeliveryMenuController", PickupandDeliveryMenuController);

    PickupandDeliveryMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "pickupanddeliveryConfig", "helperService", "appConfig"];

    function PickupandDeliveryMenuController($scope, $timeout, APP_CONSTANT, apiService, pickupanddeliveryConfig, helperService, appConfig) {

        var PickupandDeliveryMenuCtrl = this;

        function Init() {

            var currentPickupanddelivery = PickupandDeliveryMenuCtrl.currentPickupanddelivery[PickupandDeliveryMenuCtrl.currentPickupanddelivery.label].ePage.Entities;


            PickupandDeliveryMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickupanddelivery_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickupanddelivery

            };
            //NEW
            if(PickupandDeliveryMenuCtrl.currentPickupanddelivery.isNew)
            {
                apiService.get("eAxisAPI", pickupanddeliveryConfig.Entities.Header.API.TransGetByID.Url+null).then(function (response) {
                PickupandDeliveryMenuCtrl.currentPickupanddelivery[PickupandDeliveryMenuCtrl.currentPickupanddelivery.label].ePage.Entities.Header.Data.UIWmsTransport= response.data.Response.Response.UIWmsTransportHeader;
                PickupandDeliveryMenuCtrl.currentPickupanddelivery[PickupandDeliveryMenuCtrl.currentPickupanddelivery.label].ePage.Entities.Header.Data.UIWmsPickupAndDeliveryPointsHeader.TPT_FK = response.data.Response.Response.UIWmsTransportHeader.PK;
                });
            }
            

            // Standard Menu Configuration and Data
            PickupandDeliveryMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportPickupandDelivery;
            PickupandDeliveryMenuCtrl.ePage.Masters.StandardMenuInput.obj = PickupandDeliveryMenuCtrl.currentPickupanddelivery;
            // function
            PickupandDeliveryMenuCtrl.ePage.Masters.Save = Save;
            PickupandDeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            PickupandDeliveryMenuCtrl.ePage.Masters.IsDisableSave = false;

            PickupandDeliveryMenuCtrl.ePage.Masters.PODMenu = {};
            // Menu list from configuration

            PickupandDeliveryMenuCtrl.ePage.Masters.PODMenu.ListSource = PickupandDeliveryMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            //GetDropDownDescription();
        }
        function GetDropDownDescription() {

            var Status = PickupandDeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsTransport.Status;


            switch (Status) {

                case "ENT":
                    PickupandDeliveryMenuCtrl.ePage.Masters.Status = "Entered";
                    break;

                default:
                    PickupandDeliveryMenuCtrl.ePage.Masters.Status = "";
                    break;
            }
        }
        function Save($item) {
            PickupandDeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            PickupandDeliveryMenuCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickupAndDeliveryPointsHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Pickupanddelivery').then(function (response) {
                if (response.Status === "success") {
                    var _index = pickupanddeliveryConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(PickupandDeliveryMenuCtrl.currentPickupanddelivery.label);

                    if (_index !== -1) {
                        pickupanddeliveryConfig.TabList[_index][pickupanddeliveryConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        pickupanddeliveryConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                PickupandDeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                PickupandDeliveryMenuCtrl.ePage.Masters.IsDisableSave = false;
            });
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