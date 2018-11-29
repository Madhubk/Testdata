(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DateRevisionConsignmentController", DateRevisionConsignmentController);

    DateRevisionConsignmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "dateRevisionConsignmentConfig", "$timeout", "toastr", "appConfig"];

    function DateRevisionConsignmentController($location, APP_CONSTANT, authService, apiService, helperService, dateRevisionConsignmentConfig, $timeout, toastr, appConfig) {

        var DateRevisionConsignmentCtrl = this;

        function Init() {

            DateRevisionConsignmentCtrl.ePage = {
                "Title": "",
                "Prefix": "DateRevision_Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": dateRevisionConsignmentConfig.Entities
            };

            DateRevisionConsignmentCtrl.ePage.Masters.dataentryName = "DateRevisionConsignment";

            DateRevisionConsignmentCtrl.ePage.Masters.TabList = [];
            DateRevisionConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
            DateRevisionConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
            DateRevisionConsignmentCtrl.ePage.Masters.IsTabClick = false;
            DateRevisionConsignmentCtrl.ePage.Masters.Config = dateRevisionConsignmentConfig;

            //functions
            DateRevisionConsignmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DateRevisionConsignmentCtrl.ePage.Masters.AddTab = AddTab;
            DateRevisionConsignmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DateRevisionConsignmentCtrl.ePage.Masters.RemoveTab = RemoveTab;

            // Remove all Tabs while load shipment
            dateRevisionConsignmentConfig.TabList = [];
            // getOrgSender();
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
                        DateRevisionConsignmentCtrl.ePage.Masters.UserAccessCode = response.data.Response[0].ORG_Code;

                        // DateRevisionConsignmentCtrl.ePage.Masters.defaultFilter = {
                        //     "SenderCarrierCode": DateRevisionConsignmentCtrl.ePage.Masters.UserAccessCode,
                        //     "ActualDeliveryDateTime": "null",
                        //     "ActualPickupDateTime": "NOTNULL",
                        //     "Status": "DSP"
                        // }
                    }
                }
            });
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DateRevisionConsignmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewConsignment();
            }
        }

        function AddTab(currentConsignment, isNew) {
            DateRevisionConsignmentCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = DateRevisionConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
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
                DateRevisionConsignmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                }

               dateRevisionConsignmentConfig.GetTabDetails(_currentConsignment, isNew).then(function (response) {
                    DateRevisionConsignmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DateRevisionConsignmentCtrl.ePage.Masters.activeTabIndex = DateRevisionConsignmentCtrl.ePage.Masters.TabList.length;
                        DateRevisionConsignmentCtrl.ePage.Masters.CurrentActiveTab(currentConsignment.entity.ConsignmentNumber);
                        DateRevisionConsignmentCtrl.ePage.Masters.IsTabClick = false;
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
            DateRevisionConsignmentCtrl.ePage.Masters.currentConsignment = currentTab;
        }

        function RemoveTab(event, index, currentConsignment) {
            event.preventDefault();
            event.stopPropagation();
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            DateRevisionConsignmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        Init();
    }
})();