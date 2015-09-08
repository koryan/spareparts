'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('SecureCtrl', function ($scope, $http) {
		$scope.articulsArr = [];

		$scope.articulsSearch = function(articulsArr){
			if(!articulsArr || articulsArr.length == 0)return false;
			angular.element("loader").show();
			if(!Array.isArray(articulsArr)){
				articulsArr = articulsArr.split("\n")
			}
			$http.post("/api/articulsSearch", {articuls: articulsArr}).success(function(data) {
				angular.element("loader").hide();
				if(!data || data == "" || data.length == 0) alert("Ничего не найдено :(")
				$scope.result = data
			});
			
		}
		$scope.articulsLoadStart = function(){			
			//angular.element("loader").show();
			var data = new FormData().append("articuls", $("input[name=articuls]"))
			console.log(data)
			jQuery.ajax({
			    url: '/api/loadArticuls',
			    data: data,
			    cache: false,
			    contentType: false,
			    type: 'POST',
			    success: function(data){
			    	angular.element("loader").hide();
			    	console.log("resp", data)
			       $scope.result = data 
			    }
			});
			
		}
		$scope.sendQuery = function(){
			alert("In next version")
		}
	});		

angular.module('adminApp.controllers', []).
	controller('AdminCtrl', function ($scope, $location) {
		$scope.path = $location.$$path.substr(1)
		$scope.$watch("path", function(val) { 
			 $location.path(val);
		});
		$scope.mainMenu = [["","Сводка"],["userslist", "Управление пользователями"],["logs", "Логи"], ["xml", "Загрузка XML"]];
	}).
	controller('IndexCtrl', function ($scope, $http) {
		$http.post("/api/getSummaryS").success(function(data) {
			$scope.summary = data
		});

	}).
	controller('XmlCtrl', function ($scope, $http) {
		$scope.xmlLoadStart = function(){
			angular.element("loader").show();
		}
		
		$http.post("/api/getXmlLastTry").success(function(data) {				
			$scope.lastTry = data;
		});

	}).	
	controller('EditUserCtrl', function ($scope, $modalInstance, $http, user) {
		$scope.userAction = ["Редактирование", "Сохранить"];
		$scope.user = user
		$scope.ok = function () {
			$scope.err = "";
			
			if($scope.user.password != $scope.user.password2){
				$scope.err = "Введённые пароли не совпадают";
				return;
			}	

			$http.post("/api/userEdit", {user:$scope.user}).success(function(data) {				
				$modalInstance.close($scope.user);
			});

			
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}).
	controller('AddUserCtrl', function ($scope, $modalInstance, $http) {
		$scope.userAction = ["Создание", "Создать", true];
		$scope.user = {}
		$scope.ok = function () {
			$scope.err = "";
			
			if($scope.user.password != $scope.user.password2){
				$scope.err = "Введённые пароли не совпадают";
				return;
			}	
			delete $scope.user.password2;
			$http.post("/api/userCreate", {newUser:$scope.user}).success(function(data) {
				console.log(data)
				if(data.exists){
					$scope.err = "Пользователь '"+ $scope.user.login +"' уже существует";
					return;
				}
				//$scope.usersList = data;
				$modalInstance.close($scope.user);
			});

			
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}).
	controller('LogsCtrl', function ($scope, $http) {
		var zzz = function(){
			setTimeout(function(){
				jQuery("table.logs tbody td.params a").click(function(el){	
					if($(el.currentTarget).html() == "^"){
						$(el.currentTarget).html("v")
						$(el.currentTarget).next().hide()
					}else{
						$(el.currentTarget).html("^")
						$(el.currentTarget).next().show()
					}
				});	
			},0) 
		}
		$http.post("/api/getLogs/all").success(function(data) {					
			$scope.commonLogs = data;
			zzz()			
		});
		
		//$scope.getIndividual
		$scope.getIndividual = function(userLogin){
			$http.post("/api/getLogs/personal",{userLogin:userLogin}).success(function(data) {				
				$scope.individualLogs = data;
				zzz()
			});
			$scope.individualLogsUserName = userLogin;
		}
	}).
	controller('UsersListCtrl', function ($scope, $http, $modal) {
		var showUsersList = function(){
			$http.post("/api/getUsersListS").success(function(data) {
				$scope.usersList = data				
			});
		}
				

		$scope.switchUser = function(user){
			if(user.isBlocked){
				user.isBlocked = false
			}else user.isBlocked = true;
			$http.post("/api/userEdit", {user:user}).success(function(data) {
				showUsersList();
			});
		}

		$scope.openAddUserModal = function(){
			$modal.open({	
				templateUrl: '/templates/admin/editUser.html',
				controller: 'AddUserCtrl'
			}).result.then(function () {showUsersList();})
		}
		$scope.openEditUserModal = function(user){			
			$modal.open({	
				templateUrl: '/templates/admin/editUser.html',
				controller: 'EditUserCtrl',
				resolve: {
			        user: function () {
			          return user;
			        }
			    }
			}).result.then(function () {showUsersList();})
		}
		$scope.delUser = function(userLogin){
			if(confirm("Действительно удалить пользователя \""+userLogin+"\"?")){
				$http.post("/api/userRemove", {login:userLogin}).success(function(data) {
					showUsersList();
				});
			}
		}

		showUsersList();
	});
