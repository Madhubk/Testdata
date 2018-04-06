(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SFUController", SFUControllers);

    SFUControllers.$inject = ["$timeout", "authService", "apiService", "appConfig", "helperService", "sufflierFollowupConfig", "toastr"];

    function SFUControllers($timeout, authService, apiService, appConfig, helperService, sufflierFollowupConfig, toastr) {
        var SFUCtrl = this;

        function Init() {

            SFUCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_Follow_UP",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": sufflierFollowupConfig.Entities
            };

            InitSFU();
        }

        function InitSFU() {
            SFUCtrl.ePage.Masters.taskName = "ConsignorFollowUp";
            SFUCtrl.ePage.Masters.dataentryName = "ConsignorFollowUp";
            SFUCtrl.ePage.Masters.config = SFUCtrl.ePage.Entities;
            SFUCtrl.ePage.Entities.Header.Data = {};
            SFUCtrl.ePage.Masters.SFUData = [];
            SFUCtrl.ePage.Masters.TabList = [];
            SFUCtrl.ePage.Masters.activeTabIndex = 0;
            SFUCtrl.ePage.Masters.IsTabClick = false;
            SFUCtrl.ePage.Masters.IsNewSFUClicked = false;
            SFUCtrl.ePage.Masters.AddTab = AddTab;
            SFUCtrl.ePage.Masters.RemoveTab = RemoveTab;
            SFUCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            SFUCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            SFUCtrl.ePage.Masters.CreateSFU = CreateSFU;
        }
        
        function CreateSFU() {
            SFUCtrl.ePage.Masters.IsNewSFUClicked = true;
            helperService.getFullObjectUsingGetById(SFUCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.UIOrderFollowUpHeader,
                        data: response.data.Response
                    };

                    SFUCtrl.ePage.Masters.AddTab(_obj, true);
                    SFUCtrl.ePage.Masters.IsNewSFUClicked = false;
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function AddTab(currentSFU, IsNew) {
            SFUCtrl.ePage.Masters.currentSFU = undefined;
            var _isExist = SFUCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === currentSFU.entity.FollowUpId;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SFUCtrl.ePage.Masters.IsTabClick = true;
                var _currentSFU = undefined;
                if (!IsNew) {
                    _currentSFU = currentSFU.entity;
                } else {
                    _currentSFU = currentSFU;
                }

                sufflierFollowupConfig.GetTabDetails(_currentSFU, IsNew).then(function (response) {
                    SFUCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        SFUCtrl.ePage.Masters.activeTabIndex = SFUCtrl.ePage.Masters.TabList.length;
                        SFUCtrl.ePage.Masters.CurrentActiveTab(currentSFU.entity.FollowUpId);
                        SFUCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("FollowUpId Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentSFU) {
            event.preventDefault();
            event.stopPropagation();
            var _currentSFU = currentSFU[currentSFU.label].ePage.Entities;
            // Close Current Shipment
            if (!currentSFU.isNew) {
                apiService.get("eAxisAPI", SFUCtrl.ePage.Entities.Header.API.FollowUpActivityClose.Url + _currentSFU.Header.Data.UIOrderFollowUpHeader.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        SFUCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                }); 
            } else {
                SFUCtrl.ePage.Masters.TabList.splice(index, 1);
            }            
        }

        function CurrentActiveTab(currentTab) {          
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            SFUCtrl.ePage.Masters.currentSFU = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                SFUCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        Init();
    }
})();
