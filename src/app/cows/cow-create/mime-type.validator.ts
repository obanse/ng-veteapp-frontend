import {AbstractControl} from '@angular/forms';
import {Observable, Observer, of} from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  if (typeof (control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  return new Observable((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
      /* Testen ob das dasselbe ist wie die zweite for-Schleife...
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }*/
      for (const buff of arr) {
        header += buff.toString(16);
      }
      // console.log("Header: " + header);
      switch (header) {
        // case "89504e47":
        //   // type = "image/png";
        //   isValid = true;
        //   break;
        // case "47494638":
        //   // type = "image/gif";
        //   break;
        // case "ffd8ffe0":
        // case "ffd8ffe1":
        // case "ffd8ffe2":
        // case "ffd8ffe3":
        // case "ffd8ffe8":
        //   // type = "image/jpeg";
        //   isValid = true;
        //   break;
        case '424e525f':
          // type = "text/plain" oder "application/octet-stream" :: csv
          isValid = true;
          break;
        default:
          // type = "unknown";
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
};
