(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentItemController", ConsignmentItemController);

    ConsignmentItemController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "adminConsignmentConfig", "createConsignConfig"];

    function ConsignmentItemController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, toastr, $injector, $window, confirmation, adminConsignmentConfig, createConsignConfig) {

        var ConsignmentItemCtrl = this;

        function Init() {
            var currentConsignment = ConsignmentItemCtrl.currentConsignment[ConsignmentItemCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            if ($state.current.url == "/consignment") {
                ConsignmentItemCtrl.ePage.Masters.Config = adminConsignmentConfig;
            } else if ($state.current.url == "/create-consignment") {
                ConsignmentItemCtrl.ePage.Masters.Config = createConsignConfig;
            } else {
                ConsignmentItemCtrl.ePage.Masters.Config = consignmentConfig;
            }

            ConsignmentItemCtrl.ePage.Masters.emptyText = "-";
            ConsignmentItemCtrl.ePage.Masters.selectedRow = -1;
            ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
            ConsignmentItemCtrl.ePage.Masters.HeaderName = '';

            ConsignmentItemCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsignmentItemCtrl.ePage.Masters.Edit = Edit;
            ConsignmentItemCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ConsignmentItemCtrl.ePage.Masters.Attach = Attach;
            ConsignmentItemCtrl.ePage.Masters.AddNew = AddNew;
            ConsignmentItemCtrl.ePage.Masters.Back = Back;
            ConsignmentItemCtrl.ePage.Masters.Done = Done;
            ConsignmentItemCtrl.ePage.Masters.GetItemDetails = GetItemDetails;
            ConsignmentItemCtrl.ePage.Masters.SelectedLookupItem = SelectedLookupItem;
            ConsignmentItemCtrl.ePage.Masters.GetQuantity = GetQuantity;
            ConsignmentItemCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ConsignmentItemCtrl.ePage.Masters.OnChangesItemValues = OnChangesItemValues;

        }

        function OnChangesItemValues() {
            if(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height == undefined){
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height = 0;    
            }
            if(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length == undefined){
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length = 0;                    
            }
            if(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width == undefined){
               ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width = 0; 
            }
            var volume = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height * ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width * ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length;
            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn = volume / 1000
            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn.toFixed(2);
        }
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConsignmentItemCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConsignmentItemCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ConsignmentItemCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConsignmentItemCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ConsignmentItemCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function GetQuantity(qty) {
            if(qty == 0 || qty == ""){
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].Quantity = 1;    
            }else{
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].Quantity = parseInt(qty);
            }
        }

        function SelectedLookupItem(item) {
            if (item.data) {
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID = item.data.entity.ProductCode;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_PK = item.data.entity.PK;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height = item.data.entity.Height;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length = item.data.entity.Length;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width = item.data.entity.Width;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Weight = item.data.entity.Weight;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_UOM = item.data.entity.MeasureUQ;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_VolumeUQ = item.data.entity.MeasureUQ;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_WeightUQ = item.data.entity.WeightUQ;
            } else {
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID = item.ProductCode;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_PK = item.PK;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height = item.Height;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length = item.Length;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width = item.Width;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Weight = item.Weight;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_UOM = item.MeasureUQ;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_VolumeUQ = item.MeasureUQ;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_WeightUQ = item.WeightUQ;
            }
            OnChangeValues(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID, 'E5548', true, ConsignmentItemCtrl.ePage.Masters.selectedRow);

            if (ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height == undefined)
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height = 1;
            if (ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length == undefined)
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length = 1;
            if (ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width == undefined)
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width = 1;

            var volume = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height * ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width * ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length;
            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn = volume / 1000
            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn.toFixed(2);
        }

        function GetItemDetails(item, index) {
            var _filter = {
                "TIT_ItemCodeTemp": item,
                "CurrentLocationCode": ConsignmentItemCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentItemCtrl.ePage.Entities.Header.API.ItemDetails.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentItemCtrl.ePage.Entities.Header.API.ItemDetails.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    angular.forEach(response.data.Response, function (value, key) {
                        if (value.ItemCode == item) {
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_FK = response.data.Response[key].PK;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID = response.data.Response[key].ItemRef_ID;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_PK = response.data.Response[key].ItemRef_PK;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Weight = response.data.Response[key].Weight;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length = response.data.Response[key].Length;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width = response.data.Response[key].Width;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height = response.data.Response[key].Height;
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn = response.data.Response[key].Volumn;
                        }
                    })
                } else {
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_FK = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemRef_PK = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Weight = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Length = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Width = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Height = "";
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Volumn = "";
                }
                OnChangeValues(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ItemCode, 'E5547', true, ConsignmentItemCtrl.ePage.Masters.selectedRow);
            });
        }

        function GetReceiver() {
            var _filter = {
                "MappingFor_FK": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Sender_ORG_FK,
                "MappingCode": "SENDER_RECEIVER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentItemCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentItemCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentItemCtrl.ePage.Masters.ReceiverList = response.data.Response;
                }
            });
        }

        function Back() {
            var item = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        var ReturnValue = RemoveAllLineErrors();
                        if (ReturnValue) {
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.splice(ConsignmentItemCtrl.ePage.Masters.selectedRow, 1);
                            ConsignmentItemCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentItemCtrl.currentConsignment);
                        }
                        ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
                        ConsignmentItemCtrl.ePage.Masters.selectedRow = ConsignmentItemCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length; i++) {
                OnChangeValues('value', "E5547", true, i);
                OnChangeValues('value', "E5548", true, i);
            }
            return true;
        }

        function RemoveAllOrderErrors() {
            for (var i = 0; i < ConsignmentItemCtrl.ePage.Entities.Header.Data.Consignmentorders.length; i++) {
                OnChangeValues('value', "E5551", true, i);
                OnChangeValues('value', "E5552", true, i);
                OnChangeValues('value', "E5553", true, i);
            }
            return true;
        }

        function Done($item) {

            if (ConsignmentItemCtrl.ePage.Masters.HeaderName == 'New List') {
                $timeout(function () {
                    var objDiv = document.getElementById("ConsignmentItemCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            }

            var _isExist;
            var test1 = _.groupBy(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem, 'TIT_ItemCode');
            angular.forEach(test1, function (value, key) {
                if (key != "") {
                    if (key == $item.TIT_ItemCode) {
                        if (value.length > 1) {
                            _isExist = true;
                        }
                    }
                }
            })
            if (!_isExist) {
                var _Data = ConsignmentItemCtrl.currentConsignment[ConsignmentItemCtrl.currentConsignment.label].ePage.Entities,
                    _input = _Data.Header.Data,
                    _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

                if (_input.TmsConsignmentItem.length > 0) {
                    var ReturnValue = RemoveAllLineErrors();
                }
                if (_input.Consignmentorders.length > 0) {
                    RemoveAllOrderErrors();
                }
                //Validation Call
                ConsignmentItemCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentItemCtrl.currentConsignment);
                if (ConsignmentItemCtrl.ePage.Entities.Header.Validations) {
                    ConsignmentItemCtrl.ePage.Masters.Config.RemoveApiErrors(ConsignmentItemCtrl.ePage.Entities.Header.Validations, ConsignmentItemCtrl.currentConsignment.label);
                }

                if (_errorcount.length == 0) {
                    // Save($item);
                    SaveList(ConsignmentItemCtrl.currentConsignment);
                } else {
                    ConsignmentItemCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentItemCtrl.currentConsignment);
                }

            } else {
                toastr.warning($item.TIT_ItemCode + " Already Available...!");
            }
            ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
        }

        function SaveList($item) {
            ConsignmentItemCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            angular.forEach(_input.TmsConsignmentItem, function (value, key) {
                value.TIT_IsModified = true;
            });

            apiService.post("eAxisAPI", "TmsConsignmentList/Update", _input).then(function SuccessCallback(response) {
                if (response.data.Response.Status == "Success") {
                    toastr.success("Item Saved Successfully");
                    ConsignmentItemCtrl.ePage.Masters.IsLoadingToSave = false;
                    ConsignmentItemCtrl.ePage.Entities.Header.Data = response.data.Response.Response;
                } else if (response.data.Response.Status == "ValidationFailed") {
                    ConsignmentItemCtrl.ePage.Masters.IsLoadingToSave = false;
                    
                    ConsignmentItemCtrl.ePage.Entities.Header.Validations = response.data.Response.Validations;
                    angular.forEach(response.data.Response.Validations, function (value, key) {
                        ConsignmentItemCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentItemCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ConsignmentItemCtrl.ePage.Entities.Header.Validations != null) {
                        ConsignmentItemCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentItemCtrl.currentConsignment);
                    }
                } else {
                    toastr.error("Item save failed. Please try again later");
                    ConsignmentItemCtrl.ePage.Masters.IsLoadingToSave = false;
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

        function AddNew() {
            var obj = {
                "TIT_ItemRef_ID": "",
                "TIT_ItemCode": "",
                "TIT_ItemDesc": "SSCC",
                "Quantity": 1,
                "TIT_ReceiverRef": "",
                "TIT_SenderRef": "",
                "TIT_Height": "",
                "TIT_Width": "",
                "TIT_Length": "",
                "TIT_Weight": "",
                "TIT_Volumn": "",
                "TIT_UOM": "",
                "TIT_VolumeUQ": "",
                "TIT_WeightUQ": "",
                "TIT_FK": "",
                "TIT_Receiver_ORG_FK": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                "TIT_ReceiverName": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName,
                "TIT_ReceiverCode": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode,
                "TIT_Sender_ORG_FK": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "TIT_SenderName": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName,
                "TIT_SenderCode": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                "TIT_ItemStatus": "",
                "PK": "",
                "IsDeleted": false,
                "IsModified": false
            }
            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.push(obj);
            ConsignmentItemCtrl.ePage.Masters.Edit(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length - 1, 'New List');
        }

        function setSelectedRow(index) {
            ConsignmentItemCtrl.ePage.Masters.selectedRow = index;
        }

        function Attach($item) {
            $item.some(function (value, index) {
                var _isExist = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.some(function (value1, index1) {
                    return value1.TIT_FK === value.PK;
                });
                if (!_isExist) {
                    var obj = {
                        "TIT_ItemRef_ID": value.ItemRef_ID,
                        "TIT_ItemCode": value.ItemCode,
                        "TIT_ItemDesc": value.ItemDesc,
                        "TIT_ReceiverRef": value.ReceiverRef,
                        "TIT_SenderRef": value.SenderRef,
                        "TIT_Height": value.Height,
                        "TIT_Width": value.Width,
                        "TIT_Length": value.Length,
                        "TIT_Weight": value.Weight,
                        "TIT_Volumn": value.Volumn,
                        "TIT_FK": value.PK,
                        "TIT_Receiver_ORG_FK": value.Receiver_ORG_FK,
                        "TIT_ReceiverName": value.ReceiverName,
                        "TIT_ReceiverCode": value.ReceiverCode,
                        "TIT_Sender_ORG_FK": value.Sender_ORG_FK,
                        "TIT_SenderName": value.SenderName,
                        "TIT_SenderCode": value.SenderCode,
                        "TIT_ItemStatus": value.ItemStatus,
                        "IsDeleted": value.IsDeleted,
                        "IsModified": value.IsModified
                    }
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.push(obj);
                } else {
                    toastr.warning(value.ItemCode + " Already Available...!");
                }
            });
        }

        function Edit(index, name) {
            ConsignmentItemCtrl.ePage.Masters.selectedRow = index;
            ConsignmentItemCtrl.ePage.Masters.Lineslist = false;
            ConsignmentItemCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        function RemoveRow($item) {
            var item = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK == "") {
                        var ReturnValue = RemoveAllLineErrors();
                        if (ReturnValue) {
                            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.splice(ConsignmentItemCtrl.ePage.Masters.selectedRow, 1);
                            ConsignmentItemCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentItemCtrl.currentConsignment);
                        }
                        toastr.success('Item Removed Successfully');
                        ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
                        ConsignmentItemCtrl.ePage.Masters.selectedRow = ConsignmentItemCtrl.ePage.Masters.selectedRow - 1;
                    } else {
                        item.IsDeleted = true;

                        ConsignmentItemCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ConsignmentItemCtrl.ePage.Entities.Header.Data, "IsModified");
                        apiService.post("eAxisAPI", 'TmsConsignmentList/Update', ConsignmentItemCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                                    ConsignmentItemCtrl.ePage.Entities.Header.Data = response.data.Response;
                                    toastr.success('Item Removed Successfully');
                                    var ReturnValue = RemoveAllLineErrors();
                                    if (ReturnValue) {
                                        ConsignmentItemCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentItemCtrl.currentConsignment);
                                    }
                                    ConsignmentItemCtrl.ePage.Masters.selectedRow = ConsignmentItemCtrl.ePage.Masters.selectedRow - 1;
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        Init();
    }

})();