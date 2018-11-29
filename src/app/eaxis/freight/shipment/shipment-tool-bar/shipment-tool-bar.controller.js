(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentCustomToolBarController", ShipmentCustomToolBarController);

    ShipmentCustomToolBarController.$inject = ["shipmentConfig", "appConfig", "apiService", "authService", "$scope", "$uibModal", "helperService", "toastr", "FreightConfirmation", "confirmation", "$injector","FreightShpConfirmation"];

    function ShipmentCustomToolBarController(shipmentConfig, appConfig, apiService, authService, $scope, $uibModal, helperService, toastr, FreightConfirmation, confirmation, $injector,FreightShpConfirmation) {
        var ShipmentCustomToolBarCtrl = this;
        var shipmentConfig = $injector.get("shipmentConfig");
        function Init() {
            ShipmentCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": shipmentConfig.Entities
            };

            ShipmentCustomToolBarCtrl.ePage.Masters.IsActiveMenu = ShipmentCustomToolBarCtrl.activeMenu;
            ShipmentCustomToolBarCtrl.ePage.Masters.Config = shipmentConfig;
            // Common Multi-select input
            ShipmentCustomToolBarCtrl.ePage.Masters.Input = ShipmentCustomToolBarCtrl.input;
            ShipmentCustomToolBarCtrl.ePage.Masters.DataEntryObject = ShipmentCustomToolBarCtrl.dataentryObject;
            if (ShipmentCustomToolBarCtrl.ePage.Masters.Input.length > 0) {
                EmailOpenInput();
                getShipmentInfo();
            }
            InitAction();
        }
        function getShipmentInfo() {
            ShipmentCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                // Job Document List

                var _input = {
                    "EntityRefKey": val.PK,
                    "EntitySource": "SHP",
                    "EntityRefCode": val.ShipmentNo,
                    "Status": "Success"
                };
                var inputObj = {
                    "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                    "searchInput": helperService.createToArrayOfObject(_input)
                }
                apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                    val.JobDocument = response.data.Response;
                });
                // Consol SHipment Mappings
                var _filter = {
                    "SHP_FK": val.PK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        val.UIConShpMappings = response.data.Response;
                    }
                });
                // Get Order List
                var _filter = {
                    "SHP_FK": val.PK,
                    "SortColumn": "POH_OrderNo",
                    "SortType": "ASC",
                    "PageNumber": "1",
                    "PageSize": 100
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        val.UIOrderHeaders = response.data.Response;
                    }
                });
            });
        }
        function InitAction() {
            ShipmentCustomToolBarCtrl.ePage.Masters.Merge = Merge;
            ShipmentCustomToolBarCtrl.ePage.Masters.Split = Split;
            ShipmentCustomToolBarCtrl.ePage.Masters.Activation = Activation;
            ShipmentCustomToolBarCtrl.ePage.Masters.OnClickBtn = OnClickBtn;
        }
        function Split() {
            console.log("Split Check");
        }
        function OnClickBtn(type, displayName) {
            ShipmentCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = undefined;
            switch (displayName) {
                case "Shipment Activation":
                    Activation(type, displayName);
                    break;
                default:
            }
        }
        function Merge() {
            var MismatchShipment = [];
            var MatchShipment = [];
            var HBLShipment = [];
            ShipmentCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                var hblavailable = false;
                if (val.JobDocument.length > 0) {
                    val.JobDocument.map(function (item, key) {
                        if (item.DocumentType == "HBL") {
                            hblavailable = true
                        }
                        else {
                            hblavailable = false
                        }
                    });
                    if (hblavailable == true) { HBLShipment.push(val) }
                }
                if ((val.ORG_Shipper_Code == ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].ORG_Shipper_Code) && (val.ORG_Consignee_Code == ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].ORG_Consignee_Code) && (val.Origin == ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].Origin) && (val.Destination == ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].Destination) && hblavailable == false && val.UIConShpMappings.length == 0) {
                    MatchShipment.push(val);
                } else {
                    MismatchShipment.push(val);
                }
            });
            if (MismatchShipment.length > 0) {
                ConfirmationPopup(MismatchShipment, MatchShipment, HBLShipment);
            } else {
                confirmMerge(MatchShipment);
            }
        }
        function ConfirmationPopup(MismatchShipment, MatchShipment, HBLShipment) {
            var text = "";
            var hbl = "";
            MismatchShipment.map(function (val, key) {
                text += val.ShipmentNo + ','
            });
            HBLShipment.map(function (val, key) {
                hbl += val.ShipmentNo + ','
            });
            var modalOptions = {
                closeButtonText: 'Cancel',
                closeButtonVisible: true,
                actionButtonText: 'Ok',
                headerText: 'Below listed Shipment Consignee/Consignor mismatched.Do you want to ignore this Shipments..?',
                bodyText: text
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (MatchShipment.length > 1) { confirmMerge(MatchShipment); }
                    else toastr.warning("No shipments to merge");
                }, function () {
                    console.log("Cancelled");
                });
        }
        function confirmMerge(MatchShipment) {
            var text = "";
            var shipmentNo = [];
            MatchShipment.map(function (val, key) {
                text += val.ShipmentNo + ','
                shipmentNo.push(val.ShipmentNo);
            });
            var modalOptions = {
                closeButtonText: 'Cancel',
                closeButtonVisible: true,
                actionButtonText: 'Ok',
                headerText: 'Select Master shipment from Below listed Shipment..?',
                bodyText: "Note : You cannot revert this changes",
                bodyData: shipmentNo

            };
            FreightConfirmation.showModal({}, modalOptions)
                .then(function (result) {
                    MergeShipment(MatchShipment, result);
                }, function () {
                    console.log("Cancelled");
                });
        }
        function MergeShipment(MatchShipment, MasterShipment) {
            var MasterShipmentPK = null;
            var MstShipment = null;
            MatchShipment.map(function (val, key) {
                if (val.ShipmentNo == MasterShipment) {
                    MasterShipmentPK = val.PK;
                }
            });
            helperService.getFullObjectUsingGetById(ShipmentCustomToolBarCtrl.ePage.Entities.Header.API.GetByID.Url, MasterShipmentPK).then(function (response) {
                if (response.data.Response) {
                    MstShipment = response.data.Response;
                    MstShipment.UIShipmentHeader.IsModified = true;
                    if (MstShipment.UIShipmentHeader.Volume == null)
                        MstShipment.UIShipmentHeader.Volume = 0;
                    if (MstShipment.UIShipmentHeader.Chargeable == null)
                        MstShipment.UIShipmentHeader.Chargeable = 0
                    if (MstShipment.UIShipmentHeader.Weight == null)
                        MstShipment.UIShipmentHeader.Weight = 0;
                    MatchShipment.map(function (val, key) {
                        if (val.ShipmentNo != MasterShipment) {
                            // Attach Orders
                            if (val.Volume == null)
                                val.Volume = 0;
                            if (val.Chargeable == null)
                                val.Chargeable = 0
                            if (val.Weight == null)
                                val.Weight = 0;
                            MstShipment.UIShipmentHeader.Volume = val.Volume + MstShipment.UIShipmentHeader.Volume;
                            MstShipment.UIShipmentHeader.Chargeable = val.Chargeable + MstShipment.UIShipmentHeader.Chargeable;
                            MstShipment.UIShipmentHeader.Weight = val.Weight + MstShipment.UIShipmentHeader.Weight;
                            val.UIOrderHeaders.map(function (item, key) {
                                var _tempObj = [{
                                    "EntityRefPK": item.PK,
                                    "Properties": [{
                                        "PropertyName": "POH_SHP_FK",
                                        "PropertyNewValue": MasterShipmentPK,
                                        "PropertyOldValue": item.SHP_FK
                                    }, {
                                        "PropertyName": "POH_ShipmentNo",
                                        "PropertyNewValue": MasterShipment,
                                        "PropertyOldValue": item.ShipmentNo
                                    }]
                                }];
                                apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _tempObj).then(function (response) {
                                    if (response.data.Response) {
                                        toastr.success("Shipment Orders Merged Successful");
                                    }
                                });
                            });
                            // End of Attach Orders
                            //Deactivate shipments
                            helperService.getFullObjectUsingGetById(ShipmentCustomToolBarCtrl.ePage.Entities.Header.API.GetByID.Url, val.PK).then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.UIShipmentHeader.IsModified = true;
                                    response.data.Response.UIShipmentHeader.IsValid = false;
                                    apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, response.data.Response).then(function (response) {
                                        if (response.data.Response) {
                                            toastr.success("Saved Successfully...!");
                                        }
                                    });
                                }
                            });
                            //End of Deactivate shipments
                            //Update Master shipments
                            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, MstShipment).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Shipment merged Successfully...!");
                                }
                            });
                            //Update Master shipments
                        }
                    });
                }
            });
        }
        function Activation(type, displayName) {
            var MismatchShipment = [];
            var MatchShipment = [];
            ShipmentCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                if (val.SHP_FK && val.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    MismatchShipment.push(val);
                } else {
                    MatchShipment.push(val);
                }
            });
            if (MismatchShipment.length > 0) {
                ActivationPopup(MismatchShipment, MatchShipment, type, displayName);
            } else {
                ActiveConfirmation(MatchShipment, type, displayName);
            }
        }

        function ActivationPopup(MismatchShipment, MatchShipment, type, displayName) {
            var _orderNos = CommaSeperatedField(MismatchShipment, 'OrderCumSplitNo');
            var modalOptions = {
                closeButtonText: 'Cancel',
                closeButtonVisible: true,
                actionButtonText: 'Ok',
                headerText: 'Below listed orders are attached with shipments.Do you want to ignore this orders..?',
                bodyText: _orderNos
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    ActiveConfirmation(MatchShipment, type, displayName);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function ActiveConfirmation(datas, type, displayName) {
            ShipmentCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = datas;
            ShipmentCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
            ShipmentCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
            ShipmentCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
        }

        function EmailOpenInput() {
            ShipmentCustomToolBarCtrl.ePage.Masters.InputObj = {
                "EntityRefKey": ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].PK,
                "EntitySource": "SFU",
                "EntityRefCode": ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": ShipmentCustomToolBarCtrl.ePage.Masters.Input
            }
            var _subject = "Follow-up for PO's of -" + ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].Buyer + " to " + ShipmentCustomToolBarCtrl.ePage.Masters.Input[0].Supplier;
            ShipmentCustomToolBarCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderSummaryReport",
                TemplateObj: {
                    Key: "OrderSummaryReport",
                    Description: "Order Summary Report"
                }
            };
        }
        function CommaSeperatedField(item, fieldName) {
            var field = "";
            item.map(function (val, key) {
                field += val[fieldName] + ','
            });
            return field.substring(0, field.length - 1);
        }

        Init();
    }
})();