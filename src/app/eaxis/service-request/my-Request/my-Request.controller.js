(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MyRequestController", MyRequestController);

    MyRequestController.$inject = ["helperService", "myRequestConfig", "$timeout", "toastr", "authService"];

    function MyRequestController(helperService, myRequestConfig, $timeout, toastr, authService) {

        var MyRequestCtrl = this;

        function Init() {
            
            //var currentMyRequest = MyRequestCtrl.currentMyRequest[MyRequestCtrl.currentMyRequest.label].ePage.Entities;
            
            MyRequestCtrl.ePage = {
                "Title": "",
                "Prefix": "MyRequest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": myRequestConfig.Entities
            };

            MyRequestCtrl.ePage.Masters.dataentryName = "ServiceRequest";
            MyRequestCtrl.ePage.Masters.taskName = "ServiceRequest";
            MyRequestCtrl.ePage.Masters.TabList = [];
            myRequestConfig.TabList = [];
            MyRequestCtrl.ePage.Masters.activeTabIndex = 0;
            MyRequestCtrl.ePage.Masters.isNewClicked = false;
            MyRequestCtrl.ePage.Masters.IsTabClick = false;
            MyRequestCtrl.ePage.Masters.DefaultFilter = {
                "CreatedBy" : authService.getUserInfo().UserId
            }

            //functions
            MyRequestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            MyRequestCtrl.ePage.Masters.AddTab = AddTab;
            MyRequestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            MyRequestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            MyRequestCtrl.ePage.Masters.CreateNewMyRequest = CreateNewMyRequest;
            MyRequestCtrl.ePage.Masters.Config = myRequestConfig;


        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                MyRequestCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewMyRequest();
            }
        }

        function AddTab(currentMyRequest, isNew) {
            MyRequestCtrl.ePage.Masters.currentMyRequest = undefined;

            var _isExist = MyRequestCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentMyRequest.entity.RequestNo)
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
                MyRequestCtrl.ePage.Masters.IsTabClick = true;
                var _currentMyRequest = undefined;
                if (!isNew) {
                    _currentMyRequest = currentMyRequest.entity;
                } else {
                    _currentMyRequest = currentMyRequest;
                }

                myRequestConfig.GetTabDetails(_currentMyRequest, isNew).then(function (response) {
                    MyRequestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        MyRequestCtrl.ePage.Masters.activeTabIndex = MyRequestCtrl.ePage.Masters.TabList.length;
                        MyRequestCtrl.ePage.Masters.CurrentActiveTab(currentMyRequest.entity.RequestNo);
                        MyRequestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('My Request already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            MyRequestCtrl.ePage.Masters.currentMyRequest = currentTab;
        }


        function RemoveTab(event, index, currentMyRequest) {
            event.preventDefault();
            event.stopPropagation();
            var currentMyRequest = currentMyRequest[currentMyRequest.label].ePage.Entities;
            MyRequestCtrl.ePage.Masters.TabList.splice(index, 1);
        }


        function CreateNewMyRequest() {

            location.href = '#/EA/SRQ/downtime-request-general';

            // var _isExist = MyRequestCtrl.ePage.Masters.TabList.some(function (value) {
            //     if (value.label === "New")
            //         return true;
            //     else
            //         return false;
            // });
            // if (!_isExist) {
            //     MyRequestCtrl.ePage.Masters.isNewClicked = true;
            //     helperService.getFullObjectUsingGetById(MyRequestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
            //         if (response.data.Response) {
            //             var _obj = {
            //                 entity: response.data.Response.Response.UIMyRequestHeader,
            //                 data: response.data.Response.Response,
            //                 Validations: response.data.Response.Validations
            //             };
            //             MyRequestCtrl.ePage.Masters.AddTab(_obj, true);
            //             MyRequestCtrl.ePage.Masters.isNewClicked = false;
            //         } else {
            //             console.log("Empty New My Request response");
            //         }
            //     });
            // } else {
            //     toastr.info("New Record Already Opened...!");
            // }
        }



        Init();

    }
})();