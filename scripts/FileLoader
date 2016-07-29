$(document).ready(function() {
    $("#loader").submit(function(e) {
        var formObj = $(this);
        var formURL = formObj.attr("action");
        var formData = new FormData(this);
        $.ajax({
            url: formURL,
            type: 'POST',
            data:  formData,
            mimeType:"multipart/form-data",
            contentType: false,
            cache: false,
            processData:false,
            success: function(data, textStatus, jqXHR) {
                $("#save").prop("disabled", false);
                $("#close").prop("disabled", false);
                $("#load").prop("disabled", true);
                $("#loader")[0].reset();
                data = JSON.parse(data);
                $("#file-name").html(data.name);
                $("#file-type").html(data.type.split("/")[1].toUpperCase());
                $("#file-size").html(data.size.toFixed(2) + " KB");
                $("#content-area textarea").val(data.text);
                
                // set the cookie
                var expiration_date = new Date();
                var cookie_string = '';
                expiration_date.setFullYear(expiration_date.getFullYear() + 1);
                cookie_string = "creator=true; path=/; expires=" + expiration_date.toGMTString();
                document.cookie = cookie_string;
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
        socket.emit('load', '');
        e.preventDefault(); //Prevent Default action. 
        e.unbind();
    });
    
    $("#content-area textarea").keyup(function(e) {
        var bytes = $("#content-area textarea").val().length;
        $("#file-size").html((bytes/1024).toFixed(3) + " KB");
    });
});
