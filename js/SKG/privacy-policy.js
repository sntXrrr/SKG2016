//EU Cookie law functions
var cookieName = "SKGCookiesAllowed";

jQuery(document).ready(function () {
	var IsCookieSet = ReadCookie(cookieName);
	if (IsCookieSet == null) {
		CookieNotification();
	}

	//Only include HubSpot code if cookies are allowed by the user.
	if (IsCookieSet == "true") {
		//Start of Async HubSpot Analytics Code
		(function (d, s, i, r) {
			if (d.getElementById(i)) { return; }
			var n = d.createElement(s), e = d.getElementsByTagName(s)[0];
			n.id = i; n.src = '//js.hs-analytics.net/analytics/' + (Math.ceil(new Date() / r) * r) + '/617867.js';
			e.parentNode.insertBefore(n, e);
		})(document, "script", "hs-analytics", 300000);
		//End of Async HubSpot Analytics Code
	}
});

function CookieNotification() {
	jQuery("#cookieBanner").show();
}

function CreateCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function ReadCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}

	return null;
}

function EraseCookie(name) {
	CreateCookie(name, "", -1);
}

function ConfirmCookies() {
	CreateCookie(cookieName, "true", 365);
	jQuery("#cookieBanner").hide();
	window.location.reload();
}

function DeclineCookies() {
	CreateCookie(cookieName, "false", 1);
	jQuery("#cookieBanner").hide();
}