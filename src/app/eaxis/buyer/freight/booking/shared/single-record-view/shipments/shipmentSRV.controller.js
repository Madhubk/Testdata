(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentSRVController", ShipmentSRVController);

    ShipmentSRVController.$inject = ["$scope", "$timeout", "$location", "authService", "apiService", "helperService", "three_BookingConfig", "toastr", "errorWarningService", "$uibModal"];

    function ShipmentSRVController($scope, $timeout, $location, authService, apiService, helperService, three_BookingConfig, toastr, errorWarningService, $uibModal) {
        /* jshint validthis: true */
        var ShipmentSRVCtrl = this,
            _queryString = $location.search();
        // Entity = $location.path().split("/").pop();

        function Init() {
            ShipmentSRVCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_BookingConfig.Entities
            };
            ShipmentSRVCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            ShipmentSRVCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            // For list directive
            ShipmentSRVCtrl.ePage.Masters.taskName = "Booking_" + ShipmentSRVCtrl.ePage.Masters.RoleCode;
            ShipmentSRVCtrl.ePage.Masters.dataentryName = "Booking_" + ShipmentSRVCtrl.ePage.Masters.RoleCode;
            // ShipmentSRVCtrl.ePage.Masters.defaultFilter = {
            //     "IsBooking": "true"
            // }
            ShipmentSRVCtrl.ePage.Masters.taskHeader = "";
            ShipmentSRVCtrl.ePage.Masters.config = three_BookingConfig;

            // Remove all Tabs while load booking
            three_BookingConfig.TabList = [];

            ShipmentSRVCtrl.ePage.Masters.BookingData = [];
            ShipmentSRVCtrl.ePage.Masters.TabList = [];
            ShipmentSRVCtrl.ePage.Masters.activeTabIndex = 0;
            ShipmentSRVCtrl.ePage.Masters.IsTabClick = false;
            ShipmentSRVCtrl.ePage.Masters.IsNewShipmentClicked = false;

            // Functions
            ShipmentSRVCtrl.ePage.Masters.CreateNewShipment = CreateNewShipment;
            ShipmentSRVCtrl.ePage.Masters.AddTab = AddTab;
            ShipmentSRVCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ShipmentSRVCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ShipmentSRVCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ShipmentSRVCtrl.ePage.Masters.ShowLists = false;
            ShipmentSRVCtrl.ePage.Masters.CNFShipment = false;
            ShipmentSRVCtrl.ePage.Masters.BUP = false;
            ShipmentSRVCtrl.ePage.Masters.CreateBtn = true;
            ShipmentSRVCtrl.ePage.Masters.ShipmentSelection = ShipmentSelection;

            try {
                if (_queryString.q) {
                    ShipmentSRVCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    (ShipmentSRVCtrl.ePage.Masters.Entity) ? ShipmentSelection('CNFBooking'): false;
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function ShipmentSelection(mode) {
            ShipmentSRVCtrl.ePage.Masters.dataentryName = ShipmentSRVCtrl.ePage.Masters.dataentryName;
            switch (mode) {
                case 'shipmentlist':
                    ShipmentSRVCtrl.ePage.Masters.ShowLists = true;
                    ShipmentSRVCtrl.ePage.Masters.BUP = false;
                    ShipmentSRVCtrl.ePage.Masters.CreateBtn = true;
                    ShipmentSRVCtrl.ePage.Masters.dataentryName = "Booking_" + ShipmentSRVCtrl.ePage.Masters.RoleCode;
                    ShipmentSRVCtrl.ePage.Masters.RoleCode == 'BUYER_SUPPLIER' ? ShipmentSRVCtrl.ePage.Masters.defaultFilter = {} : ShipmentSRVCtrl.ePage.Masters.RoleCode == 'BUYER_FORWARDER_EXPORT_AGENT' ? ShipmentSRVCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "false"
                    } : ShipmentSRVCtrl.ePage.Masters.defaultFilter = {
                        "IsBooking": "false"
                    };
                    break;
                case 'buplist':
                    ShipmentSRVCtrl.ePage.Masters.ShowLists = true;
                    ShipmentSRVCtrl.ePage.Masters.BUP = false;
                    ShipmentSRVCtrl.ePage.Masters.CreateBtn = false;
                    ShipmentSRVCtrl.ePage.Masters.dataentryName = "BUP_Upload";
                    ShipmentSRVCtrl.ePage.Masters.defaultFilter = {
                        "BatchUploadType": "BUP"
                    };
                    break;
                case 'BUP':
                    UploadAsn();
                    break;
                case 'CNFBooking':
                    ShipmentSRVCtrl.ePage.Masters.ShowLists = true;
                    ShipmentSRVCtrl.ePage.Masters.CNFShipment = true;
                    ShipmentSRVCtrl.ePage.Masters.CreateBtn = true;
                    CreateNewShipment();
                    break;
                case 'dashboard':
                    ShipmentSRVCtrl.ePage.Masters.ShowLists = false;
                    ShipmentSRVCtrl.ePage.Masters.BUP = false;
                    ShipmentSRVCtrl.ePage.Masters.CNFShipment = false;
                    break;
                default:
                    ShipmentSRVCtrl.ePage.Masters.ShowLists = false;
                    ShipmentSRVCtrl.ePage.Masters.SLI = false;
                    ShipmentSRVCtrl.ePage.Masters.CNFShipment = false;
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

        function CreateNewShipment() {

            var _isExist = ShipmentSRVCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                ShipmentSRVCtrl.ePage.Masters.IsNewShipmentClicked = true;

                helperService.getFullObjectUsingGetById(ShipmentSRVCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };
                        _obj.data.UIShipmentHeader.BookingType = ShipmentSRVCtrl.ePage.Masters.Entity.BookingType;
                        _obj.data.UIShipmentHeader.BatchUploadNo = ShipmentSRVCtrl.ePage.Masters.Entity.BatchUploadNo;
                        _obj.data.UIShipmentHeader.BUP_FK = ShipmentSRVCtrl.ePage.Masters.Entity.PK;
                        ShipmentSRVCtrl.ePage.Masters.AddTab(_obj, true);
                        ShipmentSRVCtrl.ePage.Masters.IsNewShipmentClicked = false;
                    } else {
                        console.log("Empty New Booking response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }

        }

        function AddTab(currentShipment, isNew) {
            ShipmentSRVCtrl.ePage.Masters.currentShipment = undefined;

            var _isExist = ShipmentSRVCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentShipment.entity.ShipmentNo)
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
                ShipmentSRVCtrl.ePage.Masters.IsTabClick = true;
                var _currentShipment = undefined;
                if (!isNew) {
                    _currentShipment = currentShipment.entity;
                } else {
                    _currentShipment = currentShipment;
                }

                three_BookingConfig.GetTabDetails(_currentShipment, isNew).then(function (response) {
                    var _entity = {};
                    ShipmentSRVCtrl.ePage.Masters.TabList = response;

                    if (ShipmentSRVCtrl.ePage.Masters.TabList.length > 0) {
                        ShipmentSRVCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentShipment.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        ShipmentSRVCtrl.ePage.Masters.activeTabIndex = ShipmentSRVCtrl.ePage.Masters.TabList.length;
                        ShipmentSRVCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo, _entity);
                        ShipmentSRVCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentShipment) {
            event.preventDefault();
            event.stopPropagation();
            var _currentShipment = currentShipment[currentShipment.label].ePage.Entities;

            // Close Current Booking
            apiService.get("eAxisAPI", ShipmentSRVCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // ShipmentSRVCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            ShipmentSRVCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            ShipmentSRVCtrl.ePage.Masters.currentShipment = currentTab;
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
                ShipmentSRVCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "icon") {
                StandardMenuConfig($item.data.entity);
            }
        }

        function StandardMenuConfig(_data) {
            ShipmentSRVCtrl.ePage.Masters.StandardMenuInput = {
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
            ShipmentSRVCtrl.ePage.Masters.StandardConfigInput = {
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

            ShipmentSRVCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
            ShipmentSRVCtrl.ePage.Masters.DocumentEnable = true;
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
                            "Input": ShipmentSRVCtrl.ePage.Masters.StandardMenuInput
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