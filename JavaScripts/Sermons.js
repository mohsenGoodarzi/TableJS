(function () {
    //header of sermons table
    var header = [
        { Key: "Date", Caption: "Date", DataType: "date", Display: true, SortType: "DSC" },
        { Key: "Preacher", Caption: "Preacher", DataType: "string", Display: true, SortType: "ASC" },
        { Key: "Title", Caption: "Title", DataType: "string", Display: true, SortType: "ASC" },
        { Key: "Reference", Caption: "Reference", DataType: "string", Display: true, SortType: "ASC" },
        { Key: "Book", Caption: "Book", DataType: "string", Display: true, SortType: "ASC" },
        { Key: "Rank", Caption: "Rank", DataType: "number", Display: false, SortType: "ASC" },
        { Key: "Length", Caption: "Length (mm.ss)", DataType: "number", Display: true, SortType: "ASC" },
        { Key: "FileSize", Caption: "File Size (MB)", DataType: "number", Display: true, SortType: "ASC" },
        { Key: "Link", Caption: "Download Link", DataType: "string", Display: false, SortType: "ASC" }
    ];

    var mainTable = new Table(header, document.querySelector("table"));
    mainTable.initCriteria();
    ajax({
        type: "GET", url: "Data/" + "All" + ".json", timeout: 5000,
        Completed: function () {
        },
        Success: function (data) {
            let parsedData = JSON.parse(data);
            mainTable.initHeader();

            let filteredData = mainTable.filterTable(parsedData.Sermons);
            mainTable.setData(filteredData);
            mainTable.initBody(filteredData);

            // Adds Click event to each column for soriting
            let tableHeader = document.querySelectorAll("table > thead > tr > tH");
            for (let i = 0; i < tableHeader.length; i++)
                tableHeader[i].addEventListener("click", function (event) {

                    let criteriaBoxChildren = document.querySelectorAll(".criterion>span");
                    filteredData = mainTable.filterTable(mainTable.getData());

                    if (this.getAttribute("Key") == "Book") {
                        mainTable.sort("Rank", "number", tableHeader[i]["SortType"], filteredData);
                        mainTable.initBody(filteredData);
                    }
                    else {
                        mainTable.sort(this.getAttribute("Key"), this.getAttribute("DataType"), tableHeader[i]["SortType"], filteredData);
                        mainTable.initBody(filteredData);
                    }
                    if (tableHeader[i]["SortType"] === "DSC") {
                        tableHeader[i]["SortType"] = "ASC";
                    }
                    else {
                        tableHeader[i]["SortType"] = "DSC";
                    }
                });
        },
        Failed: function () {
            console.log("the data could not be loaded");
        }
    });

})();