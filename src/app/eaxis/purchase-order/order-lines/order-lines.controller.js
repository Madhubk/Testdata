(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderLinesController", OrderLinesController);

    OrderLinesController.$inject = ["$timeout", "$q", "authService", "apiService", "appConfig", "helperService", "orderLinesConfig", "toastr"];

    function OrderLinesController($timeout, $q, authService, apiService, appConfig, helperService, orderLinesConfig, toastr) {
        var OrderLinesCtrl = this;

        function Init() {
            OrderLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Lines",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderLinesConfig.Entities
            };

            InitOrderLine();
        }

        function InitOrderLine() {
            OrderLinesCtrl.ePage.Masters.taskName = "PorOrderLine";
            OrderLinesCtrl.ePage.Masters.dataentryName = "PorOrderLine";
            OrderLinesCtrl.ePage.Masters.config = OrderLinesCtrl.ePage.Entities;
            OrderLinesCtrl.ePage.Entities.Header.Data = {};
            OrderLinesCtrl.ePage.Masters.TabList = [];
            OrderLinesCtrl.ePage.Masters.activeTabIndex = 0;
            OrderLinesCtrl.ePage.Masters.IsTabClick = false;
            orderLinesConfig.TabList = [];
            OrderLinesCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderLinesCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
            OrderLinesCtrl.ePage.Masters.Save = Save;
            OrderLinesCtrl.ePage.Masters.SaveClose = SaveClose;
            OrderLinesCtrl.ePage.Masters.Cancel = Cancel;
            OrderLinesCtrl.ePage.Masters.AddTab = AddTab;
            OrderLinesCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OrderLinesCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OrderLinesCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function AddTab(CurrentOrdLine, IsNew) {
            OrderLinesCtrl.ePage.Masters.CurrentOrdLine = undefined;

            var _isExist = OrderLinesCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === CurrentOrdLine.entity.OrderNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                OrderLinesCtrl.ePage.Masters.IsTabClick = true;
                var _CurrentOrdLine = undefined;
                if (!IsNew) {
                    _CurrentOrdLine = CurrentOrdLine.entity;
                } else {
                    _CurrentOrdLine = CurrentOrdLine;

                }

                orderLinesConfig.GetTabDetails(_CurrentOrdLine, IsNew).then(function (response) {

                    OrderLinesCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        OrderLinesCtrl.ePage.Masters.activeTabIndex = OrderLinesCtrl.ePage.Masters.TabList.length;
                        OrderLinesCtrl.ePage.Masters.CurrentActiveTab(CurrentOrdLine.entity.OrderNo);
                        OrderLinesCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("OrderLines Already Opened...!");
            }
        }

        function RemoveTab(event, index, CurrentOrdLine) {
            event.preventDefault();
            event.stopPropagation();
            var _CurrentOrdLine = CurrentOrdLine[CurrentOrdLine.label].ePage.Entities;

            // Close Current OrderLine
            apiService.get("eAxisAPI", OrderLinesCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _CurrentOrdLine.Header.Data.UIPorOrderLines.PK).then(function (response) {
                if (response.data.Response === "Success") {

                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            OrderLinesCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            OrderLinesCtrl.ePage.Masters.CurrentOrdLine = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrderLinesCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function Save($item) {
            OrderLinesCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrderLinesCtrl.ePage.Masters.IsDisableSave = true;

            SaveEntity($item, 'Lines').then(function (response) {
                if (response.Status === "success") {
                    var _index = OrderLinesCtrl.ePage.Masters.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf($item.label);

                    if (_index !== -1) {
                        orderLinesConfig.TabList[_index][orderLinesConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderLines = response.Data;
                        orderLinesConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                OrderLinesCtrl.ePage.Masters.SaveButtonText = "Save";
                OrderLinesCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function SaveClose($event, $index, $item) {
            OrderLinesCtrl.ePage.Masters.SaveCloseButtonText = "Please Wait...";
            OrderLinesCtrl.ePage.Masters.IsDisableSaveClose = true;

            SaveEntity($item, 'Lines').then(function (response) {
                if (response.Status === "success") {
                    var _index = OrderLinesCtrl.ePage.Masters.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf($item.label);

                    if (_index !== -1) {
                        orderLinesConfig.TabList[_index][orderLinesConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderLines = response.Data;
                        orderLinesConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                        RemoveTab($event, $index, $item);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
                OrderLinesCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                OrderLinesCtrl.ePage.Masters.IsDisableSaveClose = false;
            });
        }

        function SaveEntity(entity, module) {
            var deferred = $q.defer();
            var _Data = entity[entity.label].ePage.Entities;
            var _input = _Data.Header.Data,
                _api;

            if (entity.isNew) {
                _api = _Data.Header.API["Insert" + module].Url;
            } else {
                _api = _Data.Header.API["Update" + module].Url;
            }
            _input.UIPorOrderLines.IsModified = true;

            apiService.post("eAxisAPI", _api, [_input.UIPorOrderLines]).then(function (response) {
                var _response = {
                    Data: response.data.Response[0]
                };

                if (response.data.Response) {
                    if (response.data.Response === "Version Conflict : Please take the Latest Version!") {
                        deferred.resolve("failed");
                        toastr.error(response.data.Response);
                    } else {
                        if (response.data.Status === "Success") {
                            _response.Status = "success";
                            deferred.resolve(_response);
                            toastr.success("Saved Successfully...!");
                        } else {
                            _response.Status = "failed";
                            deferred.resolve(_response);
                            toastr.error("Could not Save...!");
                        }
                    }
                } else {
                    toastr.error("Could not Save...!");
                    _response.Status = "failed";
                    deferred.resolve(_response);
                }
            }, function (response) {
                console.log("Error : " + response);
                deferred.reject("failed");
            });

            return deferred.promise;
        }

        function Cancel($event, $index, $item) {
            RemoveTab($event, $index, $item);
        }

        Init();
    }
})();