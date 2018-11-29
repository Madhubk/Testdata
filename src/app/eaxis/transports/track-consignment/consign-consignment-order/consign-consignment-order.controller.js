(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentOrderController", ConsignmentOrderController);

    ConsignmentOrderController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "adminConsignmentConfig", "createConsignConfig"];

    function ConsignmentOrderController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, toastr, $injector, $window, confirmation, adminConsignmentConfig, createConsignConfig) {

        var ConsignmentOrderCtrl = this;

        function Init() {
            var currentConsignment = ConsignmentOrderCtrl.currentConsignment[ConsignmentOrderCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            if ($state.current.url == "/consignment") {
                ConsignmentOrderCtrl.ePage.Masters.Config = adminConsignmentConfig;
            } else if ($state.current.url == "/create-consignment") {
                ConsignmentOrderCtrl.ePage.Masters.Config = createConsignConfig;
            } else {
                ConsignmentOrderCtrl.ePage.Masters.Config = consignmentConfig;
            }

            ConsignmentOrderCtrl.ePage.Masters.emptyText = "-";
            ConsignmentOrderCtrl.ePage.Masters.selectedRow = -1;
            ConsignmentOrderCtrl.ePage.Masters.Lineslist = true;
            ConsignmentOrderCtrl.ePage.Masters.HeaderName = '';

            ConsignmentOrderCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsignmentOrderCtrl.ePage.Masters.Edit = Edit;
            ConsignmentOrderCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ConsignmentOrderCtrl.ePage.Masters.Attach = Attach;
            ConsignmentOrderCtrl.ePage.Masters.AddNew = AddNew;
            ConsignmentOrderCtrl.ePage.Masters.Back = Back;
            ConsignmentOrderCtrl.ePage.Masters.Done = Done;
            ConsignmentOrderCtrl.ePage.Masters.GetItemDetails = GetItemDetails;
            ConsignmentOrderCtrl.ePage.Masters.SelectedLookupRegion = SelectedLookupRegion;
            ConsignmentOrderCtrl.ePage.Masters.GetQuantity = GetQuantity;
            ConsignmentOrderCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConsignmentOrderCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConsignmentOrderCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ConsignmentOrderCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConsignmentOrderCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ConsignmentOrderCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function GetQuantity(qty) {
            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].Quantity = parseInt(qty);
        }

        function SelectedLookupRegion(item) {
            if (item.data) {
                ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RegionCode = item.data.entity.Code;
                ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RGN_Name = item.data.entity.Name;
                ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RGN_FK = item.data.entity.PK;
            } else {
                ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RegionCode = item.Code;
                ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RGN_Name = item.Name;
                ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RGN_FK = item.PK;
            }
            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RegionCodeName = ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RegionCode + '-' + ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RGN_Name;
            OnChangeValues(ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RegionCode, 'E5551', true, ConsignmentOrderCtrl.ePage.Masters.selectedRow);
        }

        function GetItemDetails(item, index) {
            var _filter = {
                "RegionCodeTemp": item,
                "CurrentLocationCode": ConsignmentOrderCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentOrderCtrl.ePage.Entities.Header.API.ItemDetails.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentOrderCtrl.ePage.Entities.Header.API.ItemDetails.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    angular.forEach(response.data.Response, function (value, key) {
                        if (value.ItemCode == item) {
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID = response.data.Response[key].ItemRef_ID;
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_ItemRef_PK = response.data.Response[key].ItemRef_PK;
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Weight = response.data.Response[key].Weight;
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Length = response.data.Response[key].Length;
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Width = response.data.Response[key].Width;
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Height = response.data.Response[key].Height;
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Volumn = response.data.Response[key].Volumn;
                        }
                    })
                } else {
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_ItemRef_ID = "";
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_ItemRef_PK = "";
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Weight = "";
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Length = "";
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Width = "";
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Height = "";
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Volumn = "";
                }
                OnChangeValues(ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].RegionCode, 'E5547', true, ConsignmentOrderCtrl.ePage.Masters.selectedRow);
            });
        }

        function GetReceiver() {
            var _filter = {
                "MappingFor_FK": ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow].TIT_Sender_ORG_FK,
                "MappingCode": "SENDER_RECEIVER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentOrderCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentOrderCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentOrderCtrl.ePage.Masters.ReceiverList = response.data.Response;
                }
            });
        }

        function Back() {
            var item = ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow];
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
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.splice(ConsignmentOrderCtrl.ePage.Masters.selectedRow, 1);
                            ConsignmentOrderCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentOrderCtrl.currentConsignment);
                        }
                        ConsignmentOrderCtrl.ePage.Masters.Lineslist = true;
                        ConsignmentOrderCtrl.ePage.Masters.selectedRow = ConsignmentOrderCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ConsignmentOrderCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.length; i++) {
                OnChangeValues('value', "E5551", true, i);
                OnChangeValues('value', "E5552", true, i);
                OnChangeValues('value', "E5553", true, i);
            }
            return true;
        }
        function RemoveAllItemErrors() {
            for (var i = 0; i < ConsignmentOrderCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length; i++) {
                OnChangeValues('value', "E5547", true, i);
                OnChangeValues('value', "E5548", true, i);
            }
            return true;
        }

        function Done($item) {
            if (ConsignmentOrderCtrl.ePage.Masters.HeaderName == 'New List') {
                $timeout(function () {
                    var objDiv = document.getElementById("ConsignmentOrderCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            }

            var _isExist;
            var test1 = _.groupBy(ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders, 'RegionCode');
            angular.forEach(test1, function (value, key) {
                if (key == $item.RegionCode) {
                    if (value.length > 1) {
                        _isExist = true;
                    }
                }
            })
            if (!_isExist) {
                var _Data = ConsignmentOrderCtrl.currentConsignment[ConsignmentOrderCtrl.currentConsignment.label].ePage.Entities,
                    _input = _Data.Header.Data,
                    _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

                if (_input.Consignmentorders.length > 0) {
                    var ReturnValue = RemoveAllLineErrors();
                }

                if (_input.TmsConsignmentItem.length > 0) {
                    RemoveAllItemErrors();
                }
                //Validation Call
                ConsignmentOrderCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentOrderCtrl.currentConsignment);
                if (ConsignmentOrderCtrl.ePage.Entities.Header.Validations) {
                    ConsignmentOrderCtrl.ePage.Masters.Config.RemoveApiErrors(ConsignmentOrderCtrl.ePage.Entities.Header.Validations, ConsignmentOrderCtrl.currentConsignment.label);
                }

                if (_errorcount.length == 0) {
                    // Save($item);
                    SaveList(ConsignmentOrderCtrl.currentConsignment);
                } else {
                    ConsignmentOrderCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentOrderCtrl.currentConsignment);
                }

            } else {
                toastr.warning($item.RegionCode + " Already Available...!");
            }
            ConsignmentOrderCtrl.ePage.Masters.Lineslist = true;
            ConsignmentOrderCtrl.ePage.Entities.Header.Meta.ErrorWarning.Consignmentorders.ERROR
        }

        function SaveList($item) {
            ConsignmentOrderCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            angular.forEach(_input.Consignmentorders, function (value, key) {
                value.TIT_IsModified = true;
            });

            apiService.post("eAxisAPI", "TmsConsignmentList/Update", _input).then(function SuccessCallback(response) {
                if (response.data.Response.Status == "Success") {
                    toastr.success("Item Saved Successfully");
                    ConsignmentOrderCtrl.ePage.Masters.IsLoadingToSave = false;
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data = response.data.Response.Response;
                } else {
                    toastr.error("Item save failed. Please try again later");
                    ConsignmentOrderCtrl.ePage.Masters.IsLoadingToSave = false;
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
                "PK": "",
                "TMC_FK": ConsignmentOrderCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.PK,
                "RGN_FK": "",
                "CPONumber": "",
                "ASNNumber": "",
                "Qty": "",
                "IsModified": false,
                "IsDeleted": false,
            }
            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.push(obj);
            ConsignmentOrderCtrl.ePage.Masters.Edit(ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.length - 1, 'New List');
        }

        function setSelectedRow(index) {
            ConsignmentOrderCtrl.ePage.Masters.selectedRow = index;
        }

        function Attach($item) {
            $item.some(function (value, index) {
                var _isExist = ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.some(function (value1, index1) {
                    return value1.TIT_FK === value.PK;
                });
                if (!_isExist) {
                    var obj = {
                        "TMC_FK": "",
                        "RGN_FK": "",
                        "CPONumber": "",
                        "ASNNumber": "",
                        "Qty": "",
                        "IsModified": false,
                        "IsDeleted": false,
                    }
                    ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.push(obj);
                } else {
                    toastr.warning(value.ItemCode + " Already Available...!");
                }
            });
        }

        function Edit(index, name) {
            ConsignmentOrderCtrl.ePage.Masters.selectedRow = index;
            ConsignmentOrderCtrl.ePage.Masters.Lineslist = false;
            ConsignmentOrderCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        function RemoveRow($item) {
            var item = ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders[ConsignmentOrderCtrl.ePage.Masters.selectedRow]
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
                            ConsignmentOrderCtrl.ePage.Entities.Header.Data.Consignmentorders.splice(ConsignmentOrderCtrl.ePage.Masters.selectedRow, 1);
                            ConsignmentOrderCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentOrderCtrl.currentConsignment);
                        }
                        ConsignmentOrderCtrl.ePage.Masters.Lineslist = true;
                        ConsignmentOrderCtrl.ePage.Masters.selectedRow = ConsignmentOrderCtrl.ePage.Masters.selectedRow - 1;
                    } else {
                        item.IsDeleted = true;

                        ConsignmentOrderCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ConsignmentOrderCtrl.ePage.Entities.Header.Data, "IsModified");
                        apiService.post("eAxisAPI", 'TmsConsignmentList/Update', ConsignmentOrderCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + response.data.Response.Response.PK).then(function (response) {
                                    ConsignmentOrderCtrl.ePage.Entities.Header.Data = response.data.Response;
                                    toastr.success('Item Removed Successfully');
                                    var ReturnValue = RemoveAllLineErrors();
                                    if (ReturnValue) {
                                        ConsignmentOrderCtrl.ePage.Masters.Config.GeneralValidation(ConsignmentOrderCtrl.currentConsignment);
                                    }
                                    ConsignmentOrderCtrl.ePage.Masters.selectedRow = ConsignmentOrderCtrl.ePage.Masters.selectedRow - 1;
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