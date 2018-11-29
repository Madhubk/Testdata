(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupConsignmentController", PickupConsignmentController);

    PickupConsignmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "pickupConsignmentConfig", "$timeout", "toastr", "appConfig"];

    function PickupConsignmentController($location, APP_CONSTANT, authService, apiService, helperService, pickupConsignmentConfig, $timeout, toastr, appConfig) {

        var PickupConsignmentCtrl = this;

        function Init() {

            PickupConsignmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": pickupConsignmentConfig.Entities
            };

            PickupConsignmentCtrl.ePage.Masters.dataentryName = "PickupConsignment";



            PickupConsignmentCtrl.ePage.Masters.TabList = [];
            PickupConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
            PickupConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
            PickupConsignmentCtrl.ePage.Masters.IsTabClick = false;
            PickupConsignmentCtrl.ePage.Masters.Config = pickupConsignmentConfig;

            //functions
            PickupConsignmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            PickupConsignmentCtrl.ePage.Masters.AddTab = AddTab;
            PickupConsignmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            PickupConsignmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            PickupConsignmentCtrl.ePage.Masters.CreateNewConsignment = CreateNewConsignment;
            PickupConsignmentCtrl.ePage.Masters.SaveandClose = SaveandClose;

            pickupConsignmentConfig.ValidationFindall();

            // Remove all Tabs while load shipment
            pickupConsignmentConfig.TabList = [];

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
                        PickupConsignmentCtrl.ePage.Masters.UserAccessCode = response.data.Response[0].ORG_Code;

                        PickupConsignmentCtrl.ePage.Masters.defaultFilter = {
                            "SenderCarrierCode": PickupConsignmentCtrl.ePage.Masters.UserAccessCode,
                            "ActualDeliveryDateTime": "null",
                            "ActualPickupDateTime": "null",
                            "ConsignmentStatusDesc": "In-Transit"
                        }
                    }
                }
            });
        }

        function SaveandClose(index, currentConsignment) {
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            PickupConsignmentCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            PickupConsignmentCtrl.ePage.Masters.Config.SaveAndClose = false;
            PickupConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                PickupConsignmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewConsignment();
            }
        }

        function AddTab(currentConsignment, isNew) {
            PickupConsignmentCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = PickupConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
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
                PickupConsignmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                }

                pickupConsignmentConfig.GetTabDetails(_currentConsignment, isNew).then(function (response) {
                    PickupConsignmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        PickupConsignmentCtrl.ePage.Masters.activeTabIndex = PickupConsignmentCtrl.ePage.Masters.TabList.length;
                        PickupConsignmentCtrl.ePage.Masters.CurrentActiveTab(currentConsignment.entity.ConsignmentNumber);
                        PickupConsignmentCtrl.ePage.Masters.IsTabClick = false;
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
            PickupConsignmentCtrl.ePage.Masters.currentConsignment = currentTab;
        }

        function RemoveTab(event, index, currentConsignment) {
            event.preventDefault();
            event.stopPropagation();
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            PickupConsignmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewConsignment() {
            var _isExist = PickupConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                PickupConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = true;

                helperService.getFullObjectUsingGetById(PickupConsignmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsConsignmentHeader,
                            data: response.data.Response
                        };
                        PickupConsignmentCtrl.ePage.Masters.AddTab(_obj, true);
                        PickupConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
                    } else {
                        console.log("Empty New Consignment response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        Init();
    }
})();