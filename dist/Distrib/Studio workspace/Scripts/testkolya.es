var s = "TestParam=12345";
var pname = "";
var pval = "";

var c = s.indexOf("=");
pname = s.substring(0, c);
trace(pname);

pval = s.substring(c, s.length);
trace(pval);
