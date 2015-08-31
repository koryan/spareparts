'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('SecureCtrl', function ($scope, $http) {
		$scope.articulsArr = [];
		$scope.articulsSearch = function(){
			$http.post("/api/articulsSearch", {articuls: $scope.articulsArr}).success(function(data) {
				$scope.result = data
			});
			
		}
		$scope.articulsLoadStart = function(){
			angular.element("loader").show();
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
	controller('LogsCtrl', function ($scope) {
		// write Ctrl here

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

			$http.post("/api/userCreate", {newUser:$scope.user}).success(function(data) {				
				$modalInstance.close($scope.user);
			});

			
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}).
	controller('AddUserCtrl', function ($scope, $modalInstance, $http) {
		$scope.userAction = ["Создание", "Создать"];
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
	controller('UsersListCtrl', function ($scope, $http, $modal) {
		var showUsersList = function(){
			$http.post("/api/getUsersListS").success(function(data) {
				$scope.usersList = data
			});
		}
		
		showUsersList();

		$scope.openAddUserModal = function(){
			$modal.open({	
				templateUrl: '/templates/admin/editUser.html',
				controller: 'AddUserCtrl'
			}).result.then(function () {showUsersList();})
		}
		$scope.openEditUserModal = function(user){
			console.log(user)
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

	});
