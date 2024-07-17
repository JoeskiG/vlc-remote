export function formatTime(time: number): string {
    if (time == -1) return ''

    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time / 60) % 60);
    var seconds = Math.floor(time % 60);
    const hoursString = hours < 10 ? "0" + hours : hours;
    const minutesString = minutes < 10 ? "0" + minutes : minutes;
    const secondsString = seconds < 10 ? "0" + seconds : seconds;

    return (parseInt(hoursString as string) > 0 ? hoursString + ":" : '') + minutesString + ":" + secondsString;
}