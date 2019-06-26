(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableMenuController", AccountPayableMenuController);

    AccountPayableMenuController.$inject = ["helperService", "apiService", "accountPayableConfig", "toastr"];

    function AccountPayableMenuController(helperService, apiService, accountPayableConfig, toastr) {
        var AccountPayableMenuCtrl = this;

        function Init() {
            var currentAccountPayable = AccountPayableMenuCtrl.currentAccountPayable[AccountPayableMenuCtrl.currentAccountPayable.code].ePage.Entities;

            AccountPayableMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountPayable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountPayable
            };

            AccountPayableMenuCtrl.ePage.Masters.PostButtonText = "Post";
            AccountPayableMenuCtrl.ePage.Masters.DisablePost = false;

            /* function */
            AccountPayableMenuCtrl.ePage.Masters.Validation = Validation;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _Calculation = 0;

            if (_input.UIAccountpayablelistdata.length > 0) {
                _input.UIAccountpayablelistdata.map(function (value, key) {
                    _Calculation = _Calculation + parseFloat(value.LocalTotal);
                });

                if (_Calculation == parseFloat(_input.UIAccTransactionHeader.InclTax)) {
                    Save($item);
                } else {
                    toastr.error("Missmatch Local Total Amount.");
                }
            } else {
                toastr.error("Counld not post without Line Charges.");
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            AccountPayableMenuCtrl.ePage.Masters.PostButtonText = "Please Wait...";
            AccountPayableMenuCtrl.ePage.Masters.DisablePost = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIAccTransactionHeader.PK = _input.PK;
                _input.UIAccTransactionHeader.CreatedDateTime = new Date();
                _input.UIAccTransactionHeader.EntitySource = "AP";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if ($item[$item.code].ePage.Entities.Header.Data.UIAccountpayablelistdata.length > 0) {
                    $item[$item.code].ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                        (value.PK) ? value.IsModified = true : value.IsModified = false;
                    });
                }
            }

            helperService.SaveEntity($item, 'AccountPayable').then(function (response) {
                AccountPayableMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                AccountPayableMenuCtrl.ePage.Masters.PostButtonText = "Save";
                AccountPayableMenuCtrl.ePage.Masters.DisablePost = false;

                if (response.Status === "success") {
                    apiService.get("eAxisAPI", accountPayableConfig.Entities.API.AccountpayableList.API.GetById.Url + response.Data.UIAccTransactionHeader.PK).then(function (response) {
                        if (response.data.Status == "Success") {
                            AccountPayableMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                            var _index = accountPayableConfig.TabList.map(function (value, key) {
                                return value[value.code].ePage.Entities.Header.Data.PK;
                            }).indexOf(AccountPayableMenuCtrl.currentAccountPayable[AccountPayableMenuCtrl.currentAccountPayable.code].ePage.Entities.Header.Data.PK);

                            accountPayableConfig.TabList.map(function (value, key) {
                                if (_index == key) {
                                    if (value.isNew) {
                                        value.label = AccountPayableMenuCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Desc;
                                        value[AccountPayableMenuCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.code] = value.isNew;
                                        delete value.isNew;
                                    }
                                }
                            });

                            if (_index !== -1) {
                                if (response.data.Response) {
                                    accountPayableConfig.TabList[_index][accountPayableConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                                }
                                else {
                                    accountPayableConfig.TabList[_index][accountPayableConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                                }
                                accountPayableConfig.TabList[_index].isNew = false;
                                helperService.refreshGrid();
                            }

                            toastr.success("Saved Successfully...!");
                        }
                        else if (response.data.Status === "failed") {
                            console.log("GetById Failed");
                        }
                    });
                } else if (response.Status === "failed") {
                    toastr.error("Could not Save...!");
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
        //#endregion

        Init();
    }
})();