var arr = new Array();
arr[0] = "1000.00";
arr[1] = "1550.00";
arr[2] = "732.55";
arr[3] = "111.23";
var sum = 0;
for (var i = 0; i < arr.length; i++) {
	trace("Payment #" + i + "....." + arr[i] + "$");
	sum += ToNumber(arr[i]);
}
trace("Deposit Total Amount: " + sum);

TheApplication().RaiseErrorText("Total Amount: " + sum);