(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingPlanningController", BookingPlanningController);

    BookingPlanningController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal"];

    function BookingPlanningController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal) {
        /* jshint validthis: true */
        var BookingPlanningCtrl = this;

        function Init() {
            var currentBooking = BookingPlanningCtrl.currentBooking[BookingPlanningCtrl.currentBooking.label].ePage.Entities;
            BookingPlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            // DatePicker
            BookingPlanningCtrl.ePage.Masters.DatePicker = {};
            BookingPlanningCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BookingPlanningCtrl.ePage.Masters.DatePicker.isOpen = [];
            BookingPlanningCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            BookingPlanningCtrl.ePage.Masters.DropDownMasterList = BookingConfig.Entities.Header.Meta;

            // Callback
            var _isEmpty = angular.equals({}, BookingPlanningCtrl.ePage.Masters.DropDownMasterList);
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

            BookingPlanningCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "VOLUMEUNIT"];
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
                        BookingPlanningCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BookingPlanningCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    BookingPlanningCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    BookingPlanningCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });

        }


        // ===================== Container Start =====================

        function InitContainer() {
            BookingPlanningCtrl.ePage.Masters.Container = {}
            BookingPlanningCtrl.ePage.Masters.Container.IsFormView = false;
            BookingPlanningCtrl.ePage.Masters.Container.AddNewContainer = AddNewContainer;
            BookingPlanningCtrl.ePage.Masters.Container.selectedGridRowContainer = SelectedGridRowContainer;
            // BookingPlanningCtrl.ePage.Masters.Container.DeleteContainer = DeleteContainer;
            // BookingPlanningCtrl.ePage.Masters.Container.DeleteConfirmation = DeleteConfirmation;
            BookingPlanningCtrl.ePage.Masters.Container.AddToGridContainer = AddToGridContainer;
            BookingPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New'
            // BookingPlanningCtrl.ePage.Masters.Container.gridConfig = BookingPlanningCtrl.ePage.Entities.Container.gridConfig;
            if (!BookingPlanningCtrl.currentBooking.isNew) {
                GetContainerList();
            } else {
                BookingPlanningCtrl.ePage.Masters.Container.GridData = [];
            }
        }

        function GetContainerList() {
            // Container grid list
            var _filter = [{
                "FieldName": "BookingOnlyLink",
                "value": BookingPlanningCtrl.ePage.Entities.Header.Data.PK
            }];

            var _input = {
                "searchInput": _filter,
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID
            };
            BookingPlanningCtrl.ePage.Masters.Container.GridData = undefined;
            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingPlanningCtrl.ePage.Masters.Container.GridData = response.data.Response;
                }
            });
        }

        function AddNewContainer() {
            BookingPlanningCtrl.ePage.Masters.Container.FormView = {};
            BookingPlanningCtrl.ePage.Masters.Container.IsFormView = true;
        }

        function SelectedGridRowContainer($item, type) {
            if (type == 'edit')
                EditContainer($item)
            else
                DeleteConfirmationContainer($item)
        }

        function EditContainer($item) {
            BookingPlanningCtrl.ePage.Masters.Container.FormView = $item;
            BookingPlanningCtrl.ePage.Masters.Container.IsFormView = true;
            BookingPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Update';
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

            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.Delete.Url + $item.data.PK).then(function (response) {
                if (response.data.Response) {
                    BookingPlanningCtrl.ePage.Masters.Container.GridData.splice($item.index, 1);
                    toastr.success("Record Deleted Successfully...!");
                }
            });

        }

        function AddToGridContainer() {
            var _isEmpty = angular.equals({}, BookingPlanningCtrl.ePage.Masters.Container.FormView);

            if (!_isEmpty) {
                var _index = BookingPlanningCtrl.ePage.Masters.Container.GridData.map(function (value, key) {
                    return value.PK;
                }).indexOf(BookingPlanningCtrl.ePage.Masters.Container.FormView.PK);

                if (_index === -1) {
                    BookingPlanningCtrl.ePage.Masters.Container.FormView.SHP_BookingOnlyLink = BookingPlanningCtrl.ePage.Entities.Header.Data.PK;
                    apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.Insert.Url, [BookingPlanningCtrl.ePage.Masters.Container.FormView]).then(function (response) {
                        if (response.data.Response) {
                            BookingPlanningCtrl.ePage.Masters.Container.GridData.push(response.data.Response[0]);
                            toastr.success("Record Added Successfully...!");
                            BookingPlanningCtrl.ePage.Masters.Container.IsFormView = false;
                            BookingPlanningCtrl.ePage.Masters.Container.FormView = {}
                        }
                    });

                } else {
                    BookingPlanningCtrl.ePage.Masters.Container.FormView.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.Update.Url, BookingPlanningCtrl.ePage.Masters.Container.FormView).then(function (response) {
                        if (response.data.Response) {
                            BookingPlanningCtrl.ePage.Masters.Container.GridData[_index] = response.data.Response;
                            BookingPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New'
                            toastr.success("Record Updated Successfully...!");
                            BookingPlanningCtrl.ePage.Masters.Container.IsFormView = false;
                            BookingPlanningCtrl.ePage.Masters.Container.FormView = {}
                        }
                    });
                }

            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        // ===================== Container End =====================
        //========================= InitJobSailing Start=====================
        function InitJobSailing() {
            BookingPlanningCtrl.ePage.Masters.JobSailing = {}
            BookingPlanningCtrl.ePage.Masters.JobSailing.IsFormView = false;
            BookingPlanningCtrl.ePage.Masters.JobSailing.SelectedGridRow = SelectedGridRowSailing
            BookingPlanningCtrl.ePage.Masters.JobSailing.AddNewSailing = AddNewSailing
            BookingPlanningCtrl.ePage.Masters.JobSailing.AddToGridSailing = AddToGridSailing;
            // BookingPlanningCtrl.ePage.Masters.JobSailing.gridConfig = BookingPlanningCtrl.ePage.Entities.JobSailing.gridConfig;
            if (!BookingPlanningCtrl.currentBooking.isNew) {
                getJobSailing();
            } else {
                BookingPlanningCtrl.ePage.Masters.JobSailing.GridData = []
            }
        }

        function getJobSailing() {

            var _filter = {
                "EntityRefKey": BookingPlanningCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobSailing = response.data.Response;

                    GetJobSailingDetails();
                }
            });
        }

        function GetJobSailingDetails() {
            var _gridData = [];
            BookingPlanningCtrl.ePage.Masters.JobSailing.GridData = undefined;
            $timeout(function () {
                if (BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobSailing.length > 0) {
                    BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobSailing.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("JobSailing List is Empty");
                }

                BookingPlanningCtrl.ePage.Masters.JobSailing.GridData = _gridData;
            });
        }

        function AddNewSailing() {
            BookingPlanningCtrl.ePage.Masters.JobSailing.FormView = {};
            // BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.UIJobVoyageOrigin = [{}];
            // BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.UIJobVoyageDestination = [{}];
            // BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.UIJobSailing = [];
            BookingPlanningCtrl.ePage.Masters.JobSailing.IsFormView = true;
            BookingPlanningCtrl.ePage.Masters.JobSailing.AddNewAndUpdate = 'Add New';
        }

        function SelectedGridRowSailing($item, type) {
            if (type == 'edit')
                EditSailing($item)
            else
                DeleteConfirmationSailing($item)
        }

        function EditSailing($item) {
            BookingPlanningCtrl.ePage.Masters.JobSailing.FormView = $item;
            BookingPlanningCtrl.ePage.Masters.JobSailing.IsFormView = true;
            BookingPlanningCtrl.ePage.Masters.JobSailing.AddNewAndUpdate = 'Update';
        }

        function DeleteConfirmationSailing($item) {

            alert('Need Clarification')
            // var modalOptions = {
            //     closeButtonText: 'Cancel',
            //     actionButtonText: 'Ok',
            //     headerText: 'Delete?',
            //     bodyText: 'Are you sure?'
            // };

            // confirmation.showModal({}, modalOptions)
            //     .then(function (result) {
            //         DeleteSailing($item);
            //     }, function () {
            //         console.log("Cancelled");
            //     });
        }

        // function DeleteSailing($item){

        // }

        function AddToGridSailing() {
            // body...
            var _isEmpty = angular.equals({}, BookingPlanningCtrl.ePage.Masters.JobSailing.FormView);

            if (!_isEmpty) {
                var _index = BookingPlanningCtrl.ePage.Masters.JobSailing.GridData.map(function (value, key) {
                    return value.PK;
                }).indexOf(BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.PK);
                var _input = {}
                if (_index === -1) {
                    _input = {
                        "LCLCutOff": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.CargoCutOffDate,
                        "LCLReceivalCommences": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.BookingCutOffDate,
                        "EntitySource": "SHP",
                        "SourceRefKey": BookingPlanningCtrl.ePage.Entities.Header.Data.PK
                    };


                } else {
                    _input.PK = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.JBS_FK
                    _input.LCLCutOff = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.CargoCutOffDate
                    _input.LCLReceivalCommences = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.BookingCutOffDate
                    _input.EntitySource = "SHP"
                    _input.SourceRefKey = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.EntityRefKey
                    _input.IsModified = true;

                }
                apiService.post('eAxisAPI', appConfig.Entities.SailingDetails.API.ListUpsert.Url, [_input]).then(function (response) {
                    if (response.data) {
                        JobRoutes(response.data.Response[0], _index);
                    } else {
                        toastr.error("Save failed...");
                    }
                });

            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        function JobRoutes(obj, _index) {
            var _input = {}
            var url = ""
            if (_index === -1) {
                _input = [{
                    "Vessel": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.Vessel,
                    "VoyageFlight": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.VoyageFlight,
                    "LoadPort": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.LoadPort,
                    "DischargePort": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.DischargePort,
                    "ETD": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.ETD,
                    "ETA": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.ETA,
                    "JBS_FK": obj.PK,
                    "CarrierOrg_FK ": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.CarrierOrg_FK,
                    "CarrierOrg_Code": BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.CarrierOrg_Code,
                    "EntitySource": "SHP",
                    "EntityRefKey": obj.SourceRefKey
                }];
                url = appConfig.Entities.JobRoutes.API.Insert.Url
            } else {
                _input.Vessel = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.Vessel
                _input.VoyageFlight = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.VoyageFlight
                _input.LoadPort = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.LoadPort
                _input.DischargePort = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.DischargePort
                _input.ETD = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.ETD
                _input.ETA = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.ETA
                _input.JBS_FK = obj.PK
                _input.CarrierOrg_FK = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.CarrierOrg_FK
                _input.CarrierOrg_Code = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.CarrierOrg_Code
                _input.EntityRefKey = obj.SourceRefKey
                _input.EntitySource = "SHP"
                _input.IsModified = true;
                _input.PK = BookingPlanningCtrl.ePage.Masters.JobSailing.FormView.PK
                url = appConfig.Entities.JobRoutes.API.Update.Url
            }
            apiService.post('eAxisAPI', url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Record Added Successfully...!");
                    BookingPlanningCtrl.ePage.Masters.JobSailing.IsFormView = false;
                    BookingPlanningCtrl.ePage.Masters.JobSailing.FormView = {}
                    getJobSailing();
                }
            });
        }
        //========================= InitJobSailing End=====================

        // =======================Packing Begin=======================

        function InitPacking() {
            BookingPlanningCtrl.ePage.Masters.Package = {}
            BookingPlanningCtrl.ePage.Masters.Package.FormView = {};
            BookingPlanningCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            BookingPlanningCtrl.ePage.Masters.Package.FormView.JobLocation = [];

            // BookingPlanningCtrl.ePage.Masters.Package.gridConfig = BookingPlanningCtrl.ePage.Entities.Package.gridConfig;

            BookingPlanningCtrl.ePage.Masters.Package.DeletePacking = DeletePacking;
            BookingPlanningCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            BookingPlanningCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow
            BookingPlanningCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid

            BookingPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New'


            if (!BookingPlanningCtrl.currentBooking.isNew) {
                GetPackingList();
            } else {
                BookingPlanningCtrl.ePage.Masters.Package.GridData = [];
            }
        }

        function GetPackingList() {
            var _filter = {
                "SHP_FK": BookingPlanningCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackingDetails();
                }
            });
        }

        // Package Details     
        function GetPackingDetails() {
            var _gridData = [];
            BookingPlanningCtrl.ePage.Masters.Package.GridData = undefined;
            $timeout(function () {
                if (BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "OUT") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Package List is Empty");
                }

                BookingPlanningCtrl.ePage.Masters.Package.GridData = _gridData;
                BookingPlanningCtrl.ePage.Masters.Package.FormView = {};
            });
        }



        function SelectedGridRow($item, type) {
            if (type == 'edit') {
                BookingPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update'
                BookingPlanningCtrl.ePage.Masters.Package.FormView = $item
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
            if ($item.index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.JobPackLines.API.Delete.Url + $item.data.PK).then(function (response) {
                    if (response.data.Response) {
                        BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice($item.index, 1);
                        GetPackingDetails();
                    }
                });
            }
        }

        function AddToPackageGrid() {

            var _isEmpty = angular.equals(BookingPlanningCtrl.ePage.Masters.Package.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    return value.PK;
                }).indexOf(BookingPlanningCtrl.ePage.Masters.Package.FormView.PK);

                BookingPlanningCtrl.ePage.Masters.Package.FormView.FreightMode = "OUT";
                BookingPlanningCtrl.ePage.Masters.Package.FormView.SHP_FK = BookingPlanningCtrl.ePage.Entities.Header.Data.PK

                if (_index === -1) {
                    BookingPlanningCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [BookingPlanningCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(response.data.Response[0]);
                            GetPackingDetails();
                        }
                    });

                } else {
                    BookingPlanningCtrl.ePage.Masters.Package.FormView.IsModified = true;
                    BookingPlanningCtrl.ePage.Masters.Package.FormView.SHP_FK = BookingPlanningCtrl.ePage.Entities.Header.Data.PK
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [BookingPlanningCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            BookingPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
                            BookingPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = response.data.Response[0]
                            GetPackingDetails();
                        }
                    });

                }
            }

        }

        // =======================Packing End=======================

        Init();
    }
})();