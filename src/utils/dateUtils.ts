import { intervalToDuration } from 'date-fns';

export function getRelationshipTime(startDate: Date, currentDate: Date) {
    return intervalToDuration({
        start: startDate,
        end: currentDate,
    });
}