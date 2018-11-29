(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataEventController", DataEventController);

    DataEventController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "confirmation"];

    function DataEventController($timeout, authService, apiService, helperService, appConfig, confirmation) {
        /* jshint validthis: true */
        var DataEventCtrl = this;

        function Init() {
            DataEventCtrl.ePage = {
                "Title": "",
                "Prefix": "DataEvent",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": DataEventCtrl.input
            };

            if (DataEventCtrl.ePage.Entities) {
                InitDataEvent();
            }
        }

        function InitDataEvent() {
            DataEventCtrl.ePage.Masters.emptyText = "-";
            DataEventCtrl.ePage.Masters.DataEvent = {};

            DataEventCtrl.ePage.Masters.DataEvent.OnDataEventClick = OnDataEventClick;

            GetDataEventList();
            InitDataEventFieldList();
        }

        function GetDataEventList() {
            var _filter = {
                "PropertyName": "DTE_ClassSource",
                "EntityRefKey": DataEventCtrl.ePage.Entities.EntityRefKey,
                // "EntitySource": DataEventCtrl.ePage.Entities.EntitySource,
                // "EntityRefCode": DataEventCtrl.ePage.Entities.EntityRefCode
            };

            if (DataEventCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = DataEventCtrl.ePage.Entities.ParentEntityRefKey;
                // _filter.ParentEntitySource = DataEventCtrl.ePage.Entities.ParentEntitySource;
                // _filter.ParentEntityRefCode = DataEventCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (DataEventCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = DataEventCtrl.ePage.Entities.AdditionalEntityRefKey;
                // _filter.AdditionalEntitySource = DataEventCtrl.ePage.Entities.AdditionalEntitySource;
                // _filter.AdditionalEntityRefCode = DataEventCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.GetColumnValuesWithFilters.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DataEventCtrl.ePage.Masters.DataEvent.List = response.data.Response;

                    if (DataEventCtrl.ePage.Masters.DataEvent.List.length > 0) {
                        OnDataEventClick(DataEventCtrl.ePage.Masters.DataEvent.List[0]);
                    } else {
                        OnDataEventClick();
                    }
                } else {
                    DataEventCtrl.ePage.Masters.DataEvent.List = [];
                }
            });
        }

        function OnDataEventClick($item) {
            DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent = $item;
            if ($item) {
                GetDataEventFieldList();
            } else {
                DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource = [];
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = undefined;
                DataEventCtrl.ePage.Masters.DataEventFieldList.IsEdit = true;
            }
        }

        function InitDataEventFieldList() {
            DataEventCtrl.ePage.Masters.DataEventFieldList = {};
            DataEventCtrl.ePage.Masters.DataEventFieldList.OnDataEventFieldListClick = OnDataEventFieldListClick;
            DataEventCtrl.ePage.Masters.DataEventFieldList.Edit = Edit;
            DataEventCtrl.ePage.Masters.DataEventFieldList.Save = Save;
            DataEventCtrl.ePage.Masters.DataEventFieldList.DataEventCancel = DataEventCancel;
            DataEventCtrl.ePage.Masters.DataEventFieldList.DeleteConfirmation = DeleteConfirmation;
            DataEventCtrl.ePage.Masters.DataEventFieldList.OpenJsonModal = OpenJsonModal;
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsEdit = false;
            DataEventCtrl.ePage.Masters.DataEventFieldList.SaveBtnText = "OK";
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableSaveBtn = false;

            DataEventCtrl.ePage.Masters.DataEventFieldList.DeleteBtnText = "Delete";
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableDeleteBtn = false;
        }

        function GetDataEventFieldList() {
            DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource = undefined;
            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = undefined;

            var _filter = {
                "EntityRefKey": DataEventCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": DataEventCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": DataEventCtrl.ePage.Entities.EntityRefCode,
                "ClassSource": DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent
            };

            if (DataEventCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = DataEventCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = DataEventCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = DataEventCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (DataEventCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = DataEventCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = DataEventCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = DataEventCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource = response.data.Response;

                    if (DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.length > 0) {
                        OnDataEventFieldListClick(DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource[0]);
                    } else {
                        OnDataEventFieldListClick();
                    }
                } else {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource = [];
                }
            });
        }

        function OnDataEventFieldListClick($item) {
            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy($item);

            if (!$item) {
                DataEventCtrl.ePage.Masters.DataEventFieldList.IsEdit = true;
            }
        }

        function Edit() {
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsEdit = true;
            DataEventCtrl.ePage.Masters.DataEventFieldList.SaveBtnText = "OK";
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableSaveBtn = false;
        }

        function Save() {
            if (!DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList) {
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy(DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource[0]);
            } else {
                DataEventCtrl.ePage.Masters.DataEventFieldList.SaveBtnText = "Please Wait...";
                DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableSaveBtn = true;

                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.TenantCode = authService.getUserInfo().TenantCode;
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.SAP_FK = authService.getUserInfo().AppPK;
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.IsModified = true;
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.IsDeleted = false;
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.EntityRefKey = DataEventCtrl.ePage.Entities.EntityRefKey;
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.EntitySource = DataEventCtrl.ePage.Entities.EntitySource;
                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.EntityRefCode = DataEventCtrl.ePage.Entities.EntityRefCode;

                if (DataEventCtrl.ePage.Entities.ParentEntityRefKey) {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.ParentEntityRefKey = DataEventCtrl.ePage.Entities.ParentEntityRefKey;
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.ParentEntitySource = DataEventCtrl.ePage.Entities.ParentEntitySource;
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.ParentEntityRefCode = DataEventCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (DataEventCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.AdditionalEntityRefKey = DataEventCtrl.ePage.Entities.AdditionalEntityRefKey;
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.AdditionalEntitySource = DataEventCtrl.ePage.Entities.AdditionalEntitySource;
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.AdditionalEntityRefCode = DataEventCtrl.ePage.Entities.AdditionalEntityRefCode;
                }

                var _input = [DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList];

                apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _indexFieldName = DataEventCtrl.ePage.Masters.DataEvent.List.map(function (e) {
                            return e;
                        }).indexOf(response.data.Response[0].ClassSource);

                        if (_indexFieldName !== -1) {
                            DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent = response.data.Response[0].ClassSource;

                            OnDataEventClick(response.data.Response[0].ClassSource);

                            $timeout(function () {
                                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy(response.data.Response[0]);

                                var _index = DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.map(function (e) {
                                    return e.PK;
                                }).indexOf(response.data.Response[0].PK);

                                if (_index === -1) {
                                    DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.push(response.data.Response[0]);
                                } else {
                                    DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource[_index] = response.data.Response[0];
                                }
                            }, 1000);
                        } else {
                            DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent = response.data.Response[0].ClassSource;
                            DataEventCtrl.ePage.Masters.DataEvent.List.push(response.data.Response[0].ClassSource);
                            DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource = [];
                            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy(response.data.Response[0]);
                            DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.push(response.data.Response[0]);
                        }
                        DataEventCtrl.ePage.Masters.DataEventFieldList.IsEdit = false;
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    DataEventCtrl.ePage.Masters.DataEventFieldList.SaveBtnText = "OK";
                    DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableSaveBtn = false;
                });
            }
        }

        function DataEventCancel() {
            if (!DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList) {
                if (DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.length > 0) {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy(DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource[0]);
                } else {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource = undefined;
                }
            } else {
                var _index = DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.PK);

                if (_index !== -1) {
                    DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy(DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource[_index]);
                }
            }
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsEdit = false;
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete() {
            DataEventCtrl.ePage.Masters.DataEventFieldList.DeleteBtnText = "Please Wait...";
            DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableDeleteBtn = true;

            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.IsModified = true;
            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.IsDeleted = true;

            var _input = [DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList];

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.map(function (e) {
                        return e.PK
                    }).indexOf(DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.PK);

                    if (_index !== -1) {
                        DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.splice(_index, 1);

                        if (DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource.length > 0) {
                            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = angular.copy(DataEventCtrl.ePage.Masters.DataEventFieldList.ListSource[0]);
                        } else {
                            DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList = undefined;

                            var _Index = DataEventCtrl.ePage.Masters.DataEvent.List.indexOf(DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent);

                            if (_Index !== -1) {
                                DataEventCtrl.ePage.Masters.DataEvent.List.splice(_Index, 1);
                                DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent = DataEventCtrl.ePage.Masters.DataEvent.List[0];

                                OnDataEventClick(DataEventCtrl.ePage.Masters.DataEvent.ActiveDataEvent);
                            }
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                DataEventCtrl.ePage.Masters.DataEventFieldList.DeleteBtnText = "Delete";
                DataEventCtrl.ePage.Masters.DataEventFieldList.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _relateddetailsJson = DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.RelatedDetails;

            if (_relateddetailsJson !== undefined && _relateddetailsJson !== null && _relateddetailsJson !== '' && _relateddetailsJson !== ' ') {
                try {
                    if (typeof JSON.parse(_relateddetailsJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.RelatedDetails
                                    };
                                    return exports;
                                }
                            }
                        };
                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                DataEventCtrl.ePage.Masters.DataEventFieldList.ActiveDataEventFieldList.RelatedDetails = result;
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        Init();
    }
})();
