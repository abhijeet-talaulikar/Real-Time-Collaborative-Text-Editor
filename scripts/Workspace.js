var app = angular.module('workspace', []);

app.controller('FileManager', function($scope, $http) {
    
    $scope.initialize = function() {
        $http.get('/getFileDetail')
        .then(function(response) {
            if(response.data !== "none") {
                var cookiearray = document.cookie.split(';');
                var flag = false;
                for(var i=0; i<cookiearray.length; i++){
                    name = cookiearray[i].split('=')[0];
                    value = cookiearray[i].split('=')[1];
                    if(name == 'creator' && value == 'true') {
                        flag = true;
                        break;
                    } 
                }
                if(flag) {
                    $("#save").prop("disabled", false);
                    $("#close").prop("disabled", false);
                } else {
                    $("#save").prop("disabled", true);
                    $("#close").prop("disabled", true);
                }
                $("#load").prop("disabled", true);
                $("#file-name").html(response.data.name);
                $("#file-type").html(response.data.type);
                $("#file-size").html(response.data.size.toFixed(3) + " KB");
                $http.get("/getFile").then(function (response) {
                    $("#content-area textarea").val(response.data);
                });
            }
        });
    };
    
    $scope.saveFile = function() {
        $http({
			method : 'POST',
			url : '/saveFile',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : $.param({text:$("#content-area textarea").val()})
		}).then(function(response) {
            window.location.href = '/download'; //trigger the download
		}, function(response) {
		});
    };
        
    $scope.closeFile = function() {
        $http({
			method : 'DELETE',
			url : '/closeFile'
		}).then(function(response) {
            $("#save").prop("disabled", true);
            $("#close").prop("disabled", true);
            $("#load").prop("disabled", false);
            $("#file-name").html('');
            $("#file-type").html('');
            $("#file-size").html('');
            $("#content-area textarea").val('');
            socket.emit('close', '');
            
            //delete the cookie
            document.cookie = "creator=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		}, function(response) {
		});
    };
});
