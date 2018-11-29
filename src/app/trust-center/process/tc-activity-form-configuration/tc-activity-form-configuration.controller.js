(function () {
    "use strict";
    angular
        .module("Application")
        .controller("TCActivityFormConfigurationController", TCActivityFormConfigurationController);

    TCActivityFormConfigurationController.$inject = ["$location", "authService", "apiService", "helperService", "confirmation", "trustCenterConfig"];

    function TCActivityFormConfigurationController($location, authService, apiService, helperService, confirmation, trustCenterConfig) {
        /* jshint validthis: true */

        var TCActivityFormConfigurationCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCActivityFormConfigurationCtrl.ePage = {
                "Title": "",
                "Prefix": "Activity Form",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCActivityFormConfigurationCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCActivityFormConfigurationCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCActivityFormConfigurationCtrl.ePage.Masters.QueryString.AppPk) {
                    InitActivityList();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitActivityList() {
            TCActivityFormConfigurationCtrl.ePage.Masters.DefaultFilter = {
                "MappingCode": "ACTIVITY_CONFIG"
            }
            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration = {};
            TCActivityFormConfigurationCtrl.ePage.Masters.AddNew = AddNew;
            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.Update = Update;
            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.Delete = DeleteConfirmationSingleRecord;
            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.OnActivityFormlistSave = OnActivityFormlistSave;
            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.DeleteConfirmation = DeleteConfirmation;
            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.SelectedData = SelectedData;
            GetActivityFormList();
        }

        function AddNew() {
            var _obj = {
                Code_3: '',
                ListSource: []
            };

            if (!TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource) {
                TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource = [];
            }

            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource.push(_obj);
        }

        function GetActivityFormList() {
            var _filter = {
                Fk_2: TCActivityFormConfigurationCtrl.input.PK,
                Code_2: TCActivityFormConfigurationCtrl.input.StepCode,
                SAP_FK: TCActivityFormConfigurationCtrl.ePage.Masters.QueryString.AppPk,
                MappingCode: "ACTIVITY_CONFIG"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _obj = _.groupBy(response.data.Response, 'Code_3');
                        var _list = [];
                        for (var x in _obj) {
                            var _x = {
                                Code_3: x,
                                ListSource: _obj[x]
                            };
                            _list.push(_x);
                        }
                        TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource = _list;

                    } else {
                        TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource = [];
                    }
                }
            });

        }

        function SelectedData($item, x) {
            OnActivityFormlistSave($item, x)
        }

        function OnActivityFormlistSave($item, x) {
            var _inputList = [];
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Name,

                            Fk_2: TCActivityFormConfigurationCtrl.input.PK,
                            Code_2: TCActivityFormConfigurationCtrl.input.StepCode,

                            Code_3: x.Code_3,
                            MappingCode: "ACTIVITY_CONFIG",
                            SAP_FK: TCActivityFormConfigurationCtrl.ePage.Masters.QueryString.AppPk,

                            IsModified: true,
                            IsActive: true
                        };
                        _inputList.push(_input);
                    });

                    apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, _inputList).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 0) {
                                x.ListSource = x.ListSource.concat(response.data.Response);
                            }
                        }
                    });
                }
            }
        }

        function Update($item) {
            if ($item.Code_3) {
                if (TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource) {
                    if (TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource.length > 0) {
                        var _index = TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource.map(function (value, key) {
                            return value.Code_3;
                        }).indexOf($item.Code_3);
                        if (_index != -1) {
                            var _obj = TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource[_index];
                            if (_obj.ListSource.length > 0) {
                                _obj.ListSource.map(function (value, key) {
                                    value.Code_3 = $item.Code_3;
                                    value.IsModified = true;
                                    value.SAP_FK = TCActivityFormConfigurationCtrl.ePage.Masters.QueryString.AppPk;
                                });

                                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, _obj.ListSource).then(function (response) {
                                    if (response.data.Response) {
                                        if (response.data.Response.length > 0) {
                                            $item.ListSource = response.data.Response;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }

        function DeleteConfirmationSingleRecord($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteSingleRecord($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteSingleRecord($item, $index) {
            if ($item.PK) {
                var _input = angular.copy($item);
                _input.IsDeleted = true;
                _input.IsModified = true;
                _input.SAP_FK = TCActivityFormConfigurationCtrl.ePage.Masters.QueryString.AppPk;

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource.map(function (value, key) {
                            value.ListSource.splice($index, 1);
                        });
                    }
                });
            }
        }

        function DeleteConfirmation($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteBulkRecords($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteBulkRecords($item, $index) {
            var _inputList = [];
            if ($item.ListSource) {
                if ($item.ListSource.length > 0) {
                    $item.ListSource.map(function (value, key) {
                        var _input = value;
                        _input.IsDeleted = true;
                        _input.IsModified = true;
                        _input.SAP_FK = TCActivityFormConfigurationCtrl.ePage.Masters.QueryString.AppPk;
                        _inputList.push(_input);
                    });

                    apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, _inputList).then(function (response) {
                        if (response.data.Response) {
                            TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource.splice($index, 1);
                        }
                    });
                } else {
                    TCActivityFormConfigurationCtrl.ePage.Masters.ActivityFormConfiguration.ListSource.splice($index, 1);
                }
            }
        }

        Init();
    }

})();