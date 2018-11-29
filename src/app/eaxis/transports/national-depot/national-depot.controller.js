(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NationalDepotController", NationalDepotController);

    NationalDepotController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$http", "$filter"];

    function NationalDepotController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $http, $filter) {

        var NationalDepotCtrl = this;

        function Init() {

            NationalDepotCtrl.ePage = {
                "Title": "",
                "Prefix": "National_Depot",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            NationalDepotCtrl.ePage.Masters.IsNoRecords = false;
            getOrgHeader();

            NationalDepotCtrl.ePage.Masters.OnChangeOrganization = OnChangeOrganization;

        }

        function OnChangeOrganization(item) {
            NationalDepotCtrl.ePage.Masters.IsLoading = true;
            NationalDepotCtrl.ePage.Masters.FilterDetails = $filter('filter')(NationalDepotCtrl.ePage.Masters.Details, item)
            if (NationalDepotCtrl.ePage.Masters.FilterDetails.length > 0) {
                angular.forEach(NationalDepotCtrl.ePage.Masters.FilterDetails, function (value1, key1) {
                    value1.TempDateDetails = [];
                    angular.forEach(value1.Details, function (value2, key2) {
                        angular.forEach(NationalDepotCtrl.ePage.Masters.DateDetails, function (value, key) {
                            if (value == value2.Date) {
                                value1.TempDateDetails.push(value2);
                            }
                        });
                    });
                });
                NationalDepotCtrl.ePage.Masters.TempDetails = _.groupBy(NationalDepotCtrl.ePage.Masters.FilterDetails, 'Depot');
                NationalDepotCtrl.ePage.Masters.IsNoRecords = false;
                NationalDepotCtrl.ePage.Masters.IsLoading = false;
            } else {
                NationalDepotCtrl.ePage.Masters.IsNoRecords = true;
                NationalDepotCtrl.ePage.Masters.IsLoading = false;
            }
            getDepotDetails();
        }

        function getOrgHeader() {
            var _filter = {
                "IsRoadFreightDepot": true
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGHEAD"
            };
            apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    NationalDepotCtrl.ePage.Masters.Organization = response.data.Response;
                    NationalDepotCtrl.ePage.Masters.OrganizationCode = response.data.Response[4].Code;
                    getDepotDetails();
                }
            });
        }

        function getDepotDetails() {
            NationalDepotCtrl.ePage.Masters.IsLoading = true;
            apiService.get("eAxisAPI", "TmsSOHProjection/FindAll/"+ NationalDepotCtrl.ePage.Masters.OrganizationCode).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    NationalDepotCtrl.ePage.Masters.Details = response.data.Response;
                    NationalDepotCtrl.ePage.Masters.TempDateDetails = [];
                    NationalDepotCtrl.ePage.Masters.DateDetails = [];
                    angular.forEach(NationalDepotCtrl.ePage.Masters.Details, function (value, key) {
                        angular.forEach(value.Details, function (value1, key1) {
                            value1.Date = $filter('date')(value1.Date, "MMM d, y");
                            NationalDepotCtrl.ePage.Masters.TempDateDetails.push(value1.Date);
                        });
                    });


                    NationalDepotCtrl.ePage.Masters.Temp1Details = _.groupBy(NationalDepotCtrl.ePage.Masters.Details, 'Depot');
                    NationalDepotCtrl.ePage.Masters.FilterDetails = $filter('filter')(NationalDepotCtrl.ePage.Masters.Details, NationalDepotCtrl.ePage.Masters.OrganizationCode)

                    NationalDepotCtrl.ePage.Masters.TempDateDetails = _.uniq(NationalDepotCtrl.ePage.Masters.TempDateDetails);
                    var count = 0;
                    angular.forEach(NationalDepotCtrl.ePage.Masters.TempDateDetails, function (value, key) {
                        if (count < 5) {
                            NationalDepotCtrl.ePage.Masters.DateDetails.push(value);
                            count++;
                        }
                    });

                    angular.forEach(NationalDepotCtrl.ePage.Masters.FilterDetails, function (value1, key1) {
                        value1.TempDateDetails = [];
                        angular.forEach(value1.Details, function (value2, key2) {
                            angular.forEach(NationalDepotCtrl.ePage.Masters.DateDetails, function (value, key) {
                                if (value == value2.Date) {
                                    if (value2.ToBeSent == 999) {
                                        value2.ToBeSent = "NA";
                                    }
                                    value1.TempDateDetails.push(value2);
                                }
                            });
                        });
                    });

                    NationalDepotCtrl.ePage.Masters.TempDetails = _.groupBy(NationalDepotCtrl.ePage.Masters.FilterDetails, 'Depot');
                    NationalDepotCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }

})();