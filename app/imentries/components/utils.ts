export function isExpired(date: Date) {
    if(date) date.setHours(23,59,59);    //校正时间到当天的24点
    return null === date || date < new Date();
}