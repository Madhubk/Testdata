(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BranchDetailsController", BranchDetailsController);

    BranchDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "branchConfig", "helperService", "$filter", "$uibModal", "toastr"];

    function BranchDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, branchConfig, helperService, $filter, $uibModal, toastr) {
        /* jshint validthis: true */
        var BranchDetailsCtrl = this;

        function Init() {
            var currentBranch = BranchDetailsCtrl.currentBranch[BranchDetailsCtrl.currentBranch.label].ePage.Entities;
            BranchDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBranch
            };
            BranchDetailsCtrl.ePage.Masters.OpenBranchModel = OpenBranchModel;
            BranchDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
        };

        function SelectedLookupData($index, $item, type) {
            if (type == "Organization") {
                BranchDetailsCtrl.ePage.Entities.Header.Data.Code = "";
            }
        }

        function OpenBranchModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "basics-edit right",
                scope: $scope,
                templateUrl: "app/mdm/branch/branch-details/branch-edit-details/branch-details-modal.html",
                controller: 'BranchModalController as BranchModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentBranch": BranchDetailsCtrl.ePage.Entities
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.Data != undefined) {
                        var _isEmpty = angular.equals(response.Data, {});
                        if (!_isEmpty) {
                            BranchDetailsCtrl.ePage.Entities.Header.Data = response.Data;
                            toastr.success("Record Added Successfully...!")

                        } else {
                            toastr.warnig("Value Should not be Empty...!");
                        }
                    }
                    else {
                        BranchDetailsCtrl.ePage.Entities.Header.Data = response;
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );
        };
        Init();
    }
})();
