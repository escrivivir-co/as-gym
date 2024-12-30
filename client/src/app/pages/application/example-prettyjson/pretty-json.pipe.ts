import { Pipe, PipeTransform } from '@angular/core';

function syntaxHighlight(json: any): string {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match: string) {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );

    // Handle line breaks and spaces properly
    json = json.replace(/\n/g, '<br>');
    json = json.replace(/  /g, ' &nbsp;');  // Handle indentation (2 spaces to preserve formatting)
    json = json.replace(/(?<=\s) /g, '&nbsp;');  // Handle single space after whitespace

    return json;
  }

@Pipe({
  name: 'prettyjson',
  standalone: false
})
export class PrettyJsonPipe implements PipeTransform {
  // eslint-disable-next-line
  transform(value: any, ...args: any[]): any {
    return JSON.stringify(value, null, 2)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br/>');
  }

}

@Pipe({
	name: 'prettyjson',
	standalone: true
  })
  export class PrettyJsonPipeV2 implements PipeTransform {
	// eslint-disable-next-line
	transform(value: any, ...args: any[]): any {
	  return  syntaxHighlight(value);
	}
  }
