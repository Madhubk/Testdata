(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_BookingController", three_BookingController);

    three_BookingController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "three_BookingConfig", "toastr", "errorWarningService", "confirmation", "$uibModal"];

    function three_BookingController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, three_BookingConfig, toastr, errorWarningService, confirmation, $uibModal) {
        /* jshint validthis: true */
        var three_BookingCtrl = this;

        function Init() {
            three_BookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_BookingConfig.Entities
            };
            three_BookingCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_BookingCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            // For list directive
            three_BookingCtrl.ePage.Masters.taskName = "Booking_" + three_BookingCtrl.ePage.Masters.RoleCode;
            three_BookingCtrl.ePage.Masters.dataentryName = "Booking_" + three_BookingCtrl.ePage.Masters.RoleCode;
            // three_BookingCtrl.ePage.Masters.defaultFilter = {
            //     "IsBooking": "true"
            // }
            three_BookingCtrl.ePage.Masters.taskHeader = "";
            three_BookingCtrl.ePage.Masters.config = three_BookingConfig;

            // Remove all Tabs while load booking
            three_BookingConfig.TabList = [];

            three_BookingCtrl.ePage.Masters.BookingData = [];
            three_BookingCtrl.ePage.Masters.TabList = [];
            three_BookingCtrl.ePage.Masters.activeTabIndex = 0;
            three_BookingCtrl.ePage.Masters.IsTabClick = false;
            three_BookingCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            three_BookingCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            three_BookingCtrl.ePage.Masters.AddTab = AddTab;
            three_BookingCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_BookingCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_BookingCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            three_BookingCtrl.ePage.Masters.ShowLists = false;
            three_BookingCtrl.ePage.Masters.CNFShipment = false;
            three_BookingCtrl.ePage.Masters.ASN = false;
            three_BookingCtrl.ePage.Masters.CreateBtn = true;
            three_BookingCtrl.ePage.Masters.ShipmentSelection = ShipmentSelection;

        }

        function ShipmentSelection(mode) {
            three_BookingCtrl.ePage.Masters.dataentryName = three_BookingCtrl.ePage.Masters.dataentryName;
            switch (mode) {
                case 'bookinglist':
                    three_BookingCtrl.ePage.Masters.ShowLists = true;
                    three_BookingCtrl.ePage.Masters.ASN = false;
                    three_BookingCtrl.ePage.Masters.CreateBtn = true;
                    three_BookingCtrl.ePage.Masters.dataentryName = "Booking_" + three_BookingCtrl.ePage.Masters.RoleCode;
                    three_BookingCtrl.ePage.Masters.RoleCode == 'BUYER_SUPPLIER' ? three_BookingCtrl.ePage.Masters.defaultFilter = {} : three_BookingCtrl.ePage.Masters.RoleCode == 'BUYER_EXPORT_CS' ? three_BookingCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "true"
                    } : three_BookingCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "true"
                    };
                    break;
                case 'asnlist':
                    three_BookingCtrl.ePage.Masters.ShowLists = true;
                    three_BookingCtrl.ePage.Masters.ASN = false;
                    three_BookingCtrl.ePage.Masters.CreateBtn = false;
                    three_BookingCtrl.ePage.Masters.dataentryName = "ASN_Upload";
                    three_BookingCtrl.ePage.Masters.defaultFilter = {
                        "BatchUploadType": "ASN"
                    };
                    break;
                case 'ASN':
                    UploadAsn();
                    break;
                case 'CNFBooking':
                    three_BookingCtrl.ePage.Masters.ShowLists = true;
                    three_BookingCtrl.ePage.Masters.CNFShipment = true;
                    three_BookingCtrl.ePage.Masters.CreateBtn = true;
                    CreateNewBooking();
                    break;
                case 'dashboard':
                    three_BookingCtrl.ePage.Masters.ShowLists = false;
                    three_BookingCtrl.ePage.Masters.ASN = false;
                    three_BookingCtrl.ePage.Masters.CNFShipment = false;
                    break;
                default:
                    three_BookingCtrl.ePage.Masters.ShowLists = false;
                    three_BookingCtrl.ePage.Masters.SLI = false;
                    three_BookingCtrl.ePage.Masters.CNFShipment = false;
                    break;
            }
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
                function (response) {

                }
            );
        }

        function CreateNewBooking() {

            var _isExist = three_BookingCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                three_BookingCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(three_BookingCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };

                        three_BookingCtrl.ePage.Masters.AddTab(_obj, true);
                        three_BookingCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Booking response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentBooking, isNew) {
            three_BookingCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = three_BookingCtrl.ePage.Masters.TabList.some(function (value) {
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
                three_BookingCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    _currentBooking = currentBooking.entity;
                } else {
                    _currentBooking = currentBooking;
                }

                three_BookingConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    var _entity = {};
                    three_BookingCtrl.ePage.Masters.TabList = response;

                    if (three_BookingCtrl.ePage.Masters.TabList.length > 0) {
                        three_BookingCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentBooking.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        three_BookingCtrl.ePage.Masters.activeTabIndex = three_BookingCtrl.ePage.Masters.TabList.length;
                        three_BookingCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo, _entity);
                        three_BookingCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", three_BookingCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // three_BookingCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            three_BookingCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            three_BookingCtrl.ePage.Masters.currentBooking = currentTab;
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
                three_BookingCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "icon") {
                StandardMenuConfig($item.data.entity);
            }
        }

        function StandardMenuConfig(_data) {
            three_BookingCtrl.ePage.Masters.StandardMenuInput = {
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
            three_BookingCtrl.ePage.Masters.StandardConfigInput = {
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

            three_BookingCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
            three_BookingCtrl.ePage.Masters.DocumentEnable = true;
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
                            "Input": three_BookingCtrl.ePage.Masters.StandardMenuInput
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