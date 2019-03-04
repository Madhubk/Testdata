(function () {
    'user strict';

    angular
        .module("Application")
        .factory('dynamicLookupConfig', DynamicLookupConfig);

    DynamicLookupConfig.$inject = [];

    function DynamicLookupConfig() {
        var exports = {
            Entities: {}
        }
        return exports;
    }

    angular
        .module('Application')
        .directive('dynamicLookup', DynamicLookup);

    DynamicLookup.$inject = ["$templateCache"];

    function DynamicLookup($templateCache) {
        var _template = `<input class="form-control input-sm" type="text" placeholder="{{DynamicLookupCtrl.placeholder}}" data-ng-disabled="DynamicLookupCtrl.isDisabled" data-ng-model="DynamicLookupCtrl.myNgModel" uib-typeahead="x[DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay] as x[DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay] + ' -' + x[DynamicLookupCtrl.ePage.Masters.LookupConfig.DisplayColumns] for x in DynamicLookupCtrl.ePage.Masters.GetAutoCompleteList($viewValue)" typeahead-editable="DynamicLookupCtrl.IsEditable" typeahead-wait-ms="200" typeahead-loading="DynamicLookupCtrl.ePage.Masters.IsLoading" typeahead-no-results="DynamicLookupCtrl.ePage.Masters.NoRecords" typeahead-append-to-body='true' typeahead-on-select="DynamicLookupCtrl.ePage.Masters.AutoCompleteOnSelect($item, $model, $label)" data-ng-blur="DynamicLookupCtrl.ePage.Masters.OnBlurLookup()" data-ng-change="DynamicLookupCtrl.ePage.Masters.OnChangeLookup()">
        <div class="clearfix dropdown-menu typeahead" data-ng-if="DynamicLookupCtrl.ePage.Masters.NoRecords" style="display: block !important; font-size: 12px;">
            <div class="auto-complete-no-result" style="padding: 0 10px;">No Results Found!</div>
        </div>
        <div class="clearfix dropdown-menu typeahead" data-ng-if="DynamicLookupCtrl.ePage.Masters.IsLoading" style="display: block !important; font-size: 12px;">
            <div class="auto-complete-no-result" style="padding: 0 10px;">
                <i class="fa fa-spin fa-spinner"></i>
            </div>
        </div>`;
        $templateCache.put("DynamicLookup.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "DynamicLookup.html",
            controller: "DynamicLookupController",
            controllerAs: "DynamicLookupCtrl",
            scope: {
                myNgModel: '=',
                obj: "=",
                pageName: "=",
                controlId: "=",
                controlKey: "=",
                autoCompleteOnSelect: "&",
                placeholder: "@",
                isDisabled: "=",
                isEditable: "="
            },
            bindToController: true
        };

        return exports;
    }

    angular
        .module("Application")
        .controller("DynamicLookupController", DynamicLookupController);

    DynamicLookupController.$inject = ["apiService", "helperService", "dynamicLookupConfig"];

    function DynamicLookupController(apiService, helperService, dynamicLookupConfig) {
        var DynamicLookupCtrl = this;

        function Init() {
            DynamicLookupCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Lookup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": dynamicLookupConfig.Entities
            };

            DynamicLookupCtrl.ePage.Masters.GetAutoCompleteList = GetAutoCompleteList;
            DynamicLookupCtrl.ePage.Masters.OnChangeLookup = OnChangeLookup;
            DynamicLookupCtrl.ePage.Masters.OnBlurLookup = OnBlurLookup;
            DynamicLookupCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;

            (DynamicLookupCtrl.isEditable == true) ? DynamicLookupCtrl.IsEditable = true: DynamicLookupCtrl.IsEditable = false;
        }

        function GetAutoCompleteList($viewValue) {
            var _index = -1;
            for (var x in dynamicLookupConfig.Entities) {
                (DynamicLookupCtrl.controlKey) ? _index = x.indexOf(DynamicLookupCtrl.controlKey): _index = x.indexOf(DynamicLookupCtrl.controlId);

                if (_index !== -1) {
                    DynamicLookupCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                }

                // if (DynamicLookupCtrl.controlKey) {
                //     if (x == DynamicLookupCtrl.controlKey) {
                //         DynamicLookupCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                //     }
                // } else if (DynamicLookupCtrl.controlId) {
                //     if (x == DynamicLookupCtrl.controlId) {
                //         DynamicLookupCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                //     }
                // }
            }

            DynamicLookupCtrl.ePage.Masters.LookupConfig.setValues.map(function (val, key) {
                DynamicLookupCtrl.ePage.Masters.LookupConfig.defaults[val.sField] = DynamicLookupCtrl.obj[val.eField]
            });

            if (DynamicLookupCtrl.obj) {
                DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters.map(function (value, key) {
                    if (value.FieldName != DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay) {
                        if (DynamicLookupCtrl.obj[value.FieldName] != undefined) {
                            if (DynamicLookupCtrl.obj[value.FieldName]) {
                                value.value = DynamicLookupCtrl.obj[value.FieldName];
                            } else {
                                value.value = "";
                            }
                        }
                    } else {
                        value.value = $viewValue;
                    }
                });
            }

            var _input = {
                FilterID: DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterID,
                SearchInput: helperService.createToArrayOfObject(DynamicLookupCtrl.ePage.Masters.LookupConfig.defaults)
            };
            _input.SearchInput.push(DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters[0]);

            var _filterAPIArray = DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterAPI.split("/");
            var _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;

            if (_isFindLookup) {
                var _api = _filterAPIArray.slice(0, -1).join("/");
                _input.DBObjectName = DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterAPI.split("/").pop();
            } else {
                _api = DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterAPI;
            }

            return apiService.post("eAxisAPI", _api, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function OnChangeLookup() {
            if (!DynamicLookupCtrl.myNgModel) {
                var _index = -1;
                for (var x in dynamicLookupConfig.Entities) {
                    (DynamicLookupCtrl.controlKey) ? _index = x.indexOf(DynamicLookupCtrl.controlKey): _index = x.indexOf(DynamicLookupCtrl.controlId);

                    if (_index !== -1) {
                        DynamicLookupCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                    }
                }

                if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues) {
                    if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.length > 0) {
                        DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.map(function (value, key) {
                            DynamicLookupCtrl.obj[value.eField] = undefined;
                        });
                    }
                }
            }
        }

        function OnBlurLookup() {
            DynamicLookupCtrl.ePage.Masters.IsLoading = false;
            DynamicLookupCtrl.ePage.Masters.NoRecords = false;
        }

        function AutoCompleteOnSelect($item, $model, $label) {
            if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues) {
                if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.length > 0) {
                    DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.map(function (value, key) {
                        DynamicLookupCtrl.obj[value.eField] = $item[value.sField];
                    });
                }
            }

            DynamicLookupCtrl.autoCompleteOnSelect({
                $item: $item
            });
        }

        Init();
    }
})();
