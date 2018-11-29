(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PartiesController", PartiesController);

    PartiesController.$inject = ["apiService", "helperService", "appConfig", "toastr"];

    function PartiesController(apiService, helperService, appConfig, toastr) {
        /* jshint validthis: true */
        var PartiesCtrl = this;

        function Init() {
            PartiesCtrl.ePage = {
                "Title": "",
                "Prefix": "Parties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": PartiesCtrl.input
            };

            if (PartiesCtrl.ePage.Entities) {
                InitParties();
            }
        }

        function InitParties() {
            PartiesCtrl.ePage.Masters.Parties = {};
            PartiesCtrl.ePage.Masters.Parties.Organization = {};

            PartiesCtrl.ePage.Masters.Parties.Refresh = Refresh;
            PartiesCtrl.ePage.Masters.Parties.AddNewParties = AddNewParties;
            PartiesCtrl.ePage.Masters.Parties.DeleteParties = DeleteParties;
            PartiesCtrl.ePage.Masters.Parties.GetOrganizationList = GetOrganizationList;
            PartiesCtrl.ePage.Masters.Parties.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            PartiesCtrl.ePage.Masters.Parties.OnBlurAutoCompleteList = OnBlurAutoCompleteList;

            PartiesCtrl.ePage.Masters.Parties.AddBtnText = "Add";
            PartiesCtrl.ePage.Masters.Parties.IsDisableAddBtn = false;

            GetPartiesList();
        }

        function GetPartiesList() {
            PartiesCtrl.ePage.Masters.Parties.ListSource = undefined;
            var _filter = {
                "EntityRefKey": PartiesCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": PartiesCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": PartiesCtrl.ePage.Entities.EntityRefCode
            };

            if (PartiesCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = PartiesCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = PartiesCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = PartiesCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (PartiesCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = PartiesCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = PartiesCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = PartiesCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataSharedEntity.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataSharedEntity.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PartiesCtrl.ePage.Masters.Parties.ListSource = response.data.Response;
                } else {
                    PartiesCtrl.ePage.Masters.Parties.ListSource = [];
                }
            });
        }

        function Refresh() {
            GetPartiesList();
        }

        function AddNewParties() {
            if (PartiesCtrl.ePage.Masters.Parties.OrgCode) {
                PartiesCtrl.ePage.Masters.Parties.AddBtnText = "Please Wait...";
                PartiesCtrl.ePage.Masters.Parties.IsDisableAddBtn = true;

                var _input = {
                    NewValue: PartiesCtrl.ePage.Masters.Parties.Organization.Code,
                    // OldValue: PartiesCtrl.ePage.Masters.Parties.Organization.Code,
                    EntityRefKey: PartiesCtrl.ePage.Entities.EntityRefKey,
                    EntitySource: PartiesCtrl.ePage.Entities.EntitySource,
                    EntityRefCode: PartiesCtrl.ePage.Entities.EntityRefCode,
                    IsModified: true
                }

                if (PartiesCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = PartiesCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = PartiesCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = PartiesCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (PartiesCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = PartiesCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = PartiesCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = PartiesCtrl.ePage.Entities.AdditionalEntityRefCode;
                }

                apiService.post("eAxisAPI", appConfig.Entities.DataSharedEntity.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            PartiesCtrl.ePage.Masters.Parties.ListSource.push(response.data.Response[0]);
                        }
                    } else {
                        toastr.error("Could not Add...!");
                    }

                    PartiesCtrl.ePage.Masters.Parties.AddBtnText = "Add";
                    PartiesCtrl.ePage.Masters.Parties.IsDisableAddBtn = false;
                    PartiesCtrl.ePage.Masters.Parties.OrgCode = undefined;
                });
            } else {
                toastr.warning("Keyword Should not be Empy...!");
            }
        }

        function DeleteParties($item, $index) {
            if ($item) {
                var _input = $item;
                _input.IsModified = true;
                _input.IsDeleted = true;

                apiService.post("eAxisAPI", appConfig.Entities.DataSharedEntity.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        PartiesCtrl.ePage.Masters.Parties.ListSource.splice($index, 1);
                    } else {
                        toastr.error("Could not Add...!");
                    }
                });
            }
        }

        function GetOrganizationList($viewValue) {
            var _filter = {
                "Autocompletefield": $viewValue
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgHeader.API.MasterFindAll.FilterID,
            };

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            PartiesCtrl.ePage.Masters.Parties.Organization.Code = $item.Code;
            PartiesCtrl.ePage.Masters.Parties.Organization.PK = $item.PK;
        }

        function OnBlurAutoCompleteList($event) {
            PartiesCtrl.ePage.Masters.Parties.IsOrgLoading = false;
            PartiesCtrl.ePage.Masters.Parties.IsOrgNoResults = false;
        }

        Init();
    }
})();
