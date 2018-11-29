(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OneLevelMappingController", OneLevelMappingController);

    OneLevelMappingController.$inject = ["authService", "apiService", "helperService", "toastr", "appConfig"];

    function OneLevelMappingController(authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var OneLevelMappingCtrl = this;

        function Init() {
            OneLevelMappingCtrl.ePage = {
                "Title": "",
                "Prefix": "OneLevelMapping",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            OneLevelMappingCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;
            OneLevelMappingCtrl.ePage.Masters.Input = angular.copy(OneLevelMappingCtrl.input);
            OneLevelMappingCtrl.ePage.Masters.InputObject = angular.copy(OneLevelMappingCtrl.object);

            OneLevelMappingCtrl.ePage.Masters.OnAccessClick = OnAccessClick;
            OneLevelMappingCtrl.ePage.Masters.ShowMoreAccess = ShowMoreAccess;
            OneLevelMappingCtrl.ePage.Masters.HideMoreAccess = HideMoreAccess;
            OneLevelMappingCtrl.ePage.Masters.SaveAccess = SaveAccess;

            OneLevelMappingCtrl.ePage.Masters.IsDisableAccessSaveBtn = false;
            OneLevelMappingCtrl.ePage.Masters.AccessSaveBtnText = "Save";

            if (OneLevelMappingCtrl.ePage.Masters.Input) {
                GetAccessToList();
            }
        }

        function GetAccessToList() {
             if (OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Input) {
                var _isEmpty = angular.equals({}, OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Input);

                if (!_isEmpty) {
                    var _input = OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Input;

                    apiService.post(OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.API, OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.APIUrl, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            OneLevelMappingCtrl.ePage.Masters.AccessToListTemp = angular.copy(response.data.Response);
                            OneLevelMappingCtrl.ePage.Masters.AccessToList = response.data.Response;

                            GetMappingList();
                        } else {
                            OneLevelMappingCtrl.ePage.Masters.AccessToList = [];
                        }
                    });
                }
            }
        }

        function GetMappingList() {
            var _filter = {
                "MappingCode": OneLevelMappingCtrl.ePage.Masters.Input.MappingCode,
                "Item_FK": OneLevelMappingCtrl.ePage.Masters.Input.Item_FK,
                "SAP_FK":authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.FilterID
            };

            apiService.post(OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.API,  OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.FindAll, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OneLevelMappingCtrl.ePage.Masters.AccessToList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value2.Access_FK == value1.Item_FK) {
                                    value1.IsChecked = true;
                                    value1.MappingResponse = value2;
                                }
                            });
                        });
                    }
                } else {
                    OneLevelMappingCtrl.ePage.Masters.AccessToList = [];
                }
            });
        }

        function OnAccessClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            $item.Entity_FK = OneLevelMappingCtrl.ePage.Masters.Input.Item_FK;

            if (_isChecked && $item.Entity_FK && !$item.MappingResponse) {
                InsertAccess($item);
            } else if (!_isChecked && $item.Entity_FK && $item.MappingResponse) {
                DeleteAccess($item);
            }
        }

        function InsertAccess($item) {
            var _input = {
                // "TNT_FK": authService.getUserInfo().TenantPK,
                // "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": authService.getUserInfo().AppPK,
                "SAP_Code": authService.getUserInfo().AppCode,
                "MappingCode": OneLevelMappingCtrl.ePage.Masters.Input.MappingCode,
                "Item_FK": OneLevelMappingCtrl.ePage.Masters.Input.Item_FK,
                "ItemName": OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Type,
                "ItemCode": OneLevelMappingCtrl.ePage.Masters.Input.ItemCode,
                "OtherEntity_FK": OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Input.ParentRefKey,
                "OtherEntityCode": OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Input.ParentRefCode,
                "OtherEntitySource": OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.Input.ParentSource,
                 // "Access_FK": $item.PK,
                // "AccessCode": $item.ItemCode,
                "AccessTo": OneLevelMappingCtrl.ePage.Masters.Input.ItemName,
                "Access_FK": $item[OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.ValueField],
                "AccessCode": $item[OneLevelMappingCtrl.ePage.Masters.Input.AccessTo.TextField],
                "IsModified": true,
                "IsDefault": $item.IsDefault,
                "IsResticted": true
            };

            if (_input.PK) {
                apiService.post(OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.API,  OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.Update, _input).then(function (response) {
                    if (response.data.Response) {
                        $item.IsChecked = true;
                        $item.MappingResponse = response.data.Response[0];
                        $item.MappingResponse.IsResticted = true;
                    } else {
                        toastr.error("Could not Save...!");
                    }
                });
            } else {
                apiService.post(OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.API,  OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.Insert, [_input]).then(function (response) {
                    if(response.data.Response) {
                    $item.IsChecked = true;
                    $item.MappingResponse = response.data.Response[0];
                    $item.MappingResponse.IsResticted = true;
                } else {
                    toastr.error("Could not Save...!");
                }
                });
            }
        }

        function DeleteAccess($item) {
           apiService.get(OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.API,  OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.Delete + '/' + $item.MappingResponse.PK).then(function SuccessCallback(response) {
                 if (response.data.Response) {
                    $item.IsChecked = false;
                    delete $item.MappingResponse;
                } else {
                    toastr.error("Could not Save...!");
                }
            });
        }


        function ShowMoreAccess($item) {
            OneLevelMappingCtrl.ePage.Masters.ActiveMoreAccess = angular.copy($item);
        }

        function HideMoreAccess() {
            OneLevelMappingCtrl.ePage.Masters.ActiveMoreAccess = undefined;
        }

        function SaveAccess() {
            OneLevelMappingCtrl.ePage.Masters.SaveBtnTxt = "Please Wait...";
            OneLevelMappingCtrl.ePage.Masters.IsDisableAccessSaveBtn = true;

            var _input = angular.copy(OneLevelMappingCtrl.ePage.Masters.ActiveMoreAccess.MappingResponse);
            _input.IsModified = true;
             if (_input.PK) {
               apiService.post(OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.API,  OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.Update, _input).then(function (response) {
                    if (response.data.Response) {
                        OneLevelMappingCtrl.ePage.Masters.AccessToList = response.data.Response;
                    } else {
                        toastr.error("Could not Update...!");
                    }

                    OneLevelMappingCtrl.ePage.Masters.IsDisableAccessSaveBtn = false;
                    OneLevelMappingCtrl.ePage.Masters.AccessSaveBtnText = "Save";
                });
            } else {
                apiService.post(OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.API,  OneLevelMappingCtrl.ePage.Masters.Input.MappingAPI.Insert, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            var _index = OneLevelMappingCtrl.ePage.Masters.AccessToList.map(function (value, key) {
                                return value.PK;
                            }).indexOf(OneLevelMappingCtrl.ePage.Masters.ActiveMoreAccess.PK);

                            if (_index != -1) {
                                OneLevelMappingCtrl.ePage.Masters.AccessToList[_index].MappingResponse = response.data.Response[0];
                            }
                        }
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    OneLevelMappingCtrl.ePage.Masters.IsDisableAccessSaveBtn = false;
                    OneLevelMappingCtrl.ePage.Masters.AccessSaveBtnText = "Save";

                });
            }
      }

     Init();
    }
})();