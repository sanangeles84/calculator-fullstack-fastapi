doNumOnClick = function (element) {
	let valueTxt = $("#valueTxt")[0].value;
	let btnValue = element.currentTarget.value;

	if (btnValue == ".") {
		//logic to check if I can add a "." at the end
		if (valueTxt[0] === "-") valueTxt = "m" + valueTxt.slice(1);
		let op;
		if (valueTxt.includes("+")) op = "+";
		else if (valueTxt.includes("-")) op = "-";
		else if (valueTxt.includes("*")) op = "*";
		else if (valueTxt.includes("/")) op = "/";
		let values = valueTxt.split(op);
		if (values.slice(-1)[0]?.includes(".")) return;
	} else if (btnValue === "00" && valueTxt === "0") return;
	if (valueTxt === "0" && btnValue != ".") $("#valueTxt")[0].value = element.currentTarget.value;
	else $("#valueTxt")[0].value += element.currentTarget.value;

	/*
	if (btnValue === "." && valueTxt.slice(-1) === ".") return;
	if (btnValue === "00" && valueTxt === "0") return;
	if (valueTxt === "0" && btnValue != ".")
		$("#valueTxt")[0].value = element.currentTarget.value;
	else $("#valueTxt")[0].value += element.currentTarget.value;
	*/
};

doOpOnClick = function (element) {
	let valueTxt = $("#valueTxt")[0].value;
	let btnValue = element.currentTarget.value;

	if (valueTxt === "0" && btnValue === "-") {
		$("#valueTxt")[0].value = "-";
		return;
	}
	//replace operator if the user clicked on a different one
	switch (valueTxt.slice(-1)) {
		case "+":
		case "-":
		case "*":
		case "/":
			$("#valueTxt")[0].value = valueTxt.slice(0, -1) + btnValue;
			return;
	}
	if (valueTxt.slice(-1))
		if (
			valueTxt.includes("+") ||
			(valueTxt.includes("-") && valueTxt[0] != "-") ||
			valueTxt.includes("*") ||
			valueTxt.includes("/")
		)
			doEval(btnValue);
		else $("#valueTxt")[0].value += btnValue;
};

doBackOnClick = function (element) {
	let valueTxt = $("#valueTxt")[0].value.slice(0, -1);
	if (valueTxt.length == 0) valueTxt = "0";
	$("#valueTxt")[0].value = valueTxt;
};

doClearOnClick = function (element) {
	$("#valueTxt")[0].value = "0";
};

var rootURL = window.location.origin + "/api/";
var token = "8IrQofhWDbuiaoF8Gs7BNKpz7YXSKB0dQzYoTZ7IV3iIHKUjF4q52RVC47I5SXRX"; //simplified version with fixed and unique token
doEval = function (nextOp = "") {
	let valueTxt = $("#valueTxt")[0].value;
	//skip if last character is an op, second number is still missing
	switch (valueTxt.slice(-1)) {
		case "+":
		case "-":
		case "*":
		case "/":
			return;
	}

	if (valueTxt === "0") return;
	if (valueTxt[0] === "-") valueTxt = "m" + valueTxt.slice(1); //substitute the starting "-" with an "m"

	let op;
	if (valueTxt.includes("+")) op = "+";
	else if (valueTxt.includes("-")) op = "-";
	else if (valueTxt.includes("*")) op = "*";
	else if (valueTxt.includes("/")) op = "/";
	else return;

	let num1 = valueTxt.split(op)[0],
		num2 = valueTxt.split(op)[1];
	op = op
		.replace("+", "sum")
		.replace("-", "subtract")
		.replace("*", "multiply")
		.replace("/", "divide");

	num1 = num1.replace("m", "-"); // replace the "m" with a starting "-" if needed

	$.ajax({
		type: "GET",
		url: rootURL + op + "/" + num1 + "/" + num2,
		dataType: "json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + token);
		}
	})
		.done(function (response) {
			$("#valueTxt")[0].value = response.result.toString() + nextOp;
		})
		.fail(function (err) {
			if (err?.responseJSON?.result) alert(err?.responseJSON?.result);
			else alert(err.responseText);
		});
};
