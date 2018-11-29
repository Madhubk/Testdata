(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardController", InwardController);

    InwardController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "inwardConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function InwardController($location, APP_CONSTANT, authService, apiService, helperService, inwardConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var InwardCtrl = this,
            location = $location;

        function Init() {
            InwardCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inwardConfig.Entities
            };
            
            var obj = location.search();
            if (obj.a != undefined) {
                var dobj = JSON.parse(helperService.decryptData(obj.a));
                getInwardDetails(dobj);
            }

            InwardCtrl.ePage.Masters.dataentryName = "WarehouseInward";
            InwardCtrl.ePage.Masters.taskName = "WarehouseInward";
            InwardCtrl.ePage.Masters.TabList = [];
            inwardConfig.TabList = [];
            InwardCtrl.ePage.Masters.activeTabIndex = 0;
            InwardCtrl.ePage.Masters.isNewClicked = false;
            InwardCtrl.ePage.Masters.IsTabClick = false;
            InwardCtrl.ePage.Masters.Config = inwardConfig;

            inwardConfig.ValidationFindall();



            //functions
            InwardCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            InwardCtrl.ePage.Masters.AddTab = AddTab;
            InwardCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            InwardCtrl.ePage.Masters.RemoveTab = RemoveTab;
            InwardCtrl.ePage.Masters.CreateNewInward = CreateNewInward;
            InwardCtrl.ePage.Masters.SaveandClose = SaveandClose;

            //Left Menu
            GetNewInward();
        }

        function getInwardDetails(obj) {
            var _filter = {
                "PK": obj.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardCtrl.ePage.Entities.Header.API.FindAllInward.FilterID
            };

            apiService.post("eAxisAPI",InwardCtrl.ePage.Entities.Header.API.FindAllInward.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardCtrl.ePage.Masters.InwardDetails = {
                        "entity": response.data.Response[0]
                    }
                    AddTab(InwardCtrl.ePage.Masters.InwardDetails, false);
                }
            });
        }
        function GetNewInward() {
            if (InwardCtrl.ePage.Entities.Header.Message == true) {
                CreateNewInward();
            }
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                InwardCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewInward();
            }
        }

        function AddTab(currentInward, isNew) {
            InwardCtrl.ePage.Masters.currentInward = undefined;

            var _isExist = InwardCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentInward.entity.WorkOrderID)
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
                InwardCtrl.ePage.Masters.IsTabClick = true;
                var _currentInward = undefined;
                if (!isNew) {
                    _currentInward = currentInward.entity;
                } else {
                    _currentInward = currentInward;
                }

                inwardConfig.GetTabDetails(_currentInward, isNew).then(function (response) {
                    InwardCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        InwardCtrl.ePage.Masters.activeTabIndex = InwardCtrl.ePage.Masters.TabList.length;
                        InwardCtrl.ePage.Masters.CurrentActiveTab(currentInward.entity.WorkOrderID);
                        InwardCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Inward already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            InwardCtrl.ePage.Masters.currentInward = currentTab;
        }


        function RemoveTab(event, index, currentInward) {
            event.preventDefault();
            event.stopPropagation();
            var currentInward = currentInward[currentInward.label].ePage.Entities;
            InwardCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", InwardCtrl.ePage.Entities.Header.API.SessionClose.Url + currentInward.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewInward() {
            var _isExist = InwardCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                InwardCtrl.ePage.Entities.Header.Message = false;
                InwardCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(InwardCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsInwardHeader,
                            data: response.data.Response.Response,
                            Validations: response.data.Response.Validations
                        };
                        InwardCtrl.ePage.Masters.AddTab(_obj, true);
                        InwardCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Inward response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }

       

        function SaveandClose(index, currentInward){
            var currentInward = currentInward[currentInward.label].ePage.Entities;
            InwardCtrl.ePage.Masters.TabList.splice(index-1, 1);
            InwardCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", InwardCtrl.ePage.Entities.Header.API.SessionClose.Url + currentInward.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            InwardCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }

})();
