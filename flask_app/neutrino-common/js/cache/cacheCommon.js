function csvButton(csvData) {
	return csvData.replace(new RegExp(",(['\"])([+@=-])", 'g'), ",$1'$2");
}

function excelButton(csvData) {
	var body = csvData.body;
	var getSecureCellValue = function(cellData) {
		if (cellData != null && typeof cellData == 'string') {
			return cellData.replace(new RegExp("^([+@=-])", 'g'), "'$1");
		} else {
			return cellData;
		}
	}
	if (body != null) {
		var securyBody = [];
		body.forEach(function(row) {
			var secureColumns = [];
			if (row != null) {
				row.forEach(function(column) {
					secureColumns.push(getSecureCellValue(column));
				})
				securyBody.push(secureColumns);
			} else {
				securyBody.push(row);
			}

		})
	}
	csvData.body = securyBody;
	if (csvData.header != null) {
		var secureHeader = [];
		csvData.header.forEach(function(header) {
			secureHeader.push(getSecureCellValue(header));
		});
		csvData.header = secureHeader;
	}
	if (csvData.footer != null) {
		var secureFooter = [];
		csvData.footer.forEach(function(footer) {
			secureFooter.push(getSecureCellValue(footer));
		});
		csvData.footer = secureFooter;
	}
	for (var i = 0; i < csvData.body.length; i++) {
		for (var j = 0; j < csvData.body[i].length; j++) {
			if (typeof (csvData.body[i][j]) == "string") {
				if ((parseFloat(csvData.body[i][j]) != "NaN" && csvData.body[i][j].length > 15)
						|| csvData.body[i][j].charAt(0) === 0) {
					csvData.body[i][j] = csvData.body[i][j] + '\u200C';
				}
			}
			if (typeof (csvData.body[i][j]) == "number") {
				if (csvData.body[i][j].length > 15) {
					csvData.body[i][j] = csvData.body[i][j] + '\u200C';
				}
			}
		}
	}
	return csvData;
}

function pdfButton(doc, tableId) {
	var tblBody = doc.content[1].table.body;
	$(tableId)
			.find('tr')
			.each(
					function(ix, row) {
						$(row)
								.find('td')
								.each(
										function(ind, elt) {
											var isNumberType = $(
													tableId
															+ ' th:visible:not(.export-exclude)')
													.eq(ind).hasClass(
															'tbl-right');
											cssClass = $(row).hasClass('even') ? 'Even'
													: 'Odd';
											sStyle = 'tableBody' + cssClass;
											if (isNumberType == true) {
												if (tblBody[ix][ind] != 'undefined'
														&& tblBody[ix][ind] != null) {
													if (cssClass == 'Even') {
														tblBody[ix][ind].style = {
															alignment : 'right'
														};
													} else {
														tblBody[ix][ind].style = {
															fillColor : '#f3f3f3',
															alignment : 'right'
														};
													}
												}
											} else {
												if (tblBody[ix][ind] != 'undefined'
														&& tblBody[ix][ind] != null) {
													tblBody[ix][ind].style = sStyle;
												}
											}
										});
					});

}