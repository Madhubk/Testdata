(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeContainerController", ThreeContainerController);

        ThreeContainerController.$inject = ["$timeout", "$q", "apiService", "helperService", "threeContainerConfig", "toastr"];

    function ThreeContainerController($timeout, $q, apiService, helperService, threeContainerConfig, toastr) {
        var ThreeContainerCtrl = this;

        function Init() {
            ThreeContainerCtrl.ePage = {
                "Title": "",
                "Prefix": "Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": threeContainerConfig.Entities
            };
            // For list directive
            ThreeContainerCtrl.ePage.Masters.taskName = "ContainerList";
            ThreeContainerCtrl.ePage.Masters.dataentryName = "ContainerList";
            ThreeContainerCtrl.ePage.Masters.config = ThreeContainerCtrl.ePage.Entities;
            // Remove all Tabs while load shipment
            threeContainerConfig.TabList = [];
           

            ThreeContainerCtrl.ePage.Entities.Header.Data = {};
            ThreeContainerCtrl.ePage.Masters.TabList = [];
            ThreeContainerCtrl.ePage.Masters.activeTabIndex = 0;
            ThreeContainerCtrl.ePage.Masters.IsTabClick = false;
            ThreeContainerCtrl.ePage.Masters.SaveButtonText = "Save";
            // functions
            ThreeContainerCtrl.ePage.Masters.Save = Save;
            ThreeContainerCtrl.ePage.Masters.AddTab = AddTab;
            ThreeContainerCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ThreeContainerCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ThreeContainerCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function AddTab(CurrentContainer, IsNew) {
            ThreeContainerCtrl.ePage.Masters.CurrentContainer = undefined;
            var _isExist = ThreeContainerCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === CurrentContainer.entity.ContainerNo;
                } else {
                    return false;
                }
            });
            if (!_isExist) {
                ThreeContainerCtrl.ePage.Masters.IsTabClick = true;
                var _CurrentContainer = undefined;
                if (!IsNew) {
                    _CurrentContainer = CurrentContainer.entity;
                } else {
                    _CurrentContainer = CurrentContainer;
                }
                threeContainerConfig.GetTabDetails(_CurrentContainer, IsNew).then(function (response) {
                    ThreeContainerCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ThreeContainerCtrl.ePage.Masters.activeTabIndex = ThreeContainerCtrl.ePage.Masters.TabList.length;
                        ThreeContainerCtrl.ePage.Masters.CurrentActiveTab(CurrentContainer.entity.ContainerNo);
                        ThreeContainerCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("Container Already Opened...!");
            }
        }

        function RemoveTab(event, index, CurrentContainer) {
            event.preventDefault();
            event.stopPropagation();
            var _currentContainer = CurrentContainer[CurrentContainer.label].ePage.Entities;
            // Close Current Container
            apiService.get("eAxisAPI", ThreeContainerCtrl.ePage.Entities.Header.API.ContainerActivityClose.Url + _currentContainer.Header.Data.PK).then(function (response) {
                if (response.data.Status === "Success") {
                    ThreeContainerCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            ThreeContainerCtrl.ePage.Masters.CurrentContainer = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ThreeContainerCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function Save($item) {
            ThreeContainerCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ThreeContainerCtrl.ePage.Masters.IsDisableSave = true;
            SaveEntity($item, 'Container').then(function (response) {
                if (response.Status === "success") {
                    var _index = ThreeContainerCtrl.ePage.Masters.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf($item.label);

                    if (_index !== -1) {
                        threeContainerConfig.TabList[_index][threeContainerConfig.TabList[_index].label].ePage.Entities.Header.Data.UICntContainer = response.Data;
                        threeContainerConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
                ThreeContainerCtrl.ePage.Masters.SaveButtonText = "Save";
                ThreeContainerCtrl.ePage.Masters.IsDisableSave = false;
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
            _input.IsModified = true;

            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                var _response = {
                    Data: response.data.Response
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

        Init();
    }
})();
