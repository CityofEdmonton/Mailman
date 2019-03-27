export function getDateString() {
    const year = new Date().getFullYear().toString();
    const month = new Date().getMonth().toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const hour = new Date().getHours().toString().padStart(2, '0');
    const minute = new Date().getMinutes().toString().padStart(2, '0');
    const second = new Date().getSeconds().toString().padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

export function getUtcDateString() {
    const year = new Date().getUTCFullYear().toString();
    const month = new Date().getUTCMonth().toString().padStart(2, '0');
    const day = new Date().getUTCDate().toString().padStart(2, '0');
    const hour = new Date().getUTCHours().toString().padStart(2, '0');
    const minute = new Date().getUTCMinutes().toString().padStart(2, '0');
    const second = new Date().getUTCSeconds().toString().padStart(2, '0');
    const milli = new Date().getUTCMilliseconds().toString();
    return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + '.' + milli + 'Z';
}