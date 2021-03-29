// import fire from '../config/firebaseConfig';
import storage from '@react-native-firebase/storage';

const uriToBlob = uri => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};
const uploadImageOnFirebase = (imageUri, uploadBucketPath = null) => {
    return new Promise((resolve) => {
        let date = new Date().getTime();
        if (imageUri === '') {
            return resolve(false);
        }
        const Storage = storage()
            .ref(uploadBucketPath === null ? '/TemplateImages/' : uploadBucketPath)
            .child('img' + date.toString() + '.jpeg');
        Storage.putFile(imageUri)
            .then(async () => {
                const url = await Storage.getDownloadURL();
                return resolve(url);
            })
            .catch((err) => {
                console.log('err--', err);
                return resolve(false);
            });
    });
};
//leasl
// const uploadImageOnFirebase = (imageUri, uploadBucketPath = null) => {
//   return new Promise(resolve => {
//     var date = new Date().getTime();
//     uriToBlob(imageUri)
//       .then(res => {
//           console.log("image URi--",imageUri)
//         const Storage = fire
//           .storage()
//           .ref(uploadBucketPath === null ? '/TemplateImages/' : uploadBucketPath)
//           .child('img' + date.toString() + '.jpeg');
//         Storage.put(res, {
//           contentType: 'image/jpeg',
//         })
//           .then(async () => {
//             const url = await Storage.getDownloadURL();
//             console.log("url--",url)
//             return resolve(url);
//           })
//           .catch((err) => {
//               console.log("err-",err)
//             return resolve(false);
//           });
//       })
//       .catch(() => {
//         resolve(false);
//       });
//   });
// };
// const uploadPdfOnFirebase = (pdfUri, pdfName = '') => {
//   return new Promise(resolve => {
//     var date = new Date().getTime();
//     uriToBlob(pdfUri)
//       .then(res => {
//         const Storage = fire
//           .storage()
//           .ref('/TemplatePdf/')
//           .child(
//             pdfName.indexOf('.') > 0
//               ? pdfName.substring(0, pdfName.indexOf('.')) + '_pdf' + date.toString() + '.pdf'
//               : pdfName + '_pdf' + date.toString() + '.pdf'
//           );
//         Storage.put(res, {
//           contentType: '*/*',
//         })
//           .then(async () => {
//             const url = await Storage.getDownloadURL();
//             return resolve(url);
//           })
//           .catch((err) => {
//               console.log("error while uploading pdf--",err)
//             return resolve(false);
//           });
//       })
//       .catch(() => {
//           console.log("error while uploading pdf--",err)
//         resolve(false);
//       });
//   });
// };
const isDefined = value => {
  if (typeof value === 'undefined') {
    return false;
  } else {
    return true;
  }
};
export {uriToBlob, uploadImageOnFirebase, isDefined};
