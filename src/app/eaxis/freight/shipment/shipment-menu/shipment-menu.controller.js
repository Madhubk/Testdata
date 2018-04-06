(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentMenuController", ShipmentMenuController);

    ShipmentMenuController.$inject = ["$rootScope", "$location", "shipmentConfig", "helperService", "appConfig", "authService", "apiService"];

    function ShipmentMenuController($rootScope, $location, shipmentConfig, helperService, appConfig, authService, apiService) {
        var ShipmentMenuCtrl = this;
        var url = $location.path();

        function Init() {
            var currentShipment = ShipmentMenuCtrl.currentShipment[ShipmentMenuCtrl.currentShipment.label].ePage.Entities;
            ShipmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ShipmentMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };
            ShipmentMenuCtrl.ePage.Masters.ShipmentMenu = {};
            ShipmentMenuCtrl.ePage.Masters.MyTask = {};

            $rootScope.OnAddressEdit = OnAddressEdit;
            $rootScope.OnAddressEditBack = OnAddressEditBack;
            ShipmentMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;

            var _menuList = angular.copy(ShipmentMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (ShipmentMenuCtrl.currentShipment.isNew) {
                _menuList[_index].IsDisabled = true;

                ShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource = _menuList;
                ShipmentMenuCtrl.ePage.Masters.ActiveMenu = ShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }
        }

        function GetMyTaskList(menuList, index) {
            var _menuList = menuList,
                _index = index;
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: ShipmentMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: ShipmentMenuCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ShipmentMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    ShipmentMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                ShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource = _menuList;
                ShipmentMenuCtrl.ePage.Masters.ActiveMenu = ShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource[0];
            });
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEditNavType(selectedItem, addressType, type);
            ShipmentMenuCtrl.ePage.Masters.TabIndex = 8;
        }

        function OnAddressEditBack(selectedItem, addressType, type) {
            ShipmentMenuCtrl.ePage.Masters.TabIndex = 0;
        }

        function OnMenuClick($item) {
            if ($item) {
                ShipmentMenuCtrl.ePage.Masters.ActiveMenu = $item;
                ShipmentMenuCtrl.activeTab = ShipmentMenuCtrl.ePage.Masters.ActiveMenu;
            }
        }

        Init();
    }
})();
