(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DMSManifestMenuController", DMSManifestMenuController);

    DMSManifestMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "dmsManifestConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$compile", "$filter", "createmanifestConfig", "errorWarningService"];

    function DMSManifestMenuController($scope, $timeout, APP_CONSTANT, apiService, dmsManifestConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $compile, $filter, createmanifestConfig, errorWarningService) {

        var DMSManifestMenuCtrl = this

        function Init() {

            var currentManifest = DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities;

            DMSManifestMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest
            };
            // validation
            DMSManifestMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            if (errorWarningService.Modules.Manifest) {
                $timeout(function () {
                    DMSManifestMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Manifest.Entity[DMSManifestMenuCtrl.currentManifest.code];
                });
            }
            // Menu list from configuration
            DMSManifestMenuCtrl.ePage.Masters.ManifestMenu = {};
            DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            // show or hide footer from another page
            DMSManifestMenuCtrl.ePage.Masters.isShowFooter = DMSManifestMenuCtrl.isShowFooter;
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.isShowFooter = DMSManifestMenuCtrl.isShowFooter;
            // for add pickup and delivery menu
            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickupDeliveryList = true;
            }

            $timeout(function () {
                GetDesign(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value, 0, "MainMenu");
            }, 2000);

            DMSManifestMenuCtrl.ePage.Masters.MyTask = {};
            // footer button text
            DMSManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DMSManifestMenuCtrl.ePage.Masters.ConfirmText = "Confirm Manifest";
            DMSManifestMenuCtrl.ePage.Masters.RejectButtonText = "Reject Manifest";
            DMSManifestMenuCtrl.ePage.Masters.ApproveText = "Approve Manifest";
            DMSManifestMenuCtrl.ePage.Masters.TransportText = "Confirm Transport";
            DMSManifestMenuCtrl.ePage.Masters.CompleteText = "Confirm Verify & Delivery";
            DMSManifestMenuCtrl.ePage.Masters.ConfirmDockText = "Confirm Dock";
            DMSManifestMenuCtrl.ePage.Masters.StartLoadText = "Start Load";
            DMSManifestMenuCtrl.ePage.Masters.CompleteLoadText = "Complete Load";
            DMSManifestMenuCtrl.ePage.Masters.DockoutText = "Dock Out";
            DMSManifestMenuCtrl.ePage.Masters.GateoutText = "Gate Out";
            DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheetText = "Generate DRS"
            DMSManifestMenuCtrl.ePage.Masters.CreateManifestText = "Attach Consignment";
            DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicleText = "Confirm Vehicle";
            DMSManifestMenuCtrl.ePage.Masters.ConfirmPickupText = "Confirm Pickup";
            DMSManifestMenuCtrl.ePage.Masters.ConfirmDeliveryText = "Confirm Delivery";

            DMSManifestMenuCtrl.ePage.Masters.Validation = Validation;
            DMSManifestMenuCtrl.ePage.Masters.getMenu = getMenu;
            DMSManifestMenuCtrl.ePage.Masters.getSubMenu = getSubMenu;
            DMSManifestMenuCtrl.ePage.Masters.GetDesign = GetDesign;
            DMSManifestMenuCtrl.ePage.Masters.GetMenuBasedOnSender = GetMenuBasedOnSender;
            DMSManifestMenuCtrl.ePage.Masters.GetPickupDeliveryDetails = GetPickupDeliveryDetails;
            DMSManifestMenuCtrl.ePage.Masters.OnToggleFilterClick = OnToggleFilterClick;
            DMSManifestMenuCtrl.ePage.Masters.ChangeManifestValues = ChangeManifestValues;

            if ($state.current.url == "/manifest-list") {
                DMSManifestMenuCtrl.ePage.Masters.Config = dmsManifestConfig;
            } else if ($state.current.url == "/create-manifest") {
                DMSManifestMenuCtrl.ePage.Masters.Config = createmanifestConfig;
            } else {
                DMSManifestMenuCtrl.ePage.Masters.Config = dmsManifestConfig;
            }
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsToggleFilter = true;
            getProcessDetails();
            getManifestSenderDetails();
        }

        function getManifestSenderDetails() {
            var _filter = {
                "PK": DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DMSManifestMenuCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.FilterID
            };

            apiService.post("eAxisAPI", DMSManifestMenuCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient = response.data.Response[0].Code;
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsWarehouseClient = true;
                    GetMenuBasedOnSender();
                }
            });
        }

        function ChangeManifestValues() {
            // DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode = DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList[0].VehicleType;
            DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleNo = DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList[0].VehicleNo;
            DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.DriveName = DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList[0].DriverName;
            DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.DriverContactNo = DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList[0].DriverContactNo;
        }

        function getProcessDetails() {
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                EntityRefKey: DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                KeyReference: DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DMSManifestMenuCtrl.ePage.Masters.ProcessDetails = response.data.Response[0];
                }
            });
        }

        function getMenu() {
            // main menu footer button manipulation
            var isError;
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
            if (DMSManifestMenuCtrl.ePage.Masters.Confirm) {
                DMSManifestMenuCtrl.ePage.Masters.ConfirmText = "Please Wait..";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SubmittedDateTime = new Date();
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus = "Approved";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime = new Date();
            }
            if (DMSManifestMenuCtrl.ePage.Masters.Reject) {
                DMSManifestMenuCtrl.ePage.Masters.RejectButtonText = "Please Wait..";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus = "Rejected";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime = new Date();
            }
            if (DMSManifestMenuCtrl.ePage.Masters.Approve) {
                DMSManifestMenuCtrl.ePage.Masters.ApproveText = "Please Wait..";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus = "Approved";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime = new Date();
            }
            if (DMSManifestMenuCtrl.ePage.Masters.Transport) {
                DMSManifestMenuCtrl.ePage.Masters.TransportText = "Please Wait..";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportBookedDateTime = new Date();
            }
            if (DMSManifestMenuCtrl.ePage.Masters.Complete) {
                DMSManifestMenuCtrl.ePage.Masters.CompleteText = "Please Wait..";
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestCompleteDatetime = new Date();
            }
            if (DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup) {
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Sender_ORG_FK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].ORG_FK })
                angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment, function (value, key) {
                    if (!value.TMC_ActualPickupDateTime)
                        isError = true;
                });
            }
            if (DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery) {
                DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Receiver_ORG_FK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].ORG_FK })
                angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment, function (value, key) {
                    if (!value.TMC_ActualDeliveryDateTime)
                        isError = true;
                });
            }
            if (!isError) {
                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = true;
                if (DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup) {
                    DMSManifestMenuCtrl.ePage.Masters.ConfirmPickupText = "Please Wait..";
                }
                if (DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery) {
                    DMSManifestMenuCtrl.ePage.Masters.ConfirmDeliveryText = "Please Wait..";
                }
                var item = filterObjectUpdate(DMSManifestMenuCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", DMSManifestMenuCtrl.ePage.Entities.Header.API.UpdateManifest.Url, DMSManifestMenuCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            DMSManifestMenuCtrl.ePage.Entities.Header.Data = response.data.Response;
                            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallMenuFunction = true;

                            if (DMSManifestMenuCtrl.ePage.Masters.Confirm) {
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmText = "Confirm Manifest";
                                toastr.success("Manifest Confirmed Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.Confirm = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup) {
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmPickupText = "Confirm Pickup";
                                toastr.success("Pickup Confirmed Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup = false;

                                // for pickup and delivery menu
                                var res = DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");
                                if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickup = true;
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = false;
                                } else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = true;
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickup = false;
                                }
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery) {
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmDeliveryText = "Confirm Delivery";
                                toastr.success("Delivery Confirmed Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery = false;
                                // for pickup and delivery menu
                                var res = DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");
                                if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickup = true;
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = false;
                                } else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = true;
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickup = false;
                                }
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.Reject) {
                                DMSManifestMenuCtrl.ePage.Masters.RejectButtonText = "Reject Manifest";
                                toastr.success("Manifest Rejected Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.Reject = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.Approve) {
                                DMSManifestMenuCtrl.ePage.Masters.ApproveText = "Approve Manifest";
                                toastr.success("Manifest Approved Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.Approve = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.Transport) {
                                DMSManifestMenuCtrl.ePage.Masters.TransportText = "Confirm Transport";
                                toastr.success("Transport Booked Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.Transport = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.Complete) {
                                DMSManifestMenuCtrl.ePage.Masters.CompleteText = "Confirm Verify & Delivery";
                                toastr.success("Manifest Completed Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.Complete = false;
                            }
                            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                        });
                    } else {
                        DMSManifestMenuCtrl.ePage.Masters.Confirm = false;
                        DMSManifestMenuCtrl.ePage.Masters.Reject = false;
                        DMSManifestMenuCtrl.ePage.Masters.Approve = false;
                        DMSManifestMenuCtrl.ePage.Masters.Transport = false;
                        DMSManifestMenuCtrl.ePage.Masters.Complete = false;
                        DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup = false;
                        DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery = false;

                        DMSManifestMenuCtrl.ePage.Masters.ConfirmText = "Confirm Manifest";
                        DMSManifestMenuCtrl.ePage.Masters.RejectButtonText = "Reject Manifest";
                        DMSManifestMenuCtrl.ePage.Masters.ApproveText = "Approve Manifest";
                        DMSManifestMenuCtrl.ePage.Masters.TransportText = "Confirm Transport";
                        DMSManifestMenuCtrl.ePage.Masters.CompleteText = "Confirm Verify & Delivery";
                        DMSManifestMenuCtrl.ePage.Masters.ConfirmPickupText = "Confirm Pickup";
                        DMSManifestMenuCtrl.ePage.Masters.ConfirmDeliveryText = "Confirm Delivery";
                        DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                    }
                });
            } else {
                if (DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup) {
                    var _obj = {
                        ModuleName: ["Manifest"],
                        Code: [DMSManifestMenuCtrl.currentManifest.code],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "MAN"
                        },
                        EntityObject: DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data,
                        ErrorCode: ["E3540"]
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                // DMSManifestMenuCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Manifest', DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber, DMSManifestMenuCtrl.ePage.Entities.Header.Data.ActualPickupDate, 'E3540', true);
                if (DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery) {
                    var _obj = {
                        ModuleName: ["Manifest"],
                        Code: [DMSManifestMenuCtrl.currentManifest.code],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "MAN"
                        },
                        EntityObject: DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data,
                        ErrorCode: ["E3541"]
                    };
                    errorWarningService.ValidateValue(_obj);
                    // DMSManifestMenuCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Manifest', DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber, DMSManifestMenuCtrl.ePage.Entities.Header.Data.ActualDeliveryDate, 'E3541', true);
                }
                DMSManifestMenuCtrl.ePage.Masters.ConfirmPickup = false;
                DMSManifestMenuCtrl.ePage.Masters.ConfirmDelivery = false;
                DMSManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSManifestMenuCtrl.currentManifest);
                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
            }
        }

        function getSubMenu() {
            var isError;
            // Sub menu footer button manipulation
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
            DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].JobFK })
            if (DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicle) {
                DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicleText = "Please Wait..";
                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length == 0) {
                    isError = true;
                }
            }
            if (DMSManifestMenuCtrl.ePage.Masters.DockIn) {
                DMSManifestMenuCtrl.ePage.Masters.ConfirmDockText = "Please Wait..";
                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockinTime = new Date();
                }
            }
            if (DMSManifestMenuCtrl.ePage.Masters.StartLoad) {
                DMSManifestMenuCtrl.ePage.Masters.StartLoadText = "Please Wait..";
                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadStartTime = new Date();
                }
            }
            if (DMSManifestMenuCtrl.ePage.Masters.CompleteLoad) {
                DMSManifestMenuCtrl.ePage.Masters.CompleteLoadText = "Please Wait..";
                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadEndTime = new Date();
                }
            }
            if (DMSManifestMenuCtrl.ePage.Masters.Dockout) {
                DMSManifestMenuCtrl.ePage.Masters.DockoutText = "Please Wait..";
                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockoutTime = new Date();
                }
            }

            if (DMSManifestMenuCtrl.ePage.Masters.Gateout) {
                var res = DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");
                if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Sender_ORG_FK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].ORG_FK })
                    angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment, function (value, key) {
                        if (!value.TMC_ActualPickupDateTime)
                            isError = true;
                    });
                }
                else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Receiver_ORG_FK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].ORG_FK })
                }
            }
            if (!isError) {
                if (DMSManifestMenuCtrl.ePage.Masters.Gateout) {
                    DMSManifestMenuCtrl.ePage.Masters.GateoutText = "Please Wait..";
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                        DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].GateoutTime = new Date();
                    }
                }
                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = true;
                var item = filterObjectUpdate(DMSManifestMenuCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", DMSManifestMenuCtrl.ePage.Entities.Header.API.UpdateManifest.Url, DMSManifestMenuCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            DMSManifestMenuCtrl.ePage.Entities.Header.Data = response.data.Response;
                            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                            // $timeout(function () {
                            if (!DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheet) {
                                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallSubMenuFunction = true;
                            }
                            // }, 1000);
                            if (DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicle) {
                                toastr.success("Gatepass Attached Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicleText = "Confirm Vehicle";
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicle = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.DockIn) {
                                DMSManifestMenuCtrl.ePage.Masters.ConfirmDockText = "Confirm Dock";
                                toastr.success("Docked In Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.DockIn = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.StartLoad) {
                                toastr.success("Load Started Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.StartLoadText = "Start Load";
                                DMSManifestMenuCtrl.ePage.Masters.StartLoad = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.CompleteLoad) {
                                toastr.success("Load Completed Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.CompleteLoadText = "Complete Load";
                                DMSManifestMenuCtrl.ePage.Masters.CompleteLoad = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.Dockout) {
                                toastr.success("Docked Out Successfully");
                                DMSManifestMenuCtrl.ePage.Masters.DockoutText = "Dock Out";
                                DMSManifestMenuCtrl.ePage.Masters.Dockout = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.Gateout) {
                                toastr.success("Gate Out Successfully");
                                // DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallMenuFunction = true;
                                DMSManifestMenuCtrl.ePage.Masters.GateoutText = "Gate Out";
                                DMSManifestMenuCtrl.ePage.Masters.Gateout = false;
                            }
                            if (DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheet) {
                                toastr.success("Generated DRS Successfully");
                                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallMenuFunction = true;
                                DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheetText = "Generate DRS";
                                DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheet = false;
                            }
                            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;

                        });
                    } else {
                        DMSManifestMenuCtrl.ePage.Masters.ConfirmDockText = "Confirm Dock";
                        DMSManifestMenuCtrl.ePage.Masters.StartLoadText = "Start Load";
                        DMSManifestMenuCtrl.ePage.Masters.CompleteLoadText = "Complete Load";
                        DMSManifestMenuCtrl.ePage.Masters.DockoutText = "Dock Out";
                        DMSManifestMenuCtrl.ePage.Masters.GateoutText = "Gate Out";
                        DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheetText = "Generate DRS";
                        DMSManifestMenuCtrl.ePage.Masters.DeliveryRunsheet = false;
                        DMSManifestMenuCtrl.ePage.Masters.Gateout = false;
                        DMSManifestMenuCtrl.ePage.Masters.Dockout = false;
                        DMSManifestMenuCtrl.ePage.Masters.CompleteLoad = false;
                        DMSManifestMenuCtrl.ePage.Masters.StartLoad = false;
                        DMSManifestMenuCtrl.ePage.Masters.DockIn = false;
                        DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                    }
                });
            } else {
                if (DMSManifestMenuCtrl.ePage.Masters.Gateout) {
                    var _obj = {
                        ModuleName: ["Manifest"],
                        Code: [DMSManifestMenuCtrl.currentManifest.code],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "MAN"
                        },
                        EntityObject: DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data,
                        ErrorCode: ["E3539"]
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                // DMSManifestMenuCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Manifest', DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber, DMSManifestMenuCtrl.ePage.Entities.Header.Data.Gateout, 'E3539', true);
                if (DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicle) {
                    var _obj = {
                        ModuleName: ["Manifest"],
                        Code: [DMSManifestMenuCtrl.currentManifest.code],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "MAN"
                        },
                        EntityObject: DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data,
                        ErrorCode: ["E3538"]
                    };
                    errorWarningService.ValidateValue(_obj);
                    // DMSManifestMenuCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Manifest', DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber, DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatePassList, 'E3538', true);
                }
                DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicleText = "Confirm Vehicle";
                DMSManifestMenuCtrl.ePage.Masters.ConfirmVehicle = false;
                DMSManifestMenuCtrl.ePage.Masters.Gateout = false;
                DMSManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSManifestMenuCtrl.currentManifest);
                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
            }

        }

        function Validation($item) {
            // save manipulation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            //Validation Call
            var _obj = {
                ModuleName: ["Manifest"],
                Code: [$item.code],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "MAN"
                },
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                ErrorCode: ["E5501", "E5502", "E5500", "E5508", "E5545", "E5546"]
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.Manifest.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    Save($item);
                } else {
                    DMSManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSManifestMenuCtrl.currentManifest);
                }
            });
        }

        function Save($item) {
            // save and attach order button manipulation
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
            if (DMSManifestMenuCtrl.ePage.Masters.CreateManifest) {
                DMSManifestMenuCtrl.ePage.Masters.CreateManifestText = "Please Wait..";
            } else {
                DMSManifestMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait..";
            }
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = true;
            helperService.SaveEntity($item, 'Manifest').then(function (response) {
                DMSManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";

                if (response.Status === "success") {
                    var _index = DMSManifestMenuCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.TmsManifestHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + DMSManifestMenuCtrl.currentManifest[DMSManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    DMSManifestMenuCtrl.ePage.Masters.Config.TabList[_index][DMSManifestMenuCtrl.ePage.Masters.Config.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    DMSManifestMenuCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                // if (value.code == DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                                value.label = DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber;
                                                value[DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber] = value.New;
                                                delete value.New;
                                                // }
                                            }
                                        }
                                    });

                                    if (DMSManifestMenuCtrl.ePage.Masters.CreateManifest) {
                                        DMSManifestMenuCtrl.ePage.Masters.CreateManifest = false;
                                        DMSManifestMenuCtrl.ePage.Masters.CreateManifestText = "Attach Orders";
                                        DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallMenuFunction = true;
                                    } else {
                                        DMSManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                                    }
                                }
                                DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                                DMSManifestMenuCtrl.ePage.Masters.CreateManifest = false;
                            });
                            toastr.success("Saved Successfully");
                        }
                        DMSManifestMenuCtrl.ePage.Masters.Config.TabList[_index].isNew = false;
                        if ($state.current.url == "/manifest-list") {
                            helperService.refreshGrid();
                        }
                    }
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                    console.log("Success");
                } else if (response.Status === "failed") {
                    toastr.error("save failed");
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                    DMSManifestMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    // angular.forEach(response.Validations, function (value, key) {
                    //     DMSManifestMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), DMSManifestMenuCtrl.currentManifest.label, false, undefined, undefined, undefined, undefined, undefined);
                    // });
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Validations != null) {
                        DMSManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSManifestMenuCtrl.currentManifest);
                    }
                }
                // for pickup and delivery menu
                var res = DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");
                if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickup = true;
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = false;
                } else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsDelivery = true;
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickup = false;
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function OnToggleFilterClick() {
            // show or hide menu list
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsToggleFilter = !DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsToggleFilter;

            if ($(".mytask-filter").hasClass("mytask-filter-show")) {
                $(".mytask-filter").removeClass("mytask-filter-show").addClass("mytask-filter-hide");
            } else if ($(".mytask-filter").hasClass("mytask-filter-hide")) {
                $(".mytask-filter").removeClass("mytask-filter-hide").addClass("mytask-filter-show");
            }
        }

        function GetPickupDeliveryDetails() {
            // add pickup and delivery menu
            // and add submenu for pickup and delivery menu            
            var senderReceiver = 0;
            if (DMSManifestMenuCtrl.ePage.Masters.senderCount && DMSManifestMenuCtrl.ePage.Masters.receiverCount) {
                senderReceiver = DMSManifestMenuCtrl.ePage.Masters.senderCount + DMSManifestMenuCtrl.ePage.Masters.receiverCount;
            }

            DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = [];
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsPickupDeliveryList = false;
            if (DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
                if (senderReceiver > 0) {
                    if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length != 5) {
                        DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.splice(4, senderReceiver);
                    }
                }
            } else {
                DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
                if (senderReceiver > 0) {
                    if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length != 4) {
                        DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.splice(3, senderReceiver);
                    }
                }
            }
            DMSManifestMenuCtrl.ePage.Masters.senderCount = 0;
            DMSManifestMenuCtrl.ePage.Masters.receiverCount = 0;

            angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                if (value.AddressType == "PIC") {
                    DMSManifestMenuCtrl.ePage.Masters.senderCount = DMSManifestMenuCtrl.ePage.Masters.senderCount + 1;
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'Transportation') {
                        var MenuList = {
                            "DisplayName": DMSManifestMenuCtrl.ePage.Masters.senderCount + " Vehicle TAT ",
                            "Value": DMSManifestMenuCtrl.ePage.Masters.senderCount + "Pickup",
                            "Icon": "fa fa-plane",
                            "JobFK": value.PK,
                            "ORG_FK": value.ORG_FK
                        }
                    }
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'ExpressDelivery') {
                        var MenuList = {
                            "DisplayName": DMSManifestMenuCtrl.ePage.Masters.senderCount + " Confirm Dispatch ",
                            "Value": DMSManifestMenuCtrl.ePage.Masters.senderCount + "Pickup",
                            "Icon": "fa fa-plane",
                            "JobFK": value.PK,
                            "ORG_FK": value.ORG_FK
                        }
                    }
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'LastMileDelivery') {
                        var MenuList = {
                            "DisplayName": DMSManifestMenuCtrl.ePage.Masters.senderCount + " Pickup ",
                            "Value": DMSManifestMenuCtrl.ePage.Masters.senderCount + "Pickup",
                            "Icon": "fa fa-plane",
                            "JobFK": value.PK,
                            "ORG_FK": value.ORG_FK
                        }
                    }
                    var _filter = {
                        "PK": value.ORG_FK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": DMSManifestMenuCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.FilterID
                    };

                    apiService.post("eAxisAPI", DMSManifestMenuCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.Url, _input).then(function (response) {
                        if (response.data.Response.length > 0) {
                            DMSManifestMenuCtrl.ePage.Masters.SenderClient = response.data.Response[0].WarehouseCode;
                            if (DMSManifestMenuCtrl.ePage.Masters.SenderClient && (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'Transportation' || DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'LastMileDelivery')) {
                                MenuList.SubMenu = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.SubMenu;
                                GetDesign(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].Value, DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu, "MainMenu")
                            }
                        }
                    });

                    DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.splice(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1, 0, MenuList);

                } else if (value.AddressType == "DEL") {
                    DMSManifestMenuCtrl.ePage.Masters.receiverCount = DMSManifestMenuCtrl.ePage.Masters.receiverCount + 1;

                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'Transportation') {
                        var MenuList = {
                            "DisplayName": DMSManifestMenuCtrl.ePage.Masters.receiverCount + " Upload POD ",
                            "Value": DMSManifestMenuCtrl.ePage.Masters.receiverCount + "Delivery",
                            "Icon": "fa fa-plane",
                            "JobFK": value.PK,
                            "ORG_FK": value.ORG_FK
                        }
                    }
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'ExpressDelivery') {
                        var MenuList = {
                            "DisplayName": DMSManifestMenuCtrl.ePage.Masters.receiverCount + " Confirm Delivery ",
                            "Value": DMSManifestMenuCtrl.ePage.Masters.receiverCount + "Delivery",
                            "Icon": "fa fa-plane",
                            "JobFK": value.PK,
                            "ORG_FK": value.ORG_FK
                        }
                    }
                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'LastMileDelivery') {
                        var MenuList = {
                            "DisplayName": DMSManifestMenuCtrl.ePage.Masters.receiverCount + " Delivery ",
                            "Value": DMSManifestMenuCtrl.ePage.Masters.receiverCount + "Delivery",
                            "Icon": "fa fa-plane",
                            "JobFK": value.PK,
                            "ORG_FK": value.ORG_FK
                        }
                    }
                    var _filter = {
                        "PK": value.ORG_FK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": DMSManifestMenuCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.FilterID
                    };

                    apiService.post("eAxisAPI", DMSManifestMenuCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.Url, _input).then(function (response) {
                        if (response.data.Response.length > 0) {
                            DMSManifestMenuCtrl.ePage.Masters.ReceiverClient = response.data.Response[0].WarehouseCode;
                            if (DMSManifestMenuCtrl.ePage.Masters.ReceiverClient && (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'Transportation' || DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType == 'LastMileDelivery')) {
                                angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.SubMenu, function (value, key) {
                                    if (value.Value == "LoadItems") {
                                        value.DisplayName = "Complete Unload";
                                    }
                                    if (value.Value == "StartLoad") {
                                        value.DisplayName = "Start Unload";
                                    }
                                })
                                MenuList.SubMenu = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.SubMenu;
                                GetDesign(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].Value, DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu, "MainMenu")
                            }
                        }
                    });

                    DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.splice(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1, 0, MenuList);
                }
            });

        }

        function GetMenuBasedOnSender() {
            // get menu besed on sender. 

            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsWarehouseClient = false;
            if (DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = DMSManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }
            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.JobAddress.length > 2) {
                GetPickupDeliveryDetails();
            }
        }

        function GetDesign(value, mainIndex, menuType, subIndex) {
            // display menu and menu pages
            // changing menu color
            DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveSubMenu = -1;            
            
            if (!DMSManifestMenuCtrl.currentManifest.isNew) {
                if (menuType == "MainMenu") {
                    var count = 0, count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0, count6 = 0;

                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallMenuFunction = false;
                    angular.forEach(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource, function (value1, key) {
                        if (key == mainIndex) {
                            for (var i = 0; i < DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length; i++) {
                                var isError;
                                if (mainIndex == 2) {
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length == 0) {
                                        isError = true;
                                    }
                                }
                                // else if (mainIndex == 3) {
                                //     if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length == 0 || DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestItem.length == 0) {
                                //         isError = true;
                                //     }
                                // }
                                else if (mainIndex == 3) {
                                    if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SubmittedDateTime) {
                                        isError = true;
                                    }
                                } else if (mainIndex == 3 && value == "ConfirmTransportBooking") {
                                    if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime) {
                                        isError = true;
                                    }
                                } else if (mainIndex > 3 && value != "CompleteManifest") {
                                    if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportBookedDateTime) {
                                        isError = true;
                                    }
                                } else if (mainIndex > 3 && value == "CompleteManifest") {
                                    var deliveryDateCount = 0;
                                    angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                                        if (value.TMC_ActualDeliveryDateTime) {
                                            deliveryDateCount = deliveryDateCount + 1;
                                        }
                                    });
                                    if (deliveryDateCount != DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length) {
                                        isError = true;
                                    } else if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length == 0) {
                                        isError = true;
                                    }
                                }
                                // if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus == "Rejected") {
                                //     if (mainIndex > 4) {
                                //         isError = true;
                                //     }
                                // }
                                if (isError) {
                                    if (mainIndex == 2 || mainIndex == 10) {
                                        count = count + 1;
                                    }
                                    // else if (mainIndex == 3) {
                                    //     count1 = count1 + 1;
                                    // } 
                                    else if (mainIndex == 3) {
                                        count3 = count3 + 1;
                                    } else if (mainIndex == 3 && value == "ConfirmTransportBooking") {
                                        count4 = count4 + 1;
                                    } else if (mainIndex > 3 && value != "CompleteManifest") {
                                        count5 = count5 + 1;
                                    } else if (mainIndex > 3 && value == "CompleteManifest") {
                                        count6 = count6 + 1;
                                    }
                                    // if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus == "Rejected") {
                                    //     if (mainIndex > 3) {
                                    //         count2 = count2 + 1;
                                    //     }
                                    // }
                                }
                                else {
                                    DMSManifestMenuCtrl.ePage.Masters.IsActives = undefined;
                                    DMSManifestMenuCtrl.ePage.Masters.IsPickup = false;
                                    DMSManifestMenuCtrl.ePage.Masters.IsDelivery = false;
                                    // region - to change the menu name
                                    DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].DisplayName = "Manifest Created";
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SubmittedDateTime) {
                                        DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[1].DisplayName = "Consignment Attached";
                                        // DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[2].DisplayName = "Item Added";
                                        DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[2].DisplayName = "Manifest Confirmed";
                                    }
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportBookedDateTime) {
                                        DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].DisplayName = "Transport Booked";
                                    }
                                    // if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus == "Approved") {
                                    //     DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[4].DisplayName = "Manifest Approved";
                                    // } else if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus == "Rejected") {
                                    //     DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[4].DisplayName = "Manifest Rejected";
                                    // }
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestCompleteDatetime) {
                                        if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1].Value == "CompleteManifest") {
                                            DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1].DisplayName = "Manifest Delivered";
                                        }
                                    }
                                    // endregion
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu = mainIndex;
                                    DMSManifestMenuCtrl.ePage.Masters.IsActive = value;
                                    // region - change the menu color
                                    // Remove active class
                                    $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).removeClass('menu-active');
                                    $("#btn" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).removeClass('btn-active');
                                    $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).removeClass('text-active');
                                    $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).removeClass('chevron-active');
                                    // add completed class 
                                    if (mainIndex != 0) {
                                        $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value).addClass('completed-menu');
                                        $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value).addClass('completed-text');
                                        $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value).addClass('completed-chevron');
                                    }
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SubmittedDateTime) {
                                        $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value).addClass('completed-menu');
                                        $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value).addClass('completed-text');
                                        $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[0].Value).addClass('completed-chevron');

                                        $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[1].Value).addClass('completed-menu');
                                        $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[1].Value).addClass('completed-text');
                                        $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[1].Value).addClass('completed-chevron');

                                        $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[2].Value).addClass('completed-menu');
                                        $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[2].Value).addClass('completed-text');
                                        $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[2].Value).addClass('completed-chevron');

                                        // $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].Value).addClass('completed-menu');
                                        // $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].Value).addClass('completed-text');
                                        // $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].Value).addClass('completed-chevron');
                                    }
                                    // if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime) {
                                    //     $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[4].Value).addClass('completed-menu');
                                    //     $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[4].Value).addClass('completed-text');
                                    //     $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[4].Value).addClass('completed-chevron');
                                    // }
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportBookedDateTime) {
                                        if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].DisplayName == "Transport Booked") {
                                            $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].Value).addClass('completed-menu');
                                            $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].Value).addClass('completed-text');
                                            $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[3].Value).addClass('completed-chevron');
                                        }
                                    }
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestCompleteDatetime) {
                                        if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1].Value == "CompleteManifest") {
                                            $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1].Value).addClass('completed-menu');
                                            $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1].Value).addClass('completed-text');
                                            $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource.length - 1].Value).addClass('completed-chevron');
                                        }
                                    }
                                    if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].SubMenu) {
                                        DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].JobFK })
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                                            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].ManifestFK && DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockinTime && DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadStartTime && DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadEndTime && DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockoutTime && DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].GateoutTime) {
                                                $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-menu');
                                                $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-text');
                                                $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-chevron');
                                            }
                                        }
                                    } else {
                                        var res = DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].DisplayName.split(" ");
                                        if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                                            DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Sender_ORG_FK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].ORG_FK })
                                            var pickupcount = 0;
                                            angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment, function (value, key) {
                                                if (value.TMC_ActualPickupDateTime) {
                                                    pickupcount = pickupcount + 1;
                                                }
                                            });
                                            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment.length > 0) {
                                                if (pickupcount == DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment.length) {
                                                    $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-menu');
                                                    $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-text');
                                                    $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-chevron');
                                                }
                                            }
                                        }
                                        else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                                            DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, { TMC_Receiver_ORG_FK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].ORG_FK })
                                            var deliverycount = 0;
                                            angular.forEach(DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment, function (value, key) {
                                                if (value.TMC_ActualDeliveryDateTime) {
                                                    deliverycount = deliverycount + 1;
                                                }
                                            });
                                            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment.length > 0) {
                                                if (deliverycount == DMSManifestMenuCtrl.ePage.Entities.Header.Data.ManifestConsignment.length) {
                                                    $("#menu" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-menu');
                                                    $("#text" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-text');
                                                    $("#span" + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[i].Value).addClass('completed-chevron');
                                                }
                                            }
                                        }
                                    }
                                    // remove completed class for selected menu
                                    $("#menu" + DMSManifestMenuCtrl.currentManifest.label + value).removeClass('completed-menu');
                                    $("#text" + DMSManifestMenuCtrl.currentManifest.label + value).removeClass('completed-text');
                                    $("#span" + DMSManifestMenuCtrl.currentManifest.label + value).removeClass('completed-chevron');
                                    // Add active class for selected menu
                                    $("#menu" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('menu-active');
                                    $("#btn" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('btn-active');
                                    $("#text" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('text-active');
                                    $("#span" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('chevron-active');
                                    // endregion
                                }
                            }
                            // region - change the color for pickup and delivery menu(s)
                            var res = DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].DisplayName.split(" ");
                            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus != "Rejected") {
                                if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                                    DMSManifestMenuCtrl.ePage.Masters.IsPickup = true;
                                    DMSManifestMenuCtrl.ePage.Masters.IsDelivery = false;
                                }
                                else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                                    DMSManifestMenuCtrl.ePage.Masters.IsDelivery = true;
                                    DMSManifestMenuCtrl.ePage.Masters.IsPickup = false;
                                }
                                if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch" || res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportBookedDateTime) {
                                        DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu = mainIndex;
                                        DMSManifestMenuCtrl.ePage.Masters.IsActives = value;
                                        DMSManifestMenuCtrl.ePage.Masters.IsDirective = $compile("<div pickup-delivery current-manifest='DMSManifestMenuCtrl.currentManifest' menuvalue='DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName'></div>")($scope);
                                        if (DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu) {
                                            DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].JobFK })
                                            if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].ManifestFK) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[0].Value).addClass('btn-submenu-completed');
                                                }
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockinTime) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[1].Value).addClass('btn-submenu-completed');
                                                }
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadStartTime) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[2].Value).addClass('btn-submenu-completed');
                                                }
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadEndTime) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[3].Value).addClass('btn-submenu-completed');
                                                }
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockoutTime) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[4].Value).addClass('btn-submenu-completed');
                                                }
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].GateoutTime) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[5].Value).addClass('btn-submenu-completed');
                                                }
                                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].GateoutTime) {
                                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[6].Value).addClass('btn-submenu-completed');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // endregion
                        }
                    });
                    //region - show warning msg 
                    if (count > 0) {
                        toastr.warning("It can be viewed when the Order(s) available.");
                    }
                    if (count1 > 0) {
                        toastr.warning("It can be viewed when the Item(s) available.");
                    }
                    if (count2 > 0) {
                        toastr.warning("Manifest is Rejected.");
                    } if (count3 > 0) {
                        toastr.warning("It can be viewed when the manifest is Confirmed.");
                    }
                    if (count4 > 0) {
                        toastr.warning("It can be viewed when the manifest is Approved.");
                    }
                    if (count5 > 0) {
                        toastr.warning("It can be viewed when the transport is Booked.");
                    } if (count6 > 0) {
                        toastr.warning("It can be viewed when the consignment(s) in manifest is delivered.");
                    }
                    // endregion
                } else if (menuType == "SubMenu") {
                    DMSManifestMenuCtrl.ePage.Masters.IsActives = undefined;
                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.IsCallSubMenuFunction = false;
                    var subCount = 0, subCount1 = 0, subCount2 = 0, subCount3 = 0, subCount4 = 0, subCount5 = 0;
                    angular.forEach(DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu, function (value1, key1) {
                        if (key1 == subIndex) {
                            for (var i = 0; i < DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu.length; i++) {
                                var isError;
                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus == "Rejected") {
                                    if (mainIndex > 4) {
                                        isError = true;
                                        subCount = subCount + 1;
                                    }
                                }
                                DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].JobFK })

                                if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length == 0) {
                                    if (subIndex > 0) {
                                        isError = true;
                                        subCount1 = subCount1 + 1;
                                    }
                                } else if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockinTime) {
                                    if (subIndex >= 2) {
                                        isError = true;
                                        subCount2 = subCount2 + 1;
                                    }
                                } else if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadStartTime) {
                                    if (subIndex >= 3) {
                                        isError = true;
                                        subCount3 = subCount3 + 1;
                                    }
                                } else if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadEndTime) {
                                    if (subIndex >= 4) {
                                        isError = true;
                                        subCount4 = subCount4 + 1;
                                    }
                                } else if (!DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockoutTime) {
                                    if (subIndex >= 5) {
                                        isError = true;
                                        subCount5 = subCount5 + 1;
                                    }
                                }
                                if (!isError) {
                                    DMSManifestMenuCtrl.ePage.Entities.Header.CheckPoints.ActiveSubMenu = subIndex;
                                    DMSManifestMenuCtrl.ePage.Masters.IsActive = value;

                                    DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DMSManifestMenuCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].JobFK })
                                    // region - change the submenu color
                                    // Remove active class
                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[i].Value).removeClass('btn-submenu-active');
                                    // add completed class
                                    if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList.length > 0) {
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].ManifestFK) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[0].Value).addClass('btn-submenu-completed');
                                        }
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockinTime) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[1].Value).addClass('btn-submenu-completed');
                                        }
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadStartTime) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[2].Value).addClass('btn-submenu-completed');
                                        }
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].LoadOrUnloadEndTime) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[3].Value).addClass('btn-submenu-completed');
                                        }
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].DockoutTime) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[4].Value).addClass('btn-submenu-completed');
                                        }
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].GateoutTime) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[5].Value).addClass('btn-submenu-completed');
                                        }
                                        if (DMSManifestMenuCtrl.ePage.Entities.Header.Data.GatepassList[0].GateoutTime) {
                                            $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].SubMenu[6].Value).addClass('btn-submenu-completed');
                                        }
                                    }
                                    // Add class
                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + value).addClass('btn-submenu-active');
                                    // remove completed class
                                    $("#submenubtn" + DMSManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource[mainIndex].Value + DMSManifestMenuCtrl.currentManifest.label + value).removeClass('btn-submenu-completed');
                                    // endregion
                                }
                            }
                        }
                    });
                    if (subCount > 0) {
                        toastr.warning("Manifest is Rejected.");
                    } if (subCount1 > 0) {
                        toastr.warning("It can be viewed when the gatepass is attached.");
                    } if (subCount2 > 0) {
                        toastr.warning("It can be viewed when the vehicle is docked in.");
                    } if (subCount3 > 0) {
                        toastr.warning("It can be viewed when the vehicle is load started.");
                    } if (subCount4 > 0) {
                        toastr.warning("It can be viewed when the vehicle is load completed.");
                    } if (subCount5 > 0) {
                        toastr.warning("It can be viewed when the vehicle is docked out.");
                    }
                }
            } else {
                if (value == "CreateManifest") {
                    DMSManifestMenuCtrl.ePage.Masters.IsActive = 'CreateManifest';
                    $("#menu" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('menu-active');
                    $("#btn" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('btn-active');
                    $("#text" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('text-active');
                    $("#span" + DMSManifestMenuCtrl.currentManifest.label + value).addClass('chevron-active');
                } else {
                    toastr.warning("It can be viewed when the Manifest is saved");
                }
            }
        }

        Init();
    }

})();