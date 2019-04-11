(function () {
    'user strict';

    angular
        .module("Application")
        .factory('dynamicLookupConfig', DynamicLookupConfig);

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
        let _template = `<input class="form-control input-sm" type="text" placeholder="{{DynamicLookupCtrl.placeholder}}" data-ng-disabled="DynamicLookupCtrl.isDisabled" data-ng-model="DynamicLookupCtrl.myNgModel" uib-typeahead="x[DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay] as x[DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay] + ' -' + x[DynamicLookupCtrl.ePage.Masters.LookupConfig.DisplayColumns] for x in DynamicLookupCtrl.ePage.Masters.GetAutoCompleteList($viewValue)"  typeahead-editable="DynamicLookupCtrl.IsEditable" typeahead-wait-ms="200" typeahead-loading="DynamicLookupCtrl.ePage.Masters.IsLoading" typeahead-no-results="DynamicLookupCtrl.ePage.Masters.NoRecords" typeahead-append-to-body='true' typeahead-on-select="DynamicLookupCtrl.ePage.Masters.AutoCompleteOnSelect($item, $model, $label)" data-ng-blur="DynamicLookupCtrl.ePage.Masters.OnBlurLookup()" data-ng-change="DynamicLookupCtrl.ePage.Masters.OnChangeLookup()">
        <div class="clearfix dropdown-menu typeahead" data-ng-if="DynamicLookupCtrl.ePage.Masters.NoRecords" style="display: block !important; font-size: 12px;">
            <div class="auto-complete-no-result" style="padding: 0 10px;">No Results Found...!</div>
        </div>
        <div class="clearfix dropdown-menu typeahead" data-ng-if="DynamicLookupCtrl.ePage.Masters.IsLoading" style="display: block !important; font-size: 12px;">
            <div class="auto-complete-no-result" style="padding: 0 10px;">
                <i class="fa fa-spin fa-spinner"></i>
            </div>
        </div>`;
        $templateCache.put("DynamicLookup.html", _template);

        let exports = {
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
        let DynamicLookupCtrl = this;

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

            DynamicLookupCtrl.IsEditable = DynamicLookupCtrl.isEditable == true ? true : false;
        }

        function GetAutoCompleteList($viewValue) {
            let _index = -1;
            for (let x in dynamicLookupConfig.Entities) {
                _index = DynamicLookupCtrl.controlKey ? x.indexOf(DynamicLookupCtrl.controlKey) : x.indexOf(DynamicLookupCtrl.controlId);

                if (_index !== -1) {
                    DynamicLookupCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];

                    if (DynamicLookupCtrl.ePage.Masters.LookupConfig.setValues && typeof DynamicLookupCtrl.ePage.Masters.LookupConfig.setValues == "string") {
                        DynamicLookupCtrl.ePage.Masters.LookupConfig.setValues = JSON.parse(DynamicLookupCtrl.ePage.Masters.LookupConfig.setValues);
                    }
                    if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues && typeof DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues == "string") {
                        DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues = JSON.parse(DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues);
                    }
                    if (DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters && typeof DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters == "string") {
                        DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters = JSON.parse(DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters);
                    }
                }
            }

            DynamicLookupCtrl.ePage.Masters.LookupConfig.setValues.map(val => DynamicLookupCtrl.ePage.Masters.LookupConfig.defaults[val.sField] = DynamicLookupCtrl.obj[val.eField]);

            if (DynamicLookupCtrl.obj && DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters && DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters.length > 0) {
                DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters.map(value => {
                    if (value.FieldName != DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay) {
                        if (DynamicLookupCtrl.obj[value.FieldName] != undefined) {
                            value.value = DynamicLookupCtrl.obj[value.FieldName] ? DynamicLookupCtrl.obj[value.FieldName] : null;
                        }
                    } else {
                        value.value = $viewValue;
                    }
                });
            }

            let _input = {
                FilterID: DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterID,
                SearchInput: [...helperService.createToArrayOfObject(DynamicLookupCtrl.ePage.Masters.LookupConfig.defaults), ...[DynamicLookupCtrl.ePage.Masters.LookupConfig.PossibleFilters[0]]]
            };

            let _filterAPIArray = DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterAPI.split("/");
            let _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;
            let _api;
            if (_isFindLookup) {
                _api = _filterAPIArray.slice(0, -1).join("/");
                _input.DBObjectName = DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterAPI.split("/").pop();
            } else {
                _api = DynamicLookupCtrl.ePage.Masters.LookupConfig.FilterAPI;
            }

            return apiService.post("eAxisAPI", _api, _input).then(response => response.data.Response);
        }

        function OnChangeLookup() {
            if (!DynamicLookupCtrl.myNgModel) {
                let _index = -1;
                for (let x in dynamicLookupConfig.Entities) {
                    _index = DynamicLookupCtrl.controlKey ? x.indexOf(DynamicLookupCtrl.controlKey) : x.indexOf(DynamicLookupCtrl.controlId);
                    if (_index !== -1) {
                        DynamicLookupCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                    }
                }

                if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues && DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.length > 0) {
                    DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.map(value => DynamicLookupCtrl.obj[value.eField] = undefined);
                }
            }
        }

        function OnBlurLookup() {
            DynamicLookupCtrl.ePage.Masters.IsLoading = false;
            DynamicLookupCtrl.ePage.Masters.NoRecords = false;
        }

        function AutoCompleteOnSelect($item, $model, $label) {
            if (DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues && DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.length > 0) {
                DynamicLookupCtrl.ePage.Masters.LookupConfig.getValues.map(value => DynamicLookupCtrl.obj[value.eField] = $item[value.sField]);
            }

            DynamicLookupCtrl.autoCompleteOnSelect({
                $item: $item
            });
        }

        Init();
    }
})();
