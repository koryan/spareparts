$( document ).ready(function() {

	var err = function(txt){
		$("tr.error td").html(txt)
		$("tr.error").show()
	}

	$("#form").submit(function(){
		
		$("tr.error").hide()

		if($("#login").val() == "" || $("#password").val() == ""){		
			err("Заполните все поля");
			return false;
		}

		$.post( "/api/login", {login: $("#login").val(), password: $("#password").val()}, function(valid) {
			if(valid){
//console.log("valid")
				window.location="/"
			}else err("Неправильный логин/пароль")
		});
		return false;
	})
})