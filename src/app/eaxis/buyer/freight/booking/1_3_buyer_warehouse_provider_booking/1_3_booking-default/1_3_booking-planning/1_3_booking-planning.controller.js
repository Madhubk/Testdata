(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerWarehouseProviderPlanningController", bkgBuyerWarehouseProviderPlanningController);

    bkgBuyerWarehouseProviderPlanningController.$inject = ["$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "three_BookingConfig", "toastr", "confirmation", "errorWarningService"];

    function bkgBuyerWarehouseProviderPlanningController($timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, three_BookingConfig, toastr, confirmation, errorWarningService) {
        /* jshint validthis: true */
        var bkgBuyerWarehouseProviderPlanningCtrl = this;

        function Init() {
            var currentBooking;
            if (bkgBuyerWarehouseProviderPlanningCtrl.currentBooking) {
                currentBooking = bkgBuyerWarehouseProviderPlanningCtrl.currentBooking[bkgBuyerWarehouseProviderPlanningCtrl.currentBooking.label].ePage.Entities;
            } else {
                currentBooking = bkgBuyerWarehouseProviderPlanningCtrl.obj[bkgBuyerWarehouseProviderPlanningCtrl.obj.label].ePage.Entities;
            }
            bkgBuyerWarehouseProviderPlanningCtrl.currentBooking = currentBooking;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            // DatePicker
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DropDownMasterList = three_BookingConfig.Entities.Header.Meta;

            // Callback
            var _isEmpty = angular.equals({}, bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DropDownMasterList);
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

            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }
        // ===================== Container Start =====================
        function InitContainer() {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainerDelete = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container = {}
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.IsFormView = false;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.AddNewContainer = AddNewContainer;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.selectedGridRowContainer = SelectedGridRowContainer;
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.DeleteContainer = DeleteContainer;
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.DeleteConfirmation = DeleteConfirmation;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.AddToGridContainer = AddToGridContainer;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New';
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.gridConfig = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Container.gridConfig;
            if (!bkgBuyerWarehouseProviderPlanningCtrl.currentBooking.isNew) {
                GetContainerList();
            } else {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.GridData = [];
            }
        }

        function GetContainerList() {
            // Container grid list
            var _filter = [{
                "FieldName": "BookingOnlyLink",
                "value": bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK
            }];

            var _input = {
                "searchInput": _filter,
                "FilterID": bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.API.cntcontainerfindall.FilterID
            };
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.GridData = undefined;
            apiService.post("eAxisAPI", bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.API.cntcontainerfindall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response;
                    GetContainerDetails()
                }
            });
        }

        function GetContainerDetails() {
            var _gridData = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.GridData = [];
            $timeout(function () {
                if (bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.length > 0) {
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("UIJobRoutes List is Empty");
                }

                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.GridData = _gridData;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.IsFormView = false;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New';
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView = {};
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.Index = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.GridData.length;
            });
        }

        function AddNewContainer() {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.Index = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.GridData.length;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView = {};
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView.IsDeleted = false;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.IsFormView = true;
        }

        function SelectedGridRowContainer($item, type, _index) {
            if (type == 'edit') {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.SelectedIndex = _index;
                EditContainer($item, _index);
            } else
                DeleteConfirmationContainer($item, _index);
        }

        function EditContainer($item, _index) {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView = $item;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.IsFormView = true;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Update';
        }

        function DeleteConfirmationContainer($item, _index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContainer($item, _index);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Container
        function DeleteContainer($item, $index) {
            if ($item.PK) {
                $item.IsDeleted = true;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainerDelete.push($item);
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.splice($index, 1);
                GetContainerDetails();
            } else {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer.splice($index, 1);
                GetContainerDetails();
            }
        }

        function AddToGridContainer(_data, $index) {
            var _isEmpty = angular.equals({}, bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView);
            if (!_isEmpty) {
                if (bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView.PK) {
                    if ($index !== -1) {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView.IsModified = true;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer[bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.SelectedIndex] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView;

                        GetContainerDetails();
                    } else {}
                } else {
                    if ($index !== -1 && bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.AddNewAndUpdate != "Update") {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView.SHP_BookingOnlyLink = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer[$index] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView;

                        GetContainerDetails();
                    } else {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UICntContainer[bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.SelectedIndex] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Container.FormView;
                        GetContainerDetails();
                    }
                }
            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        // ===================== Container End =====================
        //========================= InitJobSailing Start=====================
        function InitJobSailing() {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutesDelete = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes = {}
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = false;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.SelectedGridRow = SelectedGridRowSailing;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewSailing = AddNewSailing;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.AddToGridSailing = AddToGridSailing;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.SelectedLookupData = SelectedLookupData;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.ShowErrorWarningModal = ShowErrorWarningModal;
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.gridConfig = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.UIJobRoutes.gridConfig;
            if (!bkgBuyerWarehouseProviderPlanningCtrl.currentBooking.isNew) {
                getJobSailing();
            } else {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData = [];
            }
        }

        function getJobSailing() {

            var _filter = {
                "EntityRefKey": bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;

                    GetJobSailingDetails();
                }
            });
        }

        function GetJobSailingDetails() {
            var _gridData = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData = undefined;
            $timeout(function () {
                if (bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("UIJobRoutes List is Empty");
                }

                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData = _gridData;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = false;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Add New';
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView = {};
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.Index = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData.length;
            });
        }

        function ValidationCall(obj) {
            // validation findall call
            var _obj = {
                ModuleName: ["VesselPlanning"],
                Code: [bkgBuyerWarehouseProviderPlanningCtrl.obj.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG"
                },
                GroupCode: "VESSEL_PLANNING",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: obj
                // ErrorCode: ["E0013"]
            };

            errorWarningService.GetErrorCodeList(_obj);
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.VesselPlanning.Entity[bkgBuyerWarehouseProviderPlanningCtrl.obj.code].GlobalErrorWarningList;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.VesselPlanning.Entity[bkgBuyerWarehouseProviderPlanningCtrl.obj.code];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

        }

        function AddNewSailing() {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.Index = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.GridData.length;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView = {};
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobVoyageOrigin = [{}];
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobVoyageDestination = [{}];
            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobSailing = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = true;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.IsDeleted = false;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Add New';
            ValidationCall(bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView);
        }

        function SelectedLookupData(item, model) {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView[model] = item.Code;
            OnFieldValueChange();
        }

        function SelectedGridRowSailing($item, type, _index) {
            if (type == 'edit') {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.SelectedIndex = _index;
                EditSailing($item);
            } else
                DeleteConfirmationSailing($item, _index);
        }

        function EditSailing($item) {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView = $item;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.IsFormView = true;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Update';
            ValidationCall(bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView);
        }

        function DeleteConfirmationSailing($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteSailing($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteSailing($item, $index) {
            if ($item.PK) {
                $item.IsDeleted = true;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutesDelete.push($item);
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.splice($index, 1);
                GetJobSailingDetails();
            } else {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes.splice($index, 1);
                GetJobSailingDetails();
            }
        }

        function AddToGridSailing($index) {
            var _obj = {
                ModuleName: ["VesselPlanning"],
                Code: [bkgBuyerWarehouseProviderPlanningCtrl.obj.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG",
                    // Code: "E0013"
                },
                GroupCode: "VESSEL_PLANNING",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.VesselPlanning.Entity[bkgBuyerWarehouseProviderPlanningCtrl.obj.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.ShowErrorWarningModal(bkgBuyerWarehouseProviderPlanningCtrl.obj);
                } else {
                    SaveOnly($index);
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.code).toggleClass("open");
        }

        function OnFieldValueChange() {
            var _obj = {
                ModuleName: ["VesselPlanning"],
                Code: [bkgBuyerWarehouseProviderPlanningCtrl.obj.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG",
                    // Code: "E0013"
                },
                GroupCode: "VESSEL_PLANNING",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function SaveOnly($index) {
            var _isEmpty = angular.equals({}, bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView);
            if (!_isEmpty) {
                if (bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.PK) {
                    if ($index !== -1) {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.IsModified = true;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes[bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.SelectedIndex] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView;

                        GetJobSailingDetails();
                    } else {}
                } else {
                    if ($index !== -1 && bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate != "Update") {
                        // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.SHP_BookingOnlyLink = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes[$index] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView;

                        GetJobSailingDetails();
                    } else {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.EntitySource = "SHP";
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView.EntityRefKey = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobRoutes[bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.SelectedIndex] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.UIJobRoutes.FormView;
                        GetJobSailingDetails();
                    }
                }
            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        //========================= InitJobSailing End=====================

        // =======================Packing Begin=======================

        function InitPacking() {
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLinesDelete = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package = {}
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView = {};
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.JobLocation = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.Index = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.length;

            // bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.gridConfig = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Package.gridConfig;

            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.DeletePacking = DeletePacking;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow;
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid;

            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';


            if (!bkgBuyerWarehouseProviderPlanningCtrl.currentBooking.isNew) {
                GetPackingList();
            } else {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.GridData = [];
            }
        }

        function GetPackingList() {
            var _filter = {
                "SHP_FK": bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackingDetails();
                }
            });
        }

        // Package Details     
        function GetPackingDetails() {
            var _gridData = [];
            bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.GridData = undefined;
            $timeout(function () {
                if (bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "OUT") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Package List is Empty");
                }

                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.GridData = _gridData;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView = {};
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.Index = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.length;
            });
        }

        function SelectedGridRow($item, type, $index) {
            if (type == 'edit') {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.SelectedIndex = $index;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update';
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView = $item;
            } else {
                PackageDeleteConfirmation($item, $index)
            }
        }

        function PackageDeleteConfirmation($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePacking($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Package
        function DeletePacking($item, $index) {
            if ($item.PK) {
                $item.IsDeleted = true;
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLinesDelete.push($item);
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice($index, 1);
                GetPackingDetails();

            } else {
                bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice($index, 1);
                GetPackingDetails();
            }
        }

        function AddToPackageGrid($index) {
            var _isEmpty = angular.equals(bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView, {});
            if (!_isEmpty) {
                if (bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.PK && bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate == "Update") {
                    if ($index !== -1) {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.IsModified = true;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.IsDeleted = false;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines[bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.SelectedIndex] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView;

                        GetPackingDetails();
                    } else {}
                } else {
                    if ($index !== -1 && bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.AddNewAndUpdate != "Update") {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.FreightMode = "OUT";
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.SHP_FK = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.PK;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView.IsDeleted = false;
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines[$index] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView;

                        GetPackingDetails();
                    } else {
                        bkgBuyerWarehouseProviderPlanningCtrl.ePage.Entities.Header.Data.UIJobPackLines[bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.SelectedIndex] = bkgBuyerWarehouseProviderPlanningCtrl.ePage.Masters.Package.FormView;

                        GetPackingDetails();
                    }

                }
            } else {
                toastr.warning("Please fill the Details..");
            }
        }

        // =======================Packing End=======================

        Init();
    }
})();