(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoadItemsController", LoadItemsController);

    LoadItemsController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "distributionConfig", "$filter"];

    function LoadItemsController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, dmsManifestConfig, helperService, $window, $uibModal, toastr, distributionConfig, $filter) {

        var LoadItemsCtrl = this;

        function Init() {

            var currentManifest = LoadItemsCtrl.currentManifest[LoadItemsCtrl.currentManifest.label].ePage.Entities;

            LoadItemsCtrl.ePage = {
                "Title": "",
                "Prefix": "Load_Items",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            LoadItemsCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(LoadItemsCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: LoadItemsCtrl.jobfk })

            if (LoadItemsCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                LoadItemsCtrl.ePage.Masters.MenuList = LoadItemsCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                LoadItemsCtrl.ePage.Masters.MenuList = LoadItemsCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            var res = LoadItemsCtrl.ePage.Masters.MenuList[LoadItemsCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");

            if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                LoadItemsCtrl.ePage.Masters.IsPickup = true;
            }
            else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                LoadItemsCtrl.ePage.Masters.IsDelivery = true;
            }

            LoadItemsCtrl.ePage.Masters.Empty = "-";
            LoadItemsCtrl.ePage.Masters.Config = dmsManifestConfig;

            LoadItemsCtrl.ePage.Masters.setManifestSelectedRow = setManifestSelectedRow;

            LoadItemsCtrl.ePage.Masters.LoadManifest = LoadManifest;
            LoadItemsCtrl.ePage.Masters.CloseLoadManifestModel = CloseLoadManifestModel
            LoadItemsCtrl.ePage.Masters.SaveLoadManifest = SaveLoadManifest;
            LoadItemsCtrl.ePage.Masters.setLoadedManifestSelectedRow = setLoadedManifestSelectedRow;
            LoadItemsCtrl.ePage.Masters.AddToLineManifest = AddToLineManifest;

            LoadItemsCtrl.ePage.Masters.SaveLoad = SaveLoad;
            LoadItemsCtrl.ePage.Masters.CloseLoadModel = CloseLoadModel;
            LoadItemsCtrl.ePage.Masters.setLoadedItemSelectedRow = setLoadedItemSelectedRow;
            LoadItemsCtrl.ePage.Masters.AddToLine = AddToLine;

            LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Save";
            LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = false;

            LoadItemsCtrl.ePage.Masters.selectedManifestRow = -1;

            // DatePicker
            LoadItemsCtrl.ePage.Masters.DatePicker = {};
            LoadItemsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            LoadItemsCtrl.ePage.Masters.DatePicker.isOpen = [];
            LoadItemsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

        }

        function setManifestSelectedRow(index) {
            LoadItemsCtrl.ePage.Masters.selectedManifestRow = index;
        }

        function AddToLineManifest() {
            LoadItemsCtrl.ePage.Masters.SelectedManifestItem.LoadedDateTime = new Date();
            if (!LoadItemsCtrl.ePage.Masters.SelectedManifestItem.Quantity)
                LoadItemsCtrl.ePage.Masters.SelectedManifestItem.Quantity = 1;
            else
                LoadItemsCtrl.ePage.Masters.SelectedManifestItem.Quantity = LoadItemsCtrl.ePage.Masters.SelectedManifestItem.Quantity;
        }

        function setLoadedManifestSelectedRow(index, item) {
            LoadItemsCtrl.ePage.Masters.selectedLoadedManifestRow = index;
            LoadItemsCtrl.ePage.Masters.SelectedManifestItem = item;
        }

        function SaveLoadManifest() {
            var _count = 0, _count1 = 0;
            LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Please Wait..";
            LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = true;
            angular.forEach(LoadItemsCtrl.ePage.Masters.ConsignManifestItemDetails, function (value, key) {
                if (value.LoadedDateTime) {
                    _count = _count + 1;
                    value.IsModified = true;
                    apiService.post("eAxisAPI", distributionConfig.Entities.TmsManifestItem.API.Update.Url, value).then(function (response) {
                        if (response.data.Response) {
                            console.log("updated");
                            _count1 = _count1 + 1;
                            if (_count == _count1) {
                                LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                                LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                toastr.success("Saved Successfully");
                            }
                        }
                    });
                }
            });
            if (_count == 0) {
                LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = false;
            }
        }

        function LoadManifest() {
            LoadItemsCtrl.ePage.Masters.IsLoading = true;
            if (LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestConsignment[LoadItemsCtrl.ePage.Masters.selectedManifestRow].TMC_ServiceType == "ORD") {
                var _filter = {
                    "WorkOrderID": LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestConsignment[LoadItemsCtrl.ePage.Masters.selectedManifestRow].TMC_ConsignmentNumber
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": distributionConfig.Entities.WmsPickReleaseLine.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", distributionConfig.Entities.WmsPickReleaseLine.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response.Response) {
                        LoadItemsCtrl.ePage.Masters.PickReleaseLineDetails = response.data.Response.Response;
                        LoadItemsCtrl.ePage.Masters.IsLoading = false;
                        OpenLoadModal().result.then(function (response) { }, function () { });
                    }
                });
            } else {
                var _filter = {
                    "TMC_FK": LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestConsignment[LoadItemsCtrl.ePage.Masters.selectedManifestRow].TMC_FK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": distributionConfig.Entities.TmsManifestItem.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", distributionConfig.Entities.TmsManifestItem.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        LoadItemsCtrl.ePage.Masters.ConsignManifestItemDetails = response.data.Response;
                        OpenManifestItemModel().result.then(function (response) { }, function () { });
                        LoadItemsCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function OpenManifestItemModel() {
            return LoadItemsCtrl.ePage.Masters.modalInstance1 = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/manifest-list/load-items/load-manifest-item.html"
            });
        }

        function CloseLoadManifestModel() {
            LoadItemsCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
        }

        function OpenLoadModal() {
            return LoadItemsCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/manifest-list/load-items/load-pickandrelease-item.html",
            });
        }

        function CloseLoadModel() {
            LoadItemsCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function AddToLine() {
            if (LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.WPL_FK) {
                LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.WPL_LoadedQty = LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.Units;
                LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.WPL_LoadStartDateTime = new Date();

                var _TempPack = 0, _TempLoadedQty = 0;
                angular.forEach(LoadItemsCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                    _TempPack = _TempPack + value.Units;
                    _TempLoadedQty = _TempLoadedQty + value.WPL_LoadedQty;
                });
                if (_TempPack == _TempLoadedQty) {
                    angular.forEach(LoadItemsCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                        value.WPL_LoadEndDateTime = new Date();
                    });
                }
            }
            if (LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.WRL_FK) {
                LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.WRL_LoadedQty = LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.Units;
                LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine.WRL_LoadStartDateTime = new Date();

                var _TempPack = 0, _TempLoadedQty = 0;
                angular.forEach(LoadItemsCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                    _TempPack = _TempPack + value.Units;
                    _TempLoadedQty = _TempLoadedQty + value.WRL_LoadedQty;
                });
                if (_TempPack == _TempLoadedQty) {
                    angular.forEach(LoadItemsCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                        value.WRL_LoadEndDateTime = new Date();
                    });
                }
            }
            LoadItemsCtrl.ePage.Masters.selectedLoadedItemRow = -1;
        }

        function setLoadedItemSelectedRow(index, item) {
            LoadItemsCtrl.ePage.Masters.selectedLoadedItemRow = index;
            LoadItemsCtrl.ePage.Masters.SelectedPickReleaseLine = item;
        }

        function SaveLoad() {
            var _count = 0, _count1 = 0;
            LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Please Wait..";
            LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = true;
            angular.forEach(LoadItemsCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                if (value.WPL_LoadedQty) {
                    _count = _count + 1;
                    apiService.post("eAxisAPI", distributionConfig.Entities.WmsPickReleaseLine.API.UpdateSelectedColumns.Url, value).then(function (response) {
                        if (response.data.Response) {
                            console.log("updated");
                            _count1 = _count1 + 1;
                            if (_count == _count1) {
                                LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                                LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                toastr.success("Saved Successfully");
                            }
                        }
                    });
                }
            });
            if (_count == 0) {
                LoadItemsCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                LoadItemsCtrl.ePage.Masters.IsDisableSaveBtn = false;
            }
        }

        $scope.filter1 = function (x) {
            if (!x.WPL_LoadStartDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter2 = function (x) {
            if (x.WPL_LoadStartDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter3 = function (x) {
            if (!x.LoadedDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter4 = function (x) {
            if (x.LoadedDateTime) {
                return true;
            } else {
                return;
            }
        };

        function UpdateLoadedDateTime(item) {
            angular.forEach(LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.TIT_ItemCode == item) {
                    value.LoadedDateTime = new Date();
                    if (!value.Quantity)
                        value.Quantity = 1;
                    else
                        value.Quantity = value.Quantity;
                    //LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem = moveElementInArray(LoadItemsCtrl.ePage.Entities.Header.Data.TmsManifestItem, value, -key);
                }
            });
        }

        function moveElementInArray(array, value, positionChange) {
            var oldIndex = array.indexOf(value);
            if (oldIndex > -1) {
                var newIndex = (oldIndex + positionChange);

                if (newIndex < 0) {
                    newIndex = 0
                } else if (newIndex >= array.length) {
                    newIndex = array.length
                }

                var arrayClone = array.slice();
                arrayClone.splice(oldIndex, 1);
                arrayClone.splice(newIndex, 0, value);

                return arrayClone
            }
            return array
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            LoadItemsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        Init();
    }

})();