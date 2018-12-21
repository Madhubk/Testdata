(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingSRVController", BookingSRVController);

    BookingSRVController.$inject = ["$scope", "$timeout", "$location", "authService", "apiService", "helperService", "three_BookingConfig", "toastr", "errorWarningService", "$uibModal"];

    function BookingSRVController($scope, $timeout, $location, authService, apiService, helperService, three_BookingConfig, toastr, errorWarningService, $uibModal) {
        /* jshint validthis: true */
        var BookingSRVCtrl = this,
            Entity = $location.path().split("/").pop();

        function Init() {
            BookingSRVCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_BookingConfig.Entities
            };
            BookingSRVCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            BookingSRVCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            BookingSRVCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            // For list directive
            BookingSRVCtrl.ePage.Masters.taskName = "Booking_" + BookingSRVCtrl.ePage.Masters.RoleCode;
            BookingSRVCtrl.ePage.Masters.dataentryName = "Booking_" + BookingSRVCtrl.ePage.Masters.RoleCode;
            // BookingSRVCtrl.ePage.Masters.defaultFilter = {
            //     "IsBooking": "true"
            // }
            BookingSRVCtrl.ePage.Masters.taskHeader = "";
            BookingSRVCtrl.ePage.Masters.config = three_BookingConfig;

            // Remove all Tabs while load booking
            three_BookingConfig.TabList = [];

            BookingSRVCtrl.ePage.Masters.BookingData = [];
            BookingSRVCtrl.ePage.Masters.TabList = [];
            BookingSRVCtrl.ePage.Masters.activeTabIndex = 0;
            BookingSRVCtrl.ePage.Masters.IsTabClick = false;
            BookingSRVCtrl.ePage.Masters.IsNewBookingClicked = false;

            // Functions
            BookingSRVCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            BookingSRVCtrl.ePage.Masters.AddTab = AddTab;
            BookingSRVCtrl.ePage.Masters.RemoveTab = RemoveTab;
            BookingSRVCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            BookingSRVCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            BookingSRVCtrl.ePage.Masters.ShowLists = false;
            BookingSRVCtrl.ePage.Masters.CNFShipment = false;
            BookingSRVCtrl.ePage.Masters.ASN = false;
            BookingSRVCtrl.ePage.Masters.CreateBtn = true;
            BookingSRVCtrl.ePage.Masters.ShipmentSelection = ShipmentSelection;

            (BookingSRVCtrl.ePage.Masters.Entity) ? ShipmentSelection('CNFBooking'): false;

        }

        function ShipmentSelection(mode) {
            BookingSRVCtrl.ePage.Masters.dataentryName = BookingSRVCtrl.ePage.Masters.dataentryName;
            switch (mode) {
                case 'bookinglist':
                    BookingSRVCtrl.ePage.Masters.ShowLists = true;
                    BookingSRVCtrl.ePage.Masters.ASN = false;
                    BookingSRVCtrl.ePage.Masters.CreateBtn = true;
                    BookingSRVCtrl.ePage.Masters.dataentryName = "Booking_" + BookingSRVCtrl.ePage.Masters.RoleCode;
                    BookingSRVCtrl.ePage.Masters.RoleCode == 'BUYER_SUPPLIER' ? BookingSRVCtrl.ePage.Masters.defaultFilter = {} : BookingSRVCtrl.ePage.Masters.RoleCode == 'BUYER_EXPORT_CS' ? BookingSRVCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "true"
                    } : BookingSRVCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "true"
                    };
                    break;
                case 'asnlist':
                    BookingSRVCtrl.ePage.Masters.ShowLists = true;
                    BookingSRVCtrl.ePage.Masters.ASN = false;
                    BookingSRVCtrl.ePage.Masters.CreateBtn = false;
                    BookingSRVCtrl.ePage.Masters.dataentryName = "ASN_Upload";
                    BookingSRVCtrl.ePage.Masters.defaultFilter = {
                        "BatchUploadType": "ASN"
                    };
                    break;
                case 'ASN':
                    UploadAsn();
                    break;
                case 'CNFBooking':
                    BookingSRVCtrl.ePage.Masters.ShowLists = true;
                    BookingSRVCtrl.ePage.Masters.CNFShipment = true;
                    BookingSRVCtrl.ePage.Masters.CreateBtn = true;
                    CreateNewBooking();
                    break;
                case 'dashboard':
                    BookingSRVCtrl.ePage.Masters.ShowLists = false;
                    BookingSRVCtrl.ePage.Masters.ASN = false;
                    BookingSRVCtrl.ePage.Masters.CNFShipment = false;
                    break;
                default:
                    BookingSRVCtrl.ePage.Masters.ShowLists = false;
                    BookingSRVCtrl.ePage.Masters.SLI = false;
                    BookingSRVCtrl.ePage.Masters.CNFShipment = false;
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

            var _isExist = BookingSRVCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                BookingSRVCtrl.ePage.Masters.IsNewBookingClicked = true;

                helperService.getFullObjectUsingGetById(BookingSRVCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };
                        _obj.data.UIShipmentHeader.BookingType = BookingSRVCtrl.ePage.Masters.Entity.BookingType;
                        _obj.data.UIShipmentHeader.BatchUploadNo = BookingSRVCtrl.ePage.Masters.Entity.BatchUploadNo;
                        _obj.data.UIShipmentHeader.BUP_FK = BookingSRVCtrl.ePage.Masters.Entity.PK;
                        BookingSRVCtrl.ePage.Masters.AddTab(_obj, true);
                        BookingSRVCtrl.ePage.Masters.IsNewBookingClicked = false;
                    } else {
                        console.log("Empty New Booking response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentBooking, isNew) {
            BookingSRVCtrl.ePage.Masters.currentBooking = undefined;

            var _isExist = BookingSRVCtrl.ePage.Masters.TabList.some(function (value) {
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
                BookingSRVCtrl.ePage.Masters.IsTabClick = true;
                var _currentBooking = undefined;
                if (!isNew) {
                    _currentBooking = currentBooking.entity;
                } else {
                    _currentBooking = currentBooking;
                }

                three_BookingConfig.GetTabDetails(_currentBooking, isNew).then(function (response) {
                    var _entity = {};
                    BookingSRVCtrl.ePage.Masters.TabList = response;

                    if (BookingSRVCtrl.ePage.Masters.TabList.length > 0) {
                        BookingSRVCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentBooking.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        BookingSRVCtrl.ePage.Masters.activeTabIndex = BookingSRVCtrl.ePage.Masters.TabList.length;
                        BookingSRVCtrl.ePage.Masters.CurrentActiveTab(currentBooking.entity.ShipmentNo, _entity);
                        BookingSRVCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", BookingSRVCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentBooking.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // BookingSRVCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            BookingSRVCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            BookingSRVCtrl.ePage.Masters.currentBooking = currentTab;
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
                BookingSRVCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "icon") {
                StandardMenuConfig($item.data.entity);
            }
        }

        function StandardMenuConfig(_data) {
            BookingSRVCtrl.ePage.Masters.StandardMenuInput = {
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
            BookingSRVCtrl.ePage.Masters.StandardConfigInput = {
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

            BookingSRVCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
            BookingSRVCtrl.ePage.Masters.DocumentEnable = true;
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
                            "Input": BookingSRVCtrl.ePage.Masters.StandardMenuInput
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