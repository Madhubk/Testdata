/*
    Page : Container details
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerDetailsController", ContainerDetailsController);

    ContainerDetailsController.$inject = ["$window", "apiService", "appConfig", "helperService"];

    function ContainerDetailsController($window, apiService, appConfig, helperService) {
        var ContainerDetailsCtrl = this;

        function Init() {
            ContainerDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "CONTAINER_DETAILS",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ContainerDetailsCtrl.ePage.Masters.emptyText = "-";
            ContainerDetailsCtrl.ePage.Masters.currentObj = ContainerDetailsCtrl.currentObj;
            GetContainerDetails();
        }
function GetContainerDetails()
{
    if (ContainerDetailsCtrl.ePage.Masters.currentObj) {
        apiService.get("eAxisAPI", appConfig.Entities.CntContainer.API.GetById.Url  + ContainerDetailsCtrl.ePage.Masters.currentObj.EntityRefKey).then(function (response) {
            if (response.data.Response) {
                ContainerDetailsCtrl.ePage.Entities.Header.Data.UIcntContainer = response.data.Response;
            } else {
                console.log("Empty response");
            }
        });
    }
}
        Init();
    }
})();