(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerForwarderPlanningController", bkgBuyerForwarderPlanningController);

    bkgBuyerForwarderPlanningController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "three_BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal"];

    function bkgBuyerForwarderPlanningController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, three_BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal) {
        /* jshint validthis: true */
        var bkgBuyerForwarderPlanningCtrl = this;

        function Init() {
            var currentBooking;
            if (bkgBuyerForwarderPlanningCtrl.currentBooking) {
                currentBooking = bkgBuyerForwarderPlanningCtrl.currentBooking[bkgBuyerForwarderPlanningCtrl.currentBooking.label].ePage.Entities;
            } else {
                currentBooking = bkgBuyerForwarderPlanningCtrl.obj[bkgBuyerForwarderPlanningCtrl.obj.label].ePage.Entities;
            }
            bkgBuyerForwarderPlanningCtrl.currentBooking = currentBooking;
            bkgBuyerForwarderPlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            // DatePicker
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DropDownMasterList = three_BookingConfig.Entities.Header.Meta;

            // Callback
            var _isEmpty = angular.equals({}, bkgBuyerForwarderPlanningCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }

            InitContainer();
            InitJobSailing();
            InitPacking();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bkgBuyerForwarderPlanningCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "VOLUMEUNIT", "HEIGHTUNIT"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        bkgBuyerForwarderPlanningCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        bkgBuyerForwarderPlanningCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });


            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });

        }


        // ===================== Container Start =====================

        function InitContainer() {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container = {}
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.IsFormView = false;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.AddNewContainer = AddNewContainer;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.selectedGridRowContainer = SelectedGridRowContainer;
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.DeleteContainer = DeleteContainer;
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.DeleteConfirmation = DeleteConfirmation;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.AddToGridContainer = AddToGridContainer;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New'
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.gridConfig = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Container.gridConfig;
            if (!bkgBuyerForwarderPlanningCtrl.currentBooking.isNew) {
                GetContainerList();
            } else {
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData = [];
            }
        }

        function GetContainerList() {
            // Container grid list
            var _filter = [{
                "FieldName": "BookingOnlyLink",
                "value": bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK
            }];

            var _input = {
                "searchInput": _filter,
                "FilterID": bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.API.cntcontainerfindall.FilterID
            };
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData = undefined;
            apiService.post("eAxisAPI", bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.API.cntcontainerfindall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response;
                    GetContainerDetails()
                }
            });
        }

        function GetContainerDetails() {
            var _gridData = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData = undefined;
            $timeout(function () {
                if (bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.length > 0) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("UIJobRoutes List is Empty");
                }

                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData = _gridData;
            });
        }

        function AddNewContainer() {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView = {};
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView.IsDeleted = false;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.IsFormView = true;
        }

        function SelectedGridRowContainer($item, type) {
            if (type == 'edit')
                EditContainer($item)
            else
                DeleteConfirmationContainer($item)
        }

        function EditContainer($item) {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView = $item;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.IsFormView = true;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Update';
        }

        function DeleteConfirmationContainer($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContainer($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Container
        function DeleteContainer($item) {
            if ($item.PK) {
                var _index = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
                    return value.PK;
                }).indexOf($item.PK);
                if (_index === -1) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.splice($item.index, 1);
                    GetContainerDetails();
                } else {
                    $item.IsDeleted = true;
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer[$item.index] = $item;
                    GetContainerDetails();
                }
            } else {
                bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.splice($item.index, 1);
                GetContainerDetails();
            }
        }

        function AddToGridContainer() {
            var _isEmpty = angular.equals({}, bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView);

            if (!_isEmpty) {
                var _index = bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData.map(function (value, key) {
                    return value.PK;
                }).indexOf(bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView.PK);

                if (_index === -1) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView.SHP_BookingOnlyLink = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK;
                    // apiService.post("eAxisAPI", bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.API.cntcontainerinsertV2.Url, bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView).then(function (response) {
                    //     if (response.data.Response) {
                    //         GetContainerList();

                    // bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData.push(response.data.Response[0]);
                    // toastr.success("Record Added Successfully...!");
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.push(bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView);
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.IsFormView = false;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView = {}
                    GetContainerDetails();
                    //     }
                    // });

                } else {
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView.IsModified = true;
                    // apiService.post("eAxisAPI", bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.API.cntcontainerupdate.Url, bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView).then(function (response) {
                    //     if (response.data.Response) {
                    //         bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.GridData[_index] = response.data.Response;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New'
                    // toastr.success("Record Updated Successfully...!");

                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer[_index] = bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.IsFormView = false;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Container.FormView = {}
                    GetContainerDetails();
                    //     }
                    // });
                }

            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        // ===================== Container End =====================
        //========================= InitJobSailing Start=====================
        function InitJobSailing() {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes = {}
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = false;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.SelectedGridRow = SelectedGridRowSailing
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewSailing = AddNewSailing
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.AddToGridSailing = AddToGridSailing;
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.gridConfig = bkgBuyerForwarderPlanningCtrl.ePage.Entities.UIJobRoutes.gridConfig;
            if (!bkgBuyerForwarderPlanningCtrl.currentBooking.isNew) {
                getJobSailing();
            } else {
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData = []
            }
        }

        function getJobSailing() {

            var _filter = {
                "EntityRefKey": bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;

                    GetJobSailingDetails();
                }
            });
        }

        function GetJobSailingDetails() {
            var _gridData = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData = undefined;
            $timeout(function () {
                if (bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("UIJobRoutes List is Empty");
                }

                bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData = _gridData;
            });
        }

        function AddNewSailing() {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView = {};
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobVoyageOrigin = [{}];
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobVoyageDestination = [{}];
            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobSailing = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = true;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.IsDeleted = false;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Add New';
        }

        function SelectedGridRowSailing($item, type) {
            if (type == 'edit')
                EditSailing($item)
            else
                DeleteConfirmationSailing($item)
        }

        function EditSailing($item) {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView = $item;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = true;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Update';
        }

        function DeleteConfirmationSailing($item) {

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteSailing($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteSailing($item) {
            if ($item.PK) {
                var _index = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                    return value.PK;
                }).indexOf($item.PK);
                if (_index === -1) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.splice($item.index, 1);
                    GetJobSailingDetails();
                } else {
                    $item.IsDeleted = true;
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes[$item.index] = $item;
                    GetJobSailingDetails();
                }
            } else {
                bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.splice($item.index, 1);
                GetJobSailingDetails();
            }
        }

        function AddToGridSailing() {
            // body...
            var _isEmpty = angular.equals({}, bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView);
            var Url;
            if (!_isEmpty) {
                var _index = bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData.map(function (value, key) {
                    return value.PK;
                }).indexOf(bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.PK);
                if (_index === -1) {
                    // Url = appConfig.Entities.JobRoutes.API.Insert.Url;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.EntitySource = "SHP";
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.EntityRefKey = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK;
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.push(bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView);
                    // toastr.success("Record Added Successfully...!");
                    GetJobSailingDetails()
                } else {
                    // Url = appConfig.Entities.JobRoutes.API.Update.Url;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.IsModified = true;
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes[_index] = bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView;
                    GetJobSailingDetails()
                }
                // apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Upsert.Url, [bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView]).then(function (response) {
                //     if (response.data.Response) {
                // toastr.success("Record Added Successfully...!");
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = false;
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView = {};
                // getJobSailing();
                //     } else {
                //         toastr.error("Save failed...");
                //     }
                // });

            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        //========================= InitJobSailing End=====================

        // =======================Packing Begin=======================

        function InitPacking() {
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package = {}
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView = {};
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.JobLocation = [];

            // bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.gridConfig = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Package.gridConfig;

            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.DeletePacking = DeletePacking;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid

            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New'


            if (!bkgBuyerForwarderPlanningCtrl.currentBooking.isNew) {
                GetPackingList();
            } else {
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.GridData = [];
            }
        }

        function GetPackingList() {
            var _filter = {
                "SHP_FK": bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackingDetails();
                }
            });
        }

        // Package Details     
        function GetPackingDetails() {
            var _gridData = [];
            bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.GridData = undefined;
            $timeout(function () {
                if (bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "OUT") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Package List is Empty");
                }

                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.GridData = _gridData;
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView = {};
            });
        }



        function SelectedGridRow($item, type) {
            if (type == 'edit') {
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update'
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView = $item
            } else {
                PackageDeleteConfirmation($item)
            }
        }

        function PackageDeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePacking($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Package
        function DeletePacking($item) {
            if ($item.PK) {
                var _index = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    return value.PK;
                }).indexOf($item.PK);
                if (_index === -1) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice($item.index, 1);
                    GetPackingDetails();
                } else {
                    $item.IsDeleted = true;
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines[$item.index] = $item;
                    GetPackingDetails();
                }
            } else {
                bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice($item.index, 1);
                GetPackingDetails();
            }
        }

        function AddToPackageGrid() {

            var _isEmpty = angular.equals(bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    return value.PK;
                }).indexOf(bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.PK);

                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.FreightMode = "OUT";
                bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.SHP_FK = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK

                if (_index === -1) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.IsDeleted = false;
                    // apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                    //     if (response.data.Response) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView);
                    GetPackingDetails();
                    //     }
                    // });

                } else {
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.IsModified = true;
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView.SHP_FK = bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.PK
                    // apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                    //     if (response.data.Response) {
                    bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
                    bkgBuyerForwarderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = bkgBuyerForwarderPlanningCtrl.ePage.Masters.Package.FormView
                    GetPackingDetails();
                    //     }
                    // });

                }
            }

        }
        // =======================Packing End=======================

        Init();
    }
})();