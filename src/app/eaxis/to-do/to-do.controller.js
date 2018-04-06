(function () {
    "use strict"

    angular
        .module("Application").directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
}).controller("ToDoController", ToDoController);

    ToDoController.$inject = ["helperService", "$location", "apiService", "authService", "APP_CONSTANT", "toDoConfig", "$cookies", "$cookieStore"];

    function ToDoController(helperService, $location, apiService, authService, APP_CONSTANT, toDoConfig, $cookies, $cookieStore) {
        var ToDoCtrl = this;

        function Init() {
            ToDoCtrl.epage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": toDoConfig.Entities
            };

            if ($cookieStore.get('search')==undefined) {
                $cookieStore.put('search', []);
            }

            ToDoCtrl.epage.Masters.ToDoListCount = 0;
            ToDoCtrl.epage.Masters.filterPanel = false;
            ToDoCtrl.epage.Masters.filterPanelOpen = filterPanelOpen;
            ToDoCtrl.epage.Masters.filterPanelClose = filterPanelClose;

            // ToDoCtrl.epage.Masters.totalItems = 25;
            ToDoCtrl.epage.Masters.currentPage = 1;
            ToDoCtrl.epage.Masters.pageChanged = pageChanged;
            // Date Picker//
            ToDoCtrl.epage.Masters.DatePicker = {};
            ToDoCtrl.epage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ToDoCtrl.epage.Masters.DatePicker.isOpen = [];
            ToDoCtrl.epage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ToDoCtrl.epage.Masters.AdvancedFilter = {};
            ToDoCtrl.epage.Masters.menuItems = [{
                'name': 'My Task',
                'status': 'I_ASSIGNED'
            }, {
                'name': 'My Group Task',
                'status': 'I_AVAILABLE'
            }];
            ToDoCtrl.epage.Masters.activeMenu = ToDoCtrl.epage.Masters.menuItems[0].status;
            ToDoCtrl.epage.Masters.AutoCompleteList = AutoCompleteList;
            ToDoCtrl.epage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            // ToDoCtrl.epage.Masters.AdvancedFilter.StartDate = new Date();
            // ToDoCtrl.epage.Masters.AdvancedFilter.DueDate = new Date();
            ToDoCtrl.epage.Masters.AdvancedFilter.ResetForm = ResetForm;
            ToDoCtrl.epage.Masters.GetToDoList = GetToDoList;

            ToDoCtrl.epage.Masters.GetToDoList(ToDoCtrl.epage.Masters.menuItems[0], ToDoCtrl.epage.Masters.currentPage);
        }

        function filterPanelOpen() {
            ToDoCtrl.epage.Masters.filterPanel = true;
        }

        function filterPanelClose() {
            ToDoCtrl.epage.Masters.filterPanel = false;
        }

        function pageChanged(item,currentPage) {
            GetToDoList(item,currentPage)
        };

        function AutoCompleteList(val) {



            // return $cookieStore.get('search');
            //  var _filtersearch = {
            //     "NewValue": val,
            //     "PageSize": "10",
            //     "PageNumber": "1",
            //     "SortType": "ASC",
            //     "SortColumn": "DTF_NewValue",
            // };
            // var _inputsearch = {
            //     "searchInput": helperService.createToArrayOfObject(_filtersearch),
            //     "FilterID": ToDoCtrl.epage.Entities.ToDoHeader.API.FullTextSearch.FilterID
            // };
            //  apiService.get("eAxisAPI", ToDoCtrl.epage.Entities.ToDoHeader.API.FullTextSearch.Url,val).then(function (response) {
            //     if (response.data.Status === "Success") {

            //         //  response.data.Response;
            //         ToDoCtrl.epage.Masters.ToDoListCount = response.data.Count;
            //         ToDoCtrl.epage.Masters.ToDoList = response.data.Response;
            //     } else {

            //     }
            // });

        }
        var rank = 0

        function AutoCompleteOnSelect(value) {
            // console.log(value)

              apiService.get("eAxisAPI", ToDoCtrl.epage.Entities.ToDoHeader.API.FullTextSearch.Url+'/'+value).then(function (response) {
                if (response.data.Status === "Success") {

                    //  response.data.Response;
                    ToDoCtrl.epage.Masters.ToDoListCount = response.data.Count;
                    ToDoCtrl.epage.Masters.ToDoList = response.data.Response;
                } else {

                }
            });
            // var searchSuggObj = [];
            //  searchSuggObj = $cookieStore.get('search');
            // // console.log(searchSuggObj[searchSuggObj.length-1].Rank)
            // var item = {
            //     "User": authService.getUserInfo().UserName(),
            //     "AppCode": appName,
            //     "SelectedValues": value,
            //     "Rank": searchSuggObj.length == 0 ? 1 : searchSuggObj[searchSuggObj.length-1].Rank + 1
            // };
           
            // console.log(searchSuggObj)
            // searchSuggObj.push(item);
            // $cookieStore.put('search', searchSuggObj);

            // console.log($cookieStore.get('search'));
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ToDoCtrl.epage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetToDoList(item, currentPage) {
            ToDoCtrl.epage.Masters.activeMenu = item.status;
            ToDoCtrl.epage.Masters.ToDoList = [];
            var _filter = {
                "Performer": "sbalaji",
                "PageSize": "10",
                "PageNumber": currentPage,
                "SortType": "ASC",
                "SortColumn": "ProcessTemplateName",
                "ProcessTemplateName": ToDoCtrl.epage.Masters.AdvancedFilter.Process,
                "ProcessInstanceId": ToDoCtrl.epage.Masters.AdvancedFilter.Instance,
                "DueDate": ToDoCtrl.epage.Masters.AdvancedFilter.DueDate,
                "StartTime": ToDoCtrl.epage.Masters.AdvancedFilter.StartDate,
                "WorkStepName": ToDoCtrl.epage.Masters.AdvancedFilter.Task,
                "Status": item.status

            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ToDoCtrl.epage.Entities.ToDoHeader.API.MyTask.FilterID
            };


            apiService.post("eAxisAPI", ToDoCtrl.epage.Entities.ToDoHeader.API.MyTask.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    ToDoCtrl.epage.Masters.ToDoListCount = response.data.Count;
                    ToDoCtrl.epage.Masters.ToDoList = response.data.Response;
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function ResetForm() {
            ToDoCtrl.epage.Masters.AdvancedFilter.DueDate = '';
            ToDoCtrl.epage.Masters.AdvancedFilter.StartDate = '';
            ToDoCtrl.epage.Masters.AdvancedFilter.Process = '';
            ToDoCtrl.epage.Masters.AdvancedFilter.Task = '';
            ToDoCtrl.epage.Masters.AdvancedFilter.Instance = '';
        }

        Init();
    }
})();
