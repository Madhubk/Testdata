(function() {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyDetailsController", CompanyDetailsController);

    CompanyDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout","appConfig", "APP_CONSTANT", "authService", "apiService", "companyConfig", "helperService", "$filter", "$uibModal", "toastr"];

    function CompanyDetailsController($rootScope, $scope, $state, $q, $location, $timeout,appConfig, APP_CONSTANT, authService, apiService, companyConfig, helperService, $filter, $uibModal, toastr) {
        /* jshint validthis: true */
        var CompanyDetailsCtrl = this;

        function Init() {
            var currentCompany = CompanyDetailsCtrl.currentCompany[CompanyDetailsCtrl.currentCompany.label].ePage.Entities;
            CompanyDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCompany
            };

            CompanyDetailsCtrl.ePage.Masters.OpenBasicsModel = OpenBasicsModel;
            CompanyDetailsCtrl.ePage.Masters.AddNewRow=AddNewRow;
            CompanyDetailsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CompanyDetailsCtrl.ePage.Masters.RemoveRow = RemoveRow;        
            CompanyDetailsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CompanyDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;

            CompanyDetailsCtrl.ePage.Masters.DropDownMasterList = {
                "ExRateType": {
                    "ListSource": []
                },
                "ExRateSubType": {
                    "ListSource": []
                },
                "JobType":{
                    "ListSource": []
                },
                "BussType":{
                    "ListSource": []
                },
                "ModeofTransport":{
                    "ListSource": []
                }
            };
            GetMastersDropDownList();
            debugger;
            console.log(CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift);
        }

        function GetMastersDropDownList() {
            var typeCodeList = ["EXRATETYPE", "EXSUBRATE","MODEOFTRANSPORT","JOBTYPE","BUSSTYPE"];
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
                        CompanyDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CompanyDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        function AddNewRow() {
            var obj = {
                "JobType": "",
                "BusinessType": "",
                "ModeOfTransport": "",
                "Currency": "",
                "CfxPercentage": "",
                "CfxMin": "",                         
                "LineNo": CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length + 1
            };

            CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.push(obj);
            CompanyDetailsCtrl.ePage.Masters.selectedRow = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("CompanyDetailsCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var _Count = 0;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                    if (value.SingleSelect == true && value.Costpost || value.Revenuepost) {
                        value.IsDeleted = false;
                    }
                    else if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                CompanyDetailsCtrl.ePage.Masters.SelectedDeltion = $filter('filter')(CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift, { IsDeleted: true })
                CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", companyConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
                    }
                    else if (value.SingleSelect && value.PK && !value.IsDeleted) {
                        _Count = _Count + 1;
                    }
                });

                if (_Count > 0) {
                    toastr.error('Please Check, Already Posted Record Could Not Delete.');
                }

                var ReturnValue = RemoveAllLineErrors();
                if (ReturnValue) {
                    angular.forEach(CompanyDetailsCtrl.ePage.Masters.SelectedDeltion, function (val1, key1) {
                        angular.forEach(CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift, function (val2, key2) {
                            // Creditor Deletion 
                            if (val2.VendorCode == val1.VendorCode && val2.RX_NKCostCurrency == val1.RX_NKCostCurrency && !val1.SingleSelect) {
                                // if same creditor Available, No deletion against Exchange Rate(CRD only)
                            } else {
                                // if same creditor not Available, deletion against Exchange Rate(CRD only) 
                                angular.forEach(CompanyDetailsCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (val3, key3) {
                                    if (val1.VendorCode == val3.Code && val1.RX_NKCostCurrency == val3.FromCurrency && val3.OrgType == "CRD") {
                                        CompanyDetailsCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key3, 1)
                                    }
                                });
                            }
                            if (val2.CustomerCode == val1.CustomerCode && val2.RX_NKSellCurrency == val1.RX_NKSellCurrency && !val1.SingleSelect) {
                                // if same debtor Available, No deletion against Exchange Rate(deb)
                            } else {
                                // if same debtor not Available, deletion against Exchange Rate(CRD only) 
                                angular.forEach(CompanyDetailsCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (val3, key3) {
                                    if (val1.CustomerCode == val3.Code && val1.RX_NKSellCurrency == val3.FromCurrency && val3.OrgType == "DEB") {
                                        CompanyDetailsCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key3, 1)
                                    }
                                });
                            }
                        });
                        if (key1 == CompanyDetailsCtrl.ePage.Masters.SelectedDeltion.length - 1) {
                            for (var i = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length - 1; i >= 0; i--) {
                                if (CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift[i].SingleSelect && CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift[i].IsDeleted) {
                                    CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.splice(i, 1);
                                    CostCalculation();
                                    RevenueCalculation();
                                    ProfitAndLossCalculation();
                                }
                            }
                        }
                    });
                    CompanyDetailsCtrl.ePage.Masters.Config.GeneralValidation(CompanyDetailsCtrl.currentCompany);
                }

                CompanyDetailsCtrl.ePage.Masters.selectedRow = -1;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }, function () {
                console.log("Cancelled");
            });
        }

        function setSelectedRow($index) {
            CompanyDetailsCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
            } else {
                CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift, function (value, key) {
                if (CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                    CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                    CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                }
                else {
                    value.SingleSelect = false;
                    CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                    CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                    CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                }
            });
        }


        function OpenBasicsModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "basics-edit right",
                scope: $scope,
                templateUrl: "app/mdm/company/company-details/company-edit-details/company-details-modal.html",
                controller: 'CompanyEditModalController as CompEditModalCtrl',
                bindToController: true,
                resolve: {
                    param: function() {
                        var exports = {
                            "CurrentCompany": CompanyDetailsCtrl.ePage.Entities.Header.Data
                        };
                        return exports;
                    }
                }
            }).result.then(
                function(response) {
                    if(response.Data != undefined){
                    var _isEmpty = angular.equals(response.Data, {});
                    if (!_isEmpty) {

                        // if (response.CurrComments.Comments.Description === "Detailed Goods Description") {
                        CompanyDetailsCtrl.ePage.Entities.Header.Data = response.Data;
                        toastr.success("Record Added Successfully...!")

                    } else {
                        toastr.warnig("Value Should not be Empty...!");
                    }
                }
                else
                {
                 CompanyDetailsCtrl.ePage.Entities.Header.Data = response;   
                }
                },
                function() {
                    console.log("Cancelled");
                }
            );
        }

        Init();
    }
})();
