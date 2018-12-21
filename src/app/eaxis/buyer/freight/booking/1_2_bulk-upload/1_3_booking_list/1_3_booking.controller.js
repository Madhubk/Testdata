(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_BookingController", one_three_BookingController);

    one_three_BookingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "one_three_BookingConfig", "toastr", "errorWarningService", "confirmation", "$uibModal"];

    function one_three_BookingController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, one_three_BookingConfig, toastr, errorWarningService, confirmation, $uibModal) {
        /* jshint validthis: true */
        var one_three_BookingCtrl = this;

        function Init() {
            one_three_BookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": one_three_BookingConfig.Entities
            };
            one_three_BookingCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            one_three_BookingCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            // For list directive
            one_three_BookingCtrl.ePage.Masters.taskName = "Booking_" + one_three_BookingCtrl.ePage.Masters.RoleCode;
            one_three_BookingCtrl.ePage.Masters.dataentryName = "Booking_" + one_three_BookingCtrl.ePage.Masters.RoleCode;
            // one_three_BookingCtrl.ePage.Masters.defaultFilter = {
            //     "IsBooking": "true"
            // }
            one_three_BookingCtrl.ePage.Masters.taskHeader = "";
            one_three_BookingCtrl.ePage.Masters.config = one_three_BookingConfig;

            // Remove all Tabs while load booking
            one_three_BookingConfig.TabList = [];

            one_three_BookingCtrl.ePage.Masters.BookingData = [];
            one_three_BookingCtrl.ePage.Masters.TabList = [];
            one_three_BookingCtrl.ePage.Masters.activeTabIndex = 0;
            one_three_BookingCtrl.ePage.Masters.IsTabClick = false;
            one_three_BookingCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            one_three_BookingCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            one_three_BookingCtrl.ePage.Masters.AddTab = AddTab;
            one_three_BookingCtrl.ePage.Masters.RemoveTab = RemoveTab;
            one_three_BookingCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            one_three_BookingCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            one_three_BookingCtrl.ePage.Masters.ShowLists = false;
            one_three_BookingCtrl.ePage.Masters.CNFShipment = false;
            one_three_BookingCtrl.ePage.Masters.BUP = false;
            one_three_BookingCtrl.ePage.Masters.CreateBtn = true;
            one_three_BookingCtrl.ePage.Masters.ShipmentSelection = ShipmentSelection;

        }

        function ShipmentSelection(mode) {
            debugger
            one_three_BookingCtrl.ePage.Masters.dataentryName = one_three_BookingCtrl.ePage.Masters.dataentryName;
            switch (mode) {
                case 'bookinglist':
                    one_three_BookingCtrl.ePage.Masters.ShowLists = true;
                    one_three_BookingCtrl.ePage.Masters.BUP = false;
                    one_three_BookingCtrl.ePage.Masters.CreateBtn = true;
                    one_three_BookingCtrl.ePage.Masters.dataentryName = "Booking_" + one_three_BookingCtrl.ePage.Masters.RoleCode;
                    one_three_BookingCtrl.ePage.Masters.RoleCode == 'BUYER_SUPPLIER' ? one_three_BookingCtrl.ePage.Masters.defaultFilter = {} : one_three_BookingCtrl.ePage.Masters.RoleCode == 'BUYER_EXPORT_CS' ? one_three_BookingCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "true"
                    } : one_three_BookingCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "true"
                    };
                    break;
                case 'buplist':
                    one_three_BookingCtrl.ePage.Masters.ShowLists = true;
                    one_three_BookingCtrl.ePage.Masters.BUP = false;
                    one_three_BookingCtrl.ePage.Masters.CreateBtn = false;
                    one_three_BookingCtrl.ePage.Masters.dataentryName = "BUP_Upload";
                    one_three_BookingCtrl.ePage.Masters.defaultFilter = {
                        "BatchUploadType": "BUP"
                    };
                    break;
                case 'BUP':
                    UploadBup();
                    break;
                case 'CNFBooking':
                    one_three_BookingCtrl.ePage.Masters.ShowLists = true;
                    one_three_BookingCtrl.ePage.Masters.CNFShipment = true;
                    one_three_BookingCtrl.ePage.Masters.CreateBtn = true;
                    CreateNewBooking();
                    break;
                case 'dashboard':
                    one_three_BookingCtrl.ePage.Masters.ShowLists = false;
                    one_three_BookingCtrl.ePage.Masters.BUP = false;
                    one_three_BookingCtrl.ePage.Masters.CNFShipment = false;
                    break;
                default:
                    one_three_BookingCtrl.ePage.Masters.ShowLists = false;
                    one_three_BookingCtrl.ePage.Masters.SLI = false;
                    one_three_BookingCtrl.ePage.Masters.CNFShipment = false;
                    break;
            }
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
                function (response) {

                }
            );
        }

        function CreateNewBooking() {

            var _isExist = one_three_BookingCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                one_three_BookingCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(one_three_BookingCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };

                        one_three_BookingCtrl.ePage.Masters.AddTab(_obj, true);
                        one_three_BookingCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Booking response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentBooking, isNew) {
            one_three_BookingCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = one_three_BookingCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentBooking.entity.ShipmentNo)
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
                one_three_BookingCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    _currentBooking = currentBooking.entity;
                } else {
                    _currentBooking = currentBooking;
                }

                one_three_BookingConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    var _entity = {};
                    one_three_BookingCtrl.ePage.Masters.TabList = response;

                    if (one_three_BookingCtrl.ePage.Masters.TabList.length > 0) {
                        one_three_BookingCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentBooking.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        one_three_BookingCtrl.ePage.Masters.activeTabIndex = one_three_BookingCtrl.ePage.Masters.TabList.length;
                        one_three_BookingCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo, _entity);
                        one_three_BookingCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentBooking) {
            event.preventDefault();
            event.stopPropagation();
            var _currentBooking = currentBooking[currentBooking.label].ePage.Entities;

            // Close Current Booking
            apiService.get("eAxisAPI", one_three_BookingCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // one_three_BookingCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            one_three_BookingCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            one_three_BookingCtrl.ePage.Masters.currentBooking = currentTab;
            // var _obj = {
            //     ModuleName: ["Booking"],
            //     Code: [currentTab],
            //     API: "Validation", // Validation/Group
            //     FilterInput: {
            //         ModuleCode: "SHP",
            //         SubModuleCode: "SHP",
            //         // Code: "E0013"
            //     },
            //     GroupCode: "TC_Test",
            //     RelatedBasicDetails: [{
            //         "UIField": "TEST",
            //         "DbField": "TEST",
            //         "Value": "TEST"
            //     }],
            //     EntityObject: entity,
            //     // ErrorCode: ["E0013"]
            // };

            // errorWarningService.GetErrorCodeList(_obj);

        }

        function SelectedGridRow($item) {
            if ($item.action === "link") {
                one_three_BookingCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "icon") {
                StandardMenuConfig($item.data.entity);
            }
        }

        function StandardMenuConfig(_data) {
            one_three_BookingCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                // "Entity": _data.Source,
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
            one_three_BookingCtrl.ePage.Masters.StandardConfigInput = {
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

            one_three_BookingCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
            one_three_BookingCtrl.ePage.Masters.DocumentEnable = true;
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
                templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/doc-upload-modal/doc-upload-modal.html",
                controller: 'DocModalController',
                controllerAs: "DocModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": one_three_BookingCtrl.ePage.Masters.StandardMenuInput
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {}
            );
        }


        Init();
    }
})();