(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmCarrierController", ConfirmCarrierController);

    ConfirmCarrierController.$inject = ["$window", "$timeout", "$injector", "APP_CONSTANT", "helperService", "apiService", "authService", "appConfig", "myTaskActivityConfig", "dynamicLookupConfig", "toastr", "errorWarningService"];

    function ConfirmCarrierController($window, $timeout, $injector, APP_CONSTANT, helperService, apiService, authService, appConfig, myTaskActivityConfig, dynamicLookupConfig, toastr, errorWarningService) {
        var ConfirmCarrierCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ConfirmCarrierCtrl.ePage = {
                "Title": "",
                "Prefix": "Verify Booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }
            };

            ConfirmCarrierCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmCarrierCtrl.taskObj) {
                ConfirmCarrierCtrl.ePage.Masters.TaskObj = ConfirmCarrierCtrl.taskObj;
                GetEntityObj();
            } else {
                ConfirmCarrierCtrl.ePage.Masters.currentShipment = myTaskActivityConfig.Entities.Shipment;
                ConfirmCarrierCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                //getRoutingProperties();
                GetRelatedLookupList();
                InitJobSailing();
            }

        }


        function GetEntityObj() {
            if (ConfirmCarrierCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ConfirmCarrierCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmCarrierCtrl.ePage.Entities.Header.Data = response.data.Response;
                        OrderGetById(ConfirmCarrierCtrl.ePage.Entities.Header.Data.PK)
                    }
                });
            }
        }

        function OrderGetById(_bookingPk) {
            var _filter = {
                "SHP_FK": _bookingPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ConfirmCarrierCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    } else {
                        ConfirmCarrierCtrl.ePage.Masters.OrderDetails = []
                    }
                } else {
                    ConfirmCarrierCtrl.ePage.Masters.OrderDetails = []
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "BP_ShpCarrierOrg_12962,BP_OrdPlannedVessel_13185,BP_OrdListPortOfLoading_13087,BP_PortOfDischarge_13077",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        //========================= InitJobSailing Start=====================
        function InitJobSailing() {
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes = {}
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView = {};
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.IsFormView = false;
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.SelectedGridRow = SelectedGridRowSailing
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.AddNewSailing = AddNewSailing
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.AddToGridSailing = AddToGridSailing;
            ConfirmCarrierCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            // DatePicker
            ConfirmCarrierCtrl.ePage.Masters.DatePicker = {};
            ConfirmCarrierCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConfirmCarrierCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConfirmCarrierCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConfirmCarrierCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConfirmCarrierCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            getJobSailing();
            ValidationCall(ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView);
        }

        function ValidationCall(obj) {
            // validation findall call
            var _obj = {
                ModuleName: ["VesselPlanning"],
                Code: [ConfirmCarrierCtrl.ePage.Masters.currentShipment.code],
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
            ConfirmCarrierCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.VesselPlanning.Entity[ConfirmCarrierCtrl.ePage.Masters.currentShipment.code].GlobalErrorWarningList;
            ConfirmCarrierCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.VesselPlanning.Entity[ConfirmCarrierCtrl.ePage.Masters.currentShipment.code];
            ConfirmCarrierCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConfirmCarrierCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getJobSailing() {

            var _filter = {
                "EntityRefKey": ConfirmCarrierCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConfirmCarrierCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;

                    GetJobSailingDetails();
                }
            });
        }

        function GetJobSailingDetails() {
            var _gridData = [];
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.GridData = undefined;
            $timeout(function () {
                if (ConfirmCarrierCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                    ConfirmCarrierCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("UIJobRoutes List is Empty");
                }

                ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.GridData = _gridData;
            });
        }

        function AddNewSailing() {
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView = {};
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.DischargePort = ConfirmCarrierCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge;
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.LoadPort = ConfirmCarrierCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading;
            // ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobVoyageOrigin = [{}];
            // ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobVoyageDestination = [{}];
            // ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.UIJobSailing = [];
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.IsFormView = true;
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Add New';
        }

        function SelectedGridRowSailing($item, type) {
            if (type == 'edit')
                EditSailing($item)
            else
                DeleteConfirmationSailing($item)
        }

        function SelectedLookupData(item, model) {
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView[model] = item.Code;
            OnFieldValueChange();
        }

        function EditSailing($item) {
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView = $item;
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.IsFormView = true;
            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.AddNewAndUpdate = 'Update';
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

            var _obj = {
                ModuleName: ["VesselPlanning"],
                Code: [ConfirmCarrierCtrl.ePage.Masters.currentShipment.code],
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
                EntityObject: ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.VesselPlanning.Entity[ConfirmCarrierCtrl.ePage.Masters.currentShipment.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    ConfirmCarrierCtrl.ePage.Masters.ShowErrorWarningModal(ConfirmCarrierCtrl.ePage.Masters.currentShipment);
                } else {
                    // body...
                    var _isEmpty = angular.equals({}, ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView);
                    var Url;
                    if (!_isEmpty) {
                        var _index = ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.GridData.map(function (value, key) {
                            return value.PK;
                        }).indexOf(ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.PK);
                        if (_index === -1) {
                            // Url = appConfig.Entities.JobRoutes.API.Insert.Url;
                            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.EntitySource = "SHP";
                            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.EntityRefKey = ConfirmCarrierCtrl.ePage.Entities.Header.Data.PK;
                        } else {
                            // Url = appConfig.Entities.JobRoutes.API.Update.Url;
                            ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView.IsModified = true;

                        }
                        apiService.post('eAxisAPI', appConfig.Entities.JobRoutes.API.Upsert.Url, [ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView]).then(function (response) {
                            if (response.data.Response) {
                                toastr.success("Record Added Successfully...!");
                                ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.IsFormView = false;
                                ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView = {};
                                getJobSailing();
                            } else {
                                toastr.error("Save failed...");
                            }
                        });

                    } else {
                        toastr.warning("Data Should not be Empty...!");
                    }
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.code).toggleClass("open");
        }

        function OnFieldValueChange() {
            var _obj = {
                ModuleName: ["VesselPlanning"],
                Code: [ConfirmCarrierCtrl.ePage.Masters.currentShipment.code],
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
                EntityObject: ConfirmCarrierCtrl.ePage.Masters.UIJobRoutes.FormView,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
        }

        //========================= InitJobSailing End=====================

        Init();
    }
})();