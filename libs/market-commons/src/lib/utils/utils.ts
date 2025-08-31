export class Utils {

  static exportToExcel(sHtmlFinal: string, name: string): void {
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{{worksheet}}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style type="text/css">{{css}}</style></head>' +
      '<body>{{table}}</body>' +
      '</html>';
    template = template.replace('{{css}}', '.center { text-align: center; } .single-line { white-space:nowrap; width:auto; } .text { mso-number-format:"\@" } .date {mso-number-format:"Short Date";} .decimal { mso-number-format:"\#\,\#\#0\.00"; }');
    template = template.replace('{{worksheet}}', 'Hoja1');
    template = template.replace('{{table}}', sHtmlFinal);

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // Si es Internet Explorer
    {
      //XportArea es un iframe creado en el html de la pagina
      var XportArea: any = document.getElementById('XportArea');
      if (!XportArea) {
        XportArea = document.createElement('iframe');
        XportArea.id = 'XportArea';
        XportArea.style.display = 'none';
        document.body.appendChild(XportArea);
      }

      XportArea.document.open('txt/html', 'replace');
      XportArea.document.write(template);
      XportArea.document.close();
      XportArea.focus();
      return XportArea.document.execCommand('SaveAs', true, name + '.xls');
    }
    else { //Otro explorador
      var formBlob = new Blob(['\ufeff', template], { type: 'application/vnd.ms-excel' });
      var link = document.createElement('a');
      link.download = name + '.xls';
      link.href = window.URL.createObjectURL(formBlob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static createTableHtml(data: any[], params: any[]): string {
    var html = '';
    html += '<table>';
    html += '<thead>';
    html += '<tr>';
    for (var i = 0; i < params.length; i++) {
      html += `<th>${params[i].th || ''}</th>`;
    }
    html += '</tr>';
    html += '<thead>';
    html += '<tbody>';
    for (var i = 0; i < data.length; i++) {
      html += '<tr>';
      for (var j = 0; j < params.length; j++) {
        html += `<td class="${params[j].type || ''}">
                            ${(typeof params[j].td === 'function') ?
            params[j].td(data[i]) :
            (this.isNullOrEmpty(data[i][params[j].td]) ? '' : data[i][params[j].td])}
                        </td>`;
      }
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    return html;
  }

  static isNullOrEmpty(value: any): boolean {
    return value === undefined || value === null || value === '';
  }

  static copyToClipboard(str: any) {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
  }

  static toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  static print(blob): void {
    const node = document.getElementById('ticket');
    if (node) document.body.removeChild(node);

    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.id = 'ticket';
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }
}