(function () {
    var menuHeight = 0;
    var winY = window.pageYOffset;
    document.addEventListener("scroll", function (a) {
        menuHeight = 2;
        winY = window.pageYOffset;
        if (menuHeight <= winY && document.getElementsByClassName("FilterSection").length > 0) {
            document.getElementById("placeHolder").style.minHeight = document.getElementsByClassName("FilterSection").item(0).clientHeight + 50 + "px";
            document.getElementsByClassName("FilterSection").item(0).classList.add("Fixed-top");
            document.getElementsByClassName("FilterSection").item(0).classList.remove("FilterSection");  
        }
        if (menuHeight > winY && document.getElementsByClassName("Fixed-top").length > 0) {
            document.getElementsByClassName("Fixed-top").item(0).classList.add("FilterSection");
            document.getElementsByClassName("Fixed-top").item(0).classList.remove("Fixed-top");
            document.getElementById("placeHolder").style.cssText = "";
        }
    });
})();