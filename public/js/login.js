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

		$.post( "/api/login", {login: $("#login").val(), password: $("#password").val()}, function(result) {
			if(result === true){
				window.location="/"
			}else{
				var txt = ""
				switch(result){
					case "notFound":
						txt = "Пользователь не найден";
						break;
					case "wrongIp":
						txt = "Недопустимый ip"
						break;
					case "blocked":
						txt = "Пользователь заблокирован";
						break;
					case "wrongPass":
						txt = "Неправильный пароль";
						break;
					default:
						txt = "You shall not pass!"
						break;
				}
				err(txt)
			}
		});
		return false;
	})
})