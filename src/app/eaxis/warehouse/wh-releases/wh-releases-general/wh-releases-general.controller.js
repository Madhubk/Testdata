(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleasesGeneralController", ReleasesGeneralController);


    ReleasesGeneralController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$state", "$filter", "toastr", "$window", "confirmation"];

    function ReleasesGeneralController($scope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $state, $filter, toastr, $window, confirmation) {

        var ReleasesGeneralCtrl = this;

        function Init() {

            var currentRelease = ReleasesGeneralCtrl.currentRelease[ReleasesGeneralCtrl.currentRelease.label].ePage.Entities;


            ReleasesGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Release_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRelease

            };

            ReleasesGeneralCtrl.ePage.Masters.EnableForOutward = true;
            ReleasesGeneralCtrl.ePage.Masters.emptyText = '-';
            ReleasesGeneralCtrl.ePage.Masters.selectedRowForOutward = -1;
            ReleasesGeneralCtrl.ePage.Masters.SearchTableForOutward = '';
            ReleasesGeneralCtrl.ePage.Masters.setSelectedRowForOutward = setSelectedRowForOutward;

            ReleasesGeneralCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;

            ReleasesGeneralCtrl.ePage.Masters.DropDownMasterList = {};


            ReleasesGeneralCtrl.ePage.Masters.Config = releaseConfig;
            ReleasesGeneralCtrl.ePage.Masters.Edit = Edit;
            ReleasesGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ReleasesGeneralCtrl.ePage.Masters.FinaliseOrder = FinaliseOrder;
            ReleasesGeneralCtrl.ePage.Masters.CreateMTRInward = CreateMTRInward;

            GetUserBasedGridColumListForOutward();
            GetDropDownList();
            GeneralOperations();
            GetMiscServDetails();
        }

        function CreateMTRInward(item) {
            // check whether the selected order is finalized or not
            if (item.WorkOrderStatus == "FIN") {
                // check whether the MTR inward created for this Order or Not
                var _filter = {
                    "WOD_Parent_FK": item.PK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.InwardList.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.InwardList.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            toastr.warning("Material Transfer Inward already created for this Order");
                        } else {
                            FetchingInwardDetails(item);
                        }
                    }
                });
            } else {
                toastr.warning("Selected Order is Not Finalized");
            }
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PickOption"];
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
                        ReleasesGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ReleasesGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetUserBasedGridColumListForOutward() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKOUTWARD",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    ReleasesGeneralCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ReleasesGeneralCtrl.ePage.Entities.Header.TableProperties.UIWmsOutward = obj;
                        ReleasesGeneralCtrl.ePage.Masters.UserHasValueForOutward = true;
                    }
                } else {
                    ReleasesGeneralCtrl.ePage.Masters.UserValueForOutward = undefined;
                }
            })
        }

        function setSelectedRowForOutward(index) {
            ReleasesGeneralCtrl.ePage.Masters.selectedRowForOutward = index;
        }

        function GeneralOperations() {
            if (ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode == null) {
                ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = "";
            }
            if (ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName == null) {
                ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = "";
            }

            ReleasesGeneralCtrl.ePage.Masters.Warehouse = ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            if (ReleasesGeneralCtrl.ePage.Masters.Warehouse == ' - ')
                ReleasesGeneralCtrl.ePage.Masters.Warehouse = "";
        }

        function GetMiscServDetails() {
            ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails = [];
            if (ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.length > 0) {
                ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.map(function (value, key) {
                    var _filter = {
                        "ORG_FK": value.ORG_Client_FK
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            var obj = {
                                "ORG_FK": response.data.Response[0].ORG_FK,
                                "IMPartAttrib1Name": response.data.Response[0].IMPartAttrib1Name,
                                "IMPartAttrib2Name": response.data.Response[0].IMPartAttrib2Name,
                                "IMPartAttrib3Name": response.data.Response[0].IMPartAttrib3Name,
                                "IMPartAttrib1Type": response.data.Response[0].IMPartAttrib1Type,
                                "IMPartAttrib2Type": response.data.Response[0].IMPartAttrib2Type,
                                "IMPartAttrib3Type": response.data.Response[0].IMPartAttrib3Type,
                            }
                            ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.push(obj);
                        }
                        if (ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.length == ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.length) {
                            ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        }
                    });
                })
            }
        }

        function SelectedLookupDataWarCode(item) {
            ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = item.WarehouseName;
            ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = item.WarehouseCode;
            ReleasesGeneralCtrl.ePage.Masters.Warehouse = ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            OnChangeValues(ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode, 'E8003');
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ReleasesGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ReleasesGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleasesGeneralCtrl.currentRelease.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ReleasesGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ReleasesGeneralCtrl.currentRelease.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function Edit(obj) {
            if (obj != undefined) {
                var _queryString = {
                    PK: obj.PK,
                    WorkOrderID: obj.WorkOrderID
                };
                _queryString = helperService.encryptData(_queryString);
                $window.open("#/EA/single-record-view/pickorder/" + _queryString, "_blank");
            } else {
                toastr.warning("Select the order for Edit");
            }
        };

        function FinaliseOrder(value) {
            var mydata = $filter('filter')(ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, value.PK);

            var validate = mydata.some(function (value, key) {
                if (parseFloat(value.ShortFallQty) > 0)
                    return value.ShortFallQty;
            });

            if (!validate) {
                var mydata = ReleasesGeneralCtrl.ePage.Masters.Config.ReleaseCapture(ReleasesGeneralCtrl.currentRelease, value.PK);
                if (mydata) {
                    if (ReleasesGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.length == 0) {
                        var modalOptions = {
                            closeButtonText: 'Cancel',
                            actionButtonText: 'Ok',
                            headerText: 'Once Finalized Outward Cannot be edited..',
                            bodyText: 'Do you want to Finalize?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                ReadyToFinalize(value);
                            }, function () {
                                console.log("Cancelled");
                            });
                    } else {
                        ReleasesGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleasesGeneralCtrl.currentRelease);
                    }
                }
            } else {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Finalize..',
                    bodyText: 'This order has Shortfall Quantity. Do you want to finalize?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        var mydata = ReleasesGeneralCtrl.ePage.Masters.Config.ReleaseCapture(ReleasesGeneralCtrl.currentRelease, value.PK);
                        if (mydata) {
                            if (ReleasesGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.length == 0)
                                ReadyToFinalize(value);
                        } else {
                            ReleasesGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleasesGeneralCtrl.currentRelease);
                        }
                    }, function () {
                        console.log("Cancelled");
                    });
            }
        }

        function ReadyToFinalize(value) {
            value.FinalisedDate = new Date();
            value.WorkOrderStatus = 'FIN';
            value.WorkOrderStatusDesc = 'Finalized';
            ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            ReleasesGeneralCtrl.ePage.Masters.LoadingValue = "Finalizing Outward";

            var _Data = ReleasesGeneralCtrl.currentRelease[ReleasesGeneralCtrl.currentRelease.label].ePage.Entities,
                _input = _Data.Header.Data;

            ReleasesGeneralCtrl.currentRelease = filterObjectUpdate(ReleasesGeneralCtrl.currentRelease, "IsModified");

            helperService.SaveEntity(ReleasesGeneralCtrl.currentRelease, 'Pick').then(function (response) {
                ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                ReleasesGeneralCtrl.ePage.Masters.LoadingValue = "";

                if (response.Status === "success") {
                    var _index = releaseConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ReleasesGeneralCtrl.currentRelease[ReleasesGeneralCtrl.currentRelease.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        releaseConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/releases") {
                            helperService.refreshGrid();
                        }
                    }

                    ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'CreatedDateTime');

                    FetchingInwardDetails(value);

                    //If outward finalized then we should normalize the pick slip tab
                    ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.NormalingPickSlipTab = true;

                    console.log("Success");
                    toastr.success("Saved Successfully...!");
                } else if (response.Status === "failed") {

                    ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    ReleasesGeneralCtrl.ePage.Masters.LoadingValue = "";

                    toastr.error("Could not Save...!");
                    ReleasesGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ReleasesGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleasesGeneralCtrl.currentRelease.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ReleasesGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        ReleasesGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleasesGeneralCtrl.currentRelease);
                    }
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

        //Function for creating Inward if Outward type is Material Transfer
        function FetchingInwardDetails(currentOutward) {
            if (currentOutward.WorkOrderSubType == "MTR") {
                if (ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickLine.length > 0) {
                    ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    ReleasesGeneralCtrl.ePage.Masters.LoadingValue = "Creating Inward";

                    //Inward Get By Id Call
                    helperService.getFullObjectUsingGetById(ReleasesGeneralCtrl.ePage.Entities.Header.API.InwardGetById.Url, 'null').then(function (response) {
                        if (response.data.Response.Response) {
                            var InwardObject = response.data.Response.Response
                            InwardObject.UIWmsInwardHeader.PK = response.data.Response.Response.PK;
                            apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + currentOutward.PK).then(function (response) {
                                if (response.data.Response) {
                                    InwardObject.UIOrgHeader = response.data.Response.UIOrgHeader;
                                    InwardObject.UIJobAddress = angular.copy(response.data.Response.UIJobAddress);
                                    angular.forEach(InwardObject.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                        if (value.AddressType == "CED")
                                            value.AddressType = "SUD";
                                    });
                                    CreatingInward(InwardObject, currentOutward)
                                }
                            });
                        }
                    });
                } else {
                    toastr.warning("Pickline is not available. So cannot create Inward");
                }
            }
            //   else {
            //     toastr.warning("It can be created when the selected Order is in 'MTR' type");
            // }
        }

        function CreatingInward(InwardObject, currentOutward) {
            //Assigning Header Object            
            InwardObject.UIWmsInwardHeader.CreatedDateTime = new Date();
            InwardObject.UIWmsInwardHeader.WorkOrderType = 'INW';
            InwardObject.UIWmsInwardHeader.ExternalReference = "Material Transfer " + InwardObject.UIWmsInwardHeader.WorkOrderID;
            InwardObject.UIWmsInwardHeader.ORG_Client_FK = currentOutward.ORG_Client_FK;
            InwardObject.UIWmsInwardHeader.ORG_FK = currentOutward.ORG_FK;
            InwardObject.UIWmsInwardHeader.ClientCode = currentOutward.ClientCode;
            InwardObject.UIWmsInwardHeader.ClientName = currentOutward.ClientName;
            InwardObject.UIWmsInwardHeader.ORG_Supplier_FK = currentOutward.ORG_Consignee_FK;
            InwardObject.UIWmsInwardHeader.SupplierCode = currentOutward.ConsigneeCode;
            InwardObject.UIWmsInwardHeader.SupplierName = currentOutward.ConsigneeName;
            InwardObject.UIWmsInwardHeader.WAR_FK = currentOutward.TransferTo_WAR_FK;
            InwardObject.UIWmsInwardHeader.WarehouseCode = currentOutward.TransferTo_WAR_Code
            InwardObject.UIWmsInwardHeader.WarehouseName = currentOutward.TransferTo_WAR_Name
            InwardObject.UIWmsInwardHeader.WorkOrderSubType = currentOutward.WorkOrderSubType;
            InwardObject.UIWmsInwardHeader.AdditionalRef2Fk = currentOutward.AdditionalRef2Fk;
            InwardObject.UIWmsInwardHeader.WOD_Parent_FK = currentOutward.PK;
            //Assigning ASN Line Object
            ReleasesGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function (value, key) {
                if (value.WOD_FK == currentOutward.PK) {
                    var AsnLineObj = {
                        "PK": "",
                        "Parent_FK": value.WOL_TransactionLine,
                        "Client_FK": currentOutward.ORG_Client_FK,
                        "ORG_ClientCode": currentOutward.ClientCode,
                        "ORG_ClientName": currentOutward.ClientName,
                        "ProductCode": value.ProductCode,
                        "ProductDescription": value.ProductDescription,
                        "ProductCondition": value.ProductCondition,
                        "POR_FK": value.PRO_FK,
                        "Packs": value.Packs,
                        "PAC_PackType": value.PAC_PackType,
                        "Quantity": value.Units,
                        "StockKeepingUnit": value.StockKeepingUnit,
                        "PalletId": value.PalletID,
                        "PartAttrib1": value.PartAttrib1,
                        "PartAttrib2": value.PartAttrib2,
                        "PartAttrib3": value.PartAttrib3,
                        "PackingDate": value.PackingDate,
                        "ExpiryDate": value.ExpiryDate,
                        "AdditionalRef1Code": value.AdditionalRef1Code,
                        "AdditionalRef1Type": value.AdditionalRef1Type,
                        "AdditionalRef1Fk": value.AdditionalRef1Fk,
                        "UseExpiryDate": value.PackingDate ? true : false,
                        "UsePackingDate": value.ExpiryDate ? true : false,
                        "UsePartAttrib1": value.PartAttrib1 ? true : false,
                        "UsePartAttrib2": value.PartAttrib2 ? true : false,
                        "UsePartAttrib3": value.PartAttrib3 ? true : false
                    }
                    InwardObject.UIWmsAsnLine.push(AsnLineObj);
                }
            });

            //Inserting Inward
            apiService.post("eAxisAPI", ReleasesGeneralCtrl.ePage.Entities.Header.API.InwardInsert.Url, InwardObject).then(function (response) {
                if (response.data.Status == 'Success') {
                    ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ReleasesGeneralCtrl.ePage.Masters.LoadingValue = "";
                    toastr.success("Material Inward is successfully created.. Inward No : " + InwardObject.UIWmsInwardHeader.WorkOrderID, {
                        tapToDismiss: false,
                        closeButton: true,
                        timeOut: 0
                    });
                } else {
                    ReleasesGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ReleasesGeneralCtrl.ePage.Masters.LoadingValue = "";
                    toastr.error("Inward Creation Failed");
                }
            });
        }

        Init();
    }

})();