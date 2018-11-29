(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadSLIController", UploadSLIController);

    UploadSLIController.$inject = ["$location", "$timeout", "$injector", "$window", "apiService", "helperService", "toastr", "appConfig"];

    function UploadSLIController($location, $timeout, $injector, $window, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var UploadSLICtrl = this,
            Entity = $location.path().split("/").pop(),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            UploadSLICtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView_Upload_SLI",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            UploadSLICtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            UploadSLICtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            UploadSLICtrl.ePage.Masters.Close = Close;

            GetDynamicLookupConfig();
            (UploadSLICtrl.ePage.Masters.Entity) ? CreateNewSLI(): false;
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList    
            var DataEntryNameList = "OrganizationList,OrgContact";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;

                res.map(function (value, key) {
                    UploadSLICtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function CreateNewSLI() {
            // helperService.getFullObjectUsingGetById(UploadSLICtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
            //     if (response.data.Response) {} else {
            //         console.log("Empty New Order response");
            //     }
            // });
        }

        function Close(index, currentObj) {
            var _currentObj = currentObj[currentObj.label].ePage.Entities;

            // Close Current Order
            apiService.get("eAxisAPI", Config.Entities.Header.API.OrderHeaderActivityClose.Url + _currentObj.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });
            Config.GlobalVar.IsClosed = false;
            $timeout(function () {
                $window.close();
            }, 1000);
        }

        Init();
    }
})();