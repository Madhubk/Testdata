(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseDetailsController", WarehouseDetailsController);

    WarehouseDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "warehousesConfig", "helperService", "$filter", "$uibModal", "toastr", "appConfig", "$injector", "$document", "confirmation",];

    function WarehouseDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, warehousesConfig, helperService, $filter, $uibModal, toastr, appConfig, $injector, $document, confirmation) {
        var WarehouseDetailsCtrl = this;
        function Init() {


            var currentWarehouse = WarehouseDetailsCtrl.currentWarehouse[WarehouseDetailsCtrl.currentWarehouse.label].ePage.Entities;

            WarehouseDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            WarehouseDetailsCtrl.ePage.Masters.Config = $injector.get("warehousesConfig");

            WarehouseDetailsCtrl.ePage.Masters.DropDownMasterList = {};
            WarehouseDetailsCtrl.ePage.Masters.Arealist = true;
            WarehouseDetailsCtrl.ePage.Masters.selectedRow = -1;
            WarehouseDetailsCtrl.ePage.Masters.Lineslist = true;
            WarehouseDetailsCtrl.ePage.Masters.HeaderName = '';
            WarehouseDetailsCtrl.ePage.Masters.emptyText = '-'

            WarehouseDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            WarehouseDetailsCtrl.ePage.Masters.SelectedLookupOrganisation = SelectedLookupOrganisation;
            WarehouseDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            WarehouseDetailsCtrl.ePage.Masters.Edit = Edit;
            WarehouseDetailsCtrl.ePage.Masters.CopyRow = CopyRow;
            WarehouseDetailsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            WarehouseDetailsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            WarehouseDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            WarehouseDetailsCtrl.ePage.Masters.Back = Back;
            WarehouseDetailsCtrl.ePage.Masters.Done = Done;
            WarehouseDetailsCtrl.ePage.Masters.OtherOrganizationAddresses = OtherOrganizationAddresses;

            //Order By
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea = $filter('orderBy')(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea, 'CreatedDateTime');

            GetMastersList();
            RemoveHyphen();
            GetAddressList();
            GetOtherOrganizationAddress();
        }

        function RemoveHyphen() {
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationCode == null) {
                WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationCode = '';
            }
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationName == null) {
                WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationName = '';
            }
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization = WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationCode + ' - ' + WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OrganizationName;
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization == ' - ')
                WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization = '';
        }

        function GetMastersList() {

            var typeCodeList = ["WarehouseType", "AreaType"];
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
                        WarehouseDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        WarehouseDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupOrganisation(item) {
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization = item.Code + ' - ' + item.FullName;
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OAD_FK = item.OAD_PK;
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.ORG_FK = item.PK;
            OnChangeValues(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.Organization, 'E4007');
            GetAddressList();
            GetOtherOrganizationAddress();
        }

        function SelectedLookupData(item) {
            OnChangeValues(item.Code,'E4004');
            OnChangeValues(item.BranchName,'E4005');
        }

        function GetAddressList() {
            var _filter = {
                "PK": WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OAD_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": WarehouseDetailsCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.OAD_FK) {
                apiService.post("eAxisAPI", WarehouseDetailsCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.PK = response.data.Response[0].ORG_FK;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_PK = response.data.Response[0].PK;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Address1 = response.data.Response[0].Address1;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Address2 = response.data.Response[0].Address2;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_City = response.data.Response[0].City;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Code = response.data.Response[0].Code;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_CountryCode = response.data.Response[0].CountryCode;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Email = response.data.Response[0].Email;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Fax = response.data.Response[0].Fax;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_State = response.data.Response[0].State;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_PostCode = response.data.Response[0].PostCode;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Phone = response.data.Response[0].Phone;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_Mobile = response.data.Response[0].Mobile;
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.CountryCode = WarehouseDetailsCtrl.ePage.Entities.Header.Data.UIOrgHeader.OAD_CountryCode;

                        OnChangeValues(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.CountryCode, 'E4006');
                    }
                });
            }
        }

        function GetOtherOrganizationAddress() {
            WarehouseDetailsCtrl.ePage.Masters.OtherOrganizationAddress = '';
            var _filter = {
                "ORG_FK": WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.ORG_FK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": WarehouseDetailsCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.ORG_FK) {
                apiService.post("eAxisAPI", WarehouseDetailsCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        WarehouseDetailsCtrl.ePage.Masters.OtherOrganizationAddress = response.data.Response;
                    }
                });
            }
        }


        function OtherOrganizationAddresses(otheraddress) {
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/mdm/warehouse/warehouses/warehouse-details/organizationaddress/address.html',
                controller: 'OrganizationAddressController as OrganizationAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "CurrentData": WarehouseDetailsCtrl.ePage.Entities.Header.Data,
                            "otheraddress": otheraddress
                        };
                        return exports;
                    }
                }
            });
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(WarehouseDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                WarehouseDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, WarehouseDetailsCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                WarehouseDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, WarehouseDetailsCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        function setSelectedRow(index) {
            WarehouseDetailsCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length;i++){
                OnChangeValues('value', "E4009", true, i);
                OnChangeValues('value', "E4010", true, i);
                OnChangeValues('value', "E4011", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                WarehouseDetailsCtrl.ePage.Masters.Config.GeneralValidation(WarehouseDetailsCtrl.currentWarehouse);
            }
            WarehouseDetailsCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (WarehouseDetailsCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("WarehouseDetailsCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(WarehouseDetailsCtrl.currentWarehouse);
                WarehouseDetailsCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            WarehouseDetailsCtrl.ePage.Masters.selectedRow = index;
            WarehouseDetailsCtrl.ePage.Masters.Lineslist = false;
            WarehouseDetailsCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (WarehouseDetailsCtrl.ePage.Masters.selectedRow != -1) {
                if (WarehouseDetailsCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (WarehouseDetailsCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        WarehouseDetailsCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (WarehouseDetailsCtrl.ePage.Masters.selectedRow == WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length - 1) {
                            return;
                        }
                        WarehouseDetailsCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea[WarehouseDetailsCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.splice(WarehouseDetailsCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            WarehouseDetailsCtrl.ePage.Masters.Edit(WarehouseDetailsCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea[WarehouseDetailsCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", WarehouseDetailsCtrl.ePage.Entities.Header.API.AreaDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.splice(WarehouseDetailsCtrl.ePage.Masters.selectedRow, 1);                   
                        WarehouseDetailsCtrl.ePage.Masters.Config.GeneralValidation(WarehouseDetailsCtrl.currentWarehouse);
                    }
                    toastr.success('Record Removed Successfully');
                    WarehouseDetailsCtrl.ePage.Masters.Lineslist = true;
                    WarehouseDetailsCtrl.ePage.Masters.selectedRow = WarehouseDetailsCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "Name": "",
                "AreaType": "",
                "IsDeleted": false
            };
            WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.push(obj);
            WarehouseDetailsCtrl.ePage.Masters.Edit(WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length - 1, 'New List');
        };

        //------ Add New, copy, remove Row---------//

        //------- Entire Page Validation----------//
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            WarehouseDetailsCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (WarehouseDetailsCtrl.ePage.Entities.Header.Validations) {
                WarehouseDetailsCtrl.ePage.Masters.Config.RemoveApiErrors(WarehouseDetailsCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                WarehouseDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseDetailsCtrl.currentWarehouse);
            }
        }

        function SaveList($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

                _input.WmsWarehouse.IsActive = true;

            if ($item.isNew) {
                _input.PK = _input.WmsWarehouse.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            helperService.SaveEntity($item, 'Warehouse').then(function (response) {
                WarehouseDetailsCtrl.ePage.Masters.IsLoadingToSave = true;
                if (response.Status === "success") {
                    
                    warehousesConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                                value[WarehouseDetailsCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = warehousesConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(WarehouseDetailsCtrl.currentWarehouse[WarehouseDetailsCtrl.currentWarehouse.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        warehousesConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/warehouses") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            WarehouseDetailsCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    WarehouseDetailsCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    WarehouseDetailsCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        WarehouseDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, WarehouseDetailsCtrl.currentWarehouse.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (WarehouseDetailsCtrl.ePage.Entities.Header.Validations != null) {
                        WarehouseDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseDetailsCtrl.currentWarehouse);
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

        Init();

    }
})();