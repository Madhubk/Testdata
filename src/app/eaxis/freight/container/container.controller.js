(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerController", ContainerController);

        ContainerController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "ContainerConfig", "toastr"];

    function ContainerController($rootScope, $scope, state, $timeout, $location, $q, APP_CONSTANT, authService, apiService, appConfig, helperService, ContainerConfig, toastr) {
        var ContainerCtrl = this;

        function Init() {

            ContainerCtrl.ePage = {
                "Title": "",
                "Prefix": "Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ContainerConfig.Entities
            };


            // For list directive
            ContainerCtrl.ePage.Masters.taskName = "ContainerList";
            ContainerCtrl.ePage.Masters.dataentryName = "ContainerList";
            ContainerCtrl.ePage.Masters.config = ContainerCtrl.ePage.Entities;

            ContainerCtrl.ePage.Entities.Header.Data = {};

            ContainerCtrl.ePage.Masters.TabList = [];
            ContainerCtrl.ePage.Masters.activeTabIndex = 0;
            ContainerCtrl.ePage.Masters.IsTabClick = false;
            ContainerCtrl.ePage.Masters.SaveButtonText = "Save";
            ContainerCtrl.ePage.Masters.Save = Save

            ContainerCtrl.ePage.Masters.AddTab = AddTab;
            ContainerCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ContainerCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;

            ContainerCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CheckUserBasedMenuVisibleType();
        }


        function AddTab(CurrentContainer, IsNew) {
            ContainerCtrl.ePage.Masters.CurrentContainer = undefined;

            var _isExist = ContainerCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === CurrentContainer.entity.ContainerNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                ContainerCtrl.ePage.Masters.IsTabClick = true;
                var _CurrentContainer = undefined;
                if (!IsNew) {
                    _CurrentContainer = CurrentContainer.entity;
                } else {
                    _CurrentContainer = CurrentContainer;

                }

                ContainerConfig.GetTabDetails(_CurrentContainer, IsNew).then(function (response) {

                    ContainerCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ContainerCtrl.ePage.Masters.activeTabIndex = ContainerCtrl.ePage.Masters.TabList.length;
                        ContainerCtrl.ePage.Masters.CurrentActiveTab(CurrentContainer.entity.ContainerNo);
                        ContainerCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("Container Already Opened...!");

            }
        }

        function RemoveTab(event, index, CurrentContainer) {
            event.preventDefault();
            event.stopPropagation();
            var _CurrentContainer = CurrentContainer[CurrentContainer.label].ePage.Entities;

            // Close Current Container
            // apiService.get("eAxisAPI", ContainerCtrl.ePage.Entities.Header.API.CntContainerActivityClose.Url + _CurrentContainer.Header.Data.UICntContainer.PK).then(function (response) {
            //     if (response.data.Response === "Success") {

            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });

            ContainerCtrl.ePage.Masters.TabList.splice(index, 1);
        }


        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            ContainerCtrl.ePage.Masters.CurrentContainer = currentTab;
        }


        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                ContainerCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        ContainerCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Save($item) {
            ContainerCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ContainerCtrl.ePage.Masters.IsDisableSave = true;

            SaveEntity($item, 'Container').then(function (response) {
                if (response.Status === "success") {
                    var _index = ContainerCtrl.ePage.Masters.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf($item.label);

                    if (_index !== -1) {
                        ContainerConfig.TabList[_index][ContainerConfig.TabList[_index].label].ePage.Entities.Header.Data.UICntContainer = response.Data;
                        ContainerConfig.TabList[_index].isNew = false;
                        appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                ContainerCtrl.ePage.Masters.SaveButtonText = "Save";
                ContainerCtrl.ePage.Masters.IsDisableSave = false;
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
            _input.UICntContainer.IsModified = true;

            apiService.post("eAxisAPI", _api, _input.UICntContainer).then(function (response) {

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
