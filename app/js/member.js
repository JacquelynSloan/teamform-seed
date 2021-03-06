$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

});

angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	// TODO: implementation of MemberCtrl
	
	
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
	
	//Set initial data for member
	//$scope.userID = "";
	//$scope.userName = "";	
	//$scope.teams = {};
	$scope.input = {
			userID: "",
			userName: "",
			description: "",
			image: "",
			tags: {},
			teams: {}
		};
	var reff = firebase.database().ref("teamform-46380");
	$scope.memberArr = $firebaseArray(reff);
	
	
	$scope.loadFunc = function() {
		var userID = $scope.input.userID;
		if ( userID !== '' ) {
			
			var refPath = getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {
								
				if ( data.child("name").val() != null ) {
					$scope.input.userName = data.child("name").val();
				} else {
					$scope.input.userName = "";
				}
				
				
				if (data.child("selection").val() != null ) {
					$scope.input.selection = data.child("selection").val();
				}
				else {
					$scope.input.selection = [];
				}
				$scope.$apply();
			});
		}
	}
	
	$scope.saveFunc = function() {
		
		
		var userID = $.trim( $scope.input.userID );
		var userName = $.trim( $scope.input.userName );
		
		if ( userID !== '' && userName !== '' ) {
									
			var newData = {				
				'name': userName,
				'selection': $scope.input.selection
			};
			
			var refPath = getURLParameter("q") + "/member/" + userID;	
			var ref = firebase.database().ref(refPath);
			
			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");
				
				// Finally, go back to the front-end
				window.location.href= "index.html";
			});
			
			
		
					
		}
	}
	
	$scope.refreshTeams = function() {
		var refPath = getURLParameter("q") + "/team";	
		var ref = firebase.database().ref(refPath);
		
		// Link and sync a firebase object
		$scope.selection = [];		
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);    
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
			$scope.index.selection=$scope.selection;
		}
	
	
		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then( function(data) {
								
							
							
			}) 
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});
			
		
	}
	
	
	$scope.refreshTeams(); // call to refresh teams...
		
}]);
