(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupanddeliverydetailController", PickupanddeliverydetailController);

    PickupanddeliverydetailController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "pickupanddeliveryConfig", "helperService", "toastr", "$document", "confirmation"];

    function PickupanddeliverydetailController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, pickupanddeliveryConfig, helperService, toastr, $document, confirmation) {

        var PickupanddeliverydetailCtrl = this;

        function Init() {

            var currentPickupanddelivery = PickupanddeliverydetailCtrl.currentPickupanddelivery[PickupanddeliverydetailCtrl.currentPickupanddelivery.label].ePage.Entities;
            PickupanddeliverydetailCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickupanddelivery_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickupanddelivery,
            };

            PickupanddeliverydetailCtrl.ePage.Masters.Config = pickupanddeliveryConfig;
            PickupanddeliverydetailCtrl.ePage.Masters.DropDownMasterList = {};
            PickupanddeliverydetailCtrl.ePage.Masters.selectedRow = -1;
            PickupanddeliverydetailCtrl.ePage.Masters.Lineslist = true;
            PickupanddeliverydetailCtrl.ePage.Masters.HeaderName = '';
            PickupanddeliverydetailCtrl.ePage.Masters.emptyText = '-'

            PickupanddeliverydetailCtrl.ePage.Masters.Attach = Attach;
            PickupanddeliverydetailCtrl.ePage.Masters.Detach = Detach;
            PickupanddeliverydetailCtrl.ePage.Masters.Cancel = Cancel;
            PickupanddeliverydetailCtrl.ePage.Masters.Edit = Edit;
            PickupanddeliverydetailCtrl.ePage.Masters.Done = Done;
            GetDropDownList();
            PickupanddeliverydetailCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            PickupanddeliverydetailCtrl.ePage.Masters.SelectedLookupFromData = SelectedLookupFromData;
            PickupanddeliverydetailCtrl.ePage.Masters.SelectedLookupToData = SelectedLookupToData;


        }

        function inputnull(index) {
            if (PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode == null) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode = "";
            }
            if (PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName == null) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName = "";
            }
            if (PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_ToName == null) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_ToName = "";

            }
            if (PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_ToCode == null) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_ToCode = "";
            }
        }
        function removehyphen(index) {
            if (PickupanddeliverydetailCtrl.ePage.Masters.FromCodeName = "-") {
                PickupanddeliverydetailCtrl.ePage.Masters.FromCodeName = "";
            }
            if (PickupanddeliverydetailCtrl.ePage.Masters.ToCodeName = "-") {
                PickupanddeliverydetailCtrl.ePage.Masters.ToCodeName = "";
            }
        }



        function SelectedLookupFromData(item, index) {
            if (item.entity) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode = item.entity.Code;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName = item.entity.FullName;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].PickupFrom_TPD_FK = item.entity.PK;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Address1 = item.entity.OAD_Address1;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Address2 = item.entity.OAD_Address2;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_State = item.entity.OAD_State;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_City = item.entity.OAD_City;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_PostCode = item.entity.OAD_PostCode;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Fax = item.entity.OAD_Fax;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Phone = item.entity.OAD_Phone;
                PickupanddeliverydetailCtrl.ePage.Masters.FromCodeName = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode + '-' + PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName;
            }
            else {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode = item.Code;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName = item.FullName;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].PickupFrom_TPD_FK = item.PK;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Address1 = item.OAD_Address1;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Address2 = item.OAD_Address2;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_State = item.OAD_State;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_City = item.OAD_City;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_PostCode = item.OAD_PostCode;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Fax = item.OAD_Fax;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_Phone = item.OAD_Phone;
                PickupanddeliverydetailCtrl.ePage.Masters.FromCodeName = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode + '-' + PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName;
            }
        }
        function SelectedLookupToData(item, index) {
            if (item.entity) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode = item.entity.Code;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName = item.entity.FullName;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].DeliveryTo_TPD_FK = item.entity.PK;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Address1 = item.entity.OAD_Address1;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Address2 = item.entity.OAD_Address2;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_State = item.entity.OAD_State;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_City = item.entity.OAD_City;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_PostCode = item.entity.OAD_PostCode;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Fax = item.entity.OAD_Fax;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Phone = item.entity.OAD_Phone;
                PickupanddeliverydetailCtrl.ePage.Masters.ToCodeName = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode + '-' + PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName;
            }
            else {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode = item.Code;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName = item.FullName;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].DeliveryTo_TPD_FK = item.PK;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Address1 = item.OAD_Address1;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Address2 = item.OAD_Address2;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_State = item.OAD_State;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_City = item.OAD_City;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_PostCode = item.OAD_PostCode;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Fax = item.OAD_Fax;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_Phone = item.OAD_Phone;
                PickupanddeliverydetailCtrl.ePage.Masters.ToCodeName = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode + '-' + PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName;
            }
        }

        // Get CFXType Dropdown list
        function GetDropDownList() {
            var typeCodeList = ["WMSYESNO", "WMSRelationShip", "INW_LINE_UQ", "PickMode"];
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
                        PickupanddeliverydetailCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickupanddeliverydetailCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        //Binding Two Values
        function GetBindingValues() {
            angular.forEach(PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
                if (value.ClientCode == null)
                    value.ClientCode = '';

                if (value.ClientName == null)
                    value.ClientName = '';

                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[key].Client = value.ClientCode + ' - ' + value.ClientName;
            });
        }

        // function SelectedLookupDataClient(item, index) {
        //     if (item.entity) {
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ClientCode = item.entity.Code;
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ClientName = item.entity.FullName;
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK = item.entity.PK;
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client = item.entity.Code + ' - ' + item.entity.FullName;
        //     }
        //     else {
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ClientCode = item.Code;
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ClientName = item.FullName;
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK = item.PK;
        //         PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client = item.Code + ' - ' + item.FullName;
        //     }
        //     OnChangeValues(PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client,'E7014',true,index)
        // }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(PickupanddeliverydetailCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                PickupanddeliverydetailCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey, PickupanddeliverydetailCtrl.currentPickupanddelivery.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                PickupanddeliverydetailCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, PickupanddeliverydetailCtrl.currentPickupanddelivery.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function setSelectedRow(index) {
            PickupanddeliverydetailCtrl.ePage.Masters.selectedRow = index;
        }

        function Cancel() {
            if (!PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[PickupanddeliverydetailCtrl.ePage.Masters.selectedRow].PK) {
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.splice(PickupanddeliverydetailCtrl.ePage.Masters.selectedRow, 1);
            }
            if (PickupanddeliverydetailCtrl.ePage.Masters.HeaderName == 'New List') {
                PickupanddeliverydetailCtrl.ePage.Masters.selectedRow = -1;
            }
            if (PickupanddeliverydetailCtrl.ePage.Masters.HeaderName == 'Copy Of List') {
                PickupanddeliverydetailCtrl.ePage.Masters.selectedRow = PickupanddeliverydetailCtrl.ePage.Masters.selectedRow - 1;
            }
            PickupanddeliverydetailCtrl.ePage.Masters.Lineslist = true;
            //PickupanddeliverydetailCtrl.ePage.Masters.Config.GeneralValidation(PickupanddeliverydetailCtrl.currentPickupanddelivery);
        }

        function Done() {
            if (PickupanddeliverydetailCtrl.ePage.Masters.HeaderName == 'New List') {
                Validation(PickupanddeliverydetailCtrl.currentPickupanddelivery, PickupanddeliverydetailCtrl.ePage.Masters.selectedRow);
                $timeout(function () {
                    var objDiv = document.getElementById("PickupanddeliverydetailCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            } else {
                //Validation(PickupanddeliverydetailCtrl.currentPickupanddelivery, PickupanddeliverydetailCtrl.ePage.Masters.selectedRow);
                PickupanddeliverydetailCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {

            PickupanddeliverydetailCtrl.ePage.Masters.FromCodeName = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgCode + '-' + PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].From_OrgName;
            PickupanddeliverydetailCtrl.ePage.Masters.ToCodeName = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgCode + '-' + PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index].To_OrgName;
            inputnull(index);
            removehyphen(index);

            PickupanddeliverydetailCtrl.ePage.Masters.selectedRow = index;
            PickupanddeliverydetailCtrl.ePage.Masters.Lineslist = false;
            PickupanddeliverydetailCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (PickupanddeliverydetailCtrl.ePage.Masters.selectedRow != -1) {
                if (PickupanddeliverydetailCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (PickupanddeliverydetailCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        PickupanddeliverydetailCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (PickupanddeliverydetailCtrl.ePage.Masters.selectedRow == PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length - 1) {
                            return;
                        }
                        PickupanddeliverydetailCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function AddNewRow() {
            var item = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[PickupanddeliverydetailCtrl.ePage.Masters.selectedRow]
            var obj = {
                "PK": "",
                "Client": item.ClientCode + " - " + item.ClientName,
                "ClientCode": item.ClientCode,
                "ClientName": item.ClientName,
                "Relationship": item.Relationship,
                "ClientUQ": item.ClientUQ,
                "LocalPartNumber": item.LocalPartNumber,
                "LocalPartDescription": item.LocalPartDescription,
                "UsePartAttrib1": item.UsePartAttrib1,
                "UsePartAttrib2": item.UsePartAttrib2,
                "UsePartAttrib3": item.UsePartAttrib3,
                "UseExpiryDate": item.UseExpiryDate,
                "UsePackingDate": item.UsePackingDate,
                "PickMode": item.PickMode,
                "IsDeleted": item.IsDeleted
            };
            PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(PickupanddeliverydetailCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            PickupanddeliverydetailCtrl.ePage.Masters.Edit(PickupanddeliverydetailCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[PickupanddeliverydetailCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(PickupanddeliverydetailCtrl.ePage.Masters.selectedRow, 1);
                    if (item.PK) {
                        apiService.get("eAxisAPI", PickupanddeliverydetailCtrl.ePage.Entities.Header.API.RelatedOrganizationDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    toastr.success('Record Removed Successfully');
                    PickupanddeliverydetailCtrl.ePage.Masters.selectedRow = PickupanddeliverydetailCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddEmptyRow() {
            var obj = {
                "PK": "",
                "Client": "",
                "ClientCode": "",
                "ClientName": "",
                "Relationship": "",
                "ClientUQ": "",
                "LocalPartNumber": "",
                "LocalPartDescription": "",
                "UsePartAttrib1": "",
                "UsePartAttrib2": "",
                "UsePartAttrib3": "",
                "UseExpiryDate": "",
                "UsePackingDate": "",
                "PickMode": "",
                "IsDeleted": "false"
            };
            PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.push(obj);
            PickupanddeliverydetailCtrl.ePage.Masters.Edit(PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length - 1, 'New List');
        };

        function Validation($item, index) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickupanddeliverydetailCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickupanddeliverydetailCtrl.ePage.Entities.Header.Validations) {
                PickupanddeliverydetailCtrl.ePage.Masters.Config.RemoveApiErrors(PickupanddeliverydetailCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                PickupanddeliverydetailCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupanddeliverydetailCtrl.currentPickupanddelivery);
            }
        }

        function SaveList($item) {
            PickupanddeliverydetailCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Product').then(function (response) {
                if (response.Status === "success") {
                    var _index = pickupanddeliveryConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(PickupanddeliverydetailCtrl.currentPickupanddelivery[PickupanddeliverydetailCtrl.currentPickupanddelivery.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        pickupanddeliveryConfig.TabList[_index][pickupanddeliveryConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        pickupanddeliveryConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            PickupanddeliverydetailCtrl.ePage.Masters.IsLoadingToSave = false;
                            PickupanddeliverydetailCtrl.ePage.Masters.Lineslist = true;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    PickupanddeliverydetailCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    PickupanddeliverydetailCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickupanddeliverydetailCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey, PickupanddeliverydetailCtrl.currentPickupanddelivery.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (PickupanddeliverydetailCtrl.ePage.Entities.Header.Validations != null) {
                        PickupanddeliverydetailCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupanddeliverydetailCtrl.currentPickupanddelivery);
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

        function Attach(item) {
            var _isExist = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.some(function (value, index) {
                return value.PK === item[index].PK;
            });

            if (!_isExist) {
                if(item.length > 1){
                    angular.forEach(item,function(value,key){
                        if(value.PK !== PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.PK){
                            PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.push(item[key]);
                        }
                    });
                }else{
                    if(item[0].PK !== PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.PK) {
                        PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.push(item[0]);
                    } else {
                        toastr.warning("You cannot add the same opened ORDER...!");
                    }
                }    
            } else {
                toastr.warning("Record Already Available...!");
            }
        }
        function Detach(index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DetachOrder(index);
                }, function () {
                    console.log("Cancelled");
                });
        }
        function DetachOrder(index) {
            var item = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders[index];
            var _index = PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.map(function (value, key) {
                return value.WorkOrderID;
            }).indexOf(item.WorkOrderID);

            if (_index !== -1) {
                item.IsDeleted = true;
                PickupanddeliverydetailCtrl.ePage.Entities.Header.Data.UIWmsPickupAndDeliveryOrders.splice(_index, 1);
            }
        }
        Init();
    }

})();