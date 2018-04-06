(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OrganizationAddressController", OrganizationAddressController);

    OrganizationAddressController.$inject = ["$rootScope", "$scope", "$location", "APP_CONSTANT", "authService", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationAddressController($rootScope, $scope, $location, APP_CONSTANT, authService, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr, confirmation) {
        var OrganizationAddressCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.label].ePage.Entities;

            OrganizationAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrganizationAddressCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationAddressCtrl.ePage.Masters.OrgAddress = {};
            OrganizationAddressCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrganizationAddressCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            OrganizationAddressCtrl.ePage.Masters.DeleteAddress = DeleteAddress;

            var _isEmpty = angular.equals({}, OrganizationAddressCtrl.ePage.Masters.DropDownMasterList);

            if (_isEmpty) {
                GetMastersDropDownList();
            }

            SetMainAddress();
            
        }

        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["LANGUAGE", "JOBCATEGORY", "ROLE", "ADDRTYPE", "COMT_DESC"];
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
                        OrganizationAddressCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OrganizationAddressCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });

                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.AddressCapability = helperService.metaBase();

                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.ADDRTYPE.ListSource.map(function (value, key) {
                        OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.push({
                            AddressType: value.Key,
                            AddressTypeDes: value.Value,
                            IsMainAddress: false,
                            IsMapped: false,
                            IsModified: false,
                            IsValid: false
                        });
                    });
                }
            });

            // Get country
            var _inputCountry = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _inputCountry).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Country = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });

            // Get state
            var _inputState = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CountryState.API.FindAll.FilterID,
                "DBObjectName": appConfig.Entities.CountryState.API.FindAll.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.CountryState.API.FindAll.Url, _inputState).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.State = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.State.ListSource = response.data.Response;
                }
            });

            // Get department
            var _inputDepartment = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CmpDepartment.API.FindAll.FilterID,
                "DBObjectName": appConfig.Entities.CmpDepartment.API.FindAll.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpDepartment.API.FindAll.Url, _inputDepartment).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Department = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Department.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Department = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Department.ListSource = response.data.Response;
                }
            });

            // Get company
            var _inputCompany = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CmpCompany.API.FindAll.FilterID,
                "DBObjectName": appConfig.Entities.CmpCompany.API.FindAll.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpCompany.API.FindAll.Url, _inputCompany).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Company = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Company.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Company = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Company.ListSource = response.data.Response;
                }
            });

            // Get branch
            var _inputBranch = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CmpBranch.API.FindAll.FilterID,
                "DBObjectName": appConfig.Entities.CmpBranch.API.FindAll.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpBranch.API.FindAll.Url, _inputBranch).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Branch = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Branch.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Branch = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Branch.ListSource = response.data.Response;
                }
            });

            // Get debtor
            var _inputDebtor = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstDebtorGroup.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstDebtorGroup.API.FindAll.Url, _inputDebtor).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.DebtorGroup = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.DebtorGroup.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.DebtorGroup = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.DebtorGroup.ListSource = response.data.Response;
                }
            });

            // Get Creditor
            var _inputCreditor = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstCreditorGroup.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstCreditorGroup.API.FindAll.Url, _inputCreditor).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.CreditorGroup = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.CreditorGroup.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.CreditorGroup = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.CreditorGroup.ListSource = response.data.Response;
                }
            });

            // Get currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Currency = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.Currency.ListSource = response.data.Response;
                }
            });

            // Get Party Type
            var _inputPartyType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.OrgPartyType.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgPartyType.API.FindAll.Url, _inputPartyType).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.OrgPartyType = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.OrgPartyType.ListSource = response.data.Response;

                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.OrgPartyType = helperService.metaBase();
                    OrganizationAddressCtrl.ePage.Entities.Header.Meta.OrgPartyType.ListSource = response.data.Response;
                }
            });
        }

        function SetMainAddress() {
            var _address = [];
            var _index;
            if (OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.length > 0) {
                OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                    value.AddressCapability.map(function (val, index) {
                        if (val.AddressType === "OFC") {
                            if (val.IsMainAddress) {
                                _index = key;
                            }
                        }
                    });
                });

                if (_index != undefined) {
                    MoveArrayPosition(OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress, _index, 0);
                    OrganizationAddressCtrl.ePage.Masters.OrgAddress.HasMainAddress = true;
                }
            }
        }

        function MoveArrayPosition(arr, from, to) {
            arr.splice(to, 0, arr.splice(from, 1)[0]);
            return arr;
        }

        

        function OpenEditForm($item, type, isNewMode) {

                var _filter = {
                    "ORG_FK": OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID,
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if($item){
                            if($item.PK == "00000000-0000-0000-0000-000000000000")
                            { 
                                $item.PK = response.data.Response[0].PK ; 
                            }
                        }
                    OrganizationAddressCtrl.ePage.Masters.response = response.data.Response;
                if(response.data.Response.length != 0){
                    if($item){
                        var _index = response.data.Response.map(function (value, key) {
                        return value.PK
                        }).indexOf($item.PK);
                        $item = response.data.Response[_index];
                    }

                        var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: true,
                        windowClass: "address-edit right " + type,
                        scope: $scope,
                        templateUrl: "app/mdm/organization/address/organization-address-modal/" + type + "-modal.html",
                        controller: 'OrgAddressModalController as OrgAddressModalCtrl',
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "Entity": OrganizationAddressCtrl.currentOrganization,
                                    "Type": type,
                                    "Item": $item,
                                    "OrgAddress":OrganizationAddressCtrl.ePage.Masters.response,
                                    "isNewMode": isNewMode
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {
                            var _obj = {
                                "OrgAddress": OrgAddressResponse
                            };
                            _obj[response.type]();
                        },
                        function () {
                            console.log("Cancelled");
                        }
                    );
                }
                else{
                   toastr.warning("Main Address Creation Possible only at Organization Creation");  
                }
            }
                }); 
        }
        function OrgAddressResponse() {
            OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress = undefined;
            var _filter = {
                    "ORG_FK": OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID,
                };

            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress = response.data.Response;

                } else {
                    OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress = [];
                }
            });
        }

        function DeleteConfirmation($item, type) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteAddress($item, type);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteAddress($item, type) {
            OrganizationAddressCtrl.ePage.Masters[type].IsOverlay = true;
            apiService.get("eAxisAPI", appConfig.Entities[type].API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.Status === "Success") {
                        OrganizationAddressCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.PK === $item.PK) {
                                OrganizationAddressCtrl.ePage.Entities.Header.Data[type].splice(key, 1);
                            }
                        });
                        toastr.success("Record Deleted Successfully...!");
                    } else {
                        toastr.error("Could not Delete...!");
                    }

                    OrganizationAddressCtrl.ePage.Masters[type].IsOverlay = false;
                }
            });
        }

        Init();
    }
})();
