import {checkEmailAvailabilityNotIn} from "./APIUtils";
import Alert from "react-s-alert";
import axios from "axios/index";
import {EMAIL_MAX_LENGTH} from "../constants";

export function deepCopyObject(oldObject) {
    return JSON.parse(JSON.stringify(oldObject));
}

export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + year;
}

export function formatDateTime(dateTimeString) {
    const date = new Date(new Date(dateTimeString).toLocaleString('en', {timeZone: 'UTC'}))

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
}


export function showAxiosError(error) {
    if (error.response) {
        let response = error.response;
        if (typeof response.data === 'string') {
            Alert.error(response.data, {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
        } else if (response.data instanceof ArrayBuffer) {
            let decodedText = new TextDecoder("utf-8").decode(response.data);
            Alert.error(decodedText, {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
        } else if (error.response.status === 401) {
            Alert.error(response.data.message, {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
        }
        else {
            let message = "Cannot Complete Your Request...";
            if (response.data.message) {
                message = response.data.message;
            } else if (response.data.Exception) {
                message = response.data.Exception;
            } else {
                console.error(response.data);
            }

            Alert.error(message, {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
        }
    } else if (error.request) {
        console.log(error.request);
    } else if (error.Error) {
        Alert.error(error.Error, {
            position: 'top-right',
            effect: 'stackslide',
            timeout: 5000
        });
    } else if (axios.isCancel(error)) {
        if (!!error.message)
            console.log('cancelled:', error.message);
    } else {
        console.log('Error', error);
        Alert.error(error.message, {
            position: 'top-right',
            effect: 'stackslide',
            timeout: 5000
        });
    }

}

export function humanReadableByteCount(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

export function checkIsPdf(data) {
    var isPDF=false;
    if (data && data.toString().substring(0,20)==="data:application/pdf") {
        isPDF = true;
    }
    return isPDF;
}

export function trimObject(obj){
    Object.keys(obj).map(k => obj[k] = typeof obj[k] === 'string' ? obj[k].trim() : obj[k]);
    return obj;
}

export async function newWindow(data,classnameSuffix) {
    if (data.toString().substring(0,20)!=="data:application/pdf") {
        var classnameSuffix;
        var image = new Image();
        image.src =  data;
        image.className='center-fit '+classnameSuffix;
        var w = window.open('','Image');
        console.log("classnameSuffix",classnameSuffix);
        setTimeout(function(){
            w.document.write('<html><head><style>* { margin: 0; padding: 0; } .imgbox { display: grid; height: 100%; }  .center-fit { max-width: 100%; max-height: 100vh; margin: auto;} ' +
                '      .rotate90 {\n' +
                '       -webkit-transform: rotate(90deg);' +
                '       -moz-transform: rotate(90deg);' +
                '       -o-transform: rotate(90deg);' +
                '       -ms-transform: rotate(90deg);' +
                '       transform: rotate(90deg);}' +
                '      .rotate180 {' +
                '       -webkit-transform: rotate(180deg);' +
                '       -moz-transform: rotate(180deg);' +
                '       -o-transform: rotate(180deg);' +
                '       -ms-transform: rotate(180deg);' +
                '       transform: rotate(180deg);}' +
                '      .rotate270 {' +
                '       -webkit-transform: rotate(270deg);' +
                '       -moz-transform: rotate(270deg);' +
                '       -o-transform: rotate(270deg);' +
                '       -ms-transform: rotate(270deg);' +
                '       transform: rotate(270deg);}' +
                '</style><title>Belge/Resim Görüntüleme</title><link rel="stylesheet" type="text/css" ></head><body>');
            w.document.write('<div id="imgbox" class="imgbox">');
            w.document.write(image.outerHTML);
            w.document.write('</div>');
            w.document.write('</body></html>');
        }, 0);
        // });
    }
    else {
        let pdfWindow = window.open("")
        let base64String=data.toString().split(',')[1];
        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(base64String)+"'></iframe>")
    }
}

export function b64toBlob (b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

export function RightExists( searchItem,givenAuthorities){
    let exists=false;
    const authorities=givenAuthorities;
    for (const authority of authorities)
    {
        if (authority.authority.includes(searchItem)) {
            exists=true;
        }
    }
    return exists;
}

export function getCitySubdivisions(cityId,allCitySubdivisions){
    return  allCitySubdivisions ? allCitySubdivisions.filter(item => item.cityId === Number(cityId)).map(item => ({value: item.id.toString(), label: item.name})) : [];
}

export function getCitySubdivisions_(cityId,allCitySubdivisions){
    const citySubdivisions=[];
    if(allCitySubdivisions && cityId) {
        for (const citySubdivision of allCitySubdivisions) {
            if (citySubdivision.cityId === cityId) {
                citySubdivisions.push({
                    value: Number(citySubdivision.id),
                    label: citySubdivision.name
                })
            }
        }
    }else if(allCitySubdivisions && cityId===null){
        for (const citySubdivision of allCitySubdivisions) {
            citySubdivisions.push({
                value: Number(citySubdivision.id),
                label: citySubdivision.name
            })
        }
    }


    return citySubdivisions;
}



export function filterCities(cities,odaId){
    let cityList=[];
    if(cities && odaId) {
        if(odaId===1000) {
            for (const cityItem of cities) {
                cityList.push({
                    value: cityItem.id.toString(),
                    label: cityItem.ad
                })}
        }
        else{
            for (const cityItem of cities) {
                if(cityItem.oda.id===odaId) {
                    cityList.push({
                        value: cityItem.id.toString(),
                        label: cityItem.ad })
                }
            }
        }
    }
    return cityList;
}

export function filterTransactionTypes(transactionTypes,filter) {
    let filtered=[];
    for (const item of transactionTypes) {
        if(item.transactionDirectionType===filter) {
            filtered.push({
                value: item.id.toString(),
                label: item.name })
        }
    }
    return filtered;
}


export function validateEmail(email) {
    if(!email) {
        return {
            validateStatus: 'error',
            errorMsg: 'Eposta boş olamaz.'
        }
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if(!EMAIL_REGEX.test(email)) {
        return {
            validateStatus: 'error',
            errorMsg: 'Eposta geçerli değil!'
        }
    }

    if(email.length > EMAIL_MAX_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Eposta çok uzun (en fazla ${EMAIL_MAX_LENGTH}  karakter girilmelidir!)`
        }
    }

    return {
        validateStatus: null,
        errorMsg: null
    }
}

export async function checkEmailAvailable(emailValue,recordId) {
    await checkEmailAvailabilityNotIn(emailValue,recordId)
        .then(response => {
            if(response.data.available) {
                console.log("true");
                return true;
            } else {
                console.log("false");
                return false;
            }
        }).catch(error => {
            console.log("ERROR!!!!!!!!!!");
            return false;
        });
}

export  function  getLabelByValue(arr, value, currency) {
    let found = null;
    if (value == null) {
        return "0"}
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].value == value.toString()) {
            found= currency ? arr[i].label.toString().replace(".",",") : arr[i].label;
        }
    }
    if (found === null) {
        return "0"}
    else{
        return found;
    }
}
