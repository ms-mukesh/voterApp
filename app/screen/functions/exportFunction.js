import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
// const RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import {isANDROID, isIOS} from '../../helper/themeHelper';
import {PermissionsAndroid} from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import {isDefined} from "./broadcastNotification";
import {age} from "../../helper/validation";

export const exportFile = (data, userDetails = null) => {
    return new Promise(async resolve => {
        if (data.length > 0) {
            // if (isANDROID) {
            //     try {
            //         const granted = await PermissionsAndroid.request(
            //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            //             {
            //                 title: 'Navgam app',
            //                 message: 'Navgam app needs a permission to Export Excel file',
            //                 buttonPositive: 'OK',
            //             }
            //         );
            //         // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //         //   console.log('You can use');
            //         // } else {
            //         //   console.log('Camera permission denied');
            //         // }
            //     } catch (e) {
            //         console.log(e);
            //     }
            // }
            // let fileUri = FileSystem.documentDirectory + "text.txt";
            // await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
            // const asset = await MediaLibrary.createAssetAsync(fileUri)
            // await MediaLibrary.createAlbumAsync("Download", asset, false)

            const tempDataArray = [];
            await data.map(memberData => {
                tempDataArray.push({
                    VoterId : !isDefined(memberData.VoterVotingId) && memberData.VoterVotingId===null?'NA':memberData.VoterVotingId,
                    FirstName: memberData.FirstName === null ? 'NA' : memberData.FirstName,
                    MiddleName: memberData.MiddleName === null ? 'NA' : memberData.MiddleName,
                    LastName: memberData.LastName === null ? 'NA' : memberData.LastName,
                    Email: memberData.Email === null ? 'NA' : memberData.Email,
                    DOB: memberData.DOB === null ? 'NA' : age(memberData.DOB),
                    // AadhaarNo: memberData.AadhaarNo === null ? 'NA' : memberData.AadhaarNo,
                    // MaritalStatus: memberData.MaritalStatus === null ? 'NA' : memberData.MaritalStatus,
                    // BloodGroup: memberData.BloodGroup === null ? 'NA' : memberData.BloodGroup,
                    // Zodiac: memberData.Zodiac === null ? 'NA' : memberData.Zodiac,
                    Gender: memberData.Gender === null ? 'NA' : memberData.Gender,
                    // Studies: memberData.Studies === null ? 'NA' : memberData.Studies,
                    // MarriageDate: memberData.MarriageDate === null ? 'NA' : memberData.MarriageDate,
                    // IsDaughterFamily:
                    //     memberData.Gender.toLowerCase() === 'male'
                    //         ? 'NA'
                    //         : parseInt(memberData.IsDaughterFamily) === 1
                    //         ? 'YES'
                    //         : 'NO',
                    // MotherName:
                    //     memberData.MotherEntry === null
                    //         ? 'NA'
                    //         : `${memberData.MotherEntry.FirstName} ${memberData.MotherEntry.LastName}`,
                    // FatherName: memberData.MiddleName === null ? 'NA' : memberData.MiddleName,
                    // FatherInLaw:
                    //     memberData.FatherInLawDetail === null
                    //         ? 'NA'
                    //         : `${memberData.FatherInLawDetail.FirstName} ${
                    //             memberData.FatherInLawDetail.LastName
                    //             }`,
                    // MotherInLaw:
                    //     memberData.MotherInLawDetail === null
                    //         ? 'NA'
                    //         : `${memberData.MotherInLawDetail.FirstName} ${
                    //             memberData.MotherInLawDetail.LastName
                    //             }`,
                    // Occupation:
                    //     memberData.OccupationDetail === null ? 'NA' : memberData.OccupationDetail.Name,
                    // NativePlace:
                    //     memberData.FamilyMaster === null
                    //         ? 'NA'
                    //         : memberData.FamilyMaster.NativePlaceMaster === null
                    //         ? 'NA'
                    //         : memberData.FamilyMaster.NativePlaceMaster.Name,
                    HomeAddress:
                        memberData.FamilyMaster === null ? 'NA' : memberData.FamilyMaster.AddressMaster.Address,
                    HomeCity:
                        memberData.FamilyMaster === null
                            ? 'NA'
                            : memberData.FamilyMaster.AddressMaster.CityOrVillageName,
                    HomeState:
                        memberData.FamilyMaster === null
                            ? 'NA'
                            : memberData.FamilyMaster.AddressMaster.StateName,
                    HomeCountry:
                        memberData.FamilyMaster === null
                            ? 'NA'
                            : memberData.FamilyMaster.AddressMaster.CountryName,
                    // OfficeAddress:
                    //     memberData.OfficeAddressDetail === null ? 'NA' : memberData.OfficeAddressDetail.Address,
                    // OfficeCity:
                    //     memberData.OfficeAddressDetail === null
                    //         ? 'NA'
                    //         : memberData.OfficeAddressDetail.CityName,
                    // OfficeState:
                    //     memberData.OfficeAddressDetail === null
                    //         ? 'NA'
                    //         : memberData.OfficeAddressDetail.StateName,
                    // OfficeCountry:
                    //     memberData.OfficeAddressDetail === null
                    //         ? 'NA'
                    //         : memberData.OfficeAddressDetail.CountryName,
                });
            });
            resolve(tempDataArray)
            // FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'database.json', tempDataArray[0]).then((res)=>{
            //     console.log(res)
            // });

            // var wb = XLSX.utils.book_new();
            // const headerTitle =
            //   userDetails.Name +
            //   '\n' +
            //   userDetails.Email +
            //   '\n' +
            //   userDetails.Mobile +
            //   '\n' +
            //   new Date().toLocaleString();
            // let ws = XLSX.utils.json_to_sheet([{}], {
            //   header: [headerTitle],
            // });
            //
            // const merge = [
            //   {s: {r: 0, c: 0}, e: {r: 0, c: 2}},
            //   {s: {r: 1, c: 0}, e: {r: 1, c: 2}},
            //   {s: {r: 2, c: 0}, e: {r: 2, c: 1}},
            //   {s: {r: 3, c: 0}, e: {r: 3, c: 2}},
            // ];
            // ws['!merges'] = merge;
            // XLSX.utils.sheet_add_aoa(ws, [[userDetails.Name]], {origin: 'A1'});
            // XLSX.utils.sheet_add_aoa(ws, [[userDetails.Email]], {origin: 'A2'});
            // XLSX.utils.sheet_add_aoa(ws, [[userDetails.Mobile]], {origin: 'A3'});
            // XLSX.utils.sheet_add_aoa(ws, [[new Date().toLocaleString()]], {origin: 'A4'});
            //
            // XLSX.utils.sheet_add_json(ws, tempDataArray, {origin: 'A6'});
            // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // var wb = XLSX.utils.book_new();
            // const headerTitle =
            //     userDetails.Name +
            //     '\n' +
            //     userDetails.Email +
            //     '\n' +
            //     userDetails.Mobile +
            //     '\n' +
            //     new Date().toLocaleString();
            // let ws = XLSX.utils.json_to_sheet([{}]);
            //
            // const merge = [];
            // ws['!merges'] = merge;
            // // XLSX.utils.sheet_add_aoa(ws, [[userDetails.Name]], {origin: 'A1'});
            // // XLSX.utils.sheet_add_aoa(ws, [[userDetails.Email]], {origin: 'A2'});
            // // XLSX.utils.sheet_add_aoa(ws, [[userDetails.Mobile]], {origin: 'A3'});
            // // XLSX.utils.sheet_add_aoa(ws, [[new Date().toLocaleString()]], {origin: 'A4'});
            //
            // XLSX.utils.sheet_add_json(ws, tempDataArray, {origin: 'A1'});
            // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            //
            // const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
            // const file = isIOS
            //     ? RNFS.DocumentDirectoryPath + '/Navgam/navgamDetail' + new Date().getTime() + '.xlsx'
            //     : RNFS.DownloadDirectoryPath + '/Navgam/navgamDetail' + new Date().getTime() + '.xlsx';
            //
            // const baseDir = isANDROID ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir;
            // const fileName = 'Navgam_excel_' + moment().unix();
            // const path = `${baseDir}/Navgam/${fileName}.xlsx`;
            // writeFile(path, wbout, 'ascii')
            //     .then(r => {
            //         console.log('called');
            //         console.log(r);
            //         // if (isIOS) {
            //         //   RNFetchBlob.ios.previewDocument(file);
            //         // } else {
            //         //   RNFetchBlob.android.actionViewIntent(file, 'application/vnd.ms-excel');
            //         // }
            //         resolve({data: tempDataArray, filePath: path});
            //     })
            //     .catch(e => {
            //         console.log('eror');
            //         console.log(e);
            //         RNFetchBlob.fs
            //             .mkdir(`${baseDir}/Navgam`)
            //             .catch(err => {
            //                 console.log(err);
            //                 resolve(false);
            //             })
            //             .then(() => {
            //                 writeFile(path, wbout, 'ascii')
            //                     .then(r => {
            //                         resolve({data: tempDataArray, filePath: file});
            //                     })
            //                     .catch(err => {
            //                         console.log(err);
            //                         resolve(false);
            //                     });
            //             });
            //     });
        } else {
            resolve(false);
        }
    });
};
