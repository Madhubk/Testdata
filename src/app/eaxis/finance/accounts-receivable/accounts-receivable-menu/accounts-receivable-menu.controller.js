(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountReceivableMenuController", AccountReceivableMenuController);

        AccountReceivableMenuController.$inject = ["helperService", "apiService", "accountReceivableConfig", "toastr"];

    function AccountReceivableMenuController(helperService, apiService, accountReceivableConfig, toastr) {
        var AccountReceivableMenuCtrl = this;

        function Init() {
            debugger;
            var currentAccountReceivable = AccountReceivableMenuCtrl.currentAccountReceivable[AccountReceivableMenuCtrl.currentAccountReceivable.code].ePage.Entities;

            AccountReceivableMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountReceivable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountReceivable
            };

            AccountReceivableMenuCtrl.ePage.Masters.PostButtonText = "Post";
            AccountReceivableMenuCtrl.ePage.Masters.DisablePost = false;

            /* function */
            AccountReceivableMenuCtrl.ePage.Masters.Validation = Validation;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _Calculation = 0;

            if (_input.UIAccountreceivablelistdata.length > 0) {
                _input.UIAccountreceivablelistdata.map(function (value, key) {
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
            AccountReceivableMenuCtrl.ePage.Masters.PostButtonText = "Please Wait...";
            AccountReceivableMenuCtrl.ePage.Masters.DisablePost = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIAccTransactionHeader.PK = _input.PK;
                _input.UIAccTransactionHeader.CreatedDateTime = new Date();
                _input.UIAccTransactionHeader.EntitySource = "AP";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if ($item[$item.code].ePage.Entities.Header.Data.UIAccountreceivablelistdata.length > 0) {
                    $item[$item.code].ePage.Entities.Header.Data.UIAccountreceivablelistdata.map(function (value, key) {
                        (value.PK) ? value.IsModified = true : value.IsModified = false;
                    });
                }
            }

            helperService.SaveEntity($item, 'AccountPayable').then(function (response) {
                AccountReceivableMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                AccountReceivableMenuCtrl.ePage.Masters.PostButtonText = "Save";
                AccountReceivableMenuCtrl.ePage.Masters.DisablePost = false;

                if (response.Status === "success") {
                    apiService.get("eAxisAPI", accountReceivableConfig.Entities.API.AccountpayableList.API.GetById.Url + response.Data.UIAccTransactionHeader.PK).then(function (response) {
                        if (response.data.Status == "Success") {
                            AccountReceivableMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                            var _index = accountReceivableConfig.TabList.map(function (value, key) {
                                return value[value.code].ePage.Entities.Header.Data.PK;
                            }).indexOf(AccountReceivableMenuCtrl.currentAccountReceivable[AccountReceivableMenuCtrl.currentAccountReceivable.code].ePage.Entities.Header.Data.PK);

                            accountReceivableConfig.TabList.map(function (value, key) {
                                if (_index == key) {
                                    if (value.isNew) {
                                        value.label = AccountReceivableMenuCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Desc;
                                        value[AccountReceivableMenuCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.code] = value.isNew;
                                        delete value.isNew;
                                    }
                                }
                            });

                            if (_index !== -1) {
                                if (response.data.Response) {
                                    accountReceivableConfig.TabList[_index][accountReceivableConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                                }
                                else {
                                    accountReceivableConfig.TabList[_index][accountReceivableConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                                }
                                accountReceivableConfig.TabList[_index].isNew = false;
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