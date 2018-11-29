(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryConsignmentController", DeliveryConsignmentController);

    DeliveryConsignmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "deliveryConsignmentConfig", "$timeout", "toastr", "appConfig"];

    function DeliveryConsignmentController($location, APP_CONSTANT, authService, apiService, helperService, deliveryConsignmentConfig, $timeout, toastr, appConfig) {

        var DeliveryConsignmentCtrl = this;

        function Init() {

            DeliveryConsignmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": deliveryConsignmentConfig.Entities
            };

            DeliveryConsignmentCtrl.ePage.Masters.dataentryName = "DeliveryConsignment";

            DeliveryConsignmentCtrl.ePage.Masters.TabList = [];
            DeliveryConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
            DeliveryConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
            DeliveryConsignmentCtrl.ePage.Masters.IsTabClick = false;
            DeliveryConsignmentCtrl.ePage.Masters.Config = deliveryConsignmentConfig;

            //functions
            DeliveryConsignmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DeliveryConsignmentCtrl.ePage.Masters.AddTab = AddTab;
            DeliveryConsignmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DeliveryConsignmentCtrl.ePage.Masters.RemoveTab = RemoveTab;

            // Remove all Tabs while load shipment
            deliveryConsignmentConfig.TabList = [];
            getOrgSender();
        }

        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        DeliveryConsignmentCtrl.ePage.Masters.UserAccessCode = response.data.Response[0].ORG_Code;

                        DeliveryConsignmentCtrl.ePage.Masters.defaultFilter = {
                            "SenderCarrierCode": DeliveryConsignmentCtrl.ePage.Masters.UserAccessCode,
                            "ActualDeliveryDateTime": "null",
                            "ActualPickupDateTime": "NOTNULL",
                            "ConsignmentStatusDesc": "In-Transit"
                        }
                    }
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DeliveryConsignmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewConsignment();
            }
        }

        function AddTab(currentConsignment, isNew) {
            DeliveryConsignmentCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = DeliveryConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentConsignment.entity.ConsignmentNumber)
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
                DeliveryConsignmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                }

                deliveryConsignmentConfig.GetTabDetails(_currentConsignment, isNew).then(function (response) {
                    DeliveryConsignmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DeliveryConsignmentCtrl.ePage.Masters.activeTabIndex = DeliveryConsignmentCtrl.ePage.Masters.TabList.length;
                        DeliveryConsignmentCtrl.ePage.Masters.CurrentActiveTab(currentConsignment.entity.ConsignmentNumber);
                        DeliveryConsignmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Pickup Consignment already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            }
            DeliveryConsignmentCtrl.ePage.Masters.currentConsignment = currentTab;
        }

        function RemoveTab(event, index, currentConsignment) {
            event.preventDefault();
            event.stopPropagation();
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            DeliveryConsignmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        Init();
    }
})();