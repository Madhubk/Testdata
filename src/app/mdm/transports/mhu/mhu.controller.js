(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MhuController", MhuController);

    MhuController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "mhuConfig", "$timeout", "toastr", "appConfig"];

    function MhuController($location, APP_CONSTANT, authService, apiService, helperService, mhuConfig, $timeout, toastr, appConfig) {

        var MhuCtrl = this;

        function Init() {

            MhuCtrl.ePage = {
                "Title": "",
                "Prefix": "MHU",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mhuConfig.Entities
            };

            MhuCtrl.ePage.Masters.taskName = "Mhu";
            MhuCtrl.ePage.Masters.dataentryName = "Mhu";
            MhuCtrl.ePage.Masters.TabList = [];
            MhuCtrl.ePage.Masters.activeTabIndex = 0;
            MhuCtrl.ePage.Masters.isNewMhuClicked = false;
            MhuCtrl.ePage.Masters.IsTabClick = false;

            //functions
            MhuCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            MhuCtrl.ePage.Masters.AddTab = AddTab;
            MhuCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            MhuCtrl.ePage.Masters.RemoveTab = RemoveTab;
            MhuCtrl.ePage.Masters.CreateNewMhu = CreateNewMhu;
            MhuCtrl.ePage.Masters.Config = mhuConfig;
            MhuCtrl.ePage.Masters.SaveandClose = SaveandClose;

            mhuConfig.ValidationFindall();
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                MhuCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewMhu();
            }
        }

        function AddTab(currentMhu, isNew) {
            MhuCtrl.ePage.Masters.currentMhu = undefined;

            var _isExist = MhuCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentMhu.entity.PartNum;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                MhuCtrl.ePage.Masters.IsTabClick = true;
                var _currentMhu = undefined;
                if (!isNew) {
                    _currentMhu = currentMhu.entity;
                } else {
                    _currentMhu = currentMhu;
                }

                mhuConfig.GetTabDetails(_currentMhu, isNew).then(function (response) {
                    MhuCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        MhuCtrl.ePage.Masters.activeTabIndex = MhuCtrl.ePage.Masters.TabList.length;
                        MhuCtrl.ePage.Masters.CurrentActiveTab(currentMhu.entity.PartNum);
                        MhuCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('MHU already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            MhuCtrl.ePage.Masters.currentMhu = currentTab;
        }

        function RemoveTab(event, index, currentMhu) {
            event.preventDefault();
            event.stopPropagation();
            var currentMhu = currentMhu[currentMhu.label].ePage.Entities;
            MhuCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", MhuCtrl.ePage.Entities.Header.API.SessionClose.Url + currentMhu.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewMhu() {
            MhuCtrl.ePage.Masters.isNewMhuClicked = true;

            helperService.getFullObjectUsingGetById(MhuCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIProductGeneral,
                        data: response.data.Response.Response,
                        Validations:response.data.Response.Validations
                    };
                    MhuCtrl.ePage.Masters.AddTab(_obj, true);
                    MhuCtrl.ePage.Masters.isNewMhuClicked = false;
                } else {
                    console.log("Empty New MHU response");
                }
            });
        }


        function SaveandClose( index, currentMhu){

            var currentMhu = currentMhu[currentMhu.label].ePage.Entities;
            MhuCtrl.ePage.Masters.TabList.splice(index-1, 1);
            MhuCtrl.ePage.Masters.Config.SaveAndClose = false;
            
            apiService.get("eAxisAPI", MhuCtrl.ePage.Entities.Header.API.SessionClose.Url + currentMhu.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            MhuCtrl.ePage.Masters.activeTabIndex = 0;

        }
        Init();
    }
})();

