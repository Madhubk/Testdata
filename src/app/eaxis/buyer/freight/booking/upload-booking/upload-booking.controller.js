(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadBookingController", UploadBookingController);
    UploadBookingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "$uibModal", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "uploadBookingConfig"];

    function UploadBookingController($rootScope, $scope, $state, $timeout, $location, $q, $http, $uibModal, APP_CONSTANT, authService, apiService, helperService, appConfig, toastr, confirmation, uploadBookingConfig) {
        /* jshint validthis: true */
        var UploadBookingCtrl = this;

        function Init() {
            UploadBookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload Booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": uploadBookingConfig.Entities
            };


            UploadBookingCtrl.ePage.Masters.taskName = "BPASNUpload";
            UploadBookingCtrl.ePage.Masters.dataentryName = "BPASNUpload";
            UploadBookingCtrl.ePage.Masters.defaultFilter = {
                "Source": "SHP",
                "BatchUploadType": "ASN,BUP"
            };

            UploadBookingCtrl.ePage.Masters.TabList = [];
            UploadBookingCtrl.ePage.Masters.activeTabIndex = 0;
            uploadBookingConfig.TabList = [];
            UploadBookingCtrl.ePage.Masters.Config = uploadBookingConfig;
            UploadBookingCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            UploadBookingCtrl.ePage.Masters.ShowLists = false;
            UploadBookingCtrl.ePage.Masters.CreateBtn = true;
            UploadBookingCtrl.ePage.Masters.ShipmentSelection = ShipmentSelection;

            InitDocUpload();
        }

        function ShipmentSelection(mode) {
            switch (mode) {
                case 'ASN':
                    UploadAsn();
                    break;
                case 'BUP':
                    UploadBup();
                    break;
                default:
                    UploadBookingCtrl.ePage.Masters.ShowLists = false;
                    UploadBookingCtrl.ePage.Masters.SLI = false;
                    break;
            }
        }

        function InitDocUpload() {
            UploadBookingCtrl.ePage.Masters.EmptyTabList = EmptyTabList;
            UploadBookingCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function EmptyTabList() {
            UploadBookingCtrl.ePage.Masters.TabList = [];
            uploadBookingConfig.TabList = [];
            uploadBookingConfig.GlobalVar.DocType = "";
        }

        function UploadAsn() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "AsnModal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/freight/booking/1_2_asn-upload/1_2_asn-upload.html",
                controller: 'oneTwoAsnUploadController',
                controllerAs: "oneTwoAsnUploadCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {};
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    EmptyTabList();
                }
            );
        }

        function UploadBup() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "AsnModal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_2_bulk-upload.html",
                controller: 'oneTwoBulkUploadController',
                controllerAs: "oneTwoBulkUploadCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {};
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    EmptyTabList();
                }
            );
        }


        function SelectedGridRow($item) {
            if ($item.action === "link") {} else if ($item.action === "icon") {
                StandardMenuConfig($item.data.entity);
            }
        }

        function StandardMenuConfig(_data) {
            UploadBookingCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "POBatchUpload_Buyer",
                "EntityRefKey": _data.PK,
                "EntityRefCode": _data.BatchUploadNo,
                "EntitySource": "SHP",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            UploadBookingCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                // IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };

            UploadBookingCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
            UploadBookingCtrl.ePage.Masters.DocumentEnable = true;
            DocumentModal();
        }

        function DocumentModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "doc-modal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/batch-upload/order-batch-upload/doc-upload-modal/doc-upload-modal.html",
                controller: 'DocModalController',
                controllerAs: "DocModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": UploadBookingCtrl.ePage.Masters.StandardMenuInput
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    EmptyTabList();
                }
            );
        }


        Init();
    }
})();