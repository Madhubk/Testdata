(function () {
    "use strict";

    angular
        .module("Application")
        .controller("preAdviceController", PreAdviceControllers);

    PreAdviceControllers.$inject = ["$timeout", "$location", "apiService", "appConfig", "helperService", "preAdviceConfig", "toastr"];

    function PreAdviceControllers($timeout, $location, apiService, appConfig, helperService, preAdviceConfig, toastr) {
        var PreAdviceCtrl = this;

        function Init() {
            PreAdviceCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": preAdviceConfig.Entities
            };

            InitPreAdvice();
        }

        function InitPreAdvice() {
            PreAdviceCtrl.ePage.Masters.taskName = "PreAdvice";
            PreAdviceCtrl.ePage.Masters.dataentryName = "PreAdvice";
            PreAdviceCtrl.ePage.Masters.config = PreAdviceCtrl.ePage.Entities;
            PreAdviceCtrl.ePage.Entities.Header.Data = {};
            PreAdviceCtrl.ePage.Masters.preadviceData = [];
            PreAdviceCtrl.ePage.Masters.TabList = [];
            PreAdviceCtrl.ePage.Masters.activeTabIndex = 0;
            PreAdviceCtrl.ePage.Masters.IsTabClick = false;
            PreAdviceCtrl.ePage.Masters.IsNewpreadviceClicked = false;
            PreAdviceCtrl.ePage.Masters.NotShowing = false;
            PreAdviceCtrl.ePage.Masters.Reload = Reload;
            PreAdviceCtrl.ePage.Masters.AddTab = AddTab;
            PreAdviceCtrl.ePage.Masters.RemoveTab = RemoveTab;
            PreAdviceCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            PreAdviceCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            PreAdviceCtrl.ePage.Masters.Createpreadvice = Createpreadvice;
            PreAdviceCtrl.ePage.Masters.filter = {};
            PreAdviceCtrl.ePage.Masters.Back = Back;
            PreAdviceCtrl.ePage.Masters.ShowBackView = true;

            InitPreAdviceOrder();
        }

        function InitPreAdviceOrder() {
            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    PreAdviceCtrl.ePage.Masters.ShowBackView = true;
                    PreAdviceCtrl.ePage.Masters.NotShowing = true;
                    PreAdviceCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    if (PreAdviceCtrl.ePage.Masters.Entity.IsCreated === "Convert To Booking") {
                        PreAdviceCtrl.ePage.Masters.ButtonValue = PreAdviceCtrl.ePage.Masters.Entity.IsCreated;
                        PreAdviceCtrl.ePage.Masters.filter = PreAdviceCtrl.ePage.Masters.Entity;
                    }
                    if (PreAdviceCtrl.ePage.Masters.Entity.IsCreated === "Vessel Planning") {
                        PreAdviceCtrl.ePage.Masters.filter = PreAdviceCtrl.ePage.Masters.Entity;
                        PreAdviceCtrl.ePage.Masters.ButtonValue = PreAdviceCtrl.ePage.Masters.Entity.IsCreated;
                        PreAdviceCtrl.ePage.Masters.IsNewOrderClicked = true;
                    }
                }
            }
        }

        function Back() {
            $location.url('/EA/PO/order-dashboard');
        }

        function Reload() {
            PreAdviceCtrl.ePage.Masters.NotShowing = false;
        }

        function Createpreadvice() {
            PreAdviceCtrl.ePage.Masters.IsNewpreadviceClicked = true;
            helperService.getFullObjectUsingGetById(PreAdviceCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.UIPreAdviceHeader,
                        data: response.data.Response
                    };

                    PreAdviceCtrl.ePage.Masters.AddTab(_obj, true);
                    PreAdviceCtrl.ePage.Masters.IsNewpreadviceClicked = false;
                } else {
                    console.log("Empty New PreAdvice response");
                }
            });
        }

        function AddTab(currentpreadvice, IsNew) {
            PreAdviceCtrl.ePage.Masters.currentpreadvice = undefined;

            var _isExist = PreAdviceCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === currentpreadvice.entity.PreAdviceId;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                PreAdviceCtrl.ePage.Masters.IsTabClick = true;
                var _currentpreadvice = undefined;
                if (!IsNew) {
                    _currentpreadvice = currentpreadvice.entity;
                } else {
                    _currentpreadvice = currentpreadvice;
                }

                preAdviceConfig.GetTabDetails(_currentpreadvice, IsNew).then(function (response) {
                    PreAdviceCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        PreAdviceCtrl.ePage.Masters.activeTabIndex = PreAdviceCtrl.ePage.Masters.TabList.length;
                        PreAdviceCtrl.ePage.Masters.CurrentActiveTab(currentpreadvice.entity.PreAdviceId);
                        PreAdviceCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("preadvice Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentpreadvice) {
            event.preventDefault();
            event.stopPropagation();
            var _currentpreadvice = currentpreadvice[currentpreadvice.label].ePage.Entities;

            // Close Current Shipment
            if (!currentpreadvice.isNew) {
                apiService.get("eAxisAPI", PreAdviceCtrl.ePage.Entities.Header.API.PreAdviceActivityClose.Url + _currentpreadvice.Header.Data.UIPreAdviceHeader.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        // PreAdviceCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                PreAdviceCtrl.ePage.Masters.TabList.splice(index, 1);
            }
            PreAdviceCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            PreAdviceCtrl.ePage.Masters.currentpreadvice = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                PreAdviceCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        Init();
    }
})();