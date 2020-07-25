
"use strict"
function Table(headerObjectParam, tableElementParam) {

    var data = null;
    var headerObject = headerObjectParam;
    var tableElement = tableElementParam;


    this.getData = function () {
        return data;
    };
    this.setData = function (dataParam) {
        data = dataParam;
    };

    var dateFormatter = function (dateParam, separator) {
        let tempDate = new Date(dateParam);
        let month = tempDate.toDateString().split(" ");
        let result = tempDate.getDate() + separator + (month[1]) + separator + tempDate.getFullYear();
        return result;
    };
    this.dateFormatter = function (dateParam, separator) {
        dateFormatter(dateParam, separator);
    };

    this.sort = function (sortBy, dataType, sortType, data) {

        switch (dataType) {
            case "string": {
                data.sort(function (a, b) {
                    let nameA = a[sortBy].toLowerCase();
                    let nameB = b[sortBy].toLowerCase();
                    let result = 0;
                    if (nameA > nameB) {
                        result = 1;
                    }
                    else {
                        result = -1;
                    }
                    if (sortType === "DSC") {
                        result *= -1;
                    }
                    return result;
                });
            }

                break;
            case "number": {
                data.sort(function (a, b) {
                    let result = a[sortBy] - b[sortBy];
                    if (sortType === "DSC") {
                        result *= -1;
                    }
                    return result;
                });
            }

                break;
            case "date": {
                data.sort(function (a, b) {
                    let result = new Date(a[sortBy]) - new Date(b[sortBy]);

                    if (sortType === "DSC") {
                        result *= -1;
                    }
                    return result;
                });
            }
                break;
        }

    };
    //Adding header culomns
    this.initHeader = function () {
        let tableHeader = tableElement.querySelector("thead");

        if (tableHeader !== null) {
            tableElement.removeChild(tableHeader);

        }
        tableHeader = document.createElement("thead");
        let headerRow = document.createElement("tr");
        for (let index in headerObject) {

            if (headerObject[index]["Display"]) {
                let tableHeaderData = document.createElement("th");
                tableHeaderData.innerText = headerObject[index]["Caption"];
                tableHeaderData.setAttribute("Key", headerObject[index]["Key"]);
                tableHeaderData.setAttribute("DataType", headerObject[index]["DataType"]);
                headerRow.appendChild(tableHeaderData);
            }
        }
        tableHeader.appendChild(headerRow);
        tableElement.appendChild(tableHeader);
    };
    // Adding Body section
    var initBody = function (data) {

        // if initializing happen more than once then table must be prepaired from scratch
        let tableBody = tableElement.querySelector("tbody");
        if (tableBody !== null) {
            tableElement.removeChild(tableBody);
        }
        tableBody = document.createElement("tbody");
        for (var rowIndex in data) {

            {
                let tableRow = document.createElement("tr");
                for (let columnIndex in data[rowIndex]) {
                    let tableRowData = document.createElement("td");

                    if (data[rowIndex][columnIndex] != data[rowIndex]["Link"] && data[rowIndex][columnIndex] != data[rowIndex]["Rank"]) {
                        tableRowData.innerText = data[rowIndex][columnIndex];
                        tableRow.appendChild(tableRowData);
                    }
                    //  Changing Date format 
                    if (data[rowIndex][columnIndex] == data[rowIndex]["Date"]) {
                        tableRowData.innerHTML = dateFormatter(data[rowIndex]["Date"], " ");
                        tableRowData.className = "FixedCell";
                        tableRow.appendChild(tableRowData);
                    }
                    if (data[rowIndex][columnIndex] == data[rowIndex]["Title"] && data[rowIndex]["Link"] != "") {
                        tableRowData.innerHTML = "<a href='" + data[rowIndex]["Link"] + "'" + " target='new'" + ">" + data[rowIndex]["Title"] + "</a>";
                        tableRow.appendChild(tableRowData);
                    }
                    if (data[rowIndex][columnIndex] == data[rowIndex]["Title"] && data[rowIndex]["Link"] == "") {
                        tableRowData.innerText = data[rowIndex]["Title"];
                        tableRow.appendChild(tableRowData);
                    }
                }
                tableBody.appendChild(tableRow);
            }
        }
        tableElement.appendChild(tableBody);
    };
    this.initBody = function (data) {
        initBody(data);
    }



    var filter = function (filteredData, filterBy, lookingFor) {

        switch (filterBy) {
            case "Book": {
                filteredData = filteredData.filter(function (a) {
                    let rs = new RegExp(lookingFor + "+", "gi");
                    if (a.Book.match(rs) !== null) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
                break;
            case "Day": {
                filteredData = filteredData.filter(function (a) {
                    let tempDay = new Date(a.Date).getDate();
                    if (tempDay == lookingFor) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
                break;
            case "Month": {
                filteredData = filteredData.filter(function (a) {
                    let tempMonth = new Date(a.Date).getMonth() + 1;
                    if (tempMonth == lookingFor) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
                break;
            case "Year": {
                filteredData = filteredData.filter(function (a) {
                    let tempYear = new Date(a.Date).getFullYear();
                    if (tempYear == lookingFor) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
                break;
            case "Reference": {
                filteredData = filteredData.filter(function (a) {
                    let rs = new RegExp(lookingFor + "+", "gi");
                    if (a.Reference.match(rs) !== null) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
                break;
            case "Preacher": {
                filteredData = filteredData.filter(function (a) {
                    let rs = new RegExp(lookingFor + "+", "gi");
                    if (a.Preacher.match(rs) !== null) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
                break;
            case "Title": {
                filteredData = filteredData.filter(function (a) {
                    let rs = new RegExp(lookingFor + "+", "gi");
                    if (a.Title.match(rs) !== null) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
                break;
        }
        return filteredData;
    };

    var filterTable = function (data) {
        let filteredData = data;
        let filterBy = null;
        let filterStr = null;
        let criteriaSpanBox = document.querySelectorAll(".criterion>span");
        if (criteriaSpanBox.length > 0) {
            for (var i = 0; i < criteriaSpanBox.length; i++) {
                filterBy = criteriaSpanBox.item(i).id.toString();
                filterStr = criteriaSpanBox.item(i).children[1].innerText;
                filteredData = filter(filteredData, filterBy, filterStr);
            }
        }
        return filteredData;
    };

    this.filterTable = function (data) {
        return filterTable(data);
    }

    this.initCriteria = function () {
        let addButton = document.querySelector("button#Add");
        addButton.addEventListener("click", function () {
            let input = document.getElementById("txtSearch").value;
            let id = document.querySelector("#filter").value;
            addCriteria(id, input);
        });

        let filterOption = document.getElementById("filter");
        let searchTextBox = document.getElementById("txtSearch");
        filterOption.addEventListener("change", function () {
        console.log(filterOption.value);
            switch (filterOption.value) {
                case "No filter": {
                    searchTextBox.setAttribute("placeholder", "Please select a filter first");
                }
                    break;
                case "Book": {
                    searchTextBox.setAttribute("placeholder", "e.g. Romans");
                }
                    break;

                case "Month": {
                    searchTextBox.setAttribute("placeholder", "e.g. 3");
                }
                    break;
                case "Preacher": {
                    searchTextBox.setAttribute("placeholder", "e.g. Gary");
                }
                    break;

                case "Reference": {
                    searchTextBox.setAttribute("placeholder", "e.g. Act");
                }
                    break;
                case "Title": {
                    searchTextBox.setAttribute("placeholder", "e.g. love");
                }
                    break;
                case "Year": {
                    searchTextBox.setAttribute("placeholder", "e.g. 2017");
                }
                    break;
            }

        });
    };

    var addCriteria = function (criteriaId, criteriaContent) {
        let checkFlag = false;

        switch (criteriaId) {
            case "Book": {
                if (criteriaContent.length > 0)
                    checkFlag = true;
                else
                    alert("No 'Book' has been entered");
            }
                break;
            case "Month": {
                if (criteriaContent.length > 0)
                    checkFlag = true;
                else
                    alert("No 'Month' has been entered");
            }
                break;
            case "Year": {
                if (criteriaContent.length > 0)
                    checkFlag = true;
                else
                    alert("No 'Year' has been entered");
            }
                break;
            case "No filter": {
                alert("No filter has been selected");
            }
                break;
            case "Title": {
                if (criteriaContent.length > 0)
                    checkFlag = true;
                else
                    alert("No 'Title' has been entered");
            }
                break;
            case "Reference": {
                if (criteriaContent.length > 0)
                    checkFlag = true;
                else
                    alert("No 'Reference' has been entered");
            }
                break;
            case "Preacher": {
                if (criteriaContent.length > 0)
                    checkFlag = true;
                else
                    alert("No 'Preacher' has been entered");
            }
                break;
        }
        if (checkFlag != false) {
            let criterionBox = document.querySelector(".criterion");
            let spanBox = document.createElement("span");
            spanBox.id = criteriaId;
            spanBox.textContent = criteriaId + " : ";
            let closeLink = document.createElement("a");
            closeLink.className = "close";
            closeLink.href = "#";
            spanBox.appendChild(closeLink);
            let criterionLink = document.createElement("a");
            criterionLink.innerText = criteriaContent;
            spanBox.appendChild(criterionLink);
            spanBox.querySelectorAll("a.close")[0].addEventListener("click", function (event) {
                event.preventDefault();
                if (event.target.parentElement.parentElement !== null && event.target.parentElement !== null)
                    event.target.parentElement.parentElement.removeChild(event.target.parentElement);
                let result = filterTable(data);
                initBody(result);
            });

            criterionBox.appendChild(spanBox);
            let result = filterTable(data);
            initBody(result);

        }
    };
};